﻿namespace vegeatery.Models
{
	public class OrderItemResponse
	{
		public int ProductId { get; set; }
		public string ProductName { get; set; }
		public int Quantity { get; set; }
		public decimal Price { get; set; }
	}
}
