using vegeatery.Models;
using Microsoft.AspNetCore.Mvc;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderCartController(MyDbContext context) : ControllerBase
    {
        private readonly MyDbContext _context = context;

        // Add product to cart
        [HttpPost]
        public IActionResult AddtoCart(int cartId, int productId, int quantity)
        {
            // Validate input parameters
            if (cartId <= 0 || productId <= 0 || quantity <= 0)
            {
                return BadRequest(new { Message = "Invalid input parameters." });
            }
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Validate the product exists
                    var product = _context.Product.FirstOrDefault(p => p.ProductId == productId);
                    if (product == null)
                    {
                        return NotFound(new { Message = "Product does not exist." });
                    }

                    // Check if the cart exists, create if it doesn't
                    var cart = _context.Cart.FirstOrDefault(c => c.CartId == cartId);
                    if (cart == null)
                    {
                        cart = new Cart
                        {
                            CreatedAt = DateTime.Now,
                            UpdatedAt = DateTime.Now
                        };
                        _context.Cart.Add(cart);
                        _context.SaveChanges();
                        cartId = cart.CartId;
                    }

                    // Check if the product is already in the cart
                    var existingCartItem = _context.CartItems.FirstOrDefault(c => c.CartId == cartId && c.ProductId == productId);

                    if (existingCartItem != null)
                    {
                        // Update the quantity if the item already exists
                        existingCartItem.Quantity += quantity;
                        existingCartItem.UpdatedAt = DateTime.Now; // Update timestamp
                        _context.CartItems.Update(existingCartItem);
                    }
                    else
                    {
                        // Create new cart item
                        var cartItem = new CartItem
                        {
                            CartId = cartId,
                            ProductId = productId,
                            Quantity = quantity,
                            Price = product.ProductPrice,
                            CreatedAt = DateTime.Now, // Set CreatedAt timestamp
                            UpdatedAt = DateTime.Now
                        };

                        _context.CartItems.Add(cartItem);
                    }
                    // Save changes to the database
                    _context.SaveChanges();
                    transaction.Commit();

                    return Ok(new { Message = "Product added to cart successfully." });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return StatusCode(500, new { Message = "An error occurred while adding the product to the cart.", Details = ex.Message, Detail = errorMessage });
                }
            }
        }

        // Read products from cart
        [HttpGet]
        public IActionResult GetAll(int cartId)
        {
            // Validate the cartId
            if (cartId <= 0)
            {
                return BadRequest(new { Message = "Invalid cart ID." });
            }

            // Join CartItem table with Product table
            var result = _context.CartItems
                .Where(cartItem => cartItem.CartId == cartId)
                .Select(cartItem => new
                {
                    cartItem.Product.ProductName,
                    cartItem.Product.ProductPrice,
                    cartItem.Quantity,
                    cartItem.Price,
                    cartItem.CreatedAt,
                    cartItem.UpdatedAt
                })
                .ToList();

            // Return an empty list if no products are found
            if (!result.Any())
            {
                return Ok(new { Message = "You have not added any products to cart", Products = result });
            }

            return Ok(result);
        }

        // Update item in cart
        [HttpPut]
        public IActionResult UpdateCartItem(int cartId, int productId, int quantity)
        {
            // Validate input parameters
            if (cartId <= 0 || productId <= 0 || quantity <= 0)
            {
                return BadRequest(new { Message = "Invalid input parameters." });
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check if the cart exists
                    var cart = _context.Cart.FirstOrDefault(c => c.CartId == cartId);
                    if (cart == null)
                    {
                        return NotFound(new { Message = "Cart does not exist." });
                    }

                    // Find the cart item
                    var cartItem = _context.CartItems.FirstOrDefault(c => c.CartId == cartId && c.ProductId == productId);
                    if (cartItem == null)
                    {
                        return NotFound(new { Message = "Product not found in the cart." });
                    }

                    // Update the quantity
                    cartItem.Quantity = quantity;
                    cartItem.UpdatedAt = DateTime.Now; // Update timestamp

                    // Save changes to the database
                    _context.CartItems.Update(cartItem);
                    _context.SaveChanges();
                    transaction.Commit();

                    return Ok(new { Message = "Cart item updated successfully." });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    // Log the full exception details, including the inner exception
                    var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return StatusCode(500, new { Message = "An error occurred while updating the cart item.", Details = errorMessage });
                }
            }
        }

        // Remove product from cart
        [HttpDelete]
        public IActionResult Delete(int CartId, int ProductId) 
        {
            // Validate input parameters
            if (CartId <= 0 || ProductId <= 0)
            {
                return BadRequest(new { Message = "Invalid input parameters." });
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check if the cart exists
                    var cart = _context.Cart.FirstOrDefault(c => c.CartId == CartId);
                    if (cart == null)
                    {
                        return NotFound(new { Message = "Cart does not exist." });
                    }

                    // Find the cart item
                    var cartItem = _context.CartItems.FirstOrDefault(c => c.CartId == CartId && c.ProductId == ProductId);
                    if (cartItem == null)
                    {
                        return NotFound(new { Message = "Product not found in the cart." });
                    }

                    // Remove the cart item
                    _context.CartItems.Remove(cartItem);

                    // Save changes to the database
                    _context.SaveChanges();
                    transaction.Commit();

                    return Ok(new { Message = "Product removed from cart successfully." });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    // Log the full exception details, including the inner exception
                    var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                    return StatusCode(500, new { Message = "An error occurred while removing the product from the cart.", Details = errorMessage });
                }
            }
        }
    }
}
