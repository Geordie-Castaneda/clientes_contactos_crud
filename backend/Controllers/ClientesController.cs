using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClientesAPI.Data;
using ClientesAPI.Models;
using System.Diagnostics;

namespace ClientesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var clientes = await _context.Clientes.Include(c => c.Contactos).ToListAsync();
            Debug.WriteLine($"Total clientes: {clientes.Count}");
            foreach (var c in clientes)
            {
                Debug.WriteLine($"Cliente {c.Id} tiene {c.Contactos?.Count ?? 0} contactos");
            }
            return clientes;
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes
                .Include(c => c.Contactos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cliente == null)
            {
                return NotFound();
            }

            Debug.WriteLine($"Cliente ID {id} encontrado");
            Debug.WriteLine($"Contactos: {cliente.Contactos?.Count ?? 0}");

            return cliente;
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, ClienteWithContactosDTO clienteDTO)
        {
            var clienteExistente = await _context.Clientes
                .Include(c => c.Contactos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (clienteExistente == null)
            {
                return NotFound();
            }

            Debug.WriteLine($"Actualizando cliente ID {id}");
            Debug.WriteLine($"Contactos recibidos: {clienteDTO.Contactos?.Count ?? 0}");

            // Actualizar propiedades del cliente
            clienteExistente.Nombre = clienteDTO.Nombre;
            clienteExistente.Direccion = clienteDTO.Direccion;
            clienteExistente.Pais = clienteDTO.Pais;
            clienteExistente.Identificador = clienteDTO.Identificador;
            clienteExistente.Telefono = clienteDTO.Telefono;
            clienteExistente.Email = clienteDTO.Email;

            // Limpiar contactos existentes y agregar nuevos
            clienteExistente.Contactos.Clear();
            
            if (clienteDTO.Contactos != null)
            {
                foreach (var contactoDTO in clienteDTO.Contactos)
                {
                    var contacto = new Contacto
                    {
                        Nombre = contactoDTO.Nombre,
                        Email = contactoDTO.Email,
                        Telefono = contactoDTO.Telefono,
                        Puesto = contactoDTO.Puesto,
                        ClienteId = id
                    };
                    clienteExistente.Contactos.Add(contacto);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Clientes
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(ClienteWithContactosDTO clienteDTO)
        {
            Debug.WriteLine($"Creando nuevo cliente: {clienteDTO.Nombre}");
            Debug.WriteLine($"Contactos a agregar: {clienteDTO.Contactos?.Count ?? 0}");

            var cliente = new Cliente
            {
                Nombre = clienteDTO.Nombre,
                Direccion = clienteDTO.Direccion,
                Pais = clienteDTO.Pais,
                Identificador = clienteDTO.Identificador,
                FechaCreacion = DateTime.Now,
                Telefono = clienteDTO.Telefono,
                Email = clienteDTO.Email
            };

            // Agregar contactos
            if (clienteDTO.Contactos != null)
            {
                foreach (var contactoDTO in clienteDTO.Contactos)
                {
                    var contacto = new Contacto
                    {
                        Nombre = contactoDTO.Nombre,
                        Email = contactoDTO.Email,
                        Telefono = contactoDTO.Telefono,
                        Puesto = contactoDTO.Puesto
                    };
                    Debug.WriteLine($"Agregando contacto: {contacto.Nombre}");
                    cliente.Contactos.Add(contacto);
                }
            }

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            // Recargar con contactos para devolver
            var clienteConContactos = await _context.Clientes
                .Include(c => c.Contactos)
                .FirstOrDefaultAsync(c => c.Id == cliente.Id);

            Debug.WriteLine($"Cliente creado ID: {cliente.Id}");
            Debug.WriteLine($"Contactos guardados: {clienteConContactos?.Contactos?.Count ?? 0}");

            return CreatedAtAction("GetCliente", new { id = cliente.Id }, clienteConContactos);
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.Include(c => c.Contactos)
                .FirstOrDefaultAsync(c => c.Id == id);
                
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id == id);
        }
    }
}
