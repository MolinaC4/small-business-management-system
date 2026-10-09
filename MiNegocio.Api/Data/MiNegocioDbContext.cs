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
    public DbSet<Venta> Ventas { get; set; }
    public DbSet<DetalleVenta> DetallesVenta { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Producto>()
            .HasOne(producto => producto.Categoria)
            .WithMany()
            .HasForeignKey(producto => producto.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Categoria>().HasData(
            new Categoria { Id = 1, Nombre = "Camisas", Prefijo = "CAM", Activo = true },
            new Categoria { Id = 2, Nombre = "Blusas", Prefijo = "BLU", Activo = true },
            new Categoria { Id = 3, Nombre = "Pantalones", Prefijo = "PAN", Activo = true },
            new Categoria { Id = 4, Nombre = "Enaguas", Prefijo = "ENA", Activo = true },
            new Categoria { Id = 5, Nombre = "Vestidos", Prefijo = "VES", Activo = true },
            new Categoria { Id = 6, Nombre = "Zapatos", Prefijo = "ZAP", Activo = true },
            new Categoria { Id = 7, Nombre = "Gorras y sombreros", Prefijo = "GOR", Activo = true },
            new Categoria { Id = 8, Nombre = "Trajes de baño", Prefijo = "TRA", Activo = true }
        );

        // Una venta puede tener muchos detalles
        modelBuilder.Entity<DetalleVenta>()
            .HasOne(detalle => detalle.Venta)
            .WithMany(venta => venta.Detalles)
            .HasForeignKey(detalle => detalle.VentaId)
            .OnDelete(DeleteBehavior.Cascade);

        // Un producto puede aparecer en muchos detalles de venta
        modelBuilder.Entity<DetalleVenta>()
            .HasOne(detalle => detalle.Producto)
            .WithMany()
            .HasForeignKey(detalle => detalle.ProductoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}