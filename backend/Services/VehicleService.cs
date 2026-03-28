using Azure.Data.Tables;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Services;

public class VehicleService
{
    private readonly TableClient _tableClient;
    private const string TableName = "Vehicles";

    public VehicleService(TableServiceClient tableServiceClient)
    {
        _tableClient = tableServiceClient.GetTableClient(TableName);
        _tableClient.CreateIfNotExists();
    }

    public async Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto)
    {
        var entity = new VehicleEntity
        {
            RowKey = dto.Id,
            Type = dto.Type,
            Capacity = dto.Capacity,
            Status = "Operativo",
            StatusColor = "green",
            CreatedAt = DateTime.UtcNow
        };

        await _tableClient.AddEntityAsync(entity);
        return MapToDto(entity);
    }

    public async Task<VehicleDto?> GetVehicleAsync(string id)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<VehicleEntity>("Vehicle", id);
            return MapToDto(entity.Value);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<List<VehicleDto>> GetAllVehiclesAsync()
    {
        var vehicles = new List<VehicleDto>();
        await foreach (var entity in _tableClient.QueryAsync<VehicleEntity>())
        {
            vehicles.Add(MapToDto(entity));
        }
        return vehicles;
    }

    public async Task<VehicleDto?> UpdateVehicleAsync(string id, UpdateVehicleDto dto)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<VehicleEntity>("Vehicle", id);
            var vehicle = entity.Value;

            if (dto.Type != null) vehicle.Type = dto.Type;
            if (dto.Capacity != null) vehicle.Capacity = dto.Capacity;
            if (dto.Status != null) vehicle.Status = dto.Status;
            if (dto.StatusColor != null) vehicle.StatusColor = dto.StatusColor;
            vehicle.UpdatedAt = DateTime.UtcNow;

            await _tableClient.UpdateEntityAsync(vehicle, vehicle.ETag);
            return MapToDto(vehicle);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<bool> DeleteVehicleAsync(string id)
    {
        try
        {
            await _tableClient.DeleteEntityAsync("Vehicle", id);
            return true;
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return false;
        }
    }

    private static VehicleDto MapToDto(VehicleEntity entity)
    {
        return new VehicleDto
        {
            Id = entity.RowKey,
            Type = entity.Type,
            Capacity = entity.Capacity,
            Status = entity.Status,
            StatusColor = entity.StatusColor,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}
