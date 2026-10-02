using Microsoft.EntityFrameworkCore;
using MiNegocio.Api.Models;

namespace MiNegocio.Api.Data;

public class MiNegocioDbContext : DbContext
{
    public MiNegocioDbContext(
        DbContextOptions<MiNegocioDbContext> options
    ) : base(options)
    {
    }

    public DbSet<Producto> Productos { get; set; }
    public DbSet<Categoria> Categorias { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Producto>()
            .HasOne(producto => producto.Categoria)
            .WithMany()
            .HasForeignKey(producto => producto.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}