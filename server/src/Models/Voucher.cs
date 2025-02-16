using System.ComponentModel.DataAnnotations.Schema;

namespace vegeatery.Models
{
    public class Voucher
    {
        public int VoucherId { get; set; }
        public string VoucherName { get; set; }
		[Column(TypeName = "decimal(18,2)")]
		public Decimal DiscountPercentage { get; set; }
        public int TierId { get; set; } // Foreign key for Tier
        public Tier Tier { get; set; } // Navigation property
        public DateTime? LastUsedAt { get; set; }

    }
}
