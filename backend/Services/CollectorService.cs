using Azure.Data.Tables;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Services;

public class CollectorService
{
    private readonly TableClient _tableClient;
    private const string TableName = "Collectors";

    public CollectorService(TableServiceClient tableServiceClient)
    {
        _tableClient = tableServiceClient.GetTableClient(TableName);
        _tableClient.CreateIfNotExists();
    }

    public async Task<CollectorDto> CreateCollectorAsync(CreateCollectorDto dto)
    {
        var entity = new CollectorEntity
        {
            RowKey = dto.Id,
            Name = dto.Name,
            Document = dto.Document,
            Shift = dto.Shift,
            Status = "Activo",
            CreatedAt = DateTime.UtcNow
        };

        await _tableClient.AddEntityAsync(entity);
        return MapToDto(entity);
    }

    public async Task<CollectorDto?> GetCollectorAsync(string id)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<CollectorEntity>("Collector", id);
            return MapToDto(entity.Value);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<List<CollectorDto>> GetAllCollectorsAsync()
    {
        var collectors = new List<CollectorDto>();
        await foreach (var entity in _tableClient.QueryAsync<CollectorEntity>())
        {
            collectors.Add(MapToDto(entity));
        }
        return collectors;
    }

    public async Task<CollectorDto?> UpdateCollectorAsync(string id, UpdateCollectorDto dto)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<CollectorEntity>("Collector", id);
            var collector = entity.Value;

            if (dto.Name != null) collector.Name = dto.Name;
            if (dto.Document != null) collector.Document = dto.Document;
            if (dto.Shift != null) collector.Shift = dto.Shift;
            if (dto.Status != null) collector.Status = dto.Status;
            collector.UpdatedAt = DateTime.UtcNow;

            await _tableClient.UpdateEntityAsync(collector, collector.ETag);
            return MapToDto(collector);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<bool> DeleteCollectorAsync(string id)
    {
        try
        {
            await _tableClient.DeleteEntityAsync("Collector", id);
            return true;
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return false;
        }
    }

    private static CollectorDto MapToDto(CollectorEntity entity)
    {
        return new CollectorDto
        {
            Id = entity.RowKey,
            Name = entity.Name,
            Document = entity.Document,
            Shift = entity.Shift,
            Status = entity.Status,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}
