using System.ComponentModel.DataAnnotations;

namespace vegeatery.Models
{
	public class ResetPasswordLinkRequest
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }
	}
}
