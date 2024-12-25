using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace vegeatery.Models
{
    public class CartItem
    {
        [Key]
        public int CartItemId { get; set; }

        [Required, Range(1, 10000)]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required, Range(1, 10)]
        public int Quantity { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        // Foreign Key
        [Required]
        public int CartId { get; set; } // Foreign key to Cart

        [Required]
        public int ProductId { get; set; } // Foreign key to Product

        // Navigation properties
        public Cart? Cart { get; set; }
        public Product? Product { get; set; }
    }
}
