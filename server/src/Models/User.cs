using System.ComponentModel.DataAnnotations;
using vegeatery.Models;

public class User
{

	[Key]
	public int Id { get; set; }

	[Required]
	[MaxLength(50)]
	public string? Username { get; set; }

	[Required]
	[MaxLength(100)]
	public string? Email { get; set; }

	[Required]
	public string? DateofBirth { get; set; }

	[Required]
	[MaxLength(100)]
	public string? ContactNumber { get; set; }

	[Required]
	public string? PasswordHash { get; set; }

	[Required]
	public string? Gender { get; set; }

	[Required]
	public string? DietPreference { get; set; }

	[Required]
	public string? AllergyInfo { get; set; }

	[Required]
	public string? MealTypes { get; set; }

	[MaxLength(100)]
	public string? Address { get; set; }

	public bool Promotions { get; set; }

	[Required]
	public bool Agreement { get; set; }

	public int TotalPoints { get; set; } = 0;

    public string? JwtToken { get; set; }

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	public int RoleId { get; set; }
    public int TierId { get; set; }

    public Role? Role { get; set; }

    public Tier Tier { get; set; }


	// foreign key
	public int CartId { get; set; }

	// Navigation property
	public Cart Cart { get; set; }
}

