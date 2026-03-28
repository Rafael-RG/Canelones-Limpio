using Azure;
using Azure.Data.Tables;

namespace Backend.Models;

public class CollectionSessionEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "CollectionSession";
    public string RowKey { get; set; } = string.Empty; // ID de la sesión
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    
    public string CollectorId { get; set; } = string.Empty;
    public string CollectorName { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Status { get; set; } = "Active"; // Active, Completed
    public int TotalCollections { get; set; }
}
