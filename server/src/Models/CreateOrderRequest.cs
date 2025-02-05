namespace vegeatery.Models
{
    public class CreateOrderRequest
    {
        public int CartId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public int TotalPoints { get; set; }
		public decimal TotalPrice { get; set; }
		public DateTime OrderDate { get; set; }
		public TimeOnly TimeSlot { get; set; }
		public Double? discountPercent { get; set; }
		public string Status { get; set; }
        public int? VoucherId { get; set; }
        public int? CustomerId { get; set; }
        public string? SessionId { get; set; }
    }
}
