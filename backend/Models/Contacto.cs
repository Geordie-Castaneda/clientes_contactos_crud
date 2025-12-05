using System.ComponentModel.DataAnnotations;

namespace ClientesAPI.Models
{
    public class Contacto
    {
        public int Id { get; set; }

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

        // Relación con Cliente
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; } = null!;
    }
}
