import React, { useState, useEffect } from 'react';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { Local } from '../../types';

interface ModalLocalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  local: Local | null;
  mode: 'create' | 'edit' | 'view';
}

export const ModalLocal: React.FC<ModalLocalProps> = ({
  isOpen,
  onClose,
  onSave,
  local,
  mode
}) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duenoId: '', // Solo para admin
    categoria: 'Comida Mexicana',
    estado: 'activo',
    ubicacion: '',
    telefono: '',
    horario: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (local) {
      setFormData({
        nombre: local.nombre || '',
        descripcion: local.descripcion || '',
        duenoId: local.dueñoId || '',
        categoria: local.categoria || 'Comida Mexicana',
        estado: local.estado || 'activo',
        ubicacion: local.ubicacion || '',
        telefono: local.telefono || '',
        horario: local.horario || '',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        duenoId: '',
        categoria: 'Comida Mexicana',
        estado: 'activo',
        ubicacion: '',
        telefono: '',
        horario: '',
      });
    }
  }, [local]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setLoading(true);
    
    try {
      // Preparar datos para enviar al backend
      const dataToSend: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        estado: formData.estado,
        ubicacion: formData.ubicacion,
        telefono: formData.telefono,
        horario: formData.horario,
      };

      // Solo admin puede especificar dueño
      if (user?.rol === 'admin' && formData.duenoId) {
        dataToSend.duenoId = formData.duenoId;
      }

      await onSave(dataToSend);
    } catch (error) {
      console.error('Error en submit:', error);
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';
  const isAdmin = user?.rol === 'admin';

  const categorias = [
    { value: 'Comida Mexicana', label: 'Comida Mexicana' },
    { value: 'Comida Japonesa', label: 'Comida Japonesa' },
    { value: 'Comida Italiana', label: 'Comida Italiana' },
    { value: 'Comida China', label: 'Comida China' },
    { value: 'Comida Rápida', label: 'Comida Rápida' },
    { value: 'Mariscos', label: 'Mariscos' },
    { value: 'Postres', label: 'Postres' },
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Panadería', label: 'Panadería' },
    { value: 'Otros', label: 'Otros' },
  ];

  const estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' && 'Nuevo Local'}
                {mode === 'edit' && 'Editar Local'}
                {mode === 'view' && 'Detalles del Local'}
              </h2>
              {mode === 'create' && user?.rol === 'dueño' && (
                <p className="text-sm text-gray-600 mt-1">
                  Este local será asignado a tu cuenta automáticamente
                </p>
              )}
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre del Local"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Tacos El Patrón"
                  required
                  disabled={isReadOnly}
                />

                <Select
                  label="Categoría"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  options={categorias}
                  required
                  disabled={isReadOnly}
                />
              </div>

              <Textarea
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el local y su especialidad..."
                rows={3}
                required
                disabled={isReadOnly}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ubicación"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: Local 12-A, Planta Alta"
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
                <Input
                  label="Horario"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  placeholder="Ej: 10:00 AM - 10:00 PM"
                  required
                  disabled={isReadOnly}
                />

                {(isAdmin || mode === 'view') && (
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

              {/* Solo Admin puede asignar dueño manualmente */}
              {isAdmin && mode === 'create' && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Nota para Admin:</strong> Puedes asignar este local a un dueño específico ingresando su ID.
                    Si dejas este campo vacío, deberás asignar el dueño manualmente después.
                  </p>
                  <Input
                    label="ID del Dueño (opcional)"
                    name="duenoId"
                    type="number"
                    value={formData.duenoId}
                    onChange={handleChange}
                    placeholder="Ej: 2"
                    disabled={isReadOnly}
                  />
                </div>
              )}

              {/* Mostrar información del dueño en modo ver/editar */}
              {mode !== 'create' && local?.dueñoNombre && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Dueño:</strong> {local.dueñoNombre}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                {mode === 'view' ? 'Cerrar' : 'Cancelar'}
              </Button>
              {mode !== 'view' && (
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Guardando...</span>
                    </span>
                  ) : (
                    mode === 'create' ? 'Crear Local' : 'Guardar Cambios'
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};