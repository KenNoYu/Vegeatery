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

    public class ReservationRequest
    {
      public DateOnly ReservationDate { get; set; }
      public string TimeSlot { get; set; }
      public string CustomerName { get; set; }
      public string CustomerEmail { get; set; }
      public string CustomerPhone { get; set; }
      public string Status { get; set; }
      public List<int> TableIds { get; set; } // Accept table IDs instead of Table objects
    }

    // Create a new reservation
    [HttpPost("CreateReservation")]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationRequest request)
    {
      if (request == null || request.TableIds == null || !request.TableIds.Any())
      {
        return BadRequest("Invalid reservation request. Tables must be selected.");
      }

      var reservation = new Reservation
      {
        ReservationDate = request.ReservationDate,
        TimeSlot = request.TimeSlot,
        CustomerName = request.CustomerName,
        CustomerEmail = request.CustomerEmail,
        CustomerPhone = request.CustomerPhone,
        Status = "Pending"
      };

      // Get the tables from the database based on the IDs sent in the request
      var selectedTables = await _dbContext.Tables
                                         .Where(t => request.TableIds.Contains(t.Id))
                                         .ToListAsync();

      if (!selectedTables.Any())
      {
        return BadRequest("Selected tables are invalid.");
      }

      // Link tables to reservation
      reservation.Tables = selectedTables;

      // Save to database
      _dbContext.Reservations.Add(reservation);
      await _dbContext.SaveChangesAsync();

      return Ok(new { message = "Reservation created successfully", reservation });
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

    [HttpGet("GetTables")]
    public async Task<ActionResult<IEnumerable<Table>>> GetTables([FromQuery] DateOnly? date, [FromQuery] string? timeSlot, [FromQuery] int? reservationId)
    {

      if (date == null || string.IsNullOrEmpty(timeSlot))
      {
        var defaultTables = await _dbContext.Tables.ToListAsync();
        return Ok(defaultTables);
      }

      var allTimeSlots = new List<string>
    {
        "11:00am", "11:30am", "12:00pm", "12:30pm",
        "1:00pm", "1:30pm", "2:00pm", "2:30pm",
        "3:00pm", "3:30pm", "4:00pm", "4:30pm",
        "5:00pm", "5:30pm", "6:00pm", "6:30pm",
        "7:00pm", "7:30pm", "8:00pm", "8:30pm"
    };

      int index = allTimeSlots.IndexOf(timeSlot);
      if (index == -1)
      {
        return BadRequest("Invalid time slot.");
      }

      var blockedTimeSlots = new List<string> { timeSlot };
      if (index > 0) blockedTimeSlots.Add(allTimeSlots[index - 1]); // Previous timeslot
      if (index < allTimeSlots.Count - 1) blockedTimeSlots.Add(allTimeSlots[index + 1]); // Next timeslot

      var reservedTables = await _dbContext.Reservations
        .Where(r => r.ReservationDate == date && blockedTimeSlots.Contains(r.TimeSlot) && r.Id != reservationId)
          .SelectMany(r => r.Tables)
          .ToListAsync();

      var allTables = await _dbContext.Tables.ToListAsync();

      var updatedTables = allTables.Select(table => new
      {
        table.Id,
        table.TableNumber,
        table.Capacity,
        Status = reservedTables.Any(rt => rt.Id == table.Id) ? "unavailable" : table.Status
      });

      return Ok(updatedTables);
    }



    [HttpGet("GetReservations")]
    public IActionResult GetReservations([FromQuery] DateOnly date)
    {
      var reservations = _dbContext.Reservations
          .Where(r => r.ReservationDate == date && r.Status != "Cancelled")
          .Include(r => r.Tables)
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
            .Include(r => r.Tables)
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

        [HttpPut("UpdateReservation/{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] ReservationRequest updatedReservation)
        {
            var reservation = await _dbContext.Reservations
                                              .Include(r => r.Tables)
                                              .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound(new { message = "Reservation not found." });
            }

            reservation.ReservationDate = updatedReservation.ReservationDate;
            reservation.TimeSlot = updatedReservation.TimeSlot;
            reservation.CustomerName = updatedReservation.CustomerName;
            reservation.CustomerEmail = updatedReservation.CustomerEmail;
            reservation.CustomerPhone = updatedReservation.CustomerPhone;
            reservation.Status = updatedReservation.Status;

            var selectedTables = await _dbContext.Tables
                                         .Where(t => updatedReservation.TableIds.Contains(t.Id))
                                         .ToListAsync();

            reservation.Tables = selectedTables;

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Reservation updated successfully", reservation });
        }
    }
}
