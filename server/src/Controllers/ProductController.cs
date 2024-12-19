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
                result = result.Where(x => x.productName.Contains(search)
                    || x.productDescription.Contains(search));
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
                productName = product.productName.Trim(),
                productDescription = product.productDescription.Trim(),
                productCategory = product.productCategory.Trim(),
                CreatedAt = now,
                UpdatedAt = now

            };

            _context.Product.Add(newProduct);
            _context.SaveChanges();
            return Ok(newProduct);
        }
    }
}
