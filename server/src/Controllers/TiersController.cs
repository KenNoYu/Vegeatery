using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vegeatery.Models;
using System.Linq;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("/tiers")]
    public class TiersController : ControllerBase
    {
        private readonly MyDbContext _context;

        public TiersController(MyDbContext context)
        {
            _context = context;
        }   

        // GET: /tiers
        [HttpGet]
        public IActionResult GetTiers()
        {
            var tiers = _context.Tiers.OrderBy(t => t.MinPoints).ToList();
            return Ok(tiers);
        }

        // GET: /tiers/{id}
        [HttpGet("{tierid}")]
        public IActionResult GetTierById(int tierid)
        {
            var tier = _context.Tiers.Find(tierid);
            if (tier == null)
            {
                return NotFound();
            }

            return Ok(tier);
        }

        // PUT: /tiers/{id}
        [HttpPut("{tierid}")]
        public IActionResult UpdateTier(int tierid, [FromBody] Tier updatedTier)
        {
            if (updatedTier == null || string.IsNullOrEmpty(updatedTier.TierName))
            {
                return BadRequest("TierName is required.");
            }

            if (updatedTier.MinPoints < 0)
            {
                return BadRequest("MinPoints must be greater than or equal to 0.");
            }

            var existingTier = _context.Tiers.Find(tierid);
            if (existingTier == null)
            {
                return NotFound($"Tier with id {tierid} not found.");
            }

            // Ensure non-overlapping MinPoints
            if (_context.Tiers.Any(t => t.TierId != tierid && t.MinPoints == updatedTier.MinPoints))
            {
                return BadRequest("MinPoints must be unique and not overlap with existing tiers.");
            }

            existingTier.TierName = updatedTier.TierName;
            existingTier.MinPoints = updatedTier.MinPoints;

            _context.Tiers.Update(existingTier);
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: /tiers/{id}
        [HttpDelete("{tierid}")]
        public IActionResult DeleteTier(int tierid)
        {
            var tier = _context.Tiers.Find(tierid);

            if (tier == null)
            {
                return NotFound($"Tier with id {tierid} not found.");
            }

            _context.Tiers.Remove(tier);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTiersForUser(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Tier)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var tiers = _context.Tiers.OrderBy(t => t.MinPoints).ToList();
            return Ok(tiers);
        }


    }
}
