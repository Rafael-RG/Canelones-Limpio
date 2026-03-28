using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly RatingService _service;

    public RatingsController(RatingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<RatingDto>>> GetAll()
    {
        var ratings = await _service.GetAllRatingsAsync();
        return Ok(ratings);
    }

    [HttpGet("{householdId}/{ratingId}")]
    public async Task<ActionResult<RatingDto>> GetById(string householdId, string ratingId)
    {
        var rating = await _service.GetRatingAsync(householdId, ratingId);
        if (rating == null)
            return NotFound();
        
        return Ok(rating);
    }

    [HttpGet("by-household/{householdId}")]
    public async Task<ActionResult<List<RatingDto>>> GetByHousehold(string householdId)
    {
        var ratings = await _service.GetRatingsByHouseholdAsync(householdId);
        return Ok(ratings);
    }

    [HttpGet("by-collector/{collectorId}")]
    public async Task<ActionResult<List<RatingDto>>> GetByCollector(string collectorId)
    {
        var ratings = await _service.GetRatingsByCollectorAsync(collectorId);
        return Ok(ratings);
    }

    [HttpGet("by-session/{sessionId}")]
    public async Task<ActionResult<List<RatingDto>>> GetBySession(string sessionId)
    {
        var ratings = await _service.GetRatingsBySessionAsync(sessionId);
        return Ok(ratings);
    }

    [HttpPost]
    public async Task<ActionResult<RatingDto>> Create([FromBody] CreateRatingDto dto)
    {
        try
        {
            var rating = await _service.CreateRatingAsync(dto);
            return CreatedAtAction(
                nameof(GetById), 
                new { householdId = rating.HouseholdId, ratingId = rating.Id }, 
                rating);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
