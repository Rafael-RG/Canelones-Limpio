using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController : ControllerBase
{
    private readonly CollectionSessionService _service;

    public SessionsController(CollectionSessionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<CollectionSessionDto>>> GetAll()
    {
        var sessions = await _service.GetAllSessionsAsync();
        return Ok(sessions);
    }

    [HttpGet("active")]
    public async Task<ActionResult<List<CollectionSessionDto>>> GetActive()
    {
        var sessions = await _service.GetActiveSessionsAsync();
        return Ok(sessions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CollectionSessionDto>> GetById(string id)
    {
        var session = await _service.GetSessionAsync(id);
        if (session == null)
            return NotFound();
        
        return Ok(session);
    }

    [HttpGet("by-collector/{collectorId}")]
    public async Task<ActionResult<List<CollectionSessionDto>>> GetByCollector(string collectorId)
    {
        var sessions = await _service.GetSessionsByCollectorAsync(collectorId);
        return Ok(sessions);
    }

    [HttpPost]
    public async Task<ActionResult<CollectionSessionDto>> Create([FromBody] CreateCollectionSessionDto dto)
    {
        var session = await _service.CreateSessionAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = session.Id }, session);
    }

    [HttpPost("{id}/end")]
    public async Task<ActionResult<CollectionSessionDto>> EndSession(string id, [FromBody] EndCollectionSessionDto dto)
    {
        var session = await _service.EndSessionAsync(id, dto);
        if (session == null)
            return NotFound();
        
        return Ok(session);
    }
}
