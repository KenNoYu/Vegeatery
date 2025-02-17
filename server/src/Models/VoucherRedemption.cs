namespace vegeatery.Models
{
    public class VoucherRedemption
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VoucherId { get; set; }
        public DateTime RedeemedAt { get; set; }
    }
}
