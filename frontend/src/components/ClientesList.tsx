import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { clientesService } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

interface Cliente {
  id: number;
  nombre: string;
  identificador: string;
  telefono: string;
  email: string;
  pais: string;
  fechaCreacion: string;
  contactos: Contacto[];
}

interface Contacto {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  puesto: string;
}

const ClientesList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getAll();
      setClientes(response.data);
    } catch (err) {
      setError("Error al cargar clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await clientesService.delete(id);
      fetchClientes();
      setShowDeleteModal(false);
    } catch (err) {
      setError("Error al eliminar cliente");
      console.error(err);
    }
  };

  const confirmDelete = (id: number) => {
    setClienteToDelete(id);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-GT");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Clientes</h2>
        <Button variant="primary" onClick={() => navigate("/clientes/nuevo")}>
          
          Nuevo Cliente
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Identificador</th>
              <th>Tel�fono</th>
              <th>Email</th>
              <th>Pa�s</th>
              <th>Fecha Creaci�n</th>
              <th>Contactos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  No hay clientes registrados
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.identificador}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.pais}</td>
                  <td>{formatDate(cliente.fechaCreacion)}</td>
                  <td>{cliente.contactos?.length || 0}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                      >
                        
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(cliente.id)}
                      >
                        
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal de confirmaci�n para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminaci�n</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          �Est�s seguro que deseas eliminar este cliente? Esta acci�n no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => clienteToDelete && handleDelete(clienteToDelete)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientesList;
