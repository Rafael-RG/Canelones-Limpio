using Azure.Data.Tables;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on the PORT environment variable (required for Azure)
builder.WebHost.ConfigureKestrel(options =>
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    options.ListenAnyIP(int.Parse(port));
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Azure Table Storage
var connectionString = builder.Configuration["AzureStorage:ConnectionString"];
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Azure Storage connection string is not configured");
}

builder.Services.AddSingleton(new TableServiceClient(connectionString));

// Register application services
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<CollectorService>();
builder.Services.AddSingleton<VehicleService>();
builder.Services.AddSingleton<HouseholdService>();
builder.Services.AddSingleton<CollectionSessionService>();
builder.Services.AddSingleton<RatingService>();
builder.Services.AddSingleton<DashboardService>();

var app = builder.Build();

// Initialize database: create tables and default admin user
await InitializeDatabaseAsync(app.Services);

// Configure the HTTP request pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Canelones Pro API V1");
    c.RoutePrefix = "swagger"; // Swagger UI en /swagger
});

// Enable CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

static async Task InitializeDatabaseAsync(IServiceProvider services)
{
    try
    {
        var tableServiceClient = services.GetRequiredService<TableServiceClient>();
        var authService = services.GetRequiredService<AuthService>();

        // Create Users table if it doesn't exist
        var usersTableClient = tableServiceClient.GetTableClient("Users");
        await usersTableClient.CreateIfNotExistsAsync();
        Console.WriteLine("✓ Users table verified/created");

        // Check if admin user exists
        try
        {
            var adminUser = await authService.GetUserAsync("admin");
            if (adminUser == null)
            {
                // Create default admin user
                await authService.CreateUserAsync("admin", "admin123", "Admin");
                Console.WriteLine("✓ Default admin user created (username: admin, password: admin123)");
            }
            else
            {
                Console.WriteLine("✓ Admin user already exists");
            }
        }
        catch
        {
            // User doesn't exist, create it
            await authService.CreateUserAsync("admin", "admin123", "Admin");
            Console.WriteLine("✓ Default admin user created (username: admin, password: admin123)");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"⚠ Error initializing database: {ex.Message}");
    }
}

