using vegeatery.Models;
using Microsoft.AspNetCore.Mvc;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController(MyDbContext context) : ControllerBase
    {
        private readonly MyDbContext _context = context;

        // Get all categories
        [HttpGet]
        [Route("categories")]
        public IActionResult GetAllCategories()
        {
            var categories = _context.Category.ToList();
            return Ok(categories);
        }

        // Add a new category (limit to 5)
        [HttpPost("add-category")]
        public IActionResult AddCategory(Category category)
        {
            // Check if the category limit is reached
            if (_context.Category.Count() >= 5)
            {
                return BadRequest(new { message = "Cannot add more than 5 categories." });
            }

            var newCategory = new Category
            {
                CategoryName = category.CategoryName.Trim(),
                TotalProduct = category.TotalProduct,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Category.Add(newCategory);
            _context.SaveChanges();
            return Ok(newCategory);
        }

        [HttpGet("categories/{id}")]
        public IActionResult GetCategoryById(int id)
        {
            var category = _context.Category
                .Where(c => c.CategoryId == id)
                .Select(c => new
                {
                    c.CategoryId,
                    c.CategoryName,
                    c.TotalProduct,
                    c.CreatedAt,
                    c.UpdatedAt
                })
                .FirstOrDefault();

            if (category == null)
            {
                return NotFound(new { message = "Category not found." });
            }

            return Ok(category);
        }


        [HttpGet]
        [Route("products")]
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
                    x.Calories,
                    x.Fats,
                    x.Carbs,
                    x.Protein,
                    x.ProductPrice,
                    x.DiscountPercentage,
                    x.DiscountedPrice, // Computed
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
            var now = DateTime.Now;

            // Validate that the CategoryId exists
            var category = _context.Category.FirstOrDefault(c => c.CategoryId == product.CategoryId);
            if (category == null)
            {
                return BadRequest(new { message = "Invalid CategoryId. Please create the category first." });
            }

            // Create the new product
            var newProduct = new Product
            {
                ImageFile = product.ImageFile,
                ProductName = product.ProductName.Trim(),
                ProductDescription = product.ProductDescription.Trim(),
                ProductPrice = product.ProductPrice,
                DiscountPercentage = product.DiscountPercentage,
                Ingredients = product.Ingredients.Trim(),
                Calories = product.Calories,
                Fats = product.Fats,
                Carbs = product.Carbs,
                Protein = product.Protein,
                CategoryId = product.CategoryId,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.Product.Add(newProduct);
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
                    p.ProductPrice,
                    p.DiscountPercentage,
                    p.DiscountedPrice, // Computed
                    p.CategoryId,
                    p.Category.CategoryName,
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
            var existingProduct = _context.Product.FirstOrDefault(p => p.ProductId == id);
            if (existingProduct == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            existingProduct.ImageFile = product.ImageFile;
            existingProduct.ProductName = product.ProductName.Trim();
            existingProduct.ProductDescription = product.ProductDescription.Trim();
            existingProduct.Ingredients = product.Ingredients.Trim();
            existingProduct.Calories = product.Calories;
            existingProduct.Fats = product.Fats;
            existingProduct.Carbs = product.Carbs;
            existingProduct.Protein = product.Protein;
            existingProduct.ProductPrice = product.ProductPrice;
            existingProduct.DiscountPercentage = product.DiscountPercentage;
            existingProduct.UpdatedAt = DateTime.Now;

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

            _context.Product.Remove(product);
            _context.SaveChanges();

            return Ok(new { message = "Product deleted successfully." });
        }



    }
}