using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vegeatery.Models;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("/vouchers")]
    public class VouchersController : ControllerBase
    {
        private readonly MyDbContext _context;

        public VouchersController(MyDbContext context)
        {
            _context = context;
        }

        // POST: /vouchers
        [HttpPost]
        public IActionResult CreateVoucher([FromBody] Voucher voucher)
        {
            if (voucher == null)
            {
                return BadRequest("Voucher data is required.");
            }

            if (string.IsNullOrEmpty(voucher.VoucherName) || string.IsNullOrEmpty(voucher.VoucherDescription))
            {
                return BadRequest("Voucher name and description are required.");
            }

            if (voucher.ExpiryDate <= DateTime.UtcNow)
            {
                return BadRequest("Expiry date must be in the future.");
            }

            // Check if the tier exists
            var tier = _context.Tiers.FirstOrDefault(t => t.TierId == voucher.TierId);
            if (tier == null)
            {
                return BadRequest($"Tier with ID {voucher.TierId} does not exist.");
            }

            // Associate the tier
            voucher.Tier = tier;

            // Add voucher to the database
            _context.Vouchers.Add(voucher);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetVoucherById), new { voucherId = voucher.VoucherId }, voucher);
        }



        // GET: /vouchers
        [HttpGet]
        public IActionResult GetVouchers()
        {
            var vouchers = _context.Vouchers
                .Include(v => v.Tier)
                .OrderBy(v => v.TierId)
                .ToList();

            return Ok(vouchers);
        }

        // GET: /vouchers/{id}
        [HttpGet("{voucherId}")]
        public IActionResult GetVoucherById(int voucherId)
        {
            var voucher = _context.Vouchers
                .Include(v => v.Tier)
                .FirstOrDefault(v => v.VoucherId == voucherId);

            if (voucher == null)
            {
                return NotFound();
            }

            return Ok(voucher);
        }

        // DELETE: /vouchers/{id}
        [HttpDelete("{voucherId}")]
        public IActionResult DeleteVoucher(int voucherId)
        {
            var voucher = _context.Vouchers.Find(voucherId);

            if (voucher == null)
            {
                return NotFound($"Voucher with id {voucherId} not found.");
            }

            _context.Vouchers.Remove(voucher);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
