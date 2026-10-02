using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiNegocio.Api.Data;
using MiNegocio.Api.Models;

namespace MiNegocio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly MiNegocioDbContext _context;

    public CategoriasController(MiNegocioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> ObtenerCategorias()
    {
        var categorias = await _context.Categorias
            .Where(categoria => categoria.Activo)
            .OrderBy(categoria => categoria.Nombre)
            .ToListAsync();

        return Ok(categorias);
    }
}