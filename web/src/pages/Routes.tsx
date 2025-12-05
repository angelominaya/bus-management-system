import { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Card, CardHeader, CardBody, Button, Table, Modal, Input } from '../components/ui';
import { routeService } from '../services/api';
import type { BusRoute } from '../types';

export function Routes() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [formData, setFormData] = useState({
    routeName: '',
    origin: '',
    destination: '',
    distance: '',
  });

  const loadRoutes = async () => {
    try {
      const data = await routeService.getAll();
      setRoutes(data);
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleOpenModal = (route?: BusRoute) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        routeName: route.routeName,
        origin: route.origin,
        destination: route.destination,
        distance: route.distance.toString(),
      });
    } else {
      setEditingRoute(null);
      setFormData({ routeName: '', origin: '', destination: '', distance: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const routeData = {
        routeName: formData.routeName,
        origin: formData.origin,
        destination: formData.destination,
        distance: parseFloat(formData.distance),
      };

      if (editingRoute) {
        await routeService.update(editingRoute.id, { ...routeData, id: editingRoute.id });
      } else {
        await routeService.create(routeData);
      }
      setIsModalOpen(false);
      loadRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta ruta?')) {
      try {
        await routeService.delete(id);
        loadRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
      }
    }
  };

  const columns = [
    { key: 'routeName', header: 'Nombre' },
    { key: 'origin', header: 'Origen' },
    { key: 'destination', header: 'Destino' },
    { key: 'distance', header: 'Distancia (km)' },
    {
      key: 'actions',
      header: '',
      render: (route: BusRoute) => (
        <div className="d-flex gap-1">
          <Button variant="outline-secondary" size="sm" onClick={() => handleOpenModal(route)}>
            <i className="bi bi-pencil"></i>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(route.id)}>
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
          <h1 className="h3 fw-bold text-dark mb-1">Rutas</h1>
          <p className="text-muted mb-0">Gestiona las rutas</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg"></i>
          Nueva
        </Button>
      </div>

      <Card>
        <CardHeader>
          <span className="fw-medium">Lista de Rutas</span>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="sm" />
              <p className="text-muted mt-2 mb-0">Cargando...</p>
            </div>
          ) : (
            <Table columns={columns} data={routes} keyExtractor={(route) => route.id} emptyMessage="No hay rutas" />
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoute ? 'Editar Ruta' : 'Nueva Ruta'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            value={formData.routeName}
            onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
            placeholder="Ruta Norte"
            required
          />
          <Row>
            <Col xs={6}>
              <Input
                label="Origen"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="Ciudad A"
                required
              />
            </Col>
            <Col xs={6}>
              <Input
                label="Destino"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Ciudad B"
                required
              />
            </Col>
          </Row>
          <Input
            label="Distancia (km)"
            type="number"
            step="0.1"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            placeholder="150"
            required
          />
          <div className="d-flex justify-content-end gap-2 pt-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editingRoute ? 'Guardar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
