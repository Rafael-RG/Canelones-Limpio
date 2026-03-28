using Azure;
using Azure.Data.Tables;

namespace Backend.Models;

public class CollectorEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "Collector";
    public string RowKey { get; set; } = string.Empty; // ID del collector
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty; // Documento de identidad
    public string Shift { get; set; } = string.Empty; // Mañana, Tarde, Noche
    public string Status { get; set; } = "Activo"; // Activo, Licencia, Inactivo
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
