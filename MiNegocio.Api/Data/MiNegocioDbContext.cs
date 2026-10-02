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
}