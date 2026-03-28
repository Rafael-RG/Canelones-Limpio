using Azure;
using Azure.Data.Tables;

namespace Backend.Models;

public class HouseholdEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "Household";
    public string RowKey { get; set; } = string.Empty; // ID del hogar (ej: ID-8829-X)
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    
    public string Address { get; set; } = string.Empty;
    public string Zone { get; set; } = string.Empty; // Zona de recolección
    public string QRCode { get; set; } = string.Empty; // Código QR asociado
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Estadísticas
    public int TotalCollections { get; set; }
    public int GoodRatings { get; set; }
    public int RegularRatings { get; set; }
    public int BadRatings { get; set; }
}
