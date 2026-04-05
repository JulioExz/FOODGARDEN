import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Store, Edit, Trash2, Eye } from 'lucide-react';
import { ModalLocal } from '../../components/locales/ModalLocal';
import { localesService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Local } from '../../types';

export const Locales: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [locales, setLocales] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permisos según rol
  const canCreate = user?.rol === 'admin' || user?.rol === 'dueño';
  const canEdit = (local: Local) => {
    if (user?.rol === 'admin') return true;
    if (user?.rol === 'dueño') {
      // El dueño solo puede editar sus propios locales
      // Necesitarás agregar lógica para verificar si el local pertenece al dueño
      return true; // Por ahora permitimos, el backend valida
    }
    return false;
  };
  const canDelete = (local: Local) => {
    if (user?.rol === 'admin') return true;
    if (user?.rol === 'dueño') return true; // Backend valida propiedad
    return false;
  };

  // Cargar locales al montar el componente
  useEffect(() => {
    loadLocales();
  }, []);

  const loadLocales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await localesService.getAll();
      
      if (response.success) {
        setLocales(response.data);
      } else {
        setError('Error al cargar locales');
      }
    } catch (err: any) {
      console.error('Error al cargar locales:', err);
      setError(err.response?.data?.message || 'Error al cargar locales');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedLocal(null);
    setViewMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (local: Local) => {
    setSelectedLocal(local);
    setViewMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (local: Local) => {
    setSelectedLocal(local);
    setViewMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este local?')) return;

    try {
      const response = await localesService.delete(id);
      
      if (response.success) {
        await loadLocales(); // Recargar lista
        alert('Local eliminado exitosamente');
      }
    } catch (err: any) {
      console.error('Error al eliminar local:', err);
      alert(err.response?.data?.message || 'Error al eliminar local');
    }
  };

  const handleSave = async (localData: any) => {
    try {
      if (viewMode === 'create') {
        const response = await localesService.create(localData);
        if (response.success) {
          await loadLocales();
          setIsModalOpen(false);
          alert('Local creado exitosamente');
        }
      } else if (viewMode === 'edit' && selectedLocal) {
        const response = await localesService.update(selectedLocal.id, localData);
        if (response.success) {
          await loadLocales();
          setIsModalOpen(false);
          alert('Local actualizado exitosamente');
        }
      }
    } catch (err: any) {
      console.error('Error al guardar local:', err);
      alert(err.response?.data?.message || 'Error al guardar local');
    }
  };

  const filteredLocales = locales.filter(local =>
    local.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    local.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando locales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadLocales}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user?.rol === 'admin' ? 'Gestión de Locales' : 'Mis Locales'}
          </h1>
          <p className="text-gray-600">
            {user?.rol === 'admin' 
              ? 'Administra todos los locales del food garden'
              : user?.rol === 'dueño'
              ? 'Gestiona tus locales'
              : 'Locales asignados'
            }
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Nuevo Local</span>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Locales</p>
                <h3 className="text-3xl font-bold text-gray-900">{locales.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Locales Activos</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {locales.filter(l => l.estado === 'activo').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Store className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <h3 className="text-3xl font-bold text-purple-600">
                  {new Set(locales.map(l => l.categoria)).size}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Store className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Locales Inactivos</p>
                <h3 className="text-3xl font-bold text-red-600">
                  {locales.filter(l => l.estado === 'inactivo').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Store className="text-red-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} className="text-gray-400" />}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locales Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocales.map((local) => (
          <Card key={local.id} hover>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <Store className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{local.nombre}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        local.estado === 'activo' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {local.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">{local.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Categoría:</span>
                    <span className="font-medium text-gray-900">{local.categoria}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Ubicación:</span>
                    <span className="font-medium text-gray-900">{local.ubicacion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Teléfono:</span>
                    <span className="font-medium text-gray-900">{local.telefono}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleView(local)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye size={16} />
                    <span className="text-sm font-medium">Ver</span>
                  </button>
                  
                  {canEdit(local) && (
                    <button
                      onClick={() => handleEdit(local)}
                      className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit size={16} />
                      <span className="text-sm font-medium">Editar</span>
                    </button>
                  )}
                  
                  {canDelete(local) && (
                    <button
                      onClick={() => handleDelete(local.id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocales.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Store size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron locales
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando un nuevo local'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ModalLocal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          local={selectedLocal}
          mode={viewMode}
        />
      )}
    </div>
  );
};