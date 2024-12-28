using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vegeatery.Models
{
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive value.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required, Range(1, 10)]
        public int Quantity { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Points earned must be a non-negative value.")]
        public int PointsEarned { get; set; }

        // Foreign Key properties
        public int OrderId { get; set; }
        public int ProductId { get; set; }

        // Navigation properties
        public Order? Order { get; set; }
        public Product? Product { get; set; }
    }
}
