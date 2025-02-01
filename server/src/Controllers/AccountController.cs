// Controllers/AccountController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vegeatery;
using vegeatery.Dtos;

[Route("[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
	private readonly MyDbContext _context;

	public AccountController(MyDbContext context)
	{
		_context = context;
	}

	[HttpGet("{id}")]
	[Authorize(Policy = "Admin")]
	public async Task<IActionResult> GetUserById(int id)
	{
		var user = await _context.Users.Include(u => u.Role).SingleOrDefaultAsync(u => u.Id == id);

		if (user == null)
		{
			return NotFound(new { message = "User not found" });
		}

		var userDto = new UserDto
		{
			Id = user.Id,
			Username = user.Username,
			Email = user.Email,
			DateofBirth = user.DateofBirth,
			ContactNumber = user.ContactNumber,
			Gender = user.Gender,
			DietPreference = user.DietPreference,
			AllergyInfo = user.AllergyInfo,
			MealTypes = user.MealTypes,
			Address = user.Address,
			Promotions = user.Promotions,
			Agreement = user.Agreement,
			TotalPoints = user.TotalPoints,
			JwtToken = user.JwtToken,
			CreatedAt = user.CreatedAt,
			RoleId = user.RoleId,
			RoleName = user.Role.Name,
			CartId = user.CartId
		};

		return Ok(userDto);
	}

	[HttpGet]
	[Authorize(Policy = "Admin")]
	public async Task<IActionResult> GetAllUsers()
	{
		// Directly access the database to get users
		var users = await _context.Users.Include(u => u.Role).ToListAsync();

		// Map users to UserDto
		var userDtos = users.Select(user => new UserDto
		{
			Id = user.Id,
			Username = user.Username ?? string.Empty,
			Email = user.Email ?? string.Empty,
			DateofBirth = user.DateofBirth ?? string.Empty,
			ContactNumber = user.ContactNumber ?? string.Empty,
			Gender = user.Gender ?? string.Empty,
			DietPreference = user.DietPreference ?? string.Empty,
			AllergyInfo = user.AllergyInfo ?? string.Empty,
			MealTypes = user.MealTypes ?? string.Empty,
			Address = user.Address ?? string.Empty,
			Promotions = user.Promotions,
			Agreement = user.Agreement,
			TotalPoints = user.TotalPoints,
			JwtToken = user.JwtToken ?? string.Empty,
			CreatedAt = user.CreatedAt,
			RoleId = user.RoleId,
			RoleName = user.Role?.Name ?? string.Empty,
			CartId = user.CartId
		}).ToList();

		return Ok(userDtos);
	}

	[HttpPut("{id}")]
	[Authorize]
	public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
	{
		var user = _context.Users.SingleOrDefault(u => u.Id == id);

		if (user == null)
		{
			return NotFound(new { message = "User not found" });
		}

		user.Username = updateUserDto.Username;
		user.Email = updateUserDto.Email;
		user.DateofBirth = updateUserDto.Dob;
		user.ContactNumber = updateUserDto.Contact;
		user.Gender = updateUserDto.Gender;
		user.DietPreference = updateUserDto.Diet;
		user.AllergyInfo = updateUserDto.Allergy;
		user.MealTypes = updateUserDto.Meal;

		_context.Users.Update(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "User updated successfully" });
	}

	[HttpDelete("{id}")]
	[Authorize]
	public async Task<IActionResult> DeleteUser(int id)
	{
		var user = _context.Users.SingleOrDefault(u => u.Id == id);

		if (user == null)
		{
			return NotFound(new { message = "User not found" });
		}

		_context.Users.Remove(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "User deleted successfully" });
	}

	[HttpPut("{id}/role")]
	[Authorize(Policy = "Admin")]
	public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto updateUserRoleDto)
	{
		var user = _context.Users.SingleOrDefault(u => u.Id == id);

		if (user == null)
		{
			return NotFound(new { message = "User not found" });
		}

		user.RoleId = updateUserRoleDto.RoleId;

		_context.Users.Update(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "User role updated successfully" });
	}
}

public class UpdateUserDto
{
	public string Username { get; set; }
	//public string Password { get; set; }
	public string Email { get; set; }
	public string Dob { get; set; }
	public string Contact { get; set; }
	public string Gender { get; set; }
	public string Diet { get; set; }
	public string Allergy { get; set; }
	public string Meal { get; set; }
	//public bool Promotions { get; set; }
	//public bool Agreement { get; set; }
	//public string Address { get; set; }
	//public string points { get; set; }
}

public class UpdateUserRoleDto
{
	public int RoleId { get; set; }
}