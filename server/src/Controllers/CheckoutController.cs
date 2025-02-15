using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Security;
using vegeatery.Models;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using Stripe;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    [EnableCors]
    public class CheckoutController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;

        public CheckoutController(MyDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Stripe payment integration
        [HttpPost("checkout")]
        public IActionResult CreateCheckoutSession(int orderId)
        {
            // Retrieve the order and its items
            var order = _context.Order.Include(o => o.OrderItems).FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
            {
                return NotFound(new { Message = "Order not found" });
            }

			decimal discountPercentDecimal = Convert.ToDecimal(order.discountPercent);
			long discountAmount = (long)Math.Round(order.TotalPrice * discountPercentDecimal * 100);

			var domain = _configuration["Stripe:Domain"];

			var lineItems = new List<SessionLineItemOptions>();

			// Add each product as a display-only line item
			foreach (var item in order.OrderItems)
			{
				lineItems.Add(new SessionLineItemOptions
				{
					PriceData = new SessionLineItemPriceDataOptions
					{
						Currency = "sgd",
						ProductData = new SessionLineItemPriceDataProductDataOptions
						{
							Name = item.ProductName ?? "Unknown",
							Description = $"Price: ${item.Price:F2} x {item.Quantity}"
						},
						UnitAmount = (long)(item.Price * 100), // Display only (won't charge)
					},
					Quantity = item.Quantity
				});
			}

			var couponOptions = new CouponCreateOptions
			{
				PercentOff = order.discountPercent * 100,
				Duration = "once"
			};
			var couponService = new CouponService();
			var coupon = couponService.Create(couponOptions);


			var options = new SessionCreateOptions
            {
				PaymentMethodTypes = new List<string> { "card" },
				LineItems = lineItems,
				Discounts = new List<SessionDiscountOptions>
				{
					new SessionDiscountOptions { Coupon = coupon.Id }
				},
				Mode = "payment",
                SuccessUrl = $"{domain}/orderconfirmation?orderId={orderId}&session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{domain}/orders",
            };
            var service = new SessionService();
            Session session = service.Create(options);

            // Save the session ID to the order for future reference
            order.SessionId = session.Id;
            _context.SaveChanges();

            return Ok(new { SessionId = session.Id});
        }

		// webhook for stripe
		[HttpPost("webhook")]
		public async Task<IActionResult> StripeWebhook()
		{
			var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
			var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _configuration["Stripe:WebhookSecret"]);

			switch (stripeEvent.Type)
			{
				case "checkout.session.completed":
					var completedSession = stripeEvent.Data.Object as Session;
					var completedOrder = _context.Order.AsTracking().FirstOrDefault(o => o.SessionId == completedSession.Id);
					if (completedOrder == null)
					{
						completedOrder.Status = "New";
						_context.SaveChanges();
					}
					break;

				case "checkout.session.async_payment_failed":
				case "checkout.session.expired":
				case "checkout.session.failed":
					var failedSession = stripeEvent.Data.Object as Session;
					var failedOrder = _context.Order.AsTracking().FirstOrDefault(o => o.SessionId == failedSession.Id);
					if (failedOrder != null)
					{
						failedOrder.Status = "Cancelled";
						_context.SaveChanges();
					}
					break;
			}

			return Ok();
		}
	}
}