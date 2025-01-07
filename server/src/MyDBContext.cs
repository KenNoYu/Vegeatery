using vegeatery.Models;
using Microsoft.EntityFrameworkCore;

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

			modelBuilder.Entity<User>().HasData(
			new User
			{
				Id = 1,
				Username = "masteradmin",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("MasterAdminPassword123!"),
				Email = "admin@domain.com",
				DateofBirth = "",
				ContactNumber = "",
				Gender = "",
				DietPreference = "",
				AllergyInfo = "",
				MealTypes = "",
				Promotions = true,
				Agreement = true,
				TotalPoints = 0,
				RoleId = 3
			}
		);
		}
	}
}
