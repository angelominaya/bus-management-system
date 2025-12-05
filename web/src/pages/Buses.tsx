import { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Card, CardHeader, CardBody, Button, Table, Modal, Input, Badge, Select } from '../components/ui';
import { busService } from '../services/api';
import type { Bus } from '../types';

export function Buses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    model: '',
    capacity: '',
    year: '',
    status: 'Active',
  });

  const loadBuses = async () => {
    try {
      const data = await busService.getAll();
      setBuses(data);
    } catch (error) {
      console.error('Error loading buses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleOpenModal = (bus?: Bus) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        busNumber: bus.busNumber,
        model: bus.model,
        capacity: bus.capacity.toString(),
        year: bus.year.toString(),
        status: bus.status,
      });
    } else {
      setEditingBus(null);
      setFormData({ busNumber: '', model: '', capacity: '', year: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const busData = {
        busNumber: formData.busNumber,
        model: formData.model,
        capacity: parseInt(formData.capacity),
        year: parseInt(formData.year),
        status: formData.status,
      };

      if (editingBus) {
        await busService.update(editingBus.id, { ...busData, id: editingBus.id });
      } else {
        await busService.create(busData);
      }
      setIsModalOpen(false);
      loadBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este autobús?')) {
      try {
        await busService.delete(id);
        loadBuses();
      } catch (error) {
        console.error('Error deleting bus:', error);
      }
    }
  };

  const columns = [
    { key: 'busNumber', header: 'Número' },
    { key: 'model', header: 'Modelo' },
    { key: 'capacity', header: 'Capacidad' },
    { key: 'year', header: 'Año' },
    {
      key: 'status',
      header: 'Estado',
      render: (bus: Bus) => (
        <Badge variant={bus.status === 'Active' ? 'success' : bus.status === 'Maintenance' ? 'warning' : 'gray'}>
          {bus.status === 'Active' ? 'Activo' : bus.status === 'Maintenance' ? 'Mantenimiento' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (bus: Bus) => (
        <div className="d-flex gap-1">
          <Button variant="outline-secondary" size="sm" onClick={() => handleOpenModal(bus)}>
            <i className="bi bi-pencil"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(bus.id)}>
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
          <h1 className="h3 fw-bold text-dark mb-1">Autobuses</h1>
          <p className="text-muted mb-0">Gestiona la flota</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg"></i>
          Nuevo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <span className="fw-medium">Lista de Autobuses</span>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="text-muted mt-2 mb-0">Cargando...</p>
            </div>
          ) : (
            <Table columns={columns} data={buses} keyExtractor={(bus) => bus.id} emptyMessage="No hay autobuses" />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBus ? 'Editar Autobús' : 'Nuevo Autobús'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Número"
            value={formData.busNumber}
            onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
            placeholder="BUS-001"
            required
          />
          <Input
            label="Modelo"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Volvo B9R"
            required
          />
          <Row>
            <Col xs={6}>
              <Input
                label="Capacidad"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="50"
                required
              />
            </Col>
            <Col xs={6}>
              <Input
                label="Año"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                required
              />
            </Col>
          </Row>
          <Select
            label="Estado"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Activo' },
              { value: 'Inactive', label: 'Inactivo' },
              { value: 'Maintenance', label: 'Mantenimiento' },
            ]}
          />
          <div className="d-flex justify-content-end gap-2 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingBus ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
