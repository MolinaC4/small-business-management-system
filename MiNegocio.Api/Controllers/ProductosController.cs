using Microsoft.AspNetCore.Mvc;
using MiNegocio.Api.Models;

namespace MiNegocio.Api.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController : ControllerBase
{
    private static readonly List<Producto> Productos =
    [
        new Producto
        {
            Id = 1,
            Codigo = "PROD-001",
            Nombre = "Camisa básica",
            Categoria = "Ropa",
            PrecioCompra = 4500,
            PrecioVenta = 7500,
            Stock = 12,
            StockMinimo = 5,
            Activo = true
        },

        new Producto
        {
            Id = 2,
            Codigo = "PROD-002",
            Nombre = "Pulsera artesanal",
            Categoria = "Accesorios",
            PrecioCompra = 1200,
            PrecioVenta = 2500,
            Stock = 3,
            StockMinimo = 5,
            Activo = true
        }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Producto>> ObtenerProductos()
    {
        return Ok(Productos);
    }

    [HttpGet("{id}")]
    public ActionResult<Producto> ObtenerProducto(int id)
    {
        var producto = Productos.FirstOrDefault(
            producto => producto.Id == id
        );

        if (producto == null)
        {
            return NotFound();
        }

        return Ok(producto);
    }

    [HttpPost]
    public ActionResult<Producto> CrearProducto(Producto nuevoProducto)
    {
        var nuevoId = Productos.Count == 0
            ? 1
            : Productos.Max(producto => producto.Id) + 1;

        nuevoProducto.Id = nuevoId;

        Productos.Add(nuevoProducto);

        return CreatedAtAction(
            nameof(ObtenerProducto),
            new { id = nuevoProducto.Id },
            nuevoProducto
        );
    }

    [HttpPut("{id}")]
    public IActionResult ActualizarProducto(int id, Producto productoActualizado)
    {
        var producto = Productos.FirstOrDefault(
            producto => producto.Id == id
        );

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

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult EliminarProducto(int id)
    {
        var producto = Productos.FirstOrDefault(
            producto => producto.Id == id
        );

        if (producto == null)
        {
            return NotFound();
        }

        Productos.Remove(producto);

        return NoContent();
    }
}