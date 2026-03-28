namespace Backend.DTOs;

public class VehicleDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Capacity { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string StatusColor { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateVehicleDto
{
    public string Id { get; set; } = string.Empty; // ej: MT-1024
    public string Type { get; set; } = string.Empty;
    public string Capacity { get; set; } = string.Empty;
}

public class UpdateVehicleDto
{
    public string? Type { get; set; }
    public string? Capacity { get; set; }
    public string? Status { get; set; }
    public string? StatusColor { get; set; }
}
