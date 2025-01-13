using vegeatery.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Data;
using vegeatery.Controllers;
namespace vegeatery
{
	public class MyDbContext : DbContext
	{
		private readonly IConfiguration _configuration;

		public MyDbContext(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			string? connectionString = _configuration.GetConnectionString("MyConnection");
			if (connectionString != null)
			{
				optionsBuilder.UseSqlServer(connectionString);
			}
		}

		public required DbSet<Product> Product { get; set; }
		public required DbSet<Cart> Cart { get; set; }
		public required DbSet<Order> Order { get; set; }
		public required DbSet<OrderItem> OrderItems { get; set; }
		public required DbSet<CartItem> CartItems { get; set; }
		public required DbSet<User> Users { get; set; }
		public required DbSet<Role> Role { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Seed Roles
			modelBuilder.Entity<Role>().HasData(
				new Role { Id = 1, Name = "User" },
				new Role { Id = 2, Name = "Staff" },
				new Role { Id = 3, Name = "Admin" }
			);

			// Common token generation logic
			string GenerateJwtToken(string username, string role)
			{
				var tokenHandler = new JwtSecurityTokenHandler();
				var key = Encoding.ASCII.GetBytes(_configuration["Authentication:Secret"]);
				var tokenDescriptor = new SecurityTokenDescriptor
				{
					Subject = new ClaimsIdentity(new Claim[]
					{
				new Claim(ClaimTypes.Name, username),
				new Claim(ClaimTypes.Role, role)
					}),
					Expires = DateTime.UtcNow.AddDays(int.Parse(_configuration["Authentication:TokenExpiresDays"])),
					SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
				};
				var token = tokenHandler.CreateToken(tokenDescriptor);
				return tokenHandler.WriteToken(token);
			}

			// Seed Users
			var users = new List<User>
	{
		new User
		{
			Id = 1,
			Username = "masteradmin",
			PasswordHash = BCrypt.Net.BCrypt.HashPassword("MasterAdminPassword123!"),
			Email = "admin@domain.com",
			DateofBirth = "",
			ContactNumber = "",
			Gender = "Others",
			DietPreference = "",
			AllergyInfo = "",
			MealTypes = "",
			Promotions = true,
			Agreement = true,
			TotalPoints = 0,
			RoleId = 3, // Admin role
            JwtToken = GenerateJwtToken("masteradmin", "Admin")
		},
		new User
		{
			Id = 2,  // Assuming the next available ID is 2
            Username = "staffuser",
			PasswordHash = BCrypt.Net.BCrypt.HashPassword("StaffUserPassword123!"),
			Email = "staff@domain.com",
			DateofBirth = "",
			ContactNumber = "",
			Gender = "Female",
			DietPreference = "",
			AllergyInfo = "",
			MealTypes = "",
			Promotions = false,  // Staff might not have access to promotions
            Agreement = true,
			TotalPoints = 0,
			RoleId = 2, // Staff role
            JwtToken = GenerateJwtToken("staffuser", "Staff")
		}
	};

			modelBuilder.Entity<User>().HasData(users);
		}

	}
}
