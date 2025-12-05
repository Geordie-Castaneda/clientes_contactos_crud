using Microsoft.EntityFrameworkCore;
using ClientesAPI.Models;

namespace ClientesAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Cliente> Clientes => Set<Cliente>();
        public DbSet<Contacto> Contactos => Set<Contacto>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuraci�n para Cliente
            modelBuilder.Entity<Cliente>()
                .HasMany(c => c.Contactos)
                .WithOne(c => c.Cliente)
                .HasForeignKey(c => c.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configurar campo Identificador como �nico
            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.Identificador)
                .IsUnique();
        }
    }
}
