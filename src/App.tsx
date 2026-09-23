import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Inventario from './pages/Inventario'
import Reportes from './pages/Reportes'
import './App.css'
import type { Producto } from './types/Producto'

function App() {
  const [paginaActual, setPaginaActual] = useState('dashboard')

  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      codigo: 'PROD-001',
      nombre: 'Camisa básica',
      categoria: 'Ropa',
      precioCompra: 4500,
      precioVenta: 7500,
      stock: 12,
      stockMinimo: 5,
      activo: true
    },
    {
      id: 2,
      codigo: 'PROD-002',
      nombre: 'Pulsera artesanal',
      categoria: 'Accesorios',
      precioCompra: 1200,
      precioVenta: 2500,
      stock: 3,
      stockMinimo: 5,
      activo: true
    }
  ])

  function mostrarPagina() {
    switch (paginaActual) {
      case 'productos':
        return (
          <Productos
            productos={productos}
            setProductos={setProductos}
          />
        )

      case 'clientes':
        return <Clientes />

      case 'ventas':
        return (
          <Ventas
            productos={productos}
            setProductos={setProductos}
          />
        )

      case 'inventario':
        return <Inventario />

      case 'reportes':
        return <Reportes />

      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar
        paginaActual={paginaActual}
        cambiarPagina={setPaginaActual}
      />

      <main className="main-content">
        {mostrarPagina()}
      </main>
    </div>
  )
}

export default App