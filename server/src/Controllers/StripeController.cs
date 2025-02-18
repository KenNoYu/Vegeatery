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
            var paymentIntents = new List<PaymentIntent>();
            string startingAfter = null;

            do
            {
                var options = new PaymentIntentListOptions
                {
                    Limit = 100,
                    StartingAfter = startingAfter
                };

                var page = service.List(options);
                paymentIntents.AddRange(page.Data);
                startingAfter = page.HasMore ? page.Data.Last().Id : null;
            } while (startingAfter != null);


            var salesByDate = paymentIntents
				.GroupBy(pi => pi.Created.ToString("yyyy-MM-dd"))
				.Select(g => new
				{
					Date = g.Key,
					Sales = g.Sum(pi => pi.AmountReceived) / 100.0 // cents to dollars
				})
				.OrderBy(g => g.Date)
				.ToList();

			var totalSales = paymentIntents.Sum(pi => pi.AmountReceived) / 100.0; // Convert from cents to dollars
			var totalOrders = paymentIntents.Count;

			return Ok(new
			{
				TotalSales = totalSales,
				TotalOrders = totalOrders,
				SalesData = salesByDate
			});
		}
	}
}
