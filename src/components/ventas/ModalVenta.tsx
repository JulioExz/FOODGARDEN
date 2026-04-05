import React, { useState } from 'react';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Venta, ProductoVenta } from '../../types';

interface ModalVentaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venta: Venta) => void;
}

export const ModalVenta: React.FC<ModalVentaProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [localId, setLocalId] = useState('1');
  const [empleadoId, setEmpleadoId] = useState('1');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);

  // Productos disponibles por local
  const productosDisponibles = [
    { id: '1', nombre: 'Tacos al Pastor', precio: 15, localId: '1' },
    { id: '2', nombre: 'Tacos de Asada', precio: 18, localId: '1' },
    { id: '3', nombre: 'Refresco', precio: 20, localId: '1' },
    { id: '4', nombre: 'Sushi Roll California', precio: 120, localId: '2' },
    { id: '5', nombre: 'Sushi Roll Philadelphia', precio: 140, localId: '2' },
    { id: '6', nombre: 'Hamburguesa Clásica', precio: 85, localId: '3' },
    { id: '7', nombre: 'Hamburguesa Doble', precio: 120, localId: '3' },
    { id: '8', nombre: 'Papas Fritas', precio: 35, localId: '3' },
  ];

  const locales = [
    { value: '1', label: 'Tacos El Patrón' },
    { value: '2', label: 'Sushi Bar Tokio' },
    { value: '3', label: 'Burger House' },
  ];

  const empleados = [
    { value: '1', label: 'Ana López' },
    { value: '2', label: 'Pedro Sánchez' },
    { value: '3', label: 'Laura Martínez' },
  ];

  const metodosPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
  ];

  const productosDelLocal = productosDisponibles.filter(p => p.localId === localId);

  const agregarProducto = () => {
    if (!productoSeleccionado || cantidad <= 0) return;

    const producto = productosDisponibles.find(p => p.id === productoSeleccionado);
    if (!producto) return;

    const productoExistente = productos.find(p => p.productoId === producto.id);
    
    if (productoExistente) {
      setProductos(productos.map(p =>
        p.productoId === producto.id
          ? { ...p, cantidad: p.cantidad + cantidad, subtotal: (p.cantidad + cantidad) * p.precioUnitario }
          : p
      ));
    } else {
      setProductos([
        ...productos,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad,
          precioUnitario: producto.precio,
          subtotal: cantidad * producto.precio,
        },
      ]);
    }

    setProductoSeleccionado('');
    setCantidad(1);
  };

  const eliminarProducto = (productoId: string) => {
    setProductos(productos.filter(p => p.productoId !== productoId));
  };

  const calcularTotales = () => {
    const subtotal = productos.reduce((acc, p) => acc + p.subtotal, 0);
    const impuestos = subtotal * 0.16;
    const total = subtotal + impuestos;
    return { subtotal, impuestos, total };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (productos.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    const { subtotal, impuestos, total } = calcularTotales();
    const localNombre = locales.find(l => l.value === localId)?.label || '';
    const empleadoNombre = empleados.find(e => e.value === empleadoId)?.label || '';

    const nuevaVenta: Venta = {
      id: Date.now().toString(),
      localId,
      localNombre,
      empleadoId,
      empleadoNombre,
      productos,
      subtotal,
      impuestos,
      total,
      metodoPago,
      fecha: new Date().toISOString(),
      estado: 'completada',
    };

    onSave(nuevaVenta);
  };

  const { subtotal, impuestos, total } = calcularTotales();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-2xl font-bold text-white">Nueva Venta</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Local"
                  value={localId}
                  onChange={(e) => {
                    setLocalId(e.target.value);
                    setProductos([]);
                    setProductoSeleccionado('');
                  }}
                  options={locales}
                  required
                />
                <Select
                  label="Empleado"
                  value={empleadoId}
                  onChange={(e) => setEmpleadoId(e.target.value)}
                  options={empleados}
                  required
                />
              </div>

              {/* Agregar Productos */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Productos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Select
                      label="Producto"
                      value={productoSeleccionado}
                      onChange={(e) => setProductoSeleccionado(e.target.value)}
                      options={[
                        { value: '', label: 'Selecciona un producto' },
                        ...productosDelLocal.map(p => ({
                          value: p.id,
                          label: `${p.nombre} - $${p.precio}`
                        }))
                      ]}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <Input
                      label="Cantidad"
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                    />
                    <Button
                      type="button"
                      onClick={agregarProducto}
                      className="flex items-center space-x-1 h-[42px]"
                      disabled={!productoSeleccionado}
                    >
                      <Plus size={18} />
                      <span>Agregar</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lista de Productos */}
              {productos.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos en la Orden</h3>
                  <div className="space-y-2">
                    {productos.map((prod) => (
                      <div
                        key={prod.productoId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{prod.nombre}</p>
                          <p className="text-sm text-gray-600">
                            {prod.cantidad} x ${prod.precioUnitario} = ${prod.subtotal}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => eliminarProducto(prod.productoId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Método de Pago y Totales */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      label="Método de Pago"
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value as any)}
                      options={metodosPago}
                      required
                    />
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IVA (16%):</span>
                        <span className="font-medium">${impuestos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                        <span>Total:</span>
                        <span className="text-green-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={productos.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Registrar Venta - ${total.toFixed(2)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};