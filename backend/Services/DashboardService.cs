using Backend.DTOs;

namespace Backend.Services;

public class DashboardService
{
    private readonly CollectorService _collectorService;
    private readonly VehicleService _vehicleService;
    private readonly HouseholdService _householdService;
    private readonly RatingService _ratingService;
    private readonly CollectionSessionService _sessionService;

    public DashboardService(
        CollectorService collectorService,
        VehicleService vehicleService,
        HouseholdService householdService,
        RatingService ratingService,
        CollectionSessionService sessionService)
    {
        _collectorService = collectorService;
        _vehicleService = vehicleService;
        _householdService = householdService;
        _ratingService = ratingService;
        _sessionService = sessionService;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var collectors = await _collectorService.GetAllCollectorsAsync();
        var vehicles = await _vehicleService.GetAllVehiclesAsync();
        var households = await _householdService.GetAllHouseholdsAsync();
        var ratings = await _ratingService.GetAllRatingsAsync();

        // Calcular recolecciones de hoy
        var today = DateTime.UtcNow.Date;
        var todayRatings = ratings.Where(r => r.CollectionDate.Date == today).ToList();
        var yesterdayRatings = ratings.Where(r => r.CollectionDate.Date == today.AddDays(-1)).ToList();
        
        var percentageChange = yesterdayRatings.Count > 0 
            ? ((todayRatings.Count - yesterdayRatings.Count) / (decimal)yesterdayRatings.Count) * 100
            : 0;

        // Calcular vehículos operativos
        var operationalVehicles = vehicles.Count(v => v.Status == "Operativo");
        var operationalPercentage = vehicles.Count > 0 
            ? (operationalVehicles / (decimal)vehicles.Count) * 100 
            : 0;

        // Calcular eficiencia promedio (basado en calificaciones buenas)
        var totalRatings = ratings.Count;
        var goodRatings = ratings.Count(r => r.Rating == "good");
        var averageEfficiency = totalRatings > 0 
            ? (goodRatings / (decimal)totalRatings) * 100 
            : 0;

        // Calcular alertas (vehículos en mantenimiento o fuera de servicio)
        var alerts = vehicles.Count(v => v.Status != "Operativo");

        return new DashboardStatsDto
        {
            TotalCollectionsToday = todayRatings.Count,
            PercentageChangeToday = Math.Round(percentageChange, 1),
            TotalVehicles = vehicles.Count,
            OperationalVehicles = operationalVehicles,
            OperationalPercentage = Math.Round(operationalPercentage, 0),
            AverageEfficiency = Math.Round(averageEfficiency, 0),
            TotalAlerts = alerts,
            ActiveCollectors = collectors.Count(c => c.Status == "Activo"),
            TotalHouseholds = households.Count
        };
    }
}
