using vegeatery.Models;
using Microsoft.AspNetCore.Mvc;

namespace vegeatery.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderCartController(MyDbContext context) : ControllerBase
    {
        private readonly MyDbContext _context = context;

    }
}
