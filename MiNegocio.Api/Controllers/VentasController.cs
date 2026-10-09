using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiNegocio.Api.Data;
using MiNegocio.Api.DTOs;
using MiNegocio.Api.Models;

namespace MiNegocio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly MiNegocioDbContext _context;

    public VentasController(MiNegocioDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> RegistrarVenta(
        CrearVentaDto datos)
    {
        if (datos.Detalles == null || datos.Detalles.Count == 0)
        {
            return BadRequest("La venta debe contener productos.");
        }

        if (string.IsNullOrWhiteSpace(datos.MetodoPago))
        {
            return BadRequest("Debe indicar el método de pago.");
        }

        if (datos.Detalles.Any(d => d.Cantidad <= 0))
        {
            return BadRequest("Las cantidades deben ser mayores que cero.");
        }

        if (datos.Detalles
            .GroupBy(d => d.ProductoId)
            .Any(grupo => grupo.Count() > 1))
        {
            return BadRequest("No repita productos en el detalle.");
        }

        await using var transaccion =
            await _context.Database.BeginTransactionAsync();

        var venta = new Venta
        {
            Fecha = DateTime.UtcNow,
            MetodoPago = datos.MetodoPago.Trim(),

            NombreCliente = string.IsNullOrWhiteSpace(datos.NombreCliente)
                ? null
                : datos.NombreCliente.Trim(),

            CedulaCliente = string.IsNullOrWhiteSpace(datos.CedulaCliente)
                ? null
                : datos.CedulaCliente.Trim(),

            Total = 0
        };

        foreach (var item in datos.Detalles)
        {
            var producto = await _context.Productos
                .FindAsync(item.ProductoId);

            if (producto == null || !producto.Activo)
            {
                return BadRequest(
                    $"El producto {item.ProductoId} no está disponible."
                );
            }

            if (producto.Stock < item.Cantidad)
            {
                return BadRequest(
                    $"Stock insuficiente para {producto.Nombre}."
                );
            }

            var subtotal = producto.PrecioVenta * item.Cantidad;

            venta.Detalles.Add(new DetalleVenta
            {
                ProductoId = producto.Id,
                Cantidad = item.Cantidad,
                PrecioUnitario = producto.PrecioVenta,
                Subtotal = subtotal
            });

            venta.Total += subtotal;

            producto.Stock -= item.Cantidad;
        }

        _context.Ventas.Add(venta);

        await _context.SaveChangesAsync();
        await transaccion.CommitAsync();

        return Ok(new
        {
            venta.Id,
            venta.Fecha,
            venta.Total,
            venta.MetodoPago,
            venta.NombreCliente,
            venta.CedulaCliente
        });
    }
}