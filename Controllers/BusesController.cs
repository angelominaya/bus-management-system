using BusManagement.Models;
using BusManagement.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusManagementApi.Controllers
{
    [ApiController]
    [Route("buses")]
    public class BusesController : ControllerBase
    {
        private readonly BusManagementContext _context;

        public BusesController(BusManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBuses()
        {
            return await _context.Buses.ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Bus>> GetBus(int id)
        {
            var bus = await _context.Buses.FindAsync(id);
            if (bus == null) return NotFound();
            return bus;
        }

        [HttpPost]
        public async Task<ActionResult<Bus>> CreateBus([FromBody] Bus bus)
        {
            _context.Buses.Add(bus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBus), new { id = bus.Id }, bus);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateBus(int id, [FromBody] Bus bus)
        {
            if (id != bus.Id) return BadRequest("ID de la URL y del cuerpo no coinciden.");

            var exists = await _context.Buses.AnyAsync(b => b.Id == id);
            if (!exists) return NotFound();

            _context.Entry(bus).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            var bus = await _context.Buses.FindAsync(id);
            if (bus == null) return NotFound();

            _context.Buses.Remove(bus);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
