using BusManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace BusManagement.Data
{
    public class BusManagementContext : DbContext
    {
        public BusManagementContext(DbContextOptions<BusManagementContext> options)
            : base(options)
        {
        }

        public DbSet<Bus> Buses => Set<Bus>();
        public DbSet<BusRoute> Routes => Set<BusRoute>();
        public DbSet<Schedule> Schedules => Set<Schedule>();
        public DbSet<Reservation> Reservations => Set<Reservation>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Bus>()
                .Property(b => b.BusNumber)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<BusRoute>()
                .Property(r => r.RouteName)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Reservation>()
                .Property(r => r.PassengerName)
                .IsRequired()
                .HasMaxLength(150);
        }
    }
}
