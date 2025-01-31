namespace vegeatery.Models
{
    public class Voucher
    {
        public int VoucherId { get; set; }
        public string VoucherName { get; set; } = string.Empty;
        public Double DiscountPercentage { get; set; }
        public DateTime ExpiryDate { get; set; }

        public int TierId { get; set; } // Foreign key for Tier
        public Tier Tier { get; set; } // Navigation property
    }
}
