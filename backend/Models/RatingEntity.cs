using Azure;
using Azure.Data.Tables;

namespace Backend.Models;

public class RatingEntity : ITableEntity
{
    // PartitionKey será el HouseholdId para facilitar consultas por hogar
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty; // ID de la calificación (timestamp-based)
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    
    public string HouseholdId { get; set; } = string.Empty;
    public string HouseholdAddress { get; set; } = string.Empty;
    public string CollectorId { get; set; } = string.Empty;
    public string CollectorName { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string Rating { get; set; } = string.Empty; // good, regular, bad
    public string? Notes { get; set; }
    public DateTime CollectionDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
