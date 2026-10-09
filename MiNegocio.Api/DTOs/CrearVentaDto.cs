namespace MiNegocio.Api.DTOs;

public class CrearVentaDto
{
    public string MetodoPago { get; set; } = string.Empty;
    
    public string? NombreCliente { get; set; }
    
    public string? CedulaCliente { get; set; }

    public List<CrearDetalleVentaDto> Detalles { get; set; } = new();
}