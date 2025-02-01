using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace vegeatery.Middleware
{
	public class JwtMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly IConfiguration _configuration;

		public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
		{
			_next = next;
			_configuration = configuration;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			var token = context.Request.Cookies["jwtToken"]; // Look for the token in the cookies

			if (!string.IsNullOrEmpty(token))
			{
				try
				{
					var secret = _configuration["Authentication:Secret"];
					if (string.IsNullOrEmpty(secret))
					{
						throw new Exception("Secret key is missing in configuration.");
					}
					var key = Encoding.ASCII.GetBytes(secret);
					var tokenHandler = new JwtSecurityTokenHandler();
					var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
					{
						IssuerSigningKey = new SymmetricSecurityKey(key),
						ValidateIssuer = false,
						ValidateAudience = false,
						ValidateLifetime = true,  // This checks if the token is expired
						ClockSkew = TimeSpan.Zero // Set to zero to prevent a time skew (token expiration)
					}, out _);

					context.User = claimsPrincipal; // Attach the claims to the HttpContext user
				}
				catch (Exception ex)
				{
					// Log the error
					Console.WriteLine("Token validation failed: " + ex.Message);
					// Invalid token, respond with 401 Unauthorized
					context.Response.StatusCode = 401;
					await context.Response.WriteAsync("Unauthorized");
					return;
				}
			}

			await _next(context); // Continue with the pipeline
		}
	}

}
