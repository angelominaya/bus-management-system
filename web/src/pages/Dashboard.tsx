import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Card, CardBody } from '../components/ui';
import { busService, routeService, scheduleService, reservationService } from '../services/api';

interface Stats {
  buses: number;
  routes: number;
  schedules: number;
  reservations: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({ buses: 0, routes: 0, schedules: 0, reservations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      busService.getAll(),
      routeService.getAll(),
      scheduleService.getAll(),
      reservationService.getAll(),
    ])
      .then(([buses, routes, schedules, reservations]) => {
        setStats({
          buses: buses.length,
          routes: routes.length,
          schedules: schedules.length,
          reservations: reservations.length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Autobuses', value: stats.buses, icon: 'bi-bus-front', color: 'primary' },
    { label: 'Rutas', value: stats.routes, icon: 'bi-signpost-split', color: 'success' },
    { label: 'Horarios', value: stats.schedules, icon: 'bi-calendar3', color: 'info' },
    { label: 'Reservas', value: stats.reservations, icon: 'bi-ticket-perforated', color: 'warning' },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark">Dashboard</h1>
        <p className="text-muted mb-0">Resumen del sistema</p>
      </div>

      <Row className="g-3 g-lg-4 mb-4">
        {statCards.map((stat) => (
          <Col xs={6} lg={3} key={stat.label}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center">
                  <div
                    className={`d-flex align-items-center justify-content-center rounded bg-${stat.color} bg-opacity-10 me-3`}
                    style={{ width: 48, height: 48 }}
                  >
                    <i className={`bi ${stat.icon} fs-4 text-${stat.color}`}></i>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">{stat.label}</p>
                    <p className="h4 fw-bold mb-0">{loading ? '-' : stat.value}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <CardBody>
          <h5 className="fw-semibold mb-2">Bienvenido</h5>
          <p className="text-muted mb-0">
            Usa el menú lateral para gestionar autobuses, rutas, horarios y reservas.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
