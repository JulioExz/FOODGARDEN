import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Search, Users, Shield, Edit, Trash2, Eye } from 'lucide-react';
import { ModalUsuario } from '../../components/usuarios/ModalUsuario';
import { api } from '../../services/api';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  estado: string;
  fechaCreacion: string;
  locales?: Array<{ id: number; nombre: string }>;
}

export const Usuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios desde el backend
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      if (response.data.success) {
        setUsuarios(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCreate = () => {
    setSelectedUsuario(null);
    setViewMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setViewMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setViewMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        alert('Usuario desactivado exitosamente');
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleSave = async (usuario: any) => {
    try {
      if (viewMode === 'create') {
        await api.post('/usuarios', usuario);
        alert('Usuario creado exitosamente');
      } else if (viewMode === 'edit') {
        await api.put(`/usuarios/${usuario.id}`, usuario);
        alert('Usuario actualizado exitosamente');
      }
      setIsModalOpen(false);
      cargarUsuarios();
    } catch (error: any) {
      console.error('Error al guardar usuario:', error);
      alert(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRol = filterRol === 'todos' || usuario.rol === filterRol;
    return matchSearch && matchRol;
  });

  const getColorByRol = (rol: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-700',
      dueño: 'bg-yellow-100 text-yellow-700',
      gerente: 'bg-green-100 text-green-700',
      empleado: 'bg-blue-100 text-blue-700',
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;
  const usuariosPorRol = (rol: string) => usuarios.filter(u => u.rol === rol).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra todos los usuarios del sistema</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <h3 className="text-3xl font-bold text-gray-900">{totalUsuarios}</h3>
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
                <h3 className="text-3xl font-bold text-green-600">{usuariosActivos}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Dueños</p>
            <h3 className="text-3xl font-bold text-yellow-600">{usuariosPorRol('dueño')}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Gerentes</p>
            <h3 className="text-3xl font-bold text-green-600">{usuariosPorRol('gerente')}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Empleados</p>
            <h3 className="text-3xl font-bold text-blue-600">{usuariosPorRol('empleado')}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} className="text-gray-400" />}
            />
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="todos">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="dueño">Dueños</option>
              <option value="gerente">Gerentes</option>
              <option value="empleado">Empleados</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rol</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Locales</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {usuario.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{usuario.nombre}</p>
                          <p className="text-sm text-gray-500">{usuario.telefono || 'Sin teléfono'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{usuario.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getColorByRol(usuario.rol)}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {usuario.locales && usuario.locales.length > 0 ? (
                        <span className="text-sm text-gray-600">
                          {usuario.locales.map(l => l.nombre).join(', ')}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Sin locales</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.estado === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Desactivar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="py-12 text-center">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron usuarios
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza creando un nuevo usuario'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <ModalUsuario
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          usuario={selectedUsuario}
          mode={viewMode}
        />
      )}
    </div>
  );
};