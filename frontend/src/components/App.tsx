import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import ClientesList from "./ClientesList";
import ClienteForm from "./ClienteForm";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">
             Gestión de Clientes
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/clientes">
               Clientes
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/clientes" />} />
          <Route path="/clientes" element={<ClientesList />} />
          <Route path="/clientes/nuevo" element={<ClienteForm />} />
          <Route path="/clientes/editar/:id" element={<ClienteForm />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
