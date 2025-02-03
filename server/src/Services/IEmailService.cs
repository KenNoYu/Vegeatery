public interface IEmailService
{
	Task SendResetEmail(string email, string resetLink);
}