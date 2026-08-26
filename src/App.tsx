import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import './App.css'

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Resumen general del sistema de créditos</p>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard title="Clientes" value={125} />
          <StatCard title="Créditos activos" value={48} />
          <StatCard title="Pendientes" value={12} />
          <StatCard title="Aprobados este mes" value={21} />
        </section>
      </main>
    </div>
  )
}

export default App