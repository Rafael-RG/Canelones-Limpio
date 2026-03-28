using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly VehicleService _service;

    public VehiclesController(VehicleService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<VehicleDto>>> GetAll()
    {
        var vehicles = await _service.GetAllVehiclesAsync();
        return Ok(vehicles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleDto>> GetById(string id)
    {
        var vehicle = await _service.GetVehicleAsync(id);
        if (vehicle == null)
            return NotFound();
        
        return Ok(vehicle);
    }

    [HttpPost]
    public async Task<ActionResult<VehicleDto>> Create([FromBody] CreateVehicleDto dto)
    {
        try
        {
            var vehicle = await _service.CreateVehicleAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 409)
        {
            return Conflict($"Vehicle with ID {dto.Id} already exists");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleDto>> Update(string id, [FromBody] UpdateVehicleDto dto)
    {
        var vehicle = await _service.UpdateVehicleAsync(id, dto);
        if (vehicle == null)
            return NotFound();
        
        return Ok(vehicle);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var result = await _service.DeleteVehicleAsync(id);
        if (!result)
            return NotFound();
        
        return NoContent();
    }
}
