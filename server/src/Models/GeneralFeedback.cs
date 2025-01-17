using System.ComponentModel.DataAnnotations;

namespace vegeatery.Models
{
    public class GeneralFeedback
    {
        [Key]
        public int FeedbackId { get; set; }

        [Required]
        public int UserId { get; set; }

        [MaxLength(100)] // Limit title length to 100 characters
        public string FeedbackTitle { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ImagePath { get; set; } // Store image path

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string Review { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}
