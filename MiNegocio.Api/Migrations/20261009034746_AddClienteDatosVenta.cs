using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiNegocio.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClienteDatosVenta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CedulaCliente",
                table: "Ventas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NombreCliente",
                table: "Ventas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CedulaCliente",
                table: "Ventas");

            migrationBuilder.DropColumn(
                name: "NombreCliente",
                table: "Ventas");
        }
    }
}
