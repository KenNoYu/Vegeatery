using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using vegeatery;


[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
	private readonly MyDbContext _context;
	private readonly IConfiguration _configuration;

	public AuthController(MyDbContext context, IConfiguration configuration)
	{
		_context = context;
		_configuration = configuration;
	}

	[HttpPost("register")]
	public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
	{
		var user = new User
		{
			Username = registerDto.Username,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
			Email = registerDto.Email,
			DateofBirth = registerDto.Dob,
			ContactNumber = registerDto.Contact,
			Gender = registerDto.Gender,
			DietPreference = registerDto.Diet,
			AllergyInfo = registerDto.Allergy,
			MealTypes = registerDto.Meal,
			Address = "",
			Promotions = registerDto.Promotions,
			Agreement = registerDto.Agreement,
			TotalPoints = 0,
			RoleId = 1 // Default role is User
			
		};

		user.JwtToken = GenerateJwtToken(user);

		_context.Users.Add(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "Registration successful", token = user.JwtToken });

	}

	[HttpPost("login")]
	public IActionResult Login([FromBody] LoginDto loginDto)
	{
		var user = _context.Users.SingleOrDefault(u => u.Username == loginDto.Username);

		if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
		{
			return Unauthorized(new { message = "Invalid credentials" });
		}

		// Normally, you would generate a JWT token here, but we'll skip that for now

		return Ok(new { message = "Login successful" });
	}

	private string GenerateJwtToken(User user)
	{
		var tokenHandler = new JwtSecurityTokenHandler();
		var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(new[]
			{
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Role, user.RoleId.ToString(), user.Role.Name)
			}),
			Expires = DateTime.UtcNow.AddDays(7),
			SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
		};
		var token = tokenHandler.CreateToken(tokenDescriptor);
		return tokenHandler.WriteToken(token);
	}
}

public class RegisterDto
{
	public string Username { get; set; }
	public string Password { get; set; }
	public string Email { get; set; }
	public string Dob { get; set; }
	public string Contact { get; set; }
	public string Gender { get; set; }
	public string Diet { get; set; }
	public string Allergy { get; set; }
	public string Meal { get; set; }
	public bool Promotions { get; set; }
	public bool Agreement { get; set; }
}

public class LoginDto
{
	public string Username { get; set; }
	public string Password { get; set; }
}
