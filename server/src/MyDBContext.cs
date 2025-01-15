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
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<ReservationLog> ReservationLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReservationLog>()
                .HasOne(r => r.Reservation)
                .WithMany() // Assuming a Reservation has many logs
                .HasForeignKey(r => r.ReservationId)
                .OnDelete(DeleteBehavior.Cascade);


        }


        public required DbSet<Tier> Tiers { get; set; }
        public required DbSet<Voucher> Vouchers { get; set; }
        public required DbSet<GeneralFeedback> GeneralFeedbacks { get; set; }



    }
}
