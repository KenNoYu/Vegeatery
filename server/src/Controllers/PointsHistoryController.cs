using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vegeatery.Models;
using System.Linq;
using System.Threading.Tasks;
using System;

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
            var sgTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");

            var orders = await _context.Order
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    CreatedAt = TimeZoneInfo.ConvertTimeFromUtc(o.CreatedAt, sgTimeZone),
                    o.TotalPoints
                })
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound("No points history found for this user.");
            }

            return Ok(orders);
        }

        [HttpGet("bonus/{userId}")]
        public IActionResult GetBonusPointsHistory(int userId)
        {
            var sgTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");

            var bonusPoints = _context.PointsHistories
                .Where(ph => ph.UserId == userId)
                .OrderByDescending(ph => ph.Date)
                .Select(ph => new
                {
                    ph.Points,
                    ph.Description,
                    Date = TimeZoneInfo.ConvertTimeFromUtc(ph.Date, sgTimeZone) // Convert to SGT
                })
                .ToList();

            if (!bonusPoints.Any())
            {
                return NotFound("No bonus points found for this user.");
            }

            return Ok(bonusPoints);
        }
    }
}
