using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using vegeatery;
using Stripe;
using vegeatery.Middleware;
using Microsoft.OpenApi.Models;
using vegeatery.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddControllers()
	.AddJsonOptions(opts => { });
builder.Services.AddDbContext<MyDbContext>();
builder.Services.AddLogging(config =>
{
	config.AddConsole();
	config.AddDebug();
	// Add other logging providers as needed
});

// Configure JWT authentication
var secret = builder.Configuration.GetValue<string>("Authentication:Secret");
var key = Encoding.ASCII.GetBytes(secret);

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = false, // Assuming you're not validating issuer/audience, if needed set to true and provide values.
		ValidateAudience = false,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Authentication:Secret")), // Use your "Secret" key
		ClockSkew = TimeSpan.Zero // Optional: to prevent time discrepancies between server and token expiration
	};

	options.Events = new JwtBearerEvents
	{
		OnMessageReceived = context =>
		{
			// Get the token from the cookie
			var token = context.HttpContext.Request.Cookies["jwtToken"];
			if (!string.IsNullOrEmpty(token))
			{
				context.Token = token; // Set the token from the cookie
			}
			return Task.CompletedTask;
		}
	};
});

builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
	options.AddPolicy("Staff", policy => policy.RequireRole("Staff"));
	options.AddPolicy("User", policy => policy.RequireRole("User"));
});

// Add CORS policy
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
if (allowedOrigins == null || allowedOrigins.Length == 0)
{
	throw new Exception("AllowedOrigins is required for CORS policy.");
}
else
{
    Console.WriteLine($"Allowed origins: {string.Join(", ", allowedOrigins)}");
}
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

	// Add JWT Authentication to Swagger
	var jwtSecurityScheme = new OpenApiSecurityScheme
	{
		BearerFormat = "JWT",
		Name = "JWT Authentication",
		In = ParameterLocation.Header,
		Type = SecuritySchemeType.Http,
		Scheme = "bearer",
		Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",

		Reference = new OpenApiReference
		{
			Id = JwtBearerDefaults.AuthenticationScheme,
			Type = ReferenceType.SecurityScheme
		}
	};

	c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

	c.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{ jwtSecurityScheme, Array.Empty<string>() }
	});
});

var app = builder.Build();

// Apply database migrations at startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    try
    {
        dbContext.Database.Migrate(); // Applies pending migrations
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error applying migrations: {ex.Message}");
        throw; // Fail-fast if migrations can't be applied
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors();

app.UseMiddleware<JwtMiddleware>();

app.UseAuthorization();
app.UseAuthentication();

app.MapControllers();

app.Run();



