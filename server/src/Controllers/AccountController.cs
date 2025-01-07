// Controllers/AccountController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using vegeatery;

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
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetUserById(int id)
	{
		var user = await _context.Users.FindAsync(id);

		if (user == null)
		{
			return NotFound(new { message = "User not found" });
		}

		return Ok(user);
	}

	[HttpGet]
	[Authorize(Roles = "Admin")]
	public IActionResult GetAllUsers()
	{
		var users = _context.Users.ToList();

		return Ok(users);
	}

	[HttpPut("{id}")]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
	{
		var user = _context.Users.SingleOrDefault(u => u.Id == id);

		if (user == null)
		{
			return NotFound(new { message = "User not found" });
		}

		user.Username = updateUserDto.Username;
		user.Email = updateUserDto.Email;

		_context.Users.Update(user);
		await _context.SaveChangesAsync();

		return Ok(new { message = "User updated successfully" });
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = "Admin")]
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
	[Authorize(Roles = "Admin")]
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
	public string Address { get; set; }
	public string points { get; set; }
}

public class UpdateUserRoleDto
{
	public int RoleId { get; set; }
}