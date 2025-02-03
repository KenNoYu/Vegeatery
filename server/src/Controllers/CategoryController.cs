using vegeatery.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly MyDbContext _context;

        public CategoryController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("categories")]
        public IActionResult GetAllCategories()
        {
            var categories = _context.Category.ToList();
            return Ok(categories);
        }

        [HttpPost("add-category")]
        public IActionResult AddCategory(Category category)
        {
            if (_context.Category.Count() >= 5)
            {
                return BadRequest(new { message = "Cannot add more than 5 categories." });
            }

            var newCategory = new Category
            {
                CategoryName = category.CategoryName.Trim(),
                TotalProduct = 0,
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

        [HttpPut("{id}")]
        public IActionResult EditCategory(int id, Category category)
        {
            var existingCategory = _context.Category.FirstOrDefault(c => c.CategoryId == id);
            if (existingCategory == null)
            {
                return NotFound(new { message = "Category not found." });
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.UpdatedAt = DateTime.UtcNow;

            _context.SaveChanges();
            return Ok(existingCategory);
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _context.Category.Include(c => c.Products).FirstOrDefault(c => c.CategoryId == id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found." });
            }

            _context.Category.Remove(category);
            _context.SaveChanges();

            return Ok(new { message = "Category and associated products deleted successfully." });
        }

    }
}
