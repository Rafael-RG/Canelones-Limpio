using System.Security.Cryptography;
using System.Text;
using Azure.Data.Tables;
using Backend.Models;

namespace Backend.Services;

public class AuthService
{
    private readonly TableClient _tableClient;

    public AuthService(TableServiceClient tableServiceClient)
    {
        _tableClient = tableServiceClient.GetTableClient("Users");
        _tableClient.CreateIfNotExists();
    }

    public async Task<UserEntity?> ValidateCredentialsAsync(string username, string password)
    {
        try
        {
            var user = await _tableClient.GetEntityAsync<UserEntity>("User", username);
            
            if (user.Value == null || !user.Value.IsActive)
                return null;

            var passwordHash = HashPassword(password);
            if (user.Value.PasswordHash == passwordHash)
                return user.Value;

            return null;
        }
        catch
        {
            return null;
        }
    }

    public async Task<UserEntity?> GetUserAsync(string username)
    {
        try
        {
            var user = await _tableClient.GetEntityAsync<UserEntity>("User", username);
            return user.Value;
        }
        catch
        {
            return null;
        }
    }

    public async Task<UserEntity> CreateUserAsync(string username, string password, string role = "Admin")
    {
        var user = new UserEntity
        {
            PartitionKey = "User",
            RowKey = username,
            Username = username,
            PasswordHash = HashPassword(password),
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _tableClient.AddEntityAsync(user);
        return user;
    }

    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public string GenerateToken(UserEntity user)
    {
        // Simple token generation - en producción usar JWT
        var tokenData = $"{user.Username}:{user.Role}:{DateTime.UtcNow.Ticks}";
        var bytes = Encoding.UTF8.GetBytes(tokenData);
        return Convert.ToBase64String(bytes);
    }
}
