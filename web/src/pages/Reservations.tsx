import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Card, CardHeader, CardBody, Button, Table, Modal, Input, Select, Badge } from '../components/ui';
import { reservationService, scheduleService } from '../services/api';
import type { Reservation, Schedule } from '../types';

export function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    scheduleId: '',
    passengerName: '',
    seatNumber: '',
  });

  const loadData = async () => {
    try {
      const [reservationsData, schedulesData] = await Promise.all([
        reservationService.getAll(),
        scheduleService.getAll(),
      ]);
      setReservations(reservationsData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const handleOpenModal = () => {
    setFormData({ scheduleId: '', passengerName: '', seatNumber: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reservationService.create({
        scheduleId: parseInt(formData.scheduleId),
        passengerName: formData.passengerName,
        seatNumber: parseInt(formData.seatNumber),
        reservationDate: new Date().toISOString(),
      });
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Cancelar esta reserva?')) {
      try {
        await reservationService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  const columns = [
    { key: 'passengerName', header: 'Pasajero' },
    {
      key: 'seatNumber',
      header: 'Asiento',
      render: (r: Reservation) => <Badge variant="info">#{r.seatNumber}</Badge>,
    },
    {
      key: 'schedule',
      header: 'Viaje',
      render: (r: Reservation) =>
        r.schedule?.route ? `${r.schedule.route.origin} → ${r.schedule.route.destination}` : `#${r.scheduleId}`,
    },
    {
      key: 'departureTime',
      header: 'Salida',
      render: (r: Reservation) => (r.schedule ? formatDateTime(r.schedule.departureTime) : '-'),
    },
    {
      key: 'reservationDate',
      header: 'Reservado',
      render: (r: Reservation) => formatDateTime(r.reservationDate),
    },
    {
      key: 'actions',
      header: '',
      render: (r: Reservation) => (
        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.id)}>
          <i className="bi bi-trash"></i>
        </Button>
      ),
    },
  ];

  const getScheduleLabel = (schedule: Schedule) => {
    const route = schedule.route;
    const bus = schedule.bus;
    const departure = new Date(schedule.departureTime).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    return `${route?.origin || '?'} → ${route?.destination || '?'} | ${bus?.busNumber || '?'} | ${departure}`;
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Reservas</h1>
          <p className="text-muted mb-0">Gestiona las reservas</p>
        </div>
        <Button onClick={handleOpenModal}>
          <i className="bi bi-plus-lg"></i>
          Nueva
        </Button>
      </div>

      <Card>
        <CardHeader>
          <span className="fw-medium">Lista de Reservas</span>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="text-muted mt-2 mb-0">Cargando...</p>
            </div>
          ) : (
            <Table columns={columns} data={reservations} keyExtractor={(r) => r.id} emptyMessage="No hay reservas" />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Reserva">
        <form onSubmit={handleSubmit}>
          <Input
            label="Pasajero"
            value={formData.passengerName}
            onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
            placeholder="Juan Pérez"
            required
          />
          <Select
            label="Viaje"
            value={formData.scheduleId}
            onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
            options={schedules.map((s) => ({ value: String(s.id), label: getScheduleLabel(s) }))}
            required
          />
          <Input
            label="Asiento"
            type="number"
            min="1"
            value={formData.seatNumber}
            onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
            placeholder="1"
            required
          />
          <div className="d-flex justify-content-end gap-2 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
