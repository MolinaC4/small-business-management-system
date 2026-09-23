import { useState } from 'react'
import type { Producto } from '../types/Producto'

type ProductosProps = {
  productos: Producto[]
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
}

function Productos({
  productos,
  setProductos
}: ProductosProps) {

  // Estados del formulario
  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [precioVenta, setPrecioVenta] = useState('')
  const [stock, setStock] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')

  // Guarda el ID del producto que estamos editando.
  // Si es null, significa que estamos creando uno nuevo.
  const [productoEditandoId, setProductoEditandoId] =
    useState<number | null>(null)

  function limpiarFormulario() {
    setCodigo('')
    setNombre('')
    setCategoria('')
    setPrecioCompra('')
    setPrecioVenta('')
    setStock('')
    setStockMinimo('')
    setProductoEditandoId(null)
  }

  function guardarProducto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Si hay un ID guardado, estamos editando.
    if (productoEditandoId !== null) {

      const productosActualizados = productos.map(producto => {

        if (producto.id === productoEditandoId) {
          return {
            ...producto,
            codigo,
            nombre,
            categoria,
            precioCompra: Number(precioCompra),
            precioVenta: Number(precioVenta),
            stock: Number(stock),
            stockMinimo: Number(stockMinimo)
          }
        }

        return producto
      })

      setProductos(productosActualizados)

    } else {

      // Si no estamos editando, creamos un producto nuevo.
      const nuevoProducto: Producto = {
        id: Date.now(),
        codigo,
        nombre,
        categoria,
        precioCompra: Number(precioCompra),
        precioVenta: Number(precioVenta),
        stock: Number(stock),
        stockMinimo: Number(stockMinimo),
        activo: true
      }

      setProductos([...productos, nuevoProducto])
    }

    limpiarFormulario()
  }

  function editarProducto(producto: Producto) {
    setProductoEditandoId(producto.id)

    setCodigo(producto.codigo)
    setNombre(producto.nombre)
    setCategoria(producto.categoria)
    setPrecioCompra(producto.precioCompra.toString())
    setPrecioVenta(producto.precioVenta.toString())
    setStock(producto.stock.toString())
    setStockMinimo(producto.stockMinimo.toString())
  }

  function eliminarProducto(id: number) {

    const productosActualizados = productos.filter(
      producto => producto.id !== id
    )

    setProductos(productosActualizados)
  }

  return (
    <>
      <header className="page-header">
        <h1>Productos</h1>
        <p>Administración de productos del negocio</p>
      </header>

      <section className="product-layout">

        <form
          className="product-form"
          onSubmit={guardarProducto}
        >

          <h2>
            {productoEditandoId !== null
              ? 'Editar producto'
              : 'Nuevo producto'}
          </h2>

          <label>
            Código
            <input
              type="text"
              value={codigo}
              onChange={event => setCodigo(event.target.value)}
              required
            />
          </label>

          <label>
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={event => setNombre(event.target.value)}
              required
            />
          </label>

          <label>
            Categoría
            <input
              type="text"
              value={categoria}
              onChange={event => setCategoria(event.target.value)}
              required
            />
          </label>

          <label>
            Precio de compra
            <input
              type="number"
              min="0"
              value={precioCompra}
              onChange={event => setPrecioCompra(event.target.value)}
              required
            />
          </label>

          <label>
            Precio de venta
            <input
              type="number"
              min="0"
              value={precioVenta}
              onChange={event => setPrecioVenta(event.target.value)}
              required
            />
          </label>

          <label>
            Stock
            <input
              type="number"
              min="0"
              value={stock}
              onChange={event => setStock(event.target.value)}
              required
            />
          </label>

          <label>
            Stock mínimo
            <input
              type="number"
              min="0"
              value={stockMinimo}
              onChange={event => setStockMinimo(event.target.value)}
              required
            />
          </label>

          <div className="form-actions">

            <button
              type="submit"
              className="primary-button"
            >
              {productoEditandoId !== null
                ? 'Actualizar producto'
                : 'Guardar producto'}
            </button>

            {productoEditandoId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}

          </div>

        </form>

        <div className="product-list">

          <h2>Productos registrados</h2>

          <table>

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio venta</th>
                <th>Stock</th>
                <th>Estado stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {productos.map(producto => (

                <tr key={producto.id}>

                  <td>{producto.codigo}</td>

                  <td>{producto.nombre}</td>

                  <td>{producto.categoria}</td>

                  <td>
                    ₡{producto.precioVenta.toLocaleString()}
                  </td>

                  <td>{producto.stock}</td>

                  <td>
                    {producto.stock <= producto.stockMinimo
                      ? 'Bajo'
                      : 'Disponible'}
                  </td>

                  <td className="actions">

                    <button
                      className="edit-button"
                      onClick={() => editarProducto(producto)}
                    >
                      Editar
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      Eliminar
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>
    </>
  )
}

export default Productos