namespace Backend.DTOs;

public class RatingDto
{
    public string Id { get; set; } = string.Empty;
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

public class CreateRatingDto
{
    public string HouseholdId { get; set; } = string.Empty;
    public string CollectorId { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string Rating { get; set; } = string.Empty; // good, regular, bad
    public string? Notes { get; set; }
}

public class UpdateRatingDto
{
    public string Rating { get; set; } = string.Empty; // good, regular, bad
    public string? Notes { get; set; }
}

public class RatingsByHouseholdDto
{
    public string HouseholdId { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public List<RatingDto> Ratings { get; set; } = new();
}
