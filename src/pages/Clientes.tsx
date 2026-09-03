import { useState } from 'react'

type Cliente = {
  id: number
  nombre: string
  identificacion: string
  correo: string
  telefono: string
}

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nombre: 'María Rodríguez',
      identificacion: '1-1111-1111',
      correo: 'maria@email.com',
      telefono: '8888-1111'
    },
    {
      id: 2,
      nombre: 'Carlos Vargas',
      identificacion: '2-2222-2222',
      correo: 'carlos@email.com',
      telefono: '8888-2222'
    }
  ])

  const [nombre, setNombre] = useState('')
  const [identificacion, setIdentificacion] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [clienteEditandoId, setClienteEditandoId] = useState<number | null>(null)

function guardarCliente(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (clienteEditandoId !== null) {
    const clientesActualizados = clientes.map(cliente => {
      if (cliente.id === clienteEditandoId) {
        return {
          ...cliente,
          nombre,
          identificacion,
          correo,
          telefono
        }
      }

      return cliente
    })

    setClientes(clientesActualizados)
    setClienteEditandoId(null)
  } else {
    const nuevoCliente: Cliente = {
      id: Date.now(),
      nombre,
      identificacion,
      correo,
      telefono
    }

    setClientes([...clientes, nuevoCliente])
  }

  setNombre('')
  setIdentificacion('')
  setCorreo('')
  setTelefono('')
}

  function eliminarCliente(id: number) {
    const clientesActualizados = clientes.filter(
      cliente => cliente.id !== id
    )

    setClientes(clientesActualizados)
  }

  function editarCliente(cliente: Cliente) {
  setClienteEditandoId(cliente.id)

  setNombre(cliente.nombre)
  setIdentificacion(cliente.identificacion)
  setCorreo(cliente.correo)
  setTelefono(cliente.telefono)
}

  return (
    <>
      <header className="page-header">
        <h1>Clientes</h1>
        <p>Administración de clientes</p>
      </header>

      <section className="customer-layout">

        <form
          className="customer-form"
          onSubmit={guardarCliente}
        >
          <h2>
          {clienteEditandoId !== null
            ? 'Editar cliente'
            : 'Nuevo cliente'}
          </h2>

          <label>
            Nombre completo
            <input
              type="text"
              value={nombre}
              onChange={event => setNombre(event.target.value)}
              required
            />
          </label>

          <label>
            Identificación
            <input
              type="text"
              value={identificacion}
              onChange={event =>
                setIdentificacion(event.target.value)
              }
              required
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              value={correo}
              onChange={event => setCorreo(event.target.value)}
              required
            />
          </label>

          <label>
            Teléfono
            <input
              type="text"
              value={telefono}
              onChange={event => setTelefono(event.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="primary-button"
            >
            {clienteEditandoId !== null
                ? 'Actualizar cliente'
                : 'Guardar cliente'}
          </button>
        </form>

        <div className="customer-list">
          <h2>Clientes registrados</h2>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Identificación</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.identificacion}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>

                  <td>
                    <button
                        className="edit-button"
                        onClick={() => editarCliente(cliente)}
                    >
                        Editar
                    </button>

                    <button
                        className="delete-button"
                        onClick={() => eliminarCliente(cliente.id)}
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

export default Clientes