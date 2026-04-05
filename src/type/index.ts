// Tipos de Usuario y Autenticación
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'dueño' | 'gerente' | 'empleado';
  localId?: string;
  avatar?: string;
  telefono?: string;
  fechaCreacion: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Tipos de Local
export interface Local {
  id: string;
  nombre: string;
  descripcion: string;
  dueñoId: string;
  dueñoNombre: string;
  categoria: string;
  estado: 'activo' | 'inactivo';
  ubicacion: string;
  telefono: string;
  horario: string;
  imagen?: string;
  fechaCreacion: string;
}

// Tipos de Empleado
export interface Empleado {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  localId: string;
  localNombre: string;
  puesto: string;
  salario: number;
  fechaContratacion: string;
  estado: 'activo' | 'inactivo';
  avatar?: string;
}

// Tipos de Producto
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  localId: string;
  stock: number;
  imagen?: string;
  estado: 'disponible' | 'agotado';
}

// Tipos de Venta
export interface Venta {
  id: string;
  localId: string;
  localNombre: string;
  empleadoId: string;
  empleadoNombre: string;
  productos: ProductoVenta[];
  subtotal: number;
  impuestos: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  fecha: string;
  estado: 'completada' | 'cancelada' | 'pendiente';
}

export interface ProductoVenta {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Tipos de Inventario
export interface MovimientoInventario {
  id: string;
  productoId: string;
  productoNombre: string;
  localId: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo: string;
  responsableId: string;
  responsableNombre: string;
  fecha: string;
}

// Tipos de Reporte
export interface ReporteVentas {
  periodo: string;
  totalVentas: number;
  cantidadOrdenes: number;
  ticketPromedio: number;
  ventasPorLocal: VentasPorLocal[];
  ventasPorDia: VentasPorDia[];
  productosMasVendidos: ProductoMasVendido[];
}

export interface VentasPorLocal {
  localId: string;
  localNombre: string;
  totalVentas: number;
  cantidadOrdenes: number;
}

export interface VentasPorDia {
  fecha: string;
  totalVentas: number;
  cantidadOrdenes: number;
}

export interface ProductoMasVendido {
  productoId: string;
  nombre: string;
  cantidadVendida: number;
  totalVentas: number;
}

// Tipos de API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}