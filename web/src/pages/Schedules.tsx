import { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Card, CardHeader, CardBody, Button, Table, Modal, Input, Select } from '../components/ui';
import { scheduleService, busService, routeService } from '../services/api';
import type { Schedule, Bus, BusRoute } from '../types';

export function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
  });

  const loadData = async () => {
    try {
      const [schedulesData, busesData, routesData] = await Promise.all([
        scheduleService.getAll(),
        busService.getAll(),
        routeService.getAll(),
      ]);
      setSchedules(schedulesData);
      setBuses(busesData);
      setRoutes(routesData);
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

  const toInputDateTime = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const handleOpenModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        busId: schedule.busId.toString(),
        routeId: schedule.routeId.toString(),
        departureTime: toInputDateTime(schedule.departureTime),
        arrivalTime: toInputDateTime(schedule.arrivalTime),
      });
    } else {
      setEditingSchedule(null);
      setFormData({ busId: '', routeId: '', departureTime: '', arrivalTime: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scheduleData = {
        busId: parseInt(formData.busId),
        routeId: parseInt(formData.routeId),
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
      };

      if (editingSchedule) {
        await scheduleService.update(editingSchedule.id, { ...scheduleData, id: editingSchedule.id });
      } else {
        await scheduleService.create(scheduleData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este horario?')) {
      try {
        await scheduleService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const columns = [
    {
      key: 'bus',
      header: 'Autobús',
      render: (schedule: Schedule) => schedule.bus?.busNumber || `#${schedule.busId}`,
    },
    {
      key: 'route',
      header: 'Ruta',
      render: (schedule: Schedule) =>
        schedule.route ? `${schedule.route.origin} → ${schedule.route.destination}` : `#${schedule.routeId}`,
    },
    {
      key: 'departureTime',
      header: 'Salida',
      render: (schedule: Schedule) => formatDateTime(schedule.departureTime),
    },
    {
      key: 'arrivalTime',
      header: 'Llegada',
      render: (schedule: Schedule) => formatDateTime(schedule.arrivalTime),
    },
    {
      key: 'actions',
      header: '',
      render: (schedule: Schedule) => (
        <div className="d-flex gap-1">
          <Button variant="outline-secondary" size="sm" onClick={() => handleOpenModal(schedule)}>
            <i className="bi bi-pencil"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(schedule.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Horarios</h1>
          <p className="text-muted mb-0">Gestiona los horarios</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg"></i>
          Nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <span className="fw-medium">Lista de Horarios</span>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="text-muted mt-2 mb-0">Cargando...</p>
            </div>
          ) : (
            <Table columns={columns} data={schedules} keyExtractor={(s) => s.id} emptyMessage="No hay horarios" />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}>
        <form onSubmit={handleSubmit}>
          <Select
            label="Autobús"
            value={formData.busId}
            onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
            options={buses.map((bus) => ({ value: String(bus.id), label: `${bus.busNumber} - ${bus.model}` }))}
            required
          />
          <Select
            label="Ruta"
            value={formData.routeId}
            onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
            options={routes.map((route) => ({ value: String(route.id), label: `${route.origin} → ${route.destination}` }))}
            required
          />
          <Row>
            <Col xs={6}>
              <Input
                label="Salida"
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                required
              />
            </Col>
            <Col xs={6}>
              <Input
                label="Llegada"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                required
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingSchedule ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
