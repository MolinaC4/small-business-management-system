namespace MiNegocio.Api.Models;

public class Venta
{
    public int Id { get; set; }

    public DateTime Fecha { get; set; }

    public decimal Total { get; set; }

    public string MetodoPago { get; set; } = string.Empty;

    public List<DetalleVenta> Detalles { get; set; } = new();

    public string? NombreCliente { get; set; }
    
    public string? CedulaCliente { get; set; }
}