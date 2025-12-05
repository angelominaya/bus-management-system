namespace BusManagement.Models
{
    public class Bus
    {
        public int Id { get; set; }
        public string BusNumber { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Capacity { get; set; }
        public int Year { get; set; }
        public string Status { get; set; } = "Active";

        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }

    public class BusRoute
    {
        public int Id { get; set; }
        public string RouteName { get; set; } = null!;
        public string Origin { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public double Distance { get; set; }

        public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
    }

    public class Schedule
    {
        public int Id { get; set; }

        public int BusId { get; set; }
        public Bus? Bus { get; set; }

        public int RouteId { get; set; }
        public BusRoute? Route { get; set; }

        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }

    public class Reservation
    {
        public int Id { get; set; }

        public int ScheduleId { get; set; }
        public Schedule? Schedule { get; set; }

        public string PassengerName { get; set; } = null!;
        public int SeatNumber { get; set; }
        public DateTime ReservationDate { get; set; }
    }
}
