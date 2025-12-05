import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const navItems = [
  { to: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/buses', icon: 'bi-bus-front', label: 'Autobuses' },
  { to: '/routes', icon: 'bi-signpost-split', label: 'Rutas' },
  { to: '/schedules', icon: 'bi-calendar3', label: 'Horarios' },
  { to: '/reservations', icon: 'bi-ticket-perforated', label: 'Reservas' },
];

interface SidebarProps {
  show: boolean;
  onHide: () => void;
}

export function Sidebar({ show, onHide }: SidebarProps) {
  return (
    <>
      {show && <div className="sidebar-backdrop d-lg-none" onClick={onHide} />}

      <aside className={`sidebar bg-dark ${show ? 'show' : ''}`}>
        <div className="d-flex align-items-center px-3 py-3 border-bottom border-secondary">
          <div
            className="d-flex align-items-center justify-content-center rounded bg-primary"
            style={{ width: 40, height: 40 }}
          >
            <i className="bi bi-bus-front text-white fs-5"></i>
          </div>
          <span className="ms-3 text-white fw-bold fs-5">BusManager</span>
          <button
            className="btn btn-link text-white ms-auto d-lg-none p-0"
            onClick={onHide}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <Nav className="flex-column p-3">
          {navItems.map((item) => (
            <Nav.Item key={item.to} className="mb-1">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onHide}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center rounded px-3 py-2 ${
                    isActive
                      ? 'active bg-primary text-white'
                      : 'text-white-50 hover-bg-secondary'
                  }`
                }
              >
                <i className={`bi ${item.icon} me-3`}></i>
                {item.label}
              </NavLink>
            </Nav.Item>
          ))}
        </Nav>

        <div className="mt-auto p-3 border-top border-secondary">
          <small className="text-muted d-block text-center">v1.0.0</small>
        </div>
      </aside>
    </>
  );
}
