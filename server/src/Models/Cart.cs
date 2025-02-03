using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace vegeatery.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        // Foreign Key
        public int? UserId { get; set; } // Nullable for guest users
        public int? SessionId { get; set; } // For guest checkouts

        // Navigation property for related cart items
        public ICollection<CartItem>? CartItems { get; set; }
		public User User { get; set; }
	}
}
