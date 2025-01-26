using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using vegeatery;

[Route("/Points")]
[ApiController]
public class PointsController : ControllerBase
{
    private readonly MyDbContext _context;

    public PointsController(MyDbContext context)
    {
        _context = context;
    }

    // GET: api/Points
    [HttpGet]
    public ActionResult<IEnumerable<Point>> GetPoints()
    {
        return Ok(_context.Points.ToList());
    }

    // POST: api/Points
    [HttpPost]
    public IActionResult AddPoint([FromBody] Point point)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Points.Add(point);
        _context.SaveChanges();

        return Ok(point);
    }

    // DELETE: api/Points/{id}
    [HttpDelete("{id}")]
    public IActionResult DeletePoint(int id)
    {
        var point = _context.Points.Find(id);
        if (point == null)
        {
            return NotFound();
        }

        _context.Points.Remove(point);
        _context.SaveChanges();

        return Ok();
    }
}
