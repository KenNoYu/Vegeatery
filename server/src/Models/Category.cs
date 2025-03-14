using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace vegeatery.Models
{
    public class Category
    {
        public int CategoryId { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string CategoryName { get; set; }

        [Required]
        public int TotalProduct { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }


        // Add a navigation property for Products
        [JsonIgnore] // Prevent serialization of the Products property
        public ICollection<Product>? Products { get; set; }  // Add this line


    }
}
