namespace Backend.DTOs;

public class DashboardStatsDto
{
    public int TotalCollectionsToday { get; set; }
    public decimal PercentageChangeToday { get; set; }
    public int TotalVehicles { get; set; }
    public int OperationalVehicles { get; set; }
    public decimal OperationalPercentage { get; set; }
    public decimal AverageEfficiency { get; set; }
    public int TotalAlerts { get; set; }
    public int ActiveCollectors { get; set; }
    public int TotalHouseholds { get; set; }
}
