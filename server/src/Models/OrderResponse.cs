namespace vegeatery.Models
{
	public class OrderResponse
	{
		public int OrderId { get; set; }
		public string FullName { get; set; }
		public string Email { get; set; }
		public string Address { get; set; }
		public DateTime OrderDate { get; set; }
		public TimeOnly TimeSlot { get; set; }
		public decimal TotalPrice { get; set; }
		public decimal TotalPoints { get; set; }
		public List<OrderItemResponse> OrderItems { get; set; }
	}
}
