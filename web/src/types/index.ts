export interface Bus {
  id: number;
  busNumber: string;
  model: string;
  capacity: number;
  year: number;
  status: string;
}

export interface BusRoute {
  id: number;
  routeName: string;
  origin: string;
  destination: string;
  distance: number;
}

export interface Schedule {
  id: number;
  busId: number;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  bus?: Bus;
  route?: BusRoute;
}

export interface Reservation {
  id: number;
  scheduleId: number;
  passengerName: string;
  seatNumber: number;
  reservationDate: string;
  schedule?: Schedule;
}
