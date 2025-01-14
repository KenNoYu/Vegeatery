using vegeatery.Models;
using Microsoft.AspNetCore.Mvc;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController(MyDbContext context) : ControllerBase
    {
        private readonly MyDbContext _context = context;

        // Get product
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Product>), StatusCodes.Status200OK)]
        public IActionResult GetAll(string? search)
        {

            try
            {
                IQueryable<Product> result = _context.Product;
                if (search != null)
                {
                    result = result.Where(x => x.ProductName.Contains(search)
                        || x.ProductDescription.Contains(search));
                }
                var list = result.OrderByDescending(x => x.CreatedAt).ToList();

                return Ok(list);
            }
            catch (Exception ex)
            {
                var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { Message = "An error occurred while creating the order.", Details = errorMessage });
            }
        }

        // Create new product
        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            var now = DateTime.Now;
            var newProduct = new Product()
            {
                ProductName = product.ProductName.Trim(),
                ProductDescription = product.ProductDescription.Trim(),
                ProductPrice = product.ProductPrice,
                ProductPoints = product.ProductPoints,
                ProductCategory = product.ProductCategory.Trim(),
                CreatedAt = now,
                UpdatedAt = now

            };

            _context.Product.Add(newProduct);
            _context.SaveChanges();
            return Ok(newProduct);
        }
    }
}
