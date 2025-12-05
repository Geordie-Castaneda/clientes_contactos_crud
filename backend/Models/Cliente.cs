using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClientesAPI.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = "";

        [StringLength(200)]
        public string Direccion { get; set; } = "";

        [StringLength(50)]
        public string Pais { get; set; } = "";

        [Required]
        [StringLength(20)]
        public string Identificador { get; set; } = ""; // Nit o DPI

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string Telefono { get; set; } = "";

        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; } = "";

        // Un cliente puede tener varios contactos
        public List<Contacto> Contactos { get; set; } = new List<Contacto>();
    }
}
