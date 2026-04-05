import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Users, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import { ModalEmpleado } from '../../components/empleados/ModalEmpleado';
import { empleadosService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { Empleado } from '../../types';

export const Empleados: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permisos según rol
  const canCreate = user?.rol === 'admin' || user?.rol === 'dueño' || user?.rol === 'gerente';
  const canEdit = (empleado: Empleado) => {
    if (user?.rol === 'admin') return true;
    if (user?.rol === 'dueño' || user?.rol === 'gerente') return true; // Backend valida
    return false;
  };
  const canDelete = (empleado: Empleado) => {
    if (user?.rol === 'admin') return true;
    if (user?.rol === 'dueño') return true; // Backend valida
    return false;
  };

  // Cargar empleados
  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await empleadosService.getAll();
      
      if (response.success) {
        setEmpleados(response.data);
      } else {
        setError('Error al cargar empleados');
      }
    } catch (err: any) {
      console.error('Error al cargar empleados:', err);
      setError(err.response?.data?.message || 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEmpleado(null);
    setViewMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setViewMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setViewMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;

    try {
      const response = await empleadosService.delete(id);
      
      if (response.success) {
        await loadEmpleados();
        alert('Empleado eliminado exitosamente');
      }
    } catch (err: any) {
      console.error('Error al eliminar empleado:', err);
      alert(err.response?.data?.message || 'Error al eliminar empleado');
    }
  };

  const handleSave = async (empleadoData: any) => {
    try {
      if (viewMode === 'create') {
        const response = await empleadosService.create(empleadoData);
        if (response.success) {
          await loadEmpleados();
          setIsModalOpen(false);
          alert('Empleado creado exitosamente');
        }
      } else if (viewMode === 'edit' && selectedEmpleado) {
        const response = await empleadosService.update(selectedEmpleado.id, empleadoData);
        if (response.success) {
          await loadEmpleados();
          setIsModalOpen(false);
          alert('Empleado actualizado exitosamente');
        }
      }
    } catch (err: any) {
      console.error('Error al guardar empleado:', err);
      alert(err.response?.data?.message || 'Error al guardar empleado');
    }
  };

  const filteredEmpleados = empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.puesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.localNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadEmpleados}>Reintentar</Button>
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
            {user?.rol === 'admin' ? 'Gestión de Empleados' : 'Empleados'}
          </h1>
          <p className="text-gray-600">
            {user?.rol === 'admin' 
              ? 'Administra el personal de todos los locales'
              : user?.rol === 'dueño'
              ? 'Gestiona empleados de tus locales'
              : 'Personal del local'
            }
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Nuevo Empleado</span>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Empleados</p>
                <h3 className="text-3xl font-bold text-gray-900">{empleados.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <h3 className="text-3xl font-bold text-green-600">
                  {empleados.filter(e => e.estado === 'activo').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salario Promedio</p>
                <h3 className="text-3xl font-bold text-purple-600">
                  ${empleados.length > 0 ? (empleados.reduce((acc, e) => acc + e.salario, 0) / empleados.length).toFixed(0) : '0'}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivos</p>
                <h3 className="text-3xl font-bold text-red-600">
                  {empleados.filter(e => e.estado === 'inactivo').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="text-red-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar por nombre, puesto o local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} className="text-gray-400" />}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Empleado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contacto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Local</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Puesto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Salario</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpleados.map((empleado) => (
                  <tr key={empleado.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {empleado.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{empleado.nombre}</p>
                          <p className="text-sm text-gray-500">{empleado.fechaContratacion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail size={14} />
                          <span>{empleado.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{empleado.telefono}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">{empleado.localNombre}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {empleado.puesto}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">${empleado.salario.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        empleado.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {empleado.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(empleado)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {canEdit(empleado) && (
                          <button
                            onClick={() => handleEdit(empleado)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        
                        {canDelete(empleado) && (
                          <button
                            onClick={() => handleDelete(empleado.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmpleados.length === 0 && (
            <div className="py-12 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron empleados
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando un nuevo empleado'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <ModalEmpleado
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          empleado={selectedEmpleado}
          mode={viewMode}
        />
      )}
    </div>
  );
};