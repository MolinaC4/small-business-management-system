type SidebarProps = {
  paginaActual: string
  cambiarPagina: (pagina: string) => void
}

function Sidebar({
  paginaActual,
  cambiarPagina
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h2>MiNegocio</h2>
        <span>Gestión comercial</span>
      </div>

      <nav className="sidebar-nav">

        <button
          className={`nav-item ${
            paginaActual === 'dashboard' ? 'active' : ''
          }`}
          onClick={() => cambiarPagina('dashboard')}
        >
          Dashboard
        </button>

        <button
          className={`nav-item ${
            paginaActual === 'productos' ? 'active' : ''
          }`}
          onClick={() => cambiarPagina('productos')}
        >
          Productos
        </button>

        <button
          className={`nav-item ${
            paginaActual === 'clientes' ? 'active' : ''
          }`}
          onClick={() => cambiarPagina('clientes')}
        >
          Clientes
        </button>

        <button
          className={`nav-item ${
            paginaActual === 'ventas' ? 'active' : ''
          }`}
          onClick={() => cambiarPagina('ventas')}
        >
          Ventas
        </button>

        <button
          className={`nav-item ${
            paginaActual === 'inventario' ? 'active' : ''
          }`}
          onClick={() => cambiarPagina('inventario')}
        >
          Inventario
        </button>

        <button
          className={`nav-item ${
            paginaActual === 'reportes' ? 'active' : ''
          }`}
          onClick={() => cambiarPagina('reportes')}
        >
          Reportes
        </button>

      </nav>
    </aside>
  )
}

export default Sidebar