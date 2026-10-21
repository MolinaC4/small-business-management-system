export type DetalleVentaHistorial = {
  productoId: number
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export type Venta = {
  id: number
  fecha: string
  nombreCliente: string | null
  cedulaCliente: string | null
  metodoPago: string
  total: number
  detalles: DetalleVentaHistorial[]
}