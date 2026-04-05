import React, { useState, useEffect } from 'react';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import type { Empleado } from '../../types';

interface ModalEmpleadoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (empleado: Empleado) => void;
  empleado: Empleado | null;
  mode: 'create' | 'edit' | 'view';
}

export const ModalEmpleado: React.FC<ModalEmpleadoProps> = ({
  isOpen,
  onClose,
  onSave,
  empleado,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<Empleado>>({
    nombre: '',
    email: '',
    telefono: '',
    localNombre: 'Tacos El Patrón',
    puesto: 'Cajero',
    salario: 8000,
    estado: 'activo',
  });

  useEffect(() => {
    if (empleado) {
      setFormData(empleado);
    } else {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        localNombre: 'Tacos El Patrón',
        puesto: 'Cajero',
        salario: 8000,
        estado: 'activo',
      });
    }
  }, [empleado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salario' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave({
        ...formData,
        id: empleado?.id || '',
        localId: empleado?.localId || '1',
        fechaContratacion: empleado?.fechaContratacion || new Date().toISOString().split('T')[0],
      } as Empleado);
    }
  };

  const isReadOnly = mode === 'view';

  const locales = [
    { value: 'Tacos El Patrón', label: 'Tacos El Patrón' },
    { value: 'Sushi Bar Tokio', label: 'Sushi Bar Tokio' },
    { value: 'Burger House', label: 'Burger House' },
  ];

  const puestos = [
    { value: 'Cajero', label: 'Cajero' },
    { value: 'Cocinero', label: 'Cocinero' },
    { value: 'Mesero', label: 'Mesero' },
    { value: 'Gerente', label: 'Gerente' },
    { value: 'Auxiliar', label: 'Auxiliar' },
  ];

  const estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

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
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' && 'Nuevo Empleado'}
              {mode === 'edit' && 'Editar Empleado'}
              {mode === 'view' && 'Detalles del Empleado'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <Input
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez García"
                required
                disabled={isReadOnly}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="empleado@foodgarden.com"
                  required
                  disabled={isReadOnly}
                />

                <Input
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="664-123-4567"
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Local Asignado"
                  name="localNombre"
                  value={formData.localNombre}
                  onChange={handleChange}
                  options={locales}
                  required
                  disabled={isReadOnly}
                />

                <Select
                  label="Puesto"
                  name="puesto"
                  value={formData.puesto}
                  onChange={handleChange}
                  options={puestos}
                  required
                  disabled={isReadOnly}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Salario Mensual"
                  name="salario"
                  type="number"
                  value={formData.salario}
                  onChange={handleChange}
                  placeholder="8000"
                  required
                  disabled={isReadOnly}
                />

                <Select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  options={estados}
                  required
                  disabled={isReadOnly}
                />
              </div>

              {mode === 'view' && empleado && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Fecha de contratación:</strong> {empleado.fechaContratacion}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button type="button" variant="outline" onClick={onClose}>
                {mode === 'view' ? 'Cerrar' : 'Cancelar'}
              </Button>
              {mode !== 'view' && (
                <Button type="submit" variant="primary">
                  {mode === 'create' ? 'Crear Empleado' : 'Guardar Cambios'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};