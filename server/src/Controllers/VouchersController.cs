using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
        public async Task<IActionResult> CreateVoucher([FromBody] Voucher voucher)
        {
            if (voucher == null)
            {
                return BadRequest("Voucher data is required.");
            }

            if (string.IsNullOrEmpty(voucher.VoucherName) || voucher.DiscountPercentage <= 0)
            {
                return BadRequest("Voucher name and discounts are required.");
            }

            if (voucher.DiscountPercentage < 1 || voucher.DiscountPercentage > 100)
            {
                return BadRequest("Discounts must be between 1 and 100.");
            }

            if (voucher.ExpiryDate <= DateTime.UtcNow)
            {
                return BadRequest("Expiry date must be in the future.");
            }

            // Check if the tier exists
            var tier = await _context.Tiers.FirstOrDefaultAsync(t => t.TierId == voucher.TierId);
            if (tier == null)
            {
                return BadRequest($"Tier with ID {voucher.TierId} does not exist.");
            }

            // Associate the tier
            voucher.Tier = tier;

            // Add voucher to the database
            await _context.Vouchers.AddAsync(voucher);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVoucherById), new { voucherId = voucher.VoucherId }, voucher);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetVouchersByUserTier(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var vouchers = await _context.Vouchers
                .Where(v => v.TierId == user.TierId)
                .ToListAsync();

            return Ok(vouchers);
        }


        // GET: /vouchers
        [HttpGet]
        public async Task<IActionResult> GetVouchers()
        {
            var vouchers = await _context.Vouchers
                .Include(v => v.Tier)
                .OrderBy(v => v.TierId)
                .ToListAsync();

            return Ok(vouchers);
        }

        // GET: /vouchers/{id}
        [HttpGet("{voucherId}")]
        public async Task<IActionResult> GetVoucherById(int voucherId)
        {
            var voucher = await _context.Vouchers
                .Include(v => v.Tier)
                .FirstOrDefaultAsync(v => v.VoucherId == voucherId);

            if (voucher == null)
            {
                return NotFound();
            }

            return Ok(voucher);
        }

        // DELETE: /vouchers/{id}
        [HttpDelete("{voucherId}")]
        public async Task<IActionResult> DeleteVoucher(int voucherId)
        {
            var voucher = await _context.Vouchers.FindAsync(voucherId);

            if (voucher == null)
            {
                return NotFound($"Voucher with id {voucherId} not found.");
            }

            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // PUT: /vouchers/{id}
        [HttpPut("{voucherId}")]
        public async Task<IActionResult> UpdateVoucher(int voucherId, [FromBody] Voucher voucher)
        {
            if (voucher == null)
            {
                return BadRequest("Voucher data is required.");
            }

            if (string.IsNullOrEmpty(voucher.VoucherName) || voucher.DiscountPercentage <= 0)
            {
                return BadRequest("Voucher name and discounts are required.");
            }

            if (voucher.ExpiryDate <= DateTime.UtcNow)
            {
                return BadRequest("Expiry date must be in the future.");
            }

            // Check if the voucher exists
            var existingVoucher = await _context.Vouchers
                .Include(v => v.Tier)
                .FirstOrDefaultAsync(v => v.VoucherId == voucherId);

            if (existingVoucher == null)
            {
                return NotFound($"Voucher with id {voucherId} not found.");
            }

            // Check if the tier exists
            var tier = await _context.Tiers.FirstOrDefaultAsync(t => t.TierId == voucher.TierId);
            if (tier == null)
            {
                return BadRequest($"Tier with ID {voucher.TierId} does not exist.");
            }

            // Update voucher properties
            existingVoucher.VoucherName = voucher.VoucherName;
            existingVoucher.DiscountPercentage = voucher.DiscountPercentage;
            existingVoucher.ExpiryDate = voucher.ExpiryDate;
            existingVoucher.TierId = voucher.TierId;
            existingVoucher.Tier = tier;

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(existingVoucher);
        }
    }
}
