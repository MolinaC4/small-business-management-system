import { useState } from 'react'
import type { Producto } from '../types/Producto'
import type { DetalleVenta } from '../types/DetalleVenta'

type VentasProps = {
  productos: Producto[]
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
}

function Ventas({
  productos,
  setProductos
}: VentasProps) {

  const [productoSeleccionadoId, setProductoSeleccionadoId] =
    useState('')

  const [cantidad, setCantidad] = useState('1')

  const [detalleVenta, setDetalleVenta] =
    useState<DetalleVenta[]>([])

  const [metodoPago, setMetodoPago] = useState('efectivo')


  function agregarProducto() {
    if (productoSeleccionadoId === '') {
      alert('Seleccione un producto')
      return
    }

    const cantidadNumerica = Number(cantidad)

    if (cantidadNumerica <= 0) {
      alert('La cantidad debe ser mayor a 0')
      return
    }

    const productoSeleccionado = productos.find(
      producto => producto.id === Number(productoSeleccionadoId)
    )

    if (!productoSeleccionado) {
      alert('Producto no encontrado')
      return
    }

    if (cantidadNumerica > productoSeleccionado.stock) {
      alert(
        `Stock insuficiente. Disponible: ${productoSeleccionado.stock}`
      )
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
  
  function registrarVenta() {
    if (detalleVenta.length === 0) {
      alert('Debe agregar al menos un producto a la venta')
      return
    }

    const productosActualizados = productos.map(producto => {

      const detalleProducto = detalleVenta.find(
        detalle => detalle.productoId === producto.id
      )

      if (detalleProducto) {
        return {
          ...producto,
          stock: producto.stock - detalleProducto.cantidad
        }
      }

      return producto
    })

    setProductos(productosActualizados)

    alert(
      `Venta registrada correctamente.\nTotal: ₡${totalVenta.toLocaleString()}\nMétodo de pago: ${metodoPago}`
    )

    setDetalleVenta([])
    setProductoSeleccionadoId('')
    setCantidad('1')
    setMetodoPago('efectivo')
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
            <span>Total</span>

            <strong>
              ₡{totalVenta.toLocaleString()}
            </strong>
          </div>

          <button
            type="button"
            className="register-sale-button"
            onClick={registrarVenta}
            disabled={detalleVenta.length === 0}
          >
            Registrar venta
          </button>

        </div>

      </section>
    </>
  )
}

export default Ventas