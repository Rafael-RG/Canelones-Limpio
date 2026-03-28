namespace Backend.DTOs;

public class CollectionSessionDto
{
    public string Id { get; set; } = string.Empty;
    public string CollectorId { get; set; } = string.Empty;
    public string CollectorName { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalCollections { get; set; }
}

public class CreateCollectionSessionDto
{
    public string CollectorId { get; set; } = string.Empty;
    public string CollectorName { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
}

public class EndCollectionSessionDto
{
    public DateTime EndTime { get; set; }
}
