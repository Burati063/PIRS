using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly RoleManager<IdentityRole> _roleManager;

    public RoleController(RoleManager<IdentityRole> roleManager)
    {
        _roleManager = roleManager;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole(string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
        {
            return BadRequest("Role name is required.");
        }

        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (roleExists)
        {
            return BadRequest("Role already exists.");
        }

        var role = new IdentityRole(roleName);
        var result = await _roleManager.CreateAsync(role);

        if (result.Succeeded)
        {
            return Ok("Role created successfully.");
        }

        return BadRequest("Failed to create role.");
    }

    // Other role-related actions here...
}