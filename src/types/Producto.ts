export type Producto = {
  id: number
  codigo: string
  nombre: string
  categoria: string
  precioCompra: number
  precioVenta: number
  stock: number
  stockMinimo: number
  activo: boolean
}