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
builder.Services.AddSingleton<CollectorService>();
builder.Services.AddSingleton<VehicleService>();
builder.Services.AddSingleton<HouseholdService>();
builder.Services.AddSingleton<CollectionSessionService>();
builder.Services.AddSingleton<RatingService>();
builder.Services.AddSingleton<DashboardService>();

var app = builder.Build();

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

