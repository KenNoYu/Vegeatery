using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vegeatery.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController(MyDbContext context) : ControllerBase
    {
        private readonly MyDbContext _context = context;
        // Create new order (for customer)
        [HttpPost("newOrder")]
        public IActionResult CreateOrder([FromBody] CreateOrderRequest request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Retrieve the cart and its items
                    var cart = _context.Cart.Include(c => c.CartItems).FirstOrDefault(c => c.CartId == request.CartId);
                    if (cart == null || !cart.CartItems.Any())
                    {
                        return NotFound(new { Message = "Cart cannot be empty or it dosen't exist" });
                    }

                    //For adding bonus points for user (based on their order count)
                    // Retrieve the user
                    var user = _context.Users.FirstOrDefault(u => u.Id == request.CustomerId);
                    if (user == null)
                    {
                        return NotFound(new { Message = "User not found" });
                    }

                    // Check if the order period has expired
                    if (user.OrderPeriodStart.HasValue && (DateTime.UtcNow - user.OrderPeriodStart.Value).TotalDays > 7)
                    {
                        user.OrderCount = 0;
                        user.OrderPeriodStart = null;
                    }

                    // Increment the order count
                    user.OrderCount++;

                    // If this is the first order in the period, set the start date
                    if (user.OrderCount == 1)
                    {
                        user.OrderPeriodStart = DateTime.UtcNow;
                    }

                    // Check if the user has reached 7 orders within 7 days
                    if (user.OrderCount >= 7)
                    {
                        // Award 10 points
                        user.TotalPoints += 10;

                        // Reset the counters
                        user.OrderCount = 0;
                        user.OrderPeriodStart = null;
                    }

                    // Create the order
                    var order = new Order
                    {
                        FullName = request.FullName,
                        Email = request.Email,
                        Address = request.Address,
                        OrderDate = request.OrderDate,
                        TotalPrice = request.TotalPrice,
                        TotalPoints = request.TotalPoints,
                        TimeSlot = request.TimeSlot,
                        Status = request.Status,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        VoucherId = request?.VoucherId,
                        discountPercent = request?.discountPercent,
                        CustomerId = request?.CustomerId,
                        SessionId = request?.SessionId
                    };
                    // save order
                    _context.Order.Add(order);
                    _context.SaveChanges();
                    // Create the order items from cart items
                    foreach (var cartItem in cart.CartItems)
                    {
                        var orderItem = new OrderItem
                        {
                            OrderId = order.OrderId,
							ProductName = cartItem.ProductName,
							ProductId = cartItem.ProductId,
                            Price = cartItem.Price,
                            Quantity = cartItem.Quantity,
                            PointsEarned = cartItem.Points,
                        };
                        // save order items
                        _context.OrderItems.Add(orderItem);
                    }
                    _context.SaveChanges();
                    transaction.Commit();
                    return Ok(new { Message = "Order created successfully.", OrderId = order.OrderId });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    // Log the full exception details, including the inner exception
                    var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return StatusCode(500, new { Message = "An error occurred while creating the order.", Details = errorMessage });
                }
            }
        }

        // Get Order By ID
        [HttpGet("orderId")]
        public IActionResult GetOrderById(int orderId)
        {
            try
            {
                // Retrieve the order and its items
                var order = _context.Order
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product) // Assuming OrderItem has a navigation property to Product
                    .FirstOrDefault(o => o.OrderId == orderId);

                if (order == null)
                {
                    return NotFound(new { Message = "Order not found" });
                }

                // Map the order and its items to a response DTO
                var orderResponse = new OrderResponse
                {
                    OrderId = order.OrderId,
                    FullName = order.FullName,
                    Email = order.Email,
                    Address = order.Address,
                    OrderDate = order.OrderDate,
                    TimeSlot = order.TimeSlot,
                    TotalPrice = order.TotalPrice,
					TotalPoints = order.TotalPoints,
                    discountPercent = order?.discountPercent,
                    VoucherId = order?.VoucherId,
					OrderItems = order.OrderItems.Select(oi => new OrderItemResponse
                    {
                        ProductName = oi.ProductName, // Assuming ProductName is a property of Product
                        Quantity = oi.Quantity,
                        Price = oi.Price
                    }).ToList()
                };

                return Ok(orderResponse);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while getting orders.", Details = ex.Message });
            }
        }

        // Get all orders by date (for admin)
        [HttpGet("allByDate")]
        public IActionResult GetAllOrdersByDate(DateTime startDate, DateTime endDate)
        {
			try
			{
				// Get all orders in order table
				var result = _context.Order
					.Include(order => order.OrderItems)
					.Where(order => order.OrderDate >= startDate && order.OrderDate <= endDate)
					.Select(Order => new
					{
						Order.OrderId,
						Order.FullName,
                        Order.Address,
						Order.OrderDate,
						Order.TimeSlot,
						Order.Status,
						Items = Order.OrderItems.Select(item => new
						{
							item.ProductName,
							item.Price,
							item.Quantity,
							item.PointsEarned
						}).ToList()
					})
					.ToList();
				// Return an empty list if no products are found
				if (!result.Any())
				{
					return Ok(new { Message = "You don't have any orders", Orders = result });
				}
				return Ok(result);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { Message = "An error occurred while getting orders.", Details = ex.Message });
			}
		}

			// Get all orders (for admin)
			[HttpGet("all")]
        public IActionResult GetAll()
        {
            try
            {
                // Get all orders in order table
                var result = _context.Order
                    .Include(order => order.OrderItems)
                    .Select(Order => new
                    {
                        Order.OrderId,
                        Order.FullName,
                        Order.Email,
                        Order.Address,
                        Order.OrderDate,
                        Order.TotalPrice,
                        Order.TotalPoints,
                        Order.TimeSlot,
                        Order.Status,
                        Order.CreatedAt,
                        Items = Order.OrderItems.Select(item => new
                        {
							item.ProductName,
                            item.Price,
                            item.Quantity,
                            item.PointsEarned
                        }).ToList()
                    })
                    .ToList();
                // Return an empty list if no products are found
                if (!result.Any())
                {
                    return Ok(new { Message = "You don't have any orders", Orders = result });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while getting orders.", Details = ex.Message });
            }
        }

        // TODO: Get orders by dates and status (for staff)
        [HttpGet("dateAndStatus")]
        public IActionResult GetOrdersByDate(DateTime startDate, DateTime endDate, string status)
        {
            try
            {
                // Get all orders in order table
                var result = _context.Order
                    .Include(order => order.OrderItems)
                    .Where(order => order.OrderDate >= startDate && order.OrderDate <= endDate && order.Status == status)
                    .Select(Order => new
                    {
                        Order.OrderId,
                        Order.FullName,
                        Order.Address,
                        Order.OrderDate,
                        Order.TimeSlot,
                        Order.Status,
                        Items = Order.OrderItems.Select(item => new
                        {
                            item.ProductName,
                            item.Price,
                            item.Quantity,
                            item.PointsEarned
                        }).ToList()
                    })
                    .ToList();
                // Return an empty list if no products are found
                if (!result.Any())
                {
                    return Ok(new { Message = "You don't have any orders", Orders = result });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while getting orders.", Details = ex.Message });
            }
        }

        // Update order status (for staff)
        [HttpPut("updateStatus")]
        public IActionResult UpdateOrderStatus(OrderStatusUpdateRequest request)
        {
            try
            {
                // Get order by order id
                var order = _context.Order.FirstOrDefault(order => order.OrderId == request.OrderId);
                if (order == null)
                {
                    return NotFound(new { Message = "Order not found." });
                }
                // Update order status
                order.Status = request.Status;
                order.UpdatedAt = DateTime.UtcNow;
                // Save changes
                _context.SaveChanges();
                return Ok(new { Message = "Order status updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating order status.", Details = ex.Message });
            }
        }

        // Get order by customer id (for customer)
        [HttpGet("customerId")]
        public IActionResult GetOrderByCustId(int custId)
        {
            try
            {
                var result = _context.Order
                .Include(Order => Order.OrderItems)
                .Where(Order => Order.CustomerId == custId)
                .Select(Order => new
                {
                    Order.OrderId,
                    Order.CustomerId,
                    Order.OrderDate,
                    Order.Status,
                    Order.TotalPrice,
                    OrderItems = Order.OrderItems.Select(item => new
                    {
						item.ProductName,
						item.Price,
                        item.Quantity,
                        item.PointsEarned
                    }).ToList()
                })
                .ToList();

                if (!result.Any())
                {
					return Ok(new Order[] {});
				}

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while getting your order.", Details = ex.Message });
            }
        }

        // Delete Order (Debug purpose)
        [HttpDelete("deleteOrder")]
        public IActionResult DeleteOrder(int orderId)
        {
            try
            {
                // Get order by order id
                var order = _context.Order.FirstOrDefault(order => order.OrderId == orderId);
                if (order == null)
                {
                    return NotFound(new { Message = "Order not found." });
                }
                // Delete order
                _context.Order.Remove(order);
                // Save changes
                _context.SaveChanges();
                return Ok(new { Message = "Order deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting order.", Details = ex.Message });
            }
        }
    }
}
