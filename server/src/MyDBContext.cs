using vegeatery.Models;
using Microsoft.EntityFrameworkCore;

namespace vegeatery
{
    public class MyDbContext(IConfiguration configuration) : DbContext
    {
        private readonly IConfiguration _configuration = configuration;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string? connectionString = _configuration.GetConnectionString("MyConnection");
            if (connectionString != null)
            {
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        public required DbSet<Product> Product { get; set; }
        public required DbSet<Category> Category { get; set; }
        public required DbSet<Cart> Cart {  get; set; }
        public required DbSet<Order> Order { get; set; }
        public required DbSet<OrderItem> OrderItems  { get; set; }
        public required DbSet<CartItem> CartItems { get; set; }
    }
}
