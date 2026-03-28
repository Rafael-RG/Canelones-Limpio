using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HouseholdsController : ControllerBase
{
    private readonly HouseholdService _service;

    public HouseholdsController(HouseholdService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<HouseholdDto>>> GetAll()
    {
        var households = await _service.GetAllHouseholdsAsync();
        return Ok(households);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HouseholdDto>> GetById(string id)
    {
        var household = await _service.GetHouseholdAsync(id);
        if (household == null)
            return NotFound();
        
        return Ok(household);
    }

    [HttpGet("by-qr/{qrCode}")]
    public async Task<ActionResult<HouseholdDto>> GetByQRCode(string qrCode)
    {
        var household = await _service.GetHouseholdByQRCodeAsync(qrCode);
        if (household == null)
            return NotFound();
        
        return Ok(household);
    }

    [HttpPost]
    public async Task<ActionResult<HouseholdDto>> Create([FromBody] CreateHouseholdDto dto)
    {
        try
        {
            var household = await _service.CreateHouseholdAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = household.Id }, household);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 409)
        {
            return Conflict($"Household with ID {dto.Id} already exists");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<HouseholdDto>> Update(string id, [FromBody] UpdateHouseholdDto dto)
    {
        var household = await _service.UpdateHouseholdAsync(id, dto);
        if (household == null)
            return NotFound();
        
        return Ok(household);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var result = await _service.DeleteHouseholdAsync(id);
        if (!result)
            return NotFound();
        
        return NoContent();
    }
}
