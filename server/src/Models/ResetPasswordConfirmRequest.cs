using System.ComponentModel.DataAnnotations;

namespace vegeatery.Models
{
	public class ResetPasswordConfirmRequest
	{
		[Required]
		public string ResetCode { get; set; } // Token sent to the user's email

		[Required]
		[MinLength(6)]
		public string NewPassword { get; set; }
	}
}
