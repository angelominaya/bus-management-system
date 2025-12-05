using BusManagement.Data;
using BusManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusManagementApi.Controllers
{
    [ApiController]
    [Route("schedules")]
    public class SchedulesController : ControllerBase
    {
        private readonly BusManagementContext _context;

        public SchedulesController(BusManagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
        {
            return await _context.Schedules
                .Include(s => s.Bus)
                .Include(s => s.Route)
                .ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            var schedule = await _context.Schedules
                .Include(s => s.Bus)
                .Include(s => s.Route)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (schedule == null) return NotFound();
            return schedule;
        }

        [HttpPost]
        public async Task<ActionResult<Schedule>> CreateSchedule([FromBody] Schedule schedule)
        {
            var busExists = await _context.Buses.AnyAsync(b => b.Id == schedule.BusId);
            var routeExists = await _context.Routes.AnyAsync(r => r.Id == schedule.RouteId);

            if (!busExists) return BadRequest($"Bus con Id {schedule.BusId} no existe.");
            if (!routeExists) return BadRequest($"Route con Id {schedule.RouteId} no existe.");

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.Id }, schedule);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] Schedule schedule)
        {
            if (id != schedule.Id) return BadRequest("ID de la URL y del cuerpo no coinciden.");

            var exists = await _context.Schedules.AnyAsync(s => s.Id == id);
            if (!exists) return NotFound();

            _context.Entry(schedule).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound();

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
