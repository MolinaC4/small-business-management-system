import { useEffect, useState } from 'react'
import type { Categoria } from '../types/Categoria'
import type { Producto } from '../types/Producto'
import { API_URL } from '../config/api'

type ProductosProps = {
  productos: Producto[]
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
}

function Productos({
  productos,
  setProductos
}: ProductosProps) {

  // Estados del formulario
  const [nombre, setNombre] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaId, setCategoriaId] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [precioVenta, setPrecioVenta] = useState('')
  const [stock, setStock] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')

  // Guarda el ID del producto que estamos editando.
  // Si es null, significa que estamos creando uno nuevo.
  const [productoEditandoId, setProductoEditandoId] =
    useState<number | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/categorias`)
      .then(response => response.json())
      .then(data => {
        setCategorias(data)
      })
      .catch(error => {
        console.error('Error al cargar categorías:', error)
      })
  }, [])

  function limpiarFormulario() {
    setNombre('')
    setCategoriaId('')
    setPrecioCompra('')
    setPrecioVenta('')
    setStock('')
    setStockMinimo('')
    setProductoEditandoId(null)
  }

  async function guardarProducto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Convertimos los valores del formulario a números
    const precioCompraNumero = Number(precioCompra)
    const precioVentaNumero = Number(precioVenta)
    const stockNumero = Number(stock)
    const stockMinimoNumero = Number(stockMinimo)

    // Validaciones
    if (nombre.trim() === '') {
      alert('Debe ingresar el nombre del producto.')
      return
    }

    if (categoriaId === '') {
      alert('Debe seleccionar una categoría.')
      return
    }

    if (precioCompraNumero < 0 || precioVentaNumero < 0) {
      alert('Los precios no pueden ser negativos.')
      return
    }

    if (precioVentaNumero < precioCompraNumero) {
      alert('El precio de venta no puede ser menor que el precio de compra.')
      return
    }

    if (stockNumero < 0 || stockMinimoNumero < 0) {
      alert('El stock no puede ser negativo.')
      return
    }

    if (!Number.isInteger(stockNumero) || !Number.isInteger(stockMinimoNumero)) {
      alert('El stock debe ser un número entero.')
      return
    }

    const datosProducto = {
      nombre: nombre.trim(),
      categoriaId: Number(categoriaId),
      precioCompra: precioCompraNumero,
      precioVenta: precioVentaNumero,
      stock: stockNumero,
      stockMinimo: stockMinimoNumero,
      activo: true
    }

    try {
      // EDITAR
      if (productoEditandoId !== null) {
        const response = await fetch(
          `${API_URL}/api/productos/${productoEditandoId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosProducto)
          }
        )

        if (!response.ok) {
          throw new Error('No se pudo actualizar el producto.')
        }

        // Por ahora actualizamos el estado de React después del PUT.
        setProductos(productos.map(producto =>
          producto.id === productoEditandoId
            ? {
                ...producto,
                ...datosProducto
              }
            : producto
        ))
      }

      // CREAR
      else {
        const response = await fetch(
          `${API_URL}/api/productos`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosProducto)
          }
        )

        if (!response.ok) {
          throw new Error('No se pudo guardar el producto.')
        }

        const productoCreado: Producto = await response.json()

        setProductos([...productos, productoCreado])
      }

      limpiarFormulario()
    } catch (error) {
      console.error(error)
      alert('Ocurrió un error al guardar el producto.')
    }
  }

  function editarProducto(producto: Producto) {
    setProductoEditandoId(producto.id)
    setNombre(producto.nombre)
    setCategoriaId(producto.categoriaId.toString())
    setPrecioCompra(producto.precioCompra.toString())
    setPrecioVenta(producto.precioVenta.toString())
    setStock(producto.stock.toString())
    setStockMinimo(producto.stockMinimo.toString())
  }

  async function eliminarProducto(id: number) {
    const confirmar = window.confirm(
      '¿Está seguro de que desea eliminar este producto?'
    )

    if (!confirmar) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/productos/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('No se pudo eliminar el producto.')
      }

      setProductos(
        productos.filter(producto => producto.id !== id)
      )
    } catch (error) {
      console.error(error)
      alert('Ocurrió un error al eliminar el producto.')
    }
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
            <select
              value={categoriaId}
              onChange={event => setCategoriaId(event.target.value)}
              required
            >
              <option value="">Seleccione una categoría</option>

              {categorias.map(categoria => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nombre}
                </option>
              ))}
            </select>
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

                  <td>
                    {
                      categorias.find(
                        categoria => categoria.id === producto.categoriaId
                      )?.nombre ?? 'Sin categoría'
                    }
                  </td>

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