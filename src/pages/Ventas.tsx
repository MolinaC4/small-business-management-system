import { useState } from 'react'
import type { Producto } from '../types/Producto'
import type { DetalleVenta } from '../types/DetalleVenta'
import { API_URL } from '../config/api'

type VentasProps = {
  productos: Producto[]
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
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
    </>
  )
}

export default Ventas