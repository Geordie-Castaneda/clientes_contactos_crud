import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import { FaSave, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { clientesService } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

interface ClienteFormData {
  nombre: string;
  direccion: string;
  pais: string;
  identificador: string;
  telefono: string;
  email: string;
  contactos: ContactoFormData[];
}

interface ContactoFormData {
  nombre: string;
  email: string;
  telefono: string;
  puesto: string;
}

const ClienteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ClienteFormData>({
    nombre: "",
    direccion: "",
    pais: "Guatemala",
    identificador: "",
    telefono: "",
    email: "",
    contactos: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchCliente();
    }
  }, [id]);

  const fetchCliente = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getById(parseInt(id!));
      setFormData({
        nombre: response.data.nombre,
        direccion: response.data.direccion || "",
        pais: response.data.pais || "Guatemala",
        identificador: response.data.identificador,
        telefono: response.data.telefono || "",
        email: response.data.email || "",
        contactos: response.data.contactos || [],
      });
    } catch (err) {
      setError("Error al cargar cliente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContactoChange = (index: number, field: keyof ContactoFormData, value: string) => {
    const updatedContactos = [...formData.contactos];
    updatedContactos[index] = {
      ...updatedContactos[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      contactos: updatedContactos,
    });
  };

  const addContacto = () => {
    setFormData({
      ...formData,
      contactos: [
        ...formData.contactos,
        { nombre: "", email: "", telefono: "", puesto: "" },
      ],
    });
  };

  const removeContacto = (index: number) => {
    const updatedContactos = formData.contactos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      contactos: updatedContactos,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (isEditMode) {
        await clientesService.update(parseInt(id!), formData);
        setSuccess("Cliente actualizado exitosamente");
      } else {
        await clientesService.create(formData);
        setSuccess("Cliente creado exitosamente");
        setTimeout(() => {
          navigate("/clientes");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar cliente");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando cliente...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isEditMode ? "Editar Cliente" : "Nuevo Cliente"}</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Nombre del cliente"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="identificador">
              <Form.Label>Identificador (NIT/DPI) *</Form.Label>
              <Form.Control
                type="text"
                name="identificador"
                value={formData.identificador}
                onChange={handleInputChange}
                required
                placeholder="NIT o DPI"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="correo@ejemplo.com"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="5555-1234"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="pais">
              <Form.Label>País</Form.Label>
              <Form.Select
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
              >
                <option value="Guatemala">Guatemala</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Honduras">Honduras</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Panamá">Panamá</option>
                <option value="México">México</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Dirección completa"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Sección de Contactos */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Personas de Contacto</span>
            <Button variant="outline-primary" size="sm" onClick={addContacto}>
               Agregar Contacto
            </Button>
          </Card.Header>
          <Card.Body>
            {formData.contactos.length === 0 ? (
              <p className="text-muted">No hay contactos agregados</p>
            ) : (
              formData.contactos.map((contacto, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Contacto {index + 1}</h6>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeContacto(index)}
                      >
                        
                      </Button>
                    </div>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control
                            type="text"
                            value={contacto.nombre}
                            onChange={(e) =>
                              handleContactoChange(index, "nombre", e.target.value)
                            }
                            required
                            placeholder="Nombre del contacto"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={contacto.email}
                            onChange={(e) =>
                              handleContactoChange(index, "email", e.target.value)
                            }
                            placeholder="correo@ejemplo.com"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control
                            type="text"
                            value={contacto.telefono}
                            onChange={(e) =>
                              handleContactoChange(index, "telefono", e.target.value)
                            }
                            placeholder="5555-1234"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Puesto</Form.Label>
                          <Form.Control
                            type="text"
                            value={contacto.puesto}
                            onChange={(e) =>
                              handleContactoChange(index, "puesto", e.target.value)
                            }
                            placeholder="Gerente, Supervisor, etc."
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            )}
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate("/clientes")}>
            
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              <>
                
                {isEditMode ? "Actualizar" : "Guardar"}
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ClienteForm;
