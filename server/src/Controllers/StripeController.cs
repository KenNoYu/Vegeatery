using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace vegeatery.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class StripeController : Controller
	{
		public StripeController()
		{
			StripeConfiguration.ApiKey = "your_stripe_secret_key";
		}

		[HttpGet("sales-summary")]
		public IActionResult GetSalesSummary()
		{
			var service = new PaymentIntentService();
			var paymentIntents = service.List(new PaymentIntentListOptions
			{
				Limit = 100
			});

			var totalSales = paymentIntents.Data.Sum(pi => pi.AmountReceived) / 100.0; // Convert from cents to dollars
			var totalOrders = paymentIntents.Data.Count;

			return Ok(new
			{
				TotalSales = totalSales,
				TotalOrders = totalOrders
			});
		}
	}
}
