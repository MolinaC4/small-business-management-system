namespace MiNegocio.Api.Models;

public class Categoria
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Prefijo { get; set; } = string.Empty;

    public bool Activo { get; set; }
}