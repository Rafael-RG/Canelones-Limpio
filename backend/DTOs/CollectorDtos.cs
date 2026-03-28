namespace Backend.DTOs;

public class CollectorDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string Shift { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateCollectorDto
{
    public string Id { get; set; } = string.Empty; // ej: RM, EB, etc.
    public string Name { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string Shift { get; set; } = string.Empty; // Mañana, Tarde, Noche
}

public class UpdateCollectorDto
{
    public string? Name { get; set; }
    public string? Document { get; set; }
    public string? Shift { get; set; }
    public string? Status { get; set; }
}
