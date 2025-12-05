using BusManagement.Data;
using BusManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusManagementApi.Controllers
{
    [ApiController]
    [Route("bus-routes")]
    public class BusRoutesController : ControllerBase
    {
        private readonly BusManagementContext _context;

        public BusRoutesController(BusManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BusRoute>>> GetRoutes()
        {
            return await _context.Routes.ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<BusRoute>> GetRoute(int id)
        {
            var route = await _context.Routes.FindAsync(id);
            if (route == null) return NotFound();
            return route;
        }

        [HttpPost]
        public async Task<ActionResult<BusRoute>> CreateRoute([FromBody] BusRoute route)
        {
            _context.Routes.Add(route);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoute), new { id = route.Id }, route);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateRoute(int id, [FromBody] BusRoute route)
        {
            if (id != route.Id) return BadRequest("ID de la URL y del cuerpo no coinciden.");

            var exists = await _context.Routes.AnyAsync(r => r.Id == id);
            if (!exists) return NotFound();

            _context.Entry(route).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            var route = await _context.Routes.FindAsync(id);
            if (route == null) return NotFound();

            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
