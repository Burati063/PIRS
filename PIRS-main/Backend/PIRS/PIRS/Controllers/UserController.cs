using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PIRS.Models.ReportModel;
using PIRS.Models.UserModel;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

[Route("[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IWebHostEnvironment _webHostEnvironment;
    public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IWebHostEnvironment webHostEnvironment)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _webHostEnvironment = webHostEnvironment;
    }
    [HttpPost]
    public async Task<IActionResult> Create(AppUser user, string roleName)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var role = await _roleManager.FindByNameAsync(roleName);

        if (role != null && (roleName == "User" || roleName == "Contractor" || roleName == "Company"))
        {

            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                if (!await _userManager.IsInRoleAsync(user, roleName))
                    await _userManager.AddToRoleAsync(user, roleName);

                return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
            }
        }

        ModelState.AddModelError(string.Empty, "Invalid role or role does not exist");
        return BadRequest(ModelState);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }
    [HttpGet]
    public IActionResult GetUsers()
    {
        var users = _userManager.GetUsersInRoleAsync("User").Result.ToList();

        return Ok(users);
    }

    /*    [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, AppUser updatedUser)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByIdAsync(id);

            if (existingUser == null)
                return NotFound();

            var userRoles = await _userManager.GetRolesAsync(existingUser);

            if (!userRoles.Contains("Customer"))
                return Forbid(); // Return 403 Forbidden if the user does not have the "Customer" role

            existingUser.UserName = updatedUser.UserName;
            existingUser.Email = updatedUser.Email;
            existingUser.PhoneNumber = updatedUser.PhoneNumber;

            var result = await _userManager.UpdateAsync(existingUser);

            if (result.Succeeded)
                return Ok(existingUser);

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return BadRequest(ModelState);
        }*/

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, AppUser user, string roleName)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _userManager.FindByIdAsync(id);
        if (existingUser == null)
        {
            ModelState.AddModelError(string.Empty, "User not found");
            return NotFound(ModelState);
        }

        var role = await _roleManager.FindByNameAsync(roleName);
        if (role == null || !(roleName == "User" || roleName == "Contractor" || roleName == "Company"))
        {
            ModelState.AddModelError(string.Empty, "Invalid role or role does not exist");
            return BadRequest(ModelState);
        }

        existingUser.UserName = user.UserName;
        existingUser.Email = user.Email;
        existingUser.PasswordHash = user.PasswordHash;
        existingUser.PhoneNumber = user.PhoneNumber;
        //existingUser.FirstName = user.FirstName;
        //existingUser.LastName = user.LastName;


        var result = await _userManager.UpdateAsync(existingUser);
        if (result.Succeeded)
        {
            var userRoles = await _userManager.GetRolesAsync(existingUser);
            if (!userRoles.Contains(roleName))
            {
                await _userManager.RemoveFromRolesAsync(existingUser, userRoles);
                await _userManager.AddToRoleAsync(existingUser, roleName);
            }

            return Ok(existingUser);
        }
        else
        {
            ModelState.AddModelError(string.Empty, "Failed to update user");
            return BadRequest(ModelState);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var existingUser = await _userManager.FindByIdAsync(id);

        if (existingUser == null)
            return NotFound();

        var result = await _userManager.DeleteAsync(existingUser);

        if (result.Succeeded)
            return Ok(existingUser);
        System.IO.File.Delete(Path.Combine(_webHostEnvironment.WebRootPath,existingUser.Logo));

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }

        return BadRequest(ModelState);
    }

    [HttpGet("users-with-roles")]
    public IActionResult GetUsersWithRoles(string roleName)
    {
        var role = _roleManager.FindByNameAsync(roleName).Result;

        if (role == null)
            return NotFound();

        var usersInRole = _userManager.GetUsersInRoleAsync(role.Name).Result;

        var usersWithRoles = new List<UserWithRoles>();

        foreach (var user in usersInRole)
        {
            var roles = _userManager.GetRolesAsync(user).Result;
            var userWithRoles = new UserWithRoles
            {
                User = user,
                Roles = roles.ToList()
            };

            usersWithRoles.Add(userWithRoles);
        }

        return Ok(usersWithRoles);
    }
    public class UserWithRoles
    {
        public AppUser User { get; set; }
        public List<string> Roles { get; set; }
    }
}