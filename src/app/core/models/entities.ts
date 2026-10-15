// ---------- Modelos que reflejan las entidades del backend (.NET) ----------
// El backend usa camelCase por defecto en el JSON (política de ASP.NET Core).

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  passwordHash?: string;
  activo: boolean;
  fechaRegistro?: string;
  rolId: number;
  rol?: Rol;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  principioActivo?: string | null;
  laboratorio?: string | null;
  presentacion?: string | null;
  unidadMedida: string;
  precioVenta: number;
  precioCompraReferencial: number;
  stock: number;
  stockMinimo: number;
  requiereReceta: boolean;
  activo: boolean;
  categoriaId: number;
  categoria?: Categoria;
}

export interface LoteProducto {
  id: number;
  productoId: number;
  numeroLote: string;
  fechaVencimiento: string;
  stock: number;
  precioCompra: number;
  fechaIngreso: string;
  activo: boolean;
  producto?: Producto;
}

export interface Proveedor {
  id: number;
  razonSocial: string;
  ruc: string;
  nombreContacto?: string | null;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  activo: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido?: string | null;
  documento?: string | null;
  tipoDocumento?: string | null;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  activo: boolean;
}

export interface DetalleIngreso {
  id?: number;
  ingresoId?: number;
  productoId: number;
  loteProductoId: number;
  cantidad: number;
  precioCompra: number;
  subtotal?: number;
  producto?: Producto;
  loteProducto?: LoteProducto;
}

export interface Ingreso {
  id: number;
  proveedorId: number;
  usuarioId: number;
  fecha: string;
  subtotal?: number;
  impuesto?: number;
  total?: number;
  observacion?: string | null;
  proveedor?: Proveedor;
  usuario?: Usuario;
  detalles: DetalleIngreso[];
}

export interface DetalleVenta {
  id?: number;
  ventaId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number;
  producto?: Producto;
}

export interface Venta {
  id: number;
  clienteId: number;
  usuarioId: number;
  fecha: string;
  tipoComprobante: string;
  serie?: string | null;
  numero?: string | null;
  subtotal?: number;
  impuesto?: number;
  total?: number;
  estado: string;
  cliente?: Cliente;
  usuario?: Usuario;
  detalles: DetalleVenta[];
}

export interface MovimientoInventario {
  id: number;
  productoId: number;
  loteProductoId?: number | null;
  usuarioId: number;
  tipoMovimiento: string;
  cantidad: number;
  stockAnterior: number;
  stockPosterior: number;
  fecha: string;
  referencia?: string | null;
  producto?: Producto;
  loteProducto?: LoteProducto;
  usuario?: Usuario;
}

export interface Caja {
  id: number;
  usuarioId: number;
  fechaApertura: string;
  fechaCierre?: string | null;
  montoInicial: number;
  montoFinal?: number | null;
  estado: 'ABIERTA' | 'CERRADA' | string;
  usuario?: Usuario;
  movimientos?: MovimientoCaja[];
}

export interface MovimientoCaja {
  id: number;
  cajaId: number;
  usuarioId: number;
  tipoMovimiento: string;
  monto: number;
  fecha: string;
  descripcion?: string | null;
  caja?: Caja;
  usuario?: Usuario;
}
