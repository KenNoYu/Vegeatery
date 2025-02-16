using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace vegeatery.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class StripeController : ControllerBase
	{

		[HttpGet("sales-summary")]
		public IActionResult GetSalesSummary()
		{
			var service = new PaymentIntentService();
			var paymentIntents = service.List(new PaymentIntentListOptions
			{
				Limit = 100
			});

			var salesByDate = paymentIntents.Data
				.GroupBy(pi => pi.Created.ToString("yyyy-MM-dd"))
				.Select(g => new
				{
					Date = g.Key,
					Sales = g.Sum(pi => pi.AmountReceived) / 100.0 // cents to dollars
				})
				.OrderBy(g => g.Date)
				.ToList();

			var totalSales = paymentIntents.Data.Sum(pi => pi.AmountReceived) / 100.0; // Convert from cents to dollars
			var totalOrders = paymentIntents.Data.Count;

			return Ok(new
			{
				TotalSales = totalSales,
				TotalOrders = totalOrders,
				SalesData = salesByDate
			});
		}
	}
}
