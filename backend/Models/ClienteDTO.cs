using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClientesAPI.Models
{
    public class ClienteWithContactosDTO
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = "";

        [StringLength(200)]
        public string Direccion { get; set; } = "";

        [StringLength(50)]
        public string Pais { get; set; } = "";

        [Required]
        [StringLength(20)]
        public string Identificador { get; set; } = "";

        [StringLength(20)]
        public string Telefono { get; set; } = "";

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = "";

        public List<ContactoDTO> Contactos { get; set; } = new List<ContactoDTO>();
    }

    public class ContactoDTO
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = "";

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = "";

        [StringLength(20)]
        public string Telefono { get; set; } = "";

        [StringLength(100)]
        public string Puesto { get; set; } = "";
    }
}
