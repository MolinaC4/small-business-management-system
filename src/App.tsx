import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Ventas from './pages/Ventas'
import Inventario from './pages/Inventario'
import Reportes from './pages/Reportes'
import './App.css'

function App() {
  const [paginaActual, setPaginaActual] = useState('dashboard')

  function mostrarPagina() {
    switch (paginaActual) {
      case 'productos':
        return <Productos />

      case 'clientes':
        return <Clientes />

      case 'ventas':
        return <Ventas />

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