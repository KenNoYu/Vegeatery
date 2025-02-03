using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace vegeatery.Models
{
	public class PasswordResetToken
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public string Token { get; set; }

		[Required]
		public DateTime ExpiryDate { get; set; }

		[Required]
		public bool IsUsed { get; set; } = false;

		[ForeignKey("User")]
		public int UserId { get; set; }

		public User User { get; set; }
	}
}
