using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace vegeatery.Models
{
    public class Product
    {
        [Required]
        public int productId { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string productName { get; set; }

        [Required, MinLength(3), MaxLength(500)]
        public string productDescription { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string productCategory { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
