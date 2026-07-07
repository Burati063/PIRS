using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using PIRS.Models.UserModel;
using Microsoft.AspNetCore.Identity;

namespace PIRS.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public AccountController(IConfiguration configuration, SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _configuration = configuration;
            this.signInManager = signInManager;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> SignUp(AppUser user, string roleName, string password)
        {
            if ((!ModelState.IsValid) || (user == null) || (string.IsNullOrEmpty(password)))
                return BadRequest(ModelState);

            var role = await roleManager.FindByNameAsync(roleName);

            if (role != null && (roleName == "User" || roleName == "Contractor" || roleName == "Company"))
            {
                var ph = new PasswordHasher<AppUser>();
                user.PasswordHash = ph.HashPassword(user, password);
                var result = await userManager.CreateAsync(user);
                if (!result.Succeeded) return Unauthorized(result.Errors);
                if (!await userManager.IsInRoleAsync(user, roleName))
                    await userManager.AddToRoleAsync(user, roleName);
                await signInManager.PasswordSignInAsync(user, password, false, false);
                IList<string> roles = await userManager.GetRolesAsync(user);
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.Name ),
                    new Claim(ClaimTypes.Role, roleName )
                };
                var token = GenerateJwtToken(claims);

                return Ok(new { Token = token, User = user });
            }

            ModelState.AddModelError(string.Empty, "Invalid role or role does not exist");
            return BadRequest(ModelState);
        }
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return BadRequest("Invalid email or password.");
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, password, false);

            if (!result.Succeeded)
            {
                return Unauthorized("Invalid email or password.");
            }

            var roles = await userManager.GetRolesAsync(user);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, roles != null && roles.Count > 0 ? roles[0] : "User")
            };

            var token = GenerateJwtToken(claims);
            return Ok(new { Token = token, User = user, Role = roles.Count > 0 ? roles[0] : "User" });
        }

        [NonAction]
        private string GenerateJwtToken(Claim[] claims)
        {
            var jwtSecret = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];
            //var jwtExpiryMinutes = 120;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            //var expiry = DateTime.UtcNow.AddMinutes(jwtExpiryMinutes);

            var token = new JwtSecurityToken(
                jwtIssuer,
                jwtAudience,
                claims,
                //expires: expiry,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}