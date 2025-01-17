using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace vegeatery.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string ProductName { get; set; }

        [Required, MinLength(3), MaxLength(500)]
        public string ProductDescription { get; set; }

        [Required, MinLength(3), MaxLength(1000)]
        public string Ingredients { get; set; }

        public int Calories { get; set; }
        public float Fats { get; set; }
        public float Carbs { get; set; }
        public float Protein { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProductPrice { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Product points must be a non-negative value.")]
        public int ProductPoints { get; set; }

        [Required, MinLength(3), MaxLength(500)]
        public string ProductDescription { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; } // Made nullable

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
