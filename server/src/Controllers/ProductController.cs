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
        public IActionResult GetAll(string? search)
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

        // Create new product
        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            var now = DateTime.Now;
            var newProduct = new Product()
            {
                ProductName = product.ProductName.Trim(),
                ProductDescription = product.ProductDescription.Trim(),
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
