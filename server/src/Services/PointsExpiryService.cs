using Microsoft.EntityFrameworkCore;

namespace vegeatery.Services
{
    public class PointsExpiryService : BackgroundService
    {
        private readonly IServiceProvider _services;

        public PointsExpiryService(IServiceProvider services)
        {
            _services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();

                    var users = await dbContext.Users
                        .Where(u => u.PointsExpiryDate <= DateTime.UtcNow)
                        .ToListAsync();

                    foreach (var user in users)
                    {
                        // Reset points and set new expiry date
                        user.TotalPoints = 0;
                        user.PointsPeriodStartDate = DateTime.UtcNow;
                        user.PointsExpiryDate = DateTime.UtcNow.AddMonths(6);
                    }

                    await dbContext.SaveChangesAsync();
                }

                // Check every day
                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }
    }
}

