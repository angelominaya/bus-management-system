import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { Sidebar } from './Sidebar';
import { Button } from '../ui';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex min-vh-100">
      <Sidebar show={sidebarOpen} onHide={() => setSidebarOpen(false)} />

      <div className="flex-grow-1 d-flex flex-column">
        <Navbar bg="white" className="d-lg-none border-bottom shadow-sm px-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="me-3"
          >
            <i className="bi bi-list"></i>
          </Button>
          <Navbar.Brand className="d-flex align-items-center">
            <i className="bi bi-bus-front text-primary me-2"></i>
            <span className="fw-bold">BusManager</span>
          </Navbar.Brand>
        </Navbar>

        <main className="flex-grow-1 p-3 p-lg-4 bg-light">
          <Container fluid className="px-0 px-lg-3">
            <Outlet />
          </Container>
        </main>
      </div>

      <style>{`
        @media (min-width: 992px) {
          :root {
            --sidebar-width: 250px;
          }
        }
      `}</style>
    </div>
  );
}
