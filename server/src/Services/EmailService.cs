using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace vegeatery.Services
{
	public class EmailService : IEmailService
	{
		private readonly IConfiguration _configuration;
		private readonly string _sendGridApiKey;
		private readonly string _fromEmail;
		private readonly string _appName;

		public EmailService(IConfiguration configuration)
		{
			_configuration = configuration;

			// Fetch sensitive data from configuration (appsettings.json or environment variables)
			_sendGridApiKey = _configuration["SendGrid:ApiKey"];  // Make sure to add this to your appsettings.json or env variables
			_fromEmail = _configuration["SendGrid:FromEmail"];     // From Email address
			_appName = _configuration["AppSettings:AppName"];      // Your App name, better to store it in the config as well
		}

		// Method to send a generic email
		public async Task SendEmailAsync(string recipientEmail, string subject, string plainTextContent)
		{
			if (string.IsNullOrEmpty(_sendGridApiKey))
				throw new InvalidOperationException("SendGrid API key is not configured.");

			var emailData = new
			{
				personalizations = new[]
				{
					new
					{
						to = new[]
						{
							new { email = recipientEmail }
						},
						subject
					}
				},
				content = new[]
				{
					new { type = "text/plain", value = plainTextContent }
				},
				from = new
				{
					email = _fromEmail,
					name = _appName
				},
				reply_to = new
				{
					email = _fromEmail,
					name = _appName
				}
			};

			var jsonContent = JsonConvert.SerializeObject(emailData);
			var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

			using (var client = new HttpClient())
			{
				client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_sendGridApiKey}");

				var response = await client.PostAsync("https://api.sendgrid.com/v3/mail/send", content);

				if (!response.IsSuccessStatusCode)
				{
					throw new Exception($"Failed to send email. Status Code: {response.StatusCode}, Reason: {response.ReasonPhrase}");
				}
			}
		}

		// Method to send a password reset email
		public async Task SendResetEmail(string recipientEmail, string resetLink)
		{
			var subject = "Password Reset Request";
			var plainTextContent = $"You have requested a password reset. Click the link below to reset your password:\n{resetLink}";

			await SendEmailAsync(recipientEmail, subject, plainTextContent);
		}

		// Method to send a custom example email
		public async Task SendExampleEmail(string recipientEmail)
		{
			var subject = "Sending with Twilio SendGrid is Fun";
			var plainTextContent = "Heya! This is a simple email example.";

			await SendEmailAsync(recipientEmail, subject, plainTextContent);
		}
	}
}
