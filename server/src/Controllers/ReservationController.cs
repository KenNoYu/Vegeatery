using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using vegeatery.Models;
using vegeatery;

namespace vegeatery.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly MyDbContext _dbContext;

        public ReservationController(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Create a new reservation
        [HttpPost("CreateReservation")]
        public async Task<IActionResult> CreateReservation([FromBody] Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    Console.WriteLine(error.ErrorMessage);
                }
                return BadRequest(ModelState);

            }


            try
            {
                reservation.Status = "Pending"; // Default status
                _dbContext.Reservations.Add(reservation);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Reservation created successfully", reservation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the reservation", error = ex.Message });
            }
        }

        // Create a new reservation log
        [HttpPost("CreateReservationLog")]
        public async Task<IActionResult> CreateReservationLog([FromBody] ReservationLog reservationLog)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                

                reservationLog.LogDate = DateTime.Now; // Automatically set the timestamp
                _dbContext.ReservationLogs.Add(reservationLog);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Reservation log created successfully", reservationLog });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the reservation log", error = ex.Message });
            }
        }

        // Get all reservations
        [HttpGet("GetAllReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            try
            {
                var reservations = await _dbContext.Reservations.ToListAsync();
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching reservations", error = ex.Message });
            }
        }

        [HttpGet("GetReservations")]
        public IActionResult GetReservations([FromQuery] DateOnly date)
        {
            var reservations = _dbContext.Reservations
                .Where(r => r.ReservationDate == date && r.Status != "Cancelled")
                .OrderBy(r => r.TimeSlot)
                .ToList();

            return Ok(reservations);
        }

        [HttpPut("SeatReservation")]
        public async Task<IActionResult> SeatReservation(int reservationId)
        {
            try
            {
                // Find the reservation by its ID
                var reservation = await _dbContext.Reservations.FindAsync(reservationId);

                if (reservation == null)
                {
                    return NotFound(new { message = "Reservation not found." });
                }

                // Update the status to "Seated"
                reservation.Status = "seated";

                // Save changes to the database
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Reservation status updated to 'Seated'.", reservation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the reservation.", error = ex.Message });
            }
        }

        [HttpPut("Unreserve")]
        public async Task<IActionResult> Unreserve(int reservationId)
        {
            try
            {
                // Find the reservation by its ID
                var reservation = await _dbContext.Reservations.FindAsync(reservationId);

                if (reservation == null)
                {
                    return NotFound(new { message = "Reservation not found." });
                }

                // Update the status to "Seated"
                reservation.Status = "cancelled";

                // Save changes to the database
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Reservation status updated to 'cancelled'.", reservation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the reservation.", error = ex.Message });
            }
        }

        // Get a single reservation by ID
        [HttpGet("GetReservationById/{id}")]
        public async Task<IActionResult> GetReservationById(int id)
        {
            try
            {
                var reservation = await _dbContext.Reservations
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservation == null)
                {
                    return NotFound(new { message = "Reservation not found" });
                }

                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the reservation", error = ex.Message });
            }
        }

        // Get 20 reservation logs
        [HttpGet("GetReservationLogs")]
        public async Task<IActionResult> GetReservationLogs()
        {
            try
            {
                var reservationLogs = await _dbContext.ReservationLogs
                    .Include(log => log.Reservation)
                    .OrderByDescending(log => log.LogDate)
                    .Take(20)
                    .ToListAsync();
                return Ok(reservationLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching reservation logs", error = ex.Message });
            }
        }
    }
}
