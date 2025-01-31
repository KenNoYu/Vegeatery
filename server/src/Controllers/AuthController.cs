using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using vegeatery;
using vegeatery.Dtos;


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
		var existingUser = await _context.Users
			.Where(u => u.Username == registerDto.username || u.Email == registerDto.email)
			.ToListAsync();

		if (existingUser.Count > 1)
		{
			return BadRequest(new { message = "Multiple users found with the same Username or Email" });
		}

		if (existingUser.Count == 1)
		{
			return BadRequest(new { message = "Username or Email already exists" });
		}

		var role = await _context.Role.SingleOrDefaultAsync(r => r.Id == 1); // Default role is User

		if (role == null)
		{
			return BadRequest(new { message = "Role not found" });
		}

		var user = new User
		{
			Username = registerDto.username,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.password),
			Email = registerDto.email,
			DateofBirth = registerDto.dateOfBirth,
			ContactNumber = registerDto.contactNumber,
			Gender = registerDto.gender,
			DietPreference = registerDto.dietPreference,
			AllergyInfo = registerDto.allergyInfo,
			MealTypes = registerDto.mealTypes,
			Address = "",
			Promotions = registerDto.promotions,
			Agreement = registerDto.agreement,
			TotalPoints = 0,
			RoleId = role.Id,
			Role = role // Assign the role to the user
		};

		if (user == null || user.Role == null)
		{
			throw new System.Exception("User or user role is not properly initialized.");
		}

		user.JwtToken = CreateToken(user);

		_context.Users.Add(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "Registration successful", token = user.JwtToken });
	}

	[HttpPost("login")]
	public IActionResult Login([FromBody] LoginDto loginDto)
	{
		var user = _context.Users
			.Include(u => u.Role)
			.SingleOrDefault(u => u.Username == loginDto.Username || u.Email == loginDto.Username);

		if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
		{
			return Unauthorized(new { message = "Invalid credentials" });
		}

		// Generate a JWT token
		user.JwtToken = CreateToken(user);

		return Ok(new { message = "Login successful", token = user.JwtToken });
	}

	[HttpGet("auth")]
	[Authorize]
	public IActionResult Auth()
	{
		// Extract user claims
		var idClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
		var nameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
		var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);

		// Validate claims
		if (idClaim != null && nameClaim != null && emailClaim != null)
		{
			var userId = Convert.ToInt32(idClaim.Value);
			var userName = nameClaim.Value;
			var userEmail = emailClaim.Value;

			var user = new
			{
				Id = userId,
				Username = userName,
				Email = userEmail
			};

			return Ok(new { User = user });
		}
		else
		{
			return Unauthorized();
		}
	}

	[HttpGet("current-user")]
	[Authorize]  // Ensures the user is authenticated
	public async Task<IActionResult> GetCurrentUser()
	{
		// Get the currently logged-in user's Id from the authenticated principal
		var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

		if (userIdString == null || !int.TryParse(userIdString, out var userId))
		{
			return Unauthorized();  // If no user is logged in
		}

		var user = await _context.Users
			.Include(u => u.Role)
			.Where(u => u.Id == userId)
			.Select(u => new UserDto
			{
				Id = u.Id,
				Username = u.Username,	
				Email = u.Email,
				DateofBirth = u.DateofBirth,
				ContactNumber = u.ContactNumber,
				Gender = u.Gender,
				DietPreference = u.DietPreference,
				AllergyInfo = u.AllergyInfo,
				MealTypes = u.MealTypes,
				Address = u.Address,
				Promotions = u.Promotions,
				Agreement = u.Agreement,
				TotalPoints = u.TotalPoints,
				JwtToken = u.JwtToken,
				CreatedAt = u.CreatedAt,
				RoleId = u.RoleId,
				RoleName = u.Role.Name
			})
			.FirstOrDefaultAsync();

		if (user == null)
		{
			return NotFound();  // If the user is not found
		}

		return Ok(user);  // Return the user data
	}


	private string CreateToken(User user)
	{
		string? secret = _configuration.GetValue<string>("Authentication:Secret");
		if (string.IsNullOrEmpty(secret))
		{
			throw new Exception("Secret is required for JWT authentication.");
		}

		int tokenExpiresDays = _configuration.GetValue<int>("Authentication:TokenExpiresDays");

		var tokenHandler = new JwtSecurityTokenHandler();
		var key = Encoding.ASCII.GetBytes(secret);
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Role, user.Role.Name)
			}),
			Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
			SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
		};
		var securityToken = tokenHandler.CreateToken(tokenDescriptor);
		string token = tokenHandler.WriteToken(securityToken);
		return token;
	}
}
public class RegisterDto
{
	public string username { get; set; }
	public string password { get; set; }
	public string email { get; set; }
	public string  dateOfBirth { get; set; }
	public string contactNumber { get; set; }
	public string gender { get; set; }
	public string dietPreference { get; set; }
	public string allergyInfo { get; set; }
	public string mealTypes { get; set; }
	public bool promotions { get; set; }
	public bool agreement { get; set; }
}

public class LoginDto
{
	public string Username { get; set; }
	public string Password { get; set; }
}
