using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiNegocio.Api.Data;
using MiNegocio.Api.Models;

namespace MiNegocio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly MiNegocioDbContext _context;

    public ProductosController(MiNegocioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Producto>>> ObtenerProductos()
    {
        var productos = await _context.Productos.ToListAsync();

        return Ok(productos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Producto>> ObtenerProducto(int id)
    {
        var producto = await _context.Productos.FindAsync(id);

        if (producto == null)
        {
            return NotFound();
        }

        return Ok(producto);
    }

    [HttpPost]
    public async Task<ActionResult<Producto>> CrearProducto(
        Producto nuevoProducto
    )
    {
        _context.Productos.Add(nuevoProducto);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(ObtenerProducto),
            new { id = nuevoProducto.Id },
            nuevoProducto
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarProducto(
        int id,
        Producto productoActualizado
    )
    {
        var producto = await _context.Productos.FindAsync(id);

        if (producto == null)
        {
            return NotFound();
        }

        producto.Codigo = productoActualizado.Codigo;
        producto.Nombre = productoActualizado.Nombre;
        producto.Categoria = productoActualizado.Categoria;
        producto.PrecioCompra = productoActualizado.PrecioCompra;
        producto.PrecioVenta = productoActualizado.PrecioVenta;
        producto.Stock = productoActualizado.Stock;
        producto.StockMinimo = productoActualizado.StockMinimo;
        producto.Activo = productoActualizado.Activo;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarProducto(int id)
    {
        var producto = await _context.Productos.FindAsync(id);

        if (producto == null)
        {
            return NotFound();
        }

        _context.Productos.Remove(producto);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}