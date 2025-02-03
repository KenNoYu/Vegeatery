using Microsoft.AspNetCore.Mvc;
using vegeatery.Models;
using System.Linq;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("/GeneralFeedback")]
    public class GeneralFeedbackController : ControllerBase
    {
        private readonly MyDbContext _context;

        public GeneralFeedbackController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllFeedbacks()
        {


            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var feedbacks = _context.GeneralFeedbacks.Select(f => new
            {
                f.FeedbackId,
                f.UserId,
                f.FeedbackTitle,
                ImagePath = string.IsNullOrEmpty(f.ImagePath) ? null : $"{baseUrl}{f.ImagePath}",
                f.Rating,
                Review = string.IsNullOrWhiteSpace(f.Review) ? "Not provided" : f.Review,
                f.CreatedAt,
                f.UpdatedAt
            }).ToList();
            return Ok(feedbacks);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetFeedbacksByUserId(int userId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var feedbacks = _context.GeneralFeedbacks
                .Where(f => f.UserId == userId)
                .Select(f => new
                {
                    f.FeedbackId,
                    f.UserId,
                    f.FeedbackTitle,
                    ImagePath = string.IsNullOrEmpty(f.ImagePath) ? null : $"{baseUrl}{f.ImagePath}",
                    f.Rating,
                    Review = string.IsNullOrWhiteSpace(f.Review) ? "Not provided" : f.Review,
                    f.CreatedAt,
                    f.UpdatedAt
                }).ToList();
            return Ok(feedbacks);
        }


        [HttpGet("{id}")]
        public IActionResult GetFeedback(int id)
        {

            var baseUrl = $"{Request.Scheme}://{Request.Host}";


            var feedback = _context.GeneralFeedbacks.Select(f => new
            {
                f.FeedbackId,
                f.UserId,
                f.FeedbackTitle,
                ImagePath = string.IsNullOrEmpty(f.ImagePath) ? null : $"{baseUrl}{f.ImagePath}",
                f.Rating,
                Review = string.IsNullOrWhiteSpace(f.Review) ? "Not provided" : f.Review,
                f.CreatedAt,
                f.UpdatedAt
            }).FirstOrDefault(f => f.FeedbackId == id);

            if (feedback == null) return NotFound("Feedback not found.");

            return Ok(feedback);
        }


        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromForm] GeneralFeedback feedback, IFormFile? imagepath)
        {
            try
            {
                if (feedback == null) return BadRequest("Invalid feedback data.");

                // Validation for FeedbackTitle
                if (string.IsNullOrWhiteSpace(feedback.FeedbackTitle))
                    return BadRequest("Feedback Title cannot be empty.");

                // Validate Rating
                if (feedback.Rating < 1 || feedback.Rating > 5)
                    return BadRequest("Rating must be between 1 and 5.");

                // Validate Review
                if (string.IsNullOrWhiteSpace(feedback.Review))
                    return BadRequest("Review cannot be empty.");

                // Process image file if provided
                if (imagepath != null)
                {
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                    if (!Directory.Exists(uploadsPath))
                    {
                        Directory.CreateDirectory(uploadsPath);
                    }

                    var filePath = Path.Combine(uploadsPath, imagepath.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imagepath.CopyToAsync(stream);
                    }

                    feedback.ImagePath = $"/uploads/{imagepath.FileName}";
                }

                feedback.CreatedAt = DateTime.Now;
                feedback.UpdatedAt = DateTime.Now;

                _context.GeneralFeedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetFeedback), new { id = feedback.FeedbackId }, feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
    }

        [HttpPut("{feedbackid}")]
        public IActionResult UpdateFeedback(int feedbackId, [FromBody] GeneralFeedback updatedFeedback)
        {
            try
            {
                var feedback = _context.GeneralFeedbacks.Find(feedbackId);
                if (feedback == null) return NotFound("Feedback not found.");

                // Update fields only if provided
                
                if (!string.IsNullOrWhiteSpace(updatedFeedback.FeedbackTitle))
                    feedback.FeedbackTitle = updatedFeedback.FeedbackTitle;

                if (!string.IsNullOrWhiteSpace(updatedFeedback.ImagePath))
                    feedback.ImagePath = updatedFeedback.ImagePath;

                if (updatedFeedback.Rating >= 1 && updatedFeedback.Rating <= 5)
                    feedback.Rating = updatedFeedback.Rating;

                if (!string.IsNullOrWhiteSpace(updatedFeedback.Review))
                    feedback.Review = updatedFeedback.Review;


                feedback.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{feedbackid}")]
        public async Task<IActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                // Validate FeedbackId
                if (feedbackId <= 0)
                {
                    return BadRequest("Invalid Feedback ID provided.");
                }

                var feedback = await _context.GeneralFeedbacks.FindAsync(feedbackId);
                if (feedback == null)
                {
                    Console.WriteLine($"Feedback with ID {feedbackId} not found for deletion."); // Log
                    return NotFound($"Feedback with ID {feedbackId} not found.");
                }

                _context.GeneralFeedbacks.Remove(feedback);
                await _context.SaveChangesAsync();

                return Ok("Feedback deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
