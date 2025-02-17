using vegeatery.Models;
using Microsoft.AspNetCore.Mvc;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ProductController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("products")]
        public IActionResult GetAllProducts(string? search, int? categoryId)
        {
            IQueryable<Product> result = _context.Product;

            if (!string.IsNullOrEmpty(search))
            {
                result = result.Where(x => x.ProductName.Contains(search) ||
                                           x.ProductDescription.Contains(search) ||
                                           x.Ingredients.Contains(search));
            }

            if (categoryId.HasValue)
            {
                result = result.Where(x => x.CategoryId == categoryId.Value);
            }

            var products = result
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new
                {
                    x.ProductId,
                    x.ImageFile,
                    x.ProductName,
                    x.ProductDescription,
                    x.Ingredients,
                    x.ProductPoints,
                    x.Calories,
                    x.Fats,
                    x.Carbs,
                    x.Protein,
                    x.Stocks,
                    x.ProductPrice,
                    x.DiscountPercentage,
                    x.DiscountedPrice,
                    IsActive = x.Stocks > 0,
                    x.CategoryId,
                    x.Category.CategoryName,          
                    x.CreatedAt,
                    x.UpdatedAt
                })
                .ToList();

            return Ok(products);
        }

        [HttpPost("add-product")]
        public IActionResult AddProduct(Product product)
        {

            // Validate the ProductPoints range (1 to 5)
            if (product.ProductPoints < 1 || product.ProductPoints > 5)
            {
                return BadRequest(new { message = "ProductPoints must be between 1 and 5." });
            }


            // Find the category based on the provided CategoryId
            var category = _context.Category.FirstOrDefault(c => c.CategoryId == product.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid CategoryId. Please create the category first." });
            }

            // Create a new product instance
            var newProduct = new Product
            {
                ImageFile = product.ImageFile,
                ProductName = product.ProductName.Trim(),
                ProductDescription = product.ProductDescription.Trim(),
                ProductPoints = product.ProductPoints,
                ProductPrice = product.ProductPrice,
                DiscountPercentage = product.DiscountPercentage,
                Ingredients = product.Ingredients.Trim(),
                Calories = product.Calories,
                Fats = product.Fats,
                Carbs = product.Carbs,
                Protein = product.Protein,
                Stocks = product.Stocks,
                CategoryId = product.CategoryId,
                IsActive = product.IsActive,
            };

            // Add the new product to the database
            _context.Product.Add(newProduct);
            _context.SaveChanges(); // Save the new product first

            // Recalculate TotalProduct dynamically to ensure consistency
            category.TotalProduct = _context.Product.Count(p => p.CategoryId == product.CategoryId);

            // Save changes to the database
            _context.SaveChanges();

            return Ok(newProduct);
        }


        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _context.Product
                .Where(p => p.ProductId == id)
                .Select(p => new
                {
                    p.ProductId,
                    p.ImageFile,
                    p.ProductName,
                    p.ProductDescription,
                    p.Ingredients,
                    p.Calories,
                    p.Fats,
                    p.Carbs,
                    p.Protein,
                    p.Stocks,
                    p.ProductPrice,
                    p.DiscountPercentage,
                    p.DiscountedPrice,
                    p.CategoryId,
                    p.Category.CategoryName,
                    p.ProductPoints,
                    p.IsActive,
                    p.CreatedAt,
                    p.UpdatedAt
                })
                .FirstOrDefault();

            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            return Ok(product);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, Product product)
        {
            // Validate the ProductPoints range (1 to 5)
            if (product.ProductPoints < 1 || product.ProductPoints > 5)
            {
                return BadRequest(new { message = "ProductPoints must be between 1 and 5." });
            }

            var existingProduct = _context.Product.FirstOrDefault(p => p.ProductId == id);
            if (existingProduct == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            existingProduct.ImageFile = product.ImageFile;
            existingProduct.ProductName = product.ProductName.Trim();
            existingProduct.ProductDescription = product.ProductDescription.Trim();
            existingProduct.Ingredients = product.Ingredients.Trim();
            existingProduct.ProductPoints = product.ProductPoints;
            existingProduct.Calories = product.Calories;
            existingProduct.Fats = product.Fats;
            existingProduct.Carbs = product.Carbs;
            existingProduct.Protein = product.Protein;
            existingProduct.Stocks = product.Stocks;
            existingProduct.ProductPrice = product.ProductPrice;
            existingProduct.DiscountPercentage = product.DiscountPercentage;
            existingProduct.UpdatedAt = DateTime.Now;
            existingProduct.IsActive = product.IsActive;

            _context.SaveChanges();

            return Ok(existingProduct);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Product.FirstOrDefault(p => p.ProductId == id);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            // Retrieve the associated category
            var category = _context.Category.FirstOrDefault(c => c.CategoryId == product.CategoryId);
            if (category == null)
            {
                return NotFound(new { message = "Category not found." });
            }

            // Remove the product
            _context.Product.Remove(product);
            _context.SaveChanges();

            // Recalculate the TotalProduct count for the category by subtracting 1
            category.TotalProduct = _context.Product.Count(p => p.CategoryId == product.CategoryId);

            // Save the changes to the category
            _context.SaveChanges();

            return Ok(new { message = "Product deleted successfully." });
        }



        [HttpGet("GetProducts")]
        public IActionResult GetFilteredProducts([FromQuery] ProductFilter filter)
        {
            var products = _context.Product.AsQueryable();

            // Apply filters
            var filteredProducts = filter.ApplyFiltering(products);

            return Ok(filteredProducts.ToList());
        }

    }
}
