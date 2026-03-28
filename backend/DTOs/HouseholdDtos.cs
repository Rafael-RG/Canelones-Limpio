namespace Backend.DTOs;

public class HouseholdDto
{
    public string Id { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Zone { get; set; } = string.Empty;
    public string QRCode { get; set; } = string.Empty;
    public int TotalCollections { get; set; }
    public int GoodRatings { get; set; }
    public int RegularRatings { get; set; }
    public int BadRatings { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateHouseholdDto
{
    public string Id { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Zone { get; set; } = string.Empty;
    public string QRCode { get; set; } = string.Empty;
}

public class UpdateHouseholdDto
{
    public string? Address { get; set; }
    public string? Zone { get; set; }
    public string? QRCode { get; set; }
}
