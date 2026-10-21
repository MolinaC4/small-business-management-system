# MiNegocio — Sistema de Gestión de Ventas e Inventario

MiNegocio es una aplicación web para la administración de productos, ventas e inventario de pequeños negocios, desarrollada con React, TypeScript, ASP.NET Core y SQL Server.

El proyecto permite centralizar operaciones comerciales básicas mediante una interfaz sencilla y una API REST.

## Tecnologías utilizadas

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- ASP.NET Core Web API (.NET 10)
- C#
- Entity Framework Core

**Base de datos**
- Microsoft SQL Server

## Funcionalidades principales

### Gestión de productos
- Registro, edición y desactivación de productos.
- Organización mediante categorías.
- Generación automática de códigos.
- Validaciones de precios y cantidades.

### Gestión de ventas
- Registro de ventas con múltiples productos.
- Datos opcionales del cliente.
- Selección del método de pago.
- Cálculo automático del total.
- Validación de existencias.
- Actualización del inventario al confirmar una venta.
- Consulta del historial y detalle de ventas.

### Inventario
- Consulta de existencias.
- Identificación de productos con stock bajo.
- Identificación de productos agotados.
- Filtros por estado.

### Dashboard
- Resumen de productos activos.
- Alertas de stock bajo.
- Total de ventas registradas.
- Monto vendido durante el día.
- Historial de ventas recientes.

### Reportes
- Consulta de ventas por rango de fechas.
- Total de ventas y monto vendido.
- Productos más vendidos.
- Resumen general del inventario.

## Arquitectura

La aplicación utiliza una arquitectura cliente-servidor:

- **React:** interfaz de usuario.
- **ASP.NET Core:** API REST y lógica de negocio.
- **Entity Framework Core:** acceso a datos.
- **SQL Server:** almacenamiento de productos, categorías, ventas y detalles de ventas.

## Ejecución local

### Requisitos
- Node.js y npm
- .NET 10 SDK
- SQL Server
- Base de datos configurada

### Backend

Desde la carpeta `MiNegocio.Api`:

```bash
dotnet restore
dotnet run
```

### Frontend

Desde la carpeta principal:

```bash
npm install
npm run dev
```

La aplicación frontend se ejecuta normalmente en `http://localhost:5173`.

La URL de la API se configura en `src/config/api.ts`.

**Nota:** para ejecutar el proyecto es necesario configurar SQL Server y preparar el esquema de la base de datos mediante las migraciones correspondientes.

## Estado del proyecto

**Versión 1.0 — Funcional para desarrollo y demostración local.**

## Mejoras futuras

- Administración independiente de clientes.
- Exportación de reportes a PDF o Excel.
- Autenticación y roles de usuario.
- Mejoras para despliegue en producción.
- Ampliación de los indicadores comerciales.

## Autoría

Proyecto personal desarrollado como parte de un portafolio profesional de desarrollo de software.