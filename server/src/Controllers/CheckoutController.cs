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

            var domain = _configuration["Stripe:Domain"];
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = order.OrderItems.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "sgd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.Product != null ? item.Product.ProductName : "Unknown",
                        },
                        UnitAmount = (long)(item.Price * 100), // Stripe expects the amount in cents
                    },
                    Quantity = item.Quantity,
                }).ToList(),
                Mode = "payment",
                SuccessUrl = $"{domain}/order-confirmation?orderId={orderId}&session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{domain}/cancel",
            };

            var service = new SessionService();
            Session session = service.Create(options);

            // Save the session ID to the order for future reference
            order.SessionId = session.Id;
            _context.SaveChanges();

            return Ok(new { SessionId = session.Id });
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
                    var session = stripeEvent.Data.Object as Session;
                    var order = _context.Order.AsTracking().FirstOrDefault(o => o.SessionId == session.Id);
                    if (order != null)
                    {
                        order.Status = "In-Progress";
                        _context.SaveChanges();
                    }
                    else
                    {
                        _logger.LogWarning($"Order not found for session ID: {session.Id}");
                    }
                    break;
            }

            return Ok();
        }
    }
}