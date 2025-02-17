using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vegeatery.Models;
using System.Linq;
using System.Threading.Tasks;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("/PointsHistory")]
    public class PointsHistoryController : ControllerBase
    {
        private readonly MyDbContext _context;

        public PointsHistoryController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetPointsHistory(int customerId)
        {
            var orders = await _context.Order
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.TotalPoints
                })
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound("No points history found for this user.");
            }

            return Ok(orders);
        }
    }
}
