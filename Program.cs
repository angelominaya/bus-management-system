using BusManagement.Data;
using BusManagement.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BusManagementContext>(options =>
    options.UseInMemoryDatabase("BusManagementDb"));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BusManagementContext>();
    SeedData(context);
}

app.Run();

static void SeedData(BusManagementContext context)
{
    if (context.Buses.Any())
        return;

    var bus1 = new Bus
    {
        BusNumber = "BUS-001",
        Model = "Volvo B9R",
        Capacity = 50,
        Year = 2022,
        Status = "Active"
    };

    var route1 = new BusManagement.Models.BusRoute
    {
        RouteName = "Ruta 1",
        Origin = "Santo Domingo",
        Destination = "Santiago",
        Distance = 155.5
    };

    context.Buses.Add(bus1);
    context.Routes.Add(route1);
    context.SaveChanges();

    var schedule1 = new Schedule
    {
        BusId = bus1.Id,
        RouteId = route1.Id,
        DepartureTime = DateTime.Today.AddHours(8),
        ArrivalTime = DateTime.Today.AddHours(12)
    };

    context.Schedules.Add(schedule1);
    context.SaveChanges();
}