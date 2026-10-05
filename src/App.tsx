import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Inventario from './pages/Inventario'
import Reportes from './pages/Reportes'
import './App.css'
import type { Producto } from './types/Producto'
import { API_URL } from './config/api'

function App() {
  const [paginaActual, setPaginaActual] = useState('dashboard')

  const [productos, setProductos] = useState<Producto[]>([]) 
  
  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
      .then(response => response.json())
      .then(data => {
        setProductos(data)
      })
      .catch(error => {
        console.error('Error al cargar productos:', error)
      })
  }, [])

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