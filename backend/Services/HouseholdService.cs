using Azure.Data.Tables;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Services;

public class HouseholdService
{
    private readonly TableClient _tableClient;
    private const string TableName = "Households";

    public HouseholdService(TableServiceClient tableServiceClient)
    {
        _tableClient = tableServiceClient.GetTableClient(TableName);
        _tableClient.CreateIfNotExists();
    }

    public async Task<HouseholdDto> CreateHouseholdAsync(CreateHouseholdDto dto)
    {
        var entity = new HouseholdEntity
        {
            RowKey = dto.Id,
            Address = dto.Address,
            Zone = dto.Zone,
            QRCode = dto.QRCode,
            CreatedAt = DateTime.UtcNow
        };

        await _tableClient.AddEntityAsync(entity);
        return MapToDto(entity);
    }

    public async Task<HouseholdDto?> GetHouseholdAsync(string id)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<HouseholdEntity>("Household", id);
            return MapToDto(entity.Value);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<HouseholdDto?> GetHouseholdByQRCodeAsync(string qrCode)
    {
        var filter = $"QRCode eq '{qrCode}'";
        await foreach (var entity in _tableClient.QueryAsync<HouseholdEntity>(filter: filter))
        {
            return MapToDto(entity);
        }
        return null;
    }

    public async Task<List<HouseholdDto>> GetAllHouseholdsAsync()
    {
        var households = new List<HouseholdDto>();
        await foreach (var entity in _tableClient.QueryAsync<HouseholdEntity>())
        {
            households.Add(MapToDto(entity));
        }
        return households;
    }

    public async Task<HouseholdDto?> UpdateHouseholdAsync(string id, UpdateHouseholdDto dto)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<HouseholdEntity>("Household", id);
            var household = entity.Value;

            if (dto.Address != null) household.Address = dto.Address;
            if (dto.Zone != null) household.Zone = dto.Zone;
            if (dto.QRCode != null) household.QRCode = dto.QRCode;
            household.UpdatedAt = DateTime.UtcNow;

            await _tableClient.UpdateEntityAsync(household, household.ETag);
            return MapToDto(household);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return null;
        }
    }

    public async Task<bool> DeleteHouseholdAsync(string id)
    {
        try
        {
            await _tableClient.DeleteEntityAsync("Household", id);
            return true;
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            return false;
        }
    }

    public async Task IncrementCollectionStatsAsync(string householdId, string rating)
    {
        try
        {
            var entity = await _tableClient.GetEntityAsync<HouseholdEntity>("Household", householdId);
            var household = entity.Value;

            household.TotalCollections++;
            switch (rating.ToLower())
            {
                case "good":
                    household.GoodRatings++;
                    break;
                case "regular":
                    household.RegularRatings++;
                    break;
                case "bad":
                    household.BadRatings++;
                    break;
            }

            await _tableClient.UpdateEntityAsync(household, household.ETag);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 404)
        {
            // Household no encontrado, no hacer nada
        }
    }

    private static HouseholdDto MapToDto(HouseholdEntity entity)
    {
        return new HouseholdDto
        {
            Id = entity.RowKey,
            Address = entity.Address,
            Zone = entity.Zone,
            QRCode = entity.QRCode,
            TotalCollections = entity.TotalCollections,
            GoodRatings = entity.GoodRatings,
            RegularRatings = entity.RegularRatings,
            BadRatings = entity.BadRatings,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}
