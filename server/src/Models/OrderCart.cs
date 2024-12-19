using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace vegeatery.Models
{
    public class OrderCart
    {
        public int cartId { get; set; }
        public int userId { get; set; }
        public int sessionId { get; set; }
        public int productId { get; set; }
        public int quantity { get; set; }
        public int added_points {  get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
