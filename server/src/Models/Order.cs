﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vegeatery.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(500)]
        public string Address { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Total price must be a positive value.")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Total points must be a non-negative value.")]
        public int TotalPoints { get; set; } // Points used for this order

        [Required, Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "datetime")]
        public DateTime? UpdatedAt { get; set; }

        // Foreign Key
        public int? VoucherId { get; set; }
        public int? CustomerId { get; set; } // Nullable for guest users
        public string? SessionId { get; set; } // For guest checkout

        // Navigation properties
        //public Customer? Customer { get; set; } // Assuming you have a Customer entity
        //public Voucher? Voucher { get; set; } // Assuming you have a Voucher entity
        public ICollection<OrderItem>? OrderItems { get; set; } // Collection of items in the order
    }
}