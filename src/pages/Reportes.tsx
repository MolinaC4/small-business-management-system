import { useEffect, useState } from 'react'
import type { Venta } from '../types/Venta'
import { API_URL } from '../config/api'
import type { Producto } from '../types/Producto'

type ReportesProps = {
  productos: Producto[]
}

function convertirFechaVenta(fecha: string): Date {
  const tieneZonaHoraria = /(?:Z|[+-]\d{2}:\d{2})$/i.test(fecha)
  return new Date(tieneZonaHoraria ? fecha : `${fecha}Z`)
}

function Reportes({ productos }: ReportesProps) {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarVentas() {
      try {
        const response = await fetch(`${API_URL}/api/ventas`)

        if (!response.ok) {
          throw new Error('Error al consultar ventas')
        }

        const data: Venta[] = await response.json()
        setVentas(data)
      } catch (error) {
        console.error(error)
        setError('No se pudieron cargar las ventas.')
      } finally {
        setCargando(false)
      }
    }

    void cargarVentas()
  }, [])

  // Obtener fecha local en formato YYYY-MM-DD
  function obtenerFechaLocal(fecha: string) {
    const valor = convertirFechaVenta(fecha)

    const anio = valor.getFullYear()
    const mes = String(valor.getMonth() + 1).padStart(2, '0')
    const dia = String(valor.getDate()).padStart(2, '0')

    return `${anio}-${mes}-${dia}`
  }

  const rangoInvalido =
    fechaInicio !== '' &&
    fechaFin !== '' &&
    fechaInicio > fechaFin

  const ventasFiltradas = rangoInvalido
    ? []
    : ventas.filter(venta => {
        const fechaVenta = obtenerFechaLocal(venta.fecha)

        const cumpleInicio =
          !fechaInicio || fechaVenta >= fechaInicio

        const cumpleFin =
          !fechaFin || fechaVenta <= fechaFin

        return cumpleInicio && cumpleFin
      })

  const totalVendido = ventasFiltradas.reduce(
    (total, venta) => total + venta.total,
    0
  )

  const totalVentas = ventasFiltradas.length


  const productosVendidos = ventasFiltradas
    .flatMap(venta => venta.detalles)
    .reduce((acumulado, detalle) => {
      const producto = acumulado.find(
        item => item.productoId === detalle.productoId
      )

      if (producto) {
        producto.cantidad += detalle.cantidad
        producto.total += detalle.subtotal
      } else {
        acumulado.push({
          productoId: detalle.productoId,
          nombre: detalle.nombreProducto,
          cantidad: detalle.cantidad,
          total: detalle.subtotal
        })
      }

      return acumulado
    }, [] as {
      productoId: number
      nombre: string
      cantidad: number
      total: number
    }[])

  const productosMasVendidos = productosVendidos
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)

  const productosActivos = productos.filter(
    producto => producto.activo
  )

  const unidadesDisponibles = productosActivos.reduce(
    (total, producto) => total + producto.stock,
    0
  )

  const productosStockBajo = productosActivos.filter(
    producto =>
      producto.stock > 0 &&
      producto.stock <= producto.stockMinimo
  ).length

  const productosAgotados = productosActivos.filter(
    producto => producto.stock === 0
  ).length


  return (
    <>
      <header className="page-header">
        <h1>Reportes</h1>
        <p>Análisis de ventas del negocio</p>
      </header>

      <section className="reportes-contenedor">
        <h2>Ventas por período</h2>

        <div className="reportes-filtros">
          <div>
            <label htmlFor="fechaInicio">
              Fecha inicial
            </label>

            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="fechaFin">
              Fecha final
            </label>

            <input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setFechaInicio('')
              setFechaFin('')
            }}
          >
            Limpiar filtros
          </button>
        </div>

        {rangoInvalido && (
          <p className="reportes-error" role="alert">
            La fecha inicial no puede ser mayor
            que la fecha final.
          </p>
        )}

        {cargando && <p>Cargando ventas...</p>}

        {error && (
          <p className="reportes-error" role="alert">
            {error}
          </p>
        )}

        {!cargando && !error && !rangoInvalido && (
          <>
            <div className="reportes-resumen">
              <div className="reporte-card">
                <h3>Ventas realizadas</h3>
                <strong>{totalVentas}</strong>
              </div>

              <div className="reporte-card">
                <h3>Total vendido</h3>
                <strong>
                  {new Intl.NumberFormat('es-CR', {
                    style: 'currency',
                    currency: 'CRC',
                    maximumFractionDigits: 0
                  }).format(totalVendido)}
                </strong>
              </div>
            </div>

            <div className="reportes-tabla-scroll">
              <table className="reportes-tabla">
                <thead>
                  <tr>
                    <th>N.º venta</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Método de pago</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {ventasFiltradas.map(venta => (
                    <tr key={venta.id}>
                      <td>#{venta.id}</td>
                      <td>
                        {new Date(venta.fecha)
                          .toLocaleString('es-CR')}
                      </td>
                      <td>
                        {venta.nombreCliente || 'Consumidor final'}
                      </td>
                      <td>{venta.metodoPago.toUpperCase()}</td>
                      <td>
                        ₡{venta.total.toLocaleString('es-CR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {ventasFiltradas.length === 0 && (
              <p className="reportes-vacio">
                No hay ventas registradas para
                el período seleccionado.
              </p>
            )}
          </>
        )}
      </section>


      <section className="reportes-contenedor">
        <h2>Productos más vendidos</h2>

        <p className="reportes-descripcion">
          Los cinco productos con mayor cantidad de unidades vendidas
          durante el período seleccionado.
        </p>

        {cargando ? (
          <p>Cargando productos más vendidos...</p>
        ) : error ? (
          <p className="reportes-error" role="alert">{error}</p>
        ) : rangoInvalido ? (
          <p className="reportes-error">
            Corrige el rango de fechas para consultar este reporte.
          </p>
        ) : productosMasVendidos.length === 0 ? (
          <p className="reportes-vacio">
            No hay productos vendidos en este período.
          </p>
        ) : (
          <div className="reportes-tabla-scroll">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Producto</th>
                  <th>Unidades vendidas</th>
                  <th>Total vendido</th>
                </tr>
              </thead>

              <tbody>
                {productosMasVendidos.map((producto, index) => (
                  <tr key={producto.productoId}>
                    <td>#{index + 1}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>
                      {new Intl.NumberFormat('es-CR', {
                        style: 'currency',
                        currency: 'CRC',
                        maximumFractionDigits: 0
                      }).format(producto.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>


  <section className="reportes-contenedor">
    <h2>Resumen de inventario</h2>

    <p className="reportes-descripcion">
      Estado actual de las existencias del negocio.
    </p>

    <div className="reportes-inventario">
      <div className="reporte-card">
        <h3>Productos activos</h3>
        <strong>{productosActivos.length}</strong>
      </div>

      <div className="reporte-card">
        <h3>Unidades disponibles</h3>
        <strong>{unidadesDisponibles}</strong>
      </div>

      <div className="reporte-card">
        <h3>Stock bajo</h3>
        <strong>{productosStockBajo}</strong>
      </div>

      <div className="reporte-card">
        <h3>Agotados</h3>
        <strong>{productosAgotados}</strong>
      </div>
    </div>
  </section>


    </>
  )
}

export default Reportes
