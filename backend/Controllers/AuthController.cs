using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new LoginResponseDto 
                { 
                    Success = false, 
                    Message = "Usuario y contraseña son requeridos" 
                });
            }

            var user = await _authService.ValidateCredentialsAsync(request.Username, request.Password);

            if (user == null)
            {
                return Unauthorized(new LoginResponseDto 
                { 
                    Success = false, 
                    Message = "Usuario o contraseña incorrectos" 
                });
            }

            var token = _authService.GenerateToken(user);

            return Ok(new LoginResponseDto
            {
                Success = true,
                Token = token,
                Username = user.Username,
                Role = user.Role,
                Message = "Login exitoso"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new LoginResponseDto 
            { 
                Success = false, 
                Message = "Error interno del servidor" 
            });
        }
    }

    [HttpGet("validate")]
    public IActionResult ValidateToken()
    {
        // Simple validation - en producción validar JWT del header
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        
        if (string.IsNullOrEmpty(authHeader))
        {
            return Unauthorized(new { success = false, message = "No autorizado" });
        }

        return Ok(new { success = true, message = "Token válido" });
    }
}
