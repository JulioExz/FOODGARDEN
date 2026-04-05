import React, { useState, useEffect } from 'react';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { X, User, Mail, Phone, Shield, Key } from 'lucide-react';

interface ModalUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (usuario: any) => void;
  usuario: any | null;
  mode: 'create' | 'edit' | 'view';
}

export const ModalUsuario: React.FC<ModalUsuarioProps> = ({
  isOpen,
  onClose,
  onSave,
  usuario,
  mode
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'empleado',
    telefono: '',
    estado: 'activo',
  });

  useEffect(() => {
    if (usuario && mode !== 'create') {
      setFormData({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '',
        rol: usuario.rol || 'empleado',
        telefono: usuario.telefono || '',
        estado: usuario.estado || 'activo',
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'empleado',
        telefono: '',
        estado: 'activo',
      });
    }
  }, [usuario, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      const dataToSend = mode === 'edit' 
        ? { id: usuario.id, ...formData, password: formData.password || undefined }
        : formData;
      onSave(dataToSend);
    }
  };

  const isReadOnly = mode === 'view';

  const roles = [
    { value: 'dueño', label: 'Dueño' },
    { value: 'gerente', label: 'Gerente' },
    { value: 'empleado', label: 'Empleado' },
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
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="flex items-center space-x-3">
              <User size={28} className="text-white" />
              <h2 className="text-2xl font-bold text-white">
                {mode === 'create' && 'Nuevo Usuario'}
                {mode === 'edit' && 'Editar Usuario'}
                {mode === 'view' && 'Detalles del Usuario'}
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
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <Input
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez García"
                icon={<User size={20} className="text-gray-400" />}
                required
                disabled={isReadOnly}
              />

              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="usuario@foodgarden.com"
                icon={<Mail size={20} className="text-gray-400" />}
                required
                disabled={isReadOnly}
              />

              {(mode === 'create' || mode === 'edit') && (
                <Input
                  label={mode === 'create' ? 'Contraseña' : 'Nueva Contraseña (dejar vacío para mantener)'}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  icon={<Key size={20} className="text-gray-400" />}
                  required={mode === 'create'}
                  disabled={isReadOnly}
                />
              )}

              <Input
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="664-123-4567"
                icon={<Phone size={20} className="text-gray-400" />}
                disabled={isReadOnly}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  options={roles}
                  required
                  disabled={isReadOnly}
                />

                {mode === 'edit' && (
                  <Select
                    label="Estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    options={estados}
                    required
                    disabled={isReadOnly}
                  />
                )}
              </div>

              {/* Información del rol */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Permisos del rol {formData.rol}:</p>
                    {formData.rol === 'dueño' && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Gestionar sus locales</li>
                        <li>• Ver ventas e inventario de sus locales</li>
                        <li>• Generar reportes de sus locales</li>
                      </ul>
                    )}
                    {formData.rol === 'gerente' && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Administrar empleados del local</li>
                        <li>• Registrar ventas y controlar inventario</li>
                        <li>• Ver reportes del local</li>
                      </ul>
                    )}
                    {formData.rol === 'empleado' && (
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Registrar ventas del local</li>
                        <li>• Consultar inventario</li>
                        <li>• Generar reporte de turno</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {mode === 'view' && usuario && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Fecha de creación:</strong>{' '}
                    {new Date(usuario.fechaCreacion).toLocaleDateString('es-MX')}
                  </p>
                  {usuario.locales && usuario.locales.length > 0 && (
                    <p className="text-sm text-gray-600">
                      <strong>Locales asignados:</strong>{' '}
                      {usuario.locales.map((l: any) => l.nombre).join(', ')}
                    </p>
                  )}
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
                  {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};