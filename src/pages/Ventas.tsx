import { Fragment, useEffect, useState } from 'react'
import type { Producto } from '../types/Producto'
import type { DetalleVenta } from '../types/DetalleVenta'
import { API_URL } from '../config/api'
import type { Venta } from '../types/Venta'

type VentasProps = {
  productos: Producto[]
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
}

function convertirFechaVenta(fecha: string): Date {
  const tieneZonaHoraria = /(?:Z|[+-]\d{2}:\d{2})$/i.test(fecha)
  return new Date(tieneZonaHoraria ? fecha : `${fecha}Z`)
}

function Ventas({
  productos,
  setProductos
}: VentasProps) {

  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [detalleVenta, setDetalleVenta] = useState<DetalleVenta[]>([])
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [nombreCliente, setNombreCliente] = useState('')
  const [cedulaCliente, setCedulaCliente] = useState('')

  const [guardandoVenta, setGuardandoVenta] = useState(false)

  const [mensaje, setMensaje] = useState<{
    tipo: 'exito' | 'error'
    texto: string
  } | null>(null)

  const [historialVentas, setHistorialVentas] = useState<Venta[]>([])
  const [cargandoHistorial, setCargandoHistorial] = useState(true)
  const [errorHistorial, setErrorHistorial] = useState('')
  const [ventaSeleccionada, setVentaSeleccionada] = useState<number | null>(null)

  async function cargarHistorial() {
    setCargandoHistorial(true)
    setErrorHistorial('')

    try {
      const response = await fetch(`${API_URL}/api/ventas`)

      if (!response.ok) {
        throw new Error('No se pudo consultar el historial de ventas.')
      }

      const ventas: Venta[] = await response.json()
      setHistorialVentas(ventas)

    } catch (error) {
      console.error('Error al consultar ventas:', error)
      setErrorHistorial('No se pudo cargar el historial de ventas.')

    } finally {
      setCargandoHistorial(false)
    }
  }  

  useEffect(() => {
    void cargarHistorial()
  }, [])


  function agregarProducto() {
    setMensaje(null)

    if (productoSeleccionadoId === '') {
      setMensaje({
        tipo: 'error',
        texto: 'Debe seleccionar un producto.'
      })
      return
    }

    const cantidadNumerica = Number(cantidad)

    if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
      setMensaje({
        tipo: 'error',
        texto: 'La cantidad debe ser un número entero mayor que cero.'
      })
      return
    }

    const productoSeleccionado = productos.find(
      producto => producto.id === Number(productoSeleccionadoId)
    )

    if (!productoSeleccionado) {
      setMensaje({
        tipo: 'error',
        texto: 'Producto no encontrado.'
      })
      return
    }

    if (cantidadNumerica > productoSeleccionado.stock) {
      setMensaje({
        tipo: 'error',
        texto: `Stock insuficiente. Disponible: ${productoSeleccionado.stock}`
      })
      return
    }

    const nuevoDetalle: DetalleVenta = {
      productoId: productoSeleccionado.id,
      codigo: productoSeleccionado.codigo,
      nombre: productoSeleccionado.nombre,
      cantidad: cantidadNumerica,
      precioUnitario: productoSeleccionado.precioVenta,
      subtotal:
        productoSeleccionado.precioVenta * cantidadNumerica
    }

  const productoYaAgregado = detalleVenta.find(
    detalle => detalle.productoId === productoSeleccionado.id
  )

  if (productoYaAgregado) {
    const nuevaCantidad =
      productoYaAgregado.cantidad + cantidadNumerica

    if (nuevaCantidad > productoSeleccionado.stock) {
      alert(
        `No puede agregar esa cantidad. Stock disponible: ${productoSeleccionado.stock}`
      )
      return
    }

    const detalleActualizado = detalleVenta.map(detalle => {
      if (detalle.productoId === productoSeleccionado.id) {
        return {
          ...detalle,
          cantidad: nuevaCantidad,
          subtotal:
            nuevaCantidad * productoSeleccionado.precioVenta
        }
      }

      return detalle
    })

    setDetalleVenta(detalleActualizado)
  } else {
    setDetalleVenta([
      ...detalleVenta,
      nuevoDetalle
    ])
  }

    setProductoSeleccionadoId('')
    setCantidad('1')
  }

  function eliminarDelDetalle(productoId: number) {
    const detalleActualizado = detalleVenta.filter(
      detalle => detalle.productoId !== productoId
    )

    setDetalleVenta(detalleActualizado)
  }
  
  async function registrarVenta() {

    if (guardandoVenta) return
    setMensaje(null)

    if (detalleVenta.length === 0) {
      setMensaje({
        tipo: 'error',
        texto: 'Debe agregar al menos un producto a la venta.'
      })
      return
    }

    if (!metodoPago) {
      setMensaje({
        tipo: 'error',
        texto: 'Debe seleccionar un método de pago.'
      })
      return
    }

    const datosVenta = {
      nombreCliente: nombreCliente.trim() || null,
      cedulaCliente: cedulaCliente.trim() || null,
      metodoPago: metodoPago,
      detalles: detalleVenta.map(detalle => ({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad
      }))
    }

    try {
      setGuardandoVenta(true)
      const response = await fetch(`${API_URL}/api/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosVenta)
      })

      if (!response.ok) {
        const mensaje = await response.text()
        throw new Error(mensaje || 'No se pudo registrar la venta.')
      }

      const ventaRegistrada = await response.json()

      // Actualizar el inventario en React
      setProductos(productosActuales =>
        productosActuales.map(producto => {
          const detalle = detalleVenta.find(
            item => item.productoId === producto.id
          )

          if (!detalle) {
            return producto
          }

          return {
            ...producto,
            stock: producto.stock - detalle.cantidad
          }
        })
      )

      setMensaje({
        tipo: 'exito',
        texto: `La venta #${ventaRegistrada.id} se guardó correctamente y el inventario fue actualizado.`
      })

      setDetalleVenta([])
      setProductoSeleccionadoId('')
      setCantidad('1')
      setNombreCliente('')
      setCedulaCliente('')

      void cargarHistorial()

    } catch (error) {
      console.error('Error al registrar venta:', error)      

      setMensaje({
        tipo: 'error',
        texto: error instanceof Error
          ? error.message
          : 'Ocurrió un error al registrar la venta.'
      })
    }
    finally {
      setGuardandoVenta(false)
    }
  }

  const totalVenta = detalleVenta.reduce(
    (total, detalle) => total + detalle.subtotal,
    0
  )

  return (
    <>
      <header className="page-header">
        <h1>Ventas</h1>
        <p>Registro de ventas del negocio</p>
      </header>

      {mensaje && (
        <div
          className={`mensaje-venta mensaje-${mensaje.tipo}`}
          role={mensaje.tipo === 'error' ? 'alert' : 'status'}
        >
          <div className="mensaje-contenido">
            <span className="mensaje-icono">
              {mensaje.tipo === 'exito' ? '✓' : '!'}
            </span>

            <div>
              <strong>
                {mensaje.tipo === 'exito'
                  ? 'Venta registrada correctamente'
                  : 'No se pudo completar la operación'}
              </strong>

              <p>{mensaje.texto}</p>
            </div>
          </div>

          <button
            type="button"
            className="mensaje-cerrar"
            onClick={() => setMensaje(null)}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <section className="datos-cliente">
        <h3>Datos del cliente</h3>

        <p className="datos-cliente-descripcion">
          Estos datos son opcionales.
        </p>

        <div className="datos-cliente-grid">
          <div className="campo-cliente">
            <label htmlFor="nombreCliente">
              Nombre completo
            </label>

            <input
              id="nombreCliente"
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Nombre del cliente"
              maxLength={150}
            />
          </div>

          <div className="campo-cliente">
            <label htmlFor="cedulaCliente">
              Cédula
            </label>

            <input
              id="cedulaCliente"
              type="text"
              value={cedulaCliente}
              onChange={(e) => setCedulaCliente(e.target.value)}
              placeholder="Número de identificación"
              maxLength={30}
            />
          </div>
        </div>
      </section>

      <section className="sale-container">

        <div className="sale-form">

          <h2>Nueva venta</h2>

          <label>
            Producto

            <select
              value={productoSeleccionadoId}
              onChange={event =>
                setProductoSeleccionadoId(event.target.value)
              }
            >
              <option value="">
                Seleccione un producto
              </option>

              {productos
                .filter(producto => producto.activo)
                .map(producto => (
                  <option
                    key={producto.id}
                    value={producto.id}
                  >
                    {producto.nombre} - Stock: {producto.stock}
                  </option>
                ))}

            </select>
          </label>

          <label>
            Cantidad

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={event =>
                setCantidad(event.target.value)
              }
            />
          </label>

          <button
            type="button"
            className="primary-button"
            onClick={agregarProducto}
          >
            Agregar a la venta
          </button>

        </div>

        <div className="sale-detail">

          <h2>Detalle de venta</h2>

          <table>

            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {detalleVenta.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="venta-vacia">
                      <span className="venta-vacia-icono" aria-hidden="true">
                        🛒
                      </span>

                      <strong>Todavía no hay productos</strong>

                      <p>
                        Selecciona un producto y agrégalo para comenzar la venta.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {detalleVenta.map(detalle => (
                <tr key={detalle.productoId}>

                  <td>{detalle.nombre}</td>

                  <td>{detalle.cantidad}</td>

                  <td>
                    ₡{detalle.precioUnitario.toLocaleString()}
                  </td>

                  <td>
                    ₡{detalle.subtotal.toLocaleString()}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => eliminarDelDetalle(detalle.productoId)}
                    >
                      Quitar
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <div className="sale-summary">
            <div className="payment-section">
              <label>
                Método de pago

                <select
                  value={metodoPago}
                  onChange={event => setMetodoPago(event.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="sinpe">SINPE Móvil</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </label>
            </div>

            <div className="sale-total">
              <span>Total de la venta</span>

              <strong>
                ₡{totalVenta.toLocaleString('es-CR')}
              </strong>
            </div>
          </div>

        <button
          type="button"
          className="btn-registrar-venta"
          onClick={registrarVenta}
          disabled={guardandoVenta}
        >
          {guardandoVenta ? (
            <>
              <span className="spinner-venta" aria-hidden="true" />
              Registrando venta...
            </>
          ) : (
            <>
              <span aria-hidden="true">✓</span>
              Registrar venta
            </>
          )}
        </button>

        </div>

      </section>

      <section className="historial-ventas">
        <div className="historial-header">
          <div>
            <h2>Historial de ventas</h2>
            <p>Consulta las ventas registradas en el negocio.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => void cargarHistorial()}
            disabled={cargandoHistorial}
          >
            {cargandoHistorial ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {cargandoHistorial && <p>Cargando ventas...</p>}

        {errorHistorial && (
          <p className="historial-error" role="alert">
            {errorHistorial}
          </p>
        )}

        {!cargandoHistorial && !errorHistorial && (
          historialVentas.length === 0 ? (
            <p className="historial-vacio">
              Todavía no hay ventas registradas.
            </p>
          ) : (
            <div className="historial-tabla">
              <table>
                <thead>
                  <tr>
                    <th>N.º venta</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Método de pago</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {historialVentas.map(venta => (
                    <Fragment key={venta.id}>
                      <tr>
                        <td>#{venta.id}</td>

                        <td>
                          {convertirFechaVenta(venta.fecha).toLocaleString('es-CR')}
                        </td>

                        <td>
                          {venta.nombreCliente || 'Consumidor final'}
                        </td>

                        <td>
                          {venta.metodoPago}
                        </td>

                        <td>
                          ₡{venta.total.toLocaleString('es-CR')}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              setVentaSeleccionada(
                                ventaSeleccionada === venta.id
                                  ? null
                                  : venta.id
                              )
                            }
                          >
                            {ventaSeleccionada === venta.id
                              ? 'Ocultar'
                              : 'Ver detalle'}
                          </button>
                        </td>
                      </tr>

                      {ventaSeleccionada === venta.id && (
                        <tr>
                          <td colSpan={6}>
                            <div className="historial-detalle">
                              <h3>Productos de la venta #{venta.id}</h3>

                              {venta.cedulaCliente && (
                                <p>
                                  <strong>Cédula:</strong> {venta.cedulaCliente}
                                </p>
                              )}

                              <table>
                                <thead>
                                  <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio unitario</th>
                                    <th>Subtotal</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {venta.detalles.map(detalle => (
                                    <tr key={detalle.productoId}>
                                      <td>{detalle.nombreProducto}</td>
                                      <td>{detalle.cantidad}</td>
                                      <td>
                                        ₡{detalle.precioUnitario.toLocaleString('es-CR')}
                                      </td>
                                      <td>
                                        ₡{detalle.subtotal.toLocaleString('es-CR')}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
    </>
  )
}

export default Ventas