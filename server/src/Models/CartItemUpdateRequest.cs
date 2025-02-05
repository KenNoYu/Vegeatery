namespace vegeatery.Models
{
	public class CartItemUpdateRequest
	{
		public int CartId { get; set; }
		public int ProductId { get; set; }
		public int Quantity { get; set; }
	}
}
