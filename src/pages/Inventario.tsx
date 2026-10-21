
import type { Producto } from '../types/Producto'
import { useState } from 'react'

type InventarioProps = {
  productos: Producto[]
}

function Inventario({ productos }: InventarioProps) {

  const productosActivos = productos.filter(
    producto => producto.activo
  )

  const [filtro, setFiltro] = useState('todos')

  const totalProductos = productosActivos.length

  const unidadesDisponibles = productosActivos.reduce(
    (total, producto) => total + producto.stock,
    0
  )

  const productosStockBajo = productosActivos.filter(
    producto =>
      producto.stock > 0 &&
      producto.stock <= producto.stockMinimo
  )

  const productosAgotados = productosActivos.filter(
    producto => producto.stock === 0
  )

  const productosFiltrados = productosActivos.filter(producto => {
    switch (filtro) {
      case 'bajo':
        return producto.stock > 0 &&
              producto.stock <= producto.stockMinimo

      case 'agotados':
        return producto.stock === 0

      case 'disponibles':
        return producto.stock > producto.stockMinimo

      default:
        return true
    }
  })

  function obtenerEstado(producto: Producto) {
    if (producto.stock === 0) {
      return 'Agotado'
    }

    if (producto.stock <= producto.stockMinimo) {
      return 'Stock bajo'
    }

    return 'Disponible'
  }

  return (
    <div className="inventario-page">
      <h1>Inventario</h1>
      <p>Control de existencias del negocio</p>

      <div className="inventario-resumen">

        <div className="inventario-card">
          <h3>Productos activos</h3>
          <strong>{totalProductos}</strong>
        </div>

        <div className="inventario-card">
          <h3>Unidades disponibles</h3>
          <strong>{unidadesDisponibles}</strong>
        </div>

        <div className="inventario-card">
          <h3>Productos con stock bajo</h3>
          <strong>{productosStockBajo.length}</strong>
        </div>

        <div className="inventario-card">
          <h3>Productos agotados</h3>
          <strong>{productosAgotados.length}</strong>
        </div>

      </div>

      <div className="inventario-tabla">
        <h2>Existencias por producto</h2>

        <select
          className="inventario-filtro"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        >
          <option value="todos">Todos los productos</option>
          <option value="bajo">Stock bajo</option>
          <option value="agotados">Agotados</option>
          <option value="disponibles">Disponibles</option>
        </select>

        <div className="inventario-tabla-scroll">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.stockMinimo}</td>
                  <td>
                    <span
                      className={
                        producto.stock === 0
                          ? 'estado-agotado'
                          : producto.stock <= producto.stockMinimo
                          ? 'estado-bajo'
                          : 'estado-disponible'
                      }
                    >
                      {obtenerEstado(producto)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {productosActivos.length === 0 && (
          <p className="inventario-vacio">
            No hay productos activos registrados.
          </p>
        )}
      </div>
    </div>
  )
}

export default Inventario
