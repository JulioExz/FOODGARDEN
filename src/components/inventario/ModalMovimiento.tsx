import React, { useState } from 'react';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { MovimientoInventario, Producto } from '../../types';

interface ModalMovimientoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movimiento: MovimientoInventario) => void;
  tipo: 'entrada' | 'salida';
  productos: Producto[];
}

export const ModalMovimiento: React.FC<ModalMovimientoProps> = ({
  isOpen,
  onClose,
  onSave,
  tipo,
  productos,
}) => {
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productoId || cantidad <= 0 || !motivo) {
      alert('Por favor completa todos los campos');
      return;
    }

    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    // Validar que no se saque más de lo que hay en stock
    if (tipo === 'salida' && cantidad > producto.stock) {
      alert(`No hay suficiente stock. Stock actual: ${producto.stock}`);
      return;
    }

    const movimiento: MovimientoInventario = {
      id: Date.now().toString(),
      productoId,
      productoNombre: producto.nombre,
      localId: producto.localId,
      tipo,
      cantidad,
      motivo,
      responsableId: '1',
      responsableNombre: 'Usuario Actual',
      fecha: new Date().toISOString(),
    };

    onSave(movimiento);
    
    // Reset form
    setProductoId('');
    setCantidad(1);
    setMotivo('');
  };

  const productoSeleccionado = productos.find(p => p.id === productoId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${
            tipo === 'entrada' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-red-500 to-rose-500'
          }`}>
            <div className="flex items-center space-x-3">
              {tipo === 'entrada' ? (
                <ArrowUpCircle size={32} className="text-white" />
              ) : (
                <ArrowDownCircle size={32} className="text-white" />
              )}
              <h2 className="text-2xl font-bold text-white">
                {tipo === 'entrada' ? 'Entrada de Inventario' : 'Salida de Inventario'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <Select
                label="Producto"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                options={[
                  { value: '', label: 'Selecciona un producto' },
                  ...productos.map(p => ({
                    value: p.id,
                    label: `${p.nombre} (Stock actual: ${p.stock})`
                  }))
                ]}
                required
              />

              {productoSeleccionado && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Stock Actual:</p>
                      <p className="text-2xl font-bold text-blue-600">{productoSeleccionado.stock}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Precio Unitario:</p>
                      <p className="text-2xl font-bold text-blue-600">${productoSeleccionado.precio}</p>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Cantidad"
                type="number"
                min="1"
                max={tipo === 'salida' && productoSeleccionado ? productoSeleccionado.stock : undefined}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                placeholder="Ingresa la cantidad"
                required
              />

              {productoSeleccionado && cantidad > 0 && (
                <div className={`p-4 rounded-lg ${
                  tipo === 'entrada' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className="text-sm text-gray-600 mb-2">Nuevo stock después del movimiento:</p>
                  <p className={`text-3xl font-bold ${
                    tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tipo === 'entrada' 
                      ? productoSeleccionado.stock + cantidad
                      : productoSeleccionado.stock - cantidad
                    }
                  </p>
                </div>
              )}

              <Textarea
                label="Motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder={tipo === 'entrada' 
                  ? 'Ej: Compra a proveedor, Devolución, etc.'
                  : 'Ej: Venta, Merma, Donación, etc.'
                }
                rows={3}
                required
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className={tipo === 'entrada' 
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                }
              >
                Registrar {tipo === 'entrada' ? 'Entrada' : 'Salida'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};