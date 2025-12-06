using System;
using System.Collections.Generic;

namespace ClientesAPI.Models
{
    public class ClienteResponseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = "";
        public string Direccion { get; set; } = "";
        public string Pais { get; set; } = "";
        public string Identificador { get; set; } = "";
        public DateTime FechaCreacion { get; set; }
        public string Telefono { get; set; } = "";
        public string Email { get; set; } = "";
        public List<ContactoResponseDTO> Contactos { get; set; } = new List<ContactoResponseDTO>();
    }

    public class ContactoResponseDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = "";
        public string Email { get; set; } = "";
        public string Telefono { get; set; } = "";
        public string Puesto { get; set; } = "";
        public int ClienteId { get; set; }
    }
}
