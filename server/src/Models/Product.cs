using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace vegeatery.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string ProductName { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProductPrice { get; set; }

        [Required, MinLength(3), MaxLength(500)]
        public string ProductDescription { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string ProductCategory { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
