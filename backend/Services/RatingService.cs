using Azure.Data.Tables;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Services;

public class RatingService
{
    private readonly TableClient _tableClient;
    private readonly HouseholdService _householdService;
    private readonly CollectionSessionService _sessionService;
    private const string TableName = "Ratings";

    public RatingService(
        TableServiceClient tableServiceClient,
        HouseholdService householdService,
        CollectionSessionService sessionService)
    {
        _tableClient = tableServiceClient.GetTableClient(TableName);
        _tableClient.CreateIfNotExists();
        _householdService = householdService;
        _sessionService = sessionService;
    }

    public async Task<RatingDto> CreateRatingAsync(CreateRatingDto dto)
    {
        // Obtener información del hogar
        var household = await _householdService.GetHouseholdAsync(dto.HouseholdId);
        if (household == null)
        {
            throw new ArgumentException($"Household {dto.HouseholdId} not found");
        }

        // Obtener información del collector de la sesión
        var session = await _sessionService.GetSessionAsync(dto.SessionId);
        
        var ratingId = $"{DateTime.UtcNow.Ticks}";
        var entity = new RatingEntity
        {
            PartitionKey = dto.HouseholdId, // Particionar por household para queries eficientes
            RowKey = ratingId,
            HouseholdId = dto.HouseholdId,
            HouseholdAddress = household.Address,
            CollectorId = dto.CollectorId,
            CollectorName = session?.CollectorName ?? string.Empty,
            SessionId = dto.SessionId,
            Rating = dto.Rating,
            Notes = dto.Notes,
            CollectionDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        await _tableClient.AddEntityAsync(entity);

        // Actualizar estadísticas del hogar
        await _householdService.IncrementCollectionStatsAsync(dto.HouseholdId, dto.Rating);

        // Incrementar contador de la sesión
        await _sessionService.IncrementCollectionCountAsync(dto.SessionId);

        return MapToDto(entity);
    }

    public async Task<RatingDto?> GetRatingAsync(string householdId, string ratingId)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<RatingEntity>(householdId, ratingId);
            return MapToDto(entity.Value);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<List<RatingDto>> GetAllRatingsAsync()
    {
        var ratings = new List<RatingDto>();
        await foreach (var entity in _tableClient.QueryAsync<RatingEntity>())
        {
            ratings.Add(MapToDto(entity));
        }
        return ratings.OrderByDescending(r => r.CollectionDate).ToList();
    }

    public async Task<List<RatingDto>> GetRatingsByHouseholdAsync(string householdId)
    {
        var ratings = new List<RatingDto>();
        await foreach (var entity in _tableClient.QueryAsync<RatingEntity>(filter: $"PartitionKey eq '{householdId}'"))
        {
            ratings.Add(MapToDto(entity));
        }
        return ratings.OrderByDescending(r => r.CollectionDate).ToList();
    }

    public async Task<List<RatingDto>> GetRatingsByCollectorAsync(string collectorId)
    {
        var filter = $"CollectorId eq '{collectorId}'";
        var ratings = new List<RatingDto>();
        await foreach (var entity in _tableClient.QueryAsync<RatingEntity>(filter: filter))
        {
            ratings.Add(MapToDto(entity));
        }
        return ratings.OrderByDescending(r => r.CollectionDate).ToList();
    }

    public async Task<List<RatingDto>> GetRatingsBySessionAsync(string sessionId)
    {
        var filter = $"SessionId eq '{sessionId}'";
        var ratings = new List<RatingDto>();
        await foreach (var entity in _tableClient.QueryAsync<RatingEntity>(filter: filter))
        {
            ratings.Add(MapToDto(entity));
        }
        return ratings.OrderByDescending(r => r.CollectionDate).ToList();
    }

    private static RatingDto MapToDto(RatingEntity entity)
    {
        return new RatingDto
        {
            Id = entity.RowKey,
            HouseholdId = entity.HouseholdId,
            HouseholdAddress = entity.HouseholdAddress,
            CollectorId = entity.CollectorId,
            CollectorName = entity.CollectorName,
            SessionId = entity.SessionId,
            Rating = entity.Rating,
            Notes = entity.Notes,
            CollectionDate = entity.CollectionDate,
            CreatedAt = entity.CreatedAt
        };
    }
}
