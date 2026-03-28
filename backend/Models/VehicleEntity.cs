using Azure;
using Azure.Data.Tables;

namespace Backend.Models;

public class VehicleEntity : ITableEntity
{
    public string PartitionKey { get; set; } = "Vehicle";
    public string RowKey { get; set; } = string.Empty; // ID del vehículo (ej: MT-1024)
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    
    public string Type { get; set; } = string.Empty; // Carga Trasera, Carga Lateral, etc.
    public string Capacity { get; set; } = string.Empty; // ej: "15.0 t"
    public string Status { get; set; } = "Operativo"; // Operativo, Mantenimiento, Fuera de Servicio
    public string StatusColor { get; set; } = "green"; // green, yellow, red
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
