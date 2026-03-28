using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CollectorsController : ControllerBase
{
    private readonly CollectorService _service;

    public CollectorsController(CollectorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<CollectorDto>>> GetAll()
    {
        var collectors = await _service.GetAllCollectorsAsync();
        return Ok(collectors);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CollectorDto>> GetById(string id)
    {
        var collector = await _service.GetCollectorAsync(id);
        if (collector == null)
            return NotFound();
        
        return Ok(collector);
    }

    [HttpPost]
    public async Task<ActionResult<CollectorDto>> Create([FromBody] CreateCollectorDto dto)
    {
        try
        {
            var collector = await _service.CreateCollectorAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = collector.Id }, collector);
        }
        catch (Azure.RequestFailedException ex) when (ex.Status == 409)
        {
            return Conflict($"Collector with ID {dto.Id} already exists");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CollectorDto>> Update(string id, [FromBody] UpdateCollectorDto dto)
    {
        var collector = await _service.UpdateCollectorAsync(id, dto);
        if (collector == null)
            return NotFound();
        
        return Ok(collector);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var result = await _service.DeleteCollectorAsync(id);
        if (!result)
            return NotFound();
        
        return NoContent();
    }
}
