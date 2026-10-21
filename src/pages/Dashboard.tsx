import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import type { Producto } from '../types/Producto'
import type { Venta } from '../types/Venta'
import { API_URL } from '../config/api'

type DashboardProps = {
  productos: Producto[]
}

function convertirFechaVenta(fecha: string): Date {
  const fechaUtc = fecha.endsWith('Z') ? fecha : `${fecha}Z`
  return new Date(fechaUtc)
}

function Dashboard({ productos }: DashboardProps) {

  const productosActivos = productos.filter(
    producto => producto.activo
  )

  const totalProductos = productosActivos.length

  const productosStockBajo = productosActivos.filter(
    producto =>
      producto.stock > 0 &&
      producto.stock <= producto.stockMinimo
  ).length

  const [ventas, setVentas] = useState<Venta[]>([])
  const [cargandoVentas, setCargandoVentas] = useState(true)
  const [errorVentas, setErrorVentas] = useState('')

  useEffect(() => {
    async function cargarVentas() {
      try {
        const response = await fetch(`${API_URL}/api/ventas`)

        if (!response.ok) {
          throw new Error('No se pudieron cargar las ventas')
        }

        const data: Venta[] = await response.json()
        setVentas(data)
      } catch (error) {
        console.error('Error al cargar ventas:', error)
        setErrorVentas('No se pudieron cargar los datos de ventas.')
      } finally {
        setCargandoVentas(false)
      }
    }

    void cargarVentas()
  }, [])

  const hoy = new Date().toLocaleDateString('en-CA')

  const ventasHoy = ventas.filter(venta => {
    const fechaVenta = convertirFechaVenta(venta.fecha)
      .toLocaleDateString('en-CA')

    return fechaVenta === hoy
  })

  const totalVentasHoy = ventasHoy.reduce(
    (total, venta) => total + venta.total,
    0
  )

  const totalVentasRealizadas = ventas.length

  const ultimasVentas = [...ventas]
    .sort((a, b) => {
      const diferenciaFechas =
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()

      return diferenciaFechas || b.id - a.id
    })
    .slice(0, 5)

  return (
    <>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen general de MiNegocio</p>
      </header>

      <section className="stats-grid">
        <StatCard
          title="Ventas de hoy"
          value={new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            maximumFractionDigits: 0
          }).format(totalVentasHoy)}
        />
        <StatCard title="Productos activos" value={totalProductos} />
        <StatCard title="Ventas realizadas" value={totalVentasRealizadas} />
        <StatCard title="Bajo stock" value={productosStockBajo} />
      </section>


      <section className="dashboard-ventas">
        <div className="dashboard-ventas-header">
          <h2>Últimas ventas</h2>
          <p>Movimientos recientes del negocio</p>
        </div>

        {cargandoVentas ? (
          <p>Cargando últimas ventas...</p>
        ) : errorVentas ? (
          <p className="dashboard-error" role="alert">
            {errorVentas}
          </p>
        ) : ultimasVentas.length === 0 ? (
          <p className="dashboard-vacio">
            Todavía no hay ventas registradas.
          </p>
        ) : (
          <div className="dashboard-tabla-scroll">
            <table>
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
                {ultimasVentas.map(venta => (
                  <tr key={venta.id}>
                    <td>#{venta.id}</td>

                    <td>
                      {convertirFechaVenta(venta.fecha).toLocaleString('es-CR')}
                    </td>

                    <td>
                      {venta.nombreCliente || 'Consumidor final'}
                    </td>

                    <td>
                      {venta.metodoPago.toUpperCase()}
                    </td>

                    <td>
                      ₡{venta.total.toLocaleString('es-CR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default Dashboard
