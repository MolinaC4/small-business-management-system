function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h2>CreditFlow</h2>
        <span>Gestión de Créditos</span>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">Dashboard</button>
        <button className="nav-item">Clientes</button>
        <button className="nav-item">Créditos</button>
        <button className="nav-item">Pagos</button>
      </nav>
    </aside>
  )
}

export default Sidebar