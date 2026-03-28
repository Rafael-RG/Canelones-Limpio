using Azure.Data.Tables;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Services;

public class CollectionSessionService
{
    private readonly TableClient _tableClient;
    private const string TableName = "CollectionSessions";

    public CollectionSessionService(TableServiceClient tableServiceClient)
    {
        _tableClient = tableServiceClient.GetTableClient(TableName);
        _tableClient.CreateIfNotExists();
    }

    public async Task<CollectionSessionDto> CreateSessionAsync(CreateCollectionSessionDto dto)
    {
        var sessionId = Guid.NewGuid().ToString();
        var entity = new CollectionSessionEntity
        {
            RowKey = sessionId,
            CollectorId = dto.CollectorId,
            CollectorName = dto.CollectorName,
            VehicleId = dto.VehicleId,
            StartTime = DateTime.UtcNow,
            Status = "Active",
            TotalCollections = 0
        };

        await _tableClient.AddEntityAsync(entity);
        return MapToDto(entity);
    }

    public async Task<CollectionSessionDto?> GetSessionAsync(string id)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<CollectionSessionEntity>("CollectionSession", id);
            return MapToDto(entity.Value);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<List<CollectionSessionDto>> GetAllSessionsAsync()
    {
        var sessions = new List<CollectionSessionDto>();
        await foreach (var entity in _tableClient.QueryAsync<CollectionSessionEntity>())
        {
            sessions.Add(MapToDto(entity));
        }
        return sessions.OrderByDescending(s => s.StartTime).ToList();
    }

    public async Task<List<CollectionSessionDto>> GetActiveSessionsAsync()
    {
        var filter = "Status eq 'Active'";
        var sessions = new List<CollectionSessionDto>();
        await foreach (var entity in _tableClient.QueryAsync<CollectionSessionEntity>(filter: filter))
        {
            sessions.Add(MapToDto(entity));
        }
        return sessions;
    }

    public async Task<List<CollectionSessionDto>> GetSessionsByCollectorAsync(string collectorId)
    {
        var filter = $"CollectorId eq '{collectorId}'";
        var sessions = new List<CollectionSessionDto>();
        await foreach (var entity in _tableClient.QueryAsync<CollectionSessionEntity>(filter: filter))
        {
            sessions.Add(MapToDto(entity));
        }
        return sessions.OrderByDescending(s => s.StartTime).ToList();
    }

    public async Task<CollectionSessionDto?> EndSessionAsync(string id, EndCollectionSessionDto dto)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<CollectionSessionEntity>("CollectionSession", id);
            var session = entity.Value;

            session.EndTime = dto.EndTime;
            session.Status = "Completed";

            await _tableClient.UpdateEntityAsync(session, session.ETag);
            return MapToDto(session);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task IncrementCollectionCountAsync(string sessionId)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<CollectionSessionEntity>("CollectionSession", sessionId);
            var session = entity.Value;

            session.TotalCollections++;

            await _tableClient.UpdateEntityAsync(session, session.ETag);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            // Session no encontrada, no hacer nada
        }
    }

    private static CollectionSessionDto MapToDto(CollectionSessionEntity entity)
    {
        return new CollectionSessionDto
        {
            Id = entity.RowKey,
            CollectorId = entity.CollectorId,
            CollectorName = entity.CollectorName,
            VehicleId = entity.VehicleId,
            StartTime = entity.StartTime,
            EndTime = entity.EndTime,
            Status = entity.Status,
            TotalCollections = entity.TotalCollections
        };
    }
}
