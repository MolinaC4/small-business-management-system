export type Producto = {
  id: number
  codigo: string
  nombre: string
  categoriaId: number
  categoria?: {
    id: number
    nombre: string
    prefijo: string
    activo: boolean
  }
  precioCompra: number
  precioVenta: number
  stock: number
  stockMinimo: number
  activo: boolean
}