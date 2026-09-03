import StatCard from '../components/StatCard'

function Dashboard() {
  return (
    <>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen general del sistema de créditos</p>
      </header>

      <section className="stats-grid">
        <StatCard title="Ventas de hoy" value={185000} />
        <StatCard title="Productos" value={76} />
        <StatCard title="Clientes" value={125} />
        <StatCard title="Bajo stock" value={8} />
      </section>
    </>
  )
}

export default Dashboard