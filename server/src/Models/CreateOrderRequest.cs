namespace vegeatery.Models
{
    public class CreateOrderRequest
    {
        public int CartId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public int TotalPoints { get; set; }
        public int? VoucherId { get; set; }
        public int? CustomerId { get; set; }
        public string SessionId { get; set; }
    }
}
