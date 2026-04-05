import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Phone, Shield, Calendar, Key, Save } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

export const Perfil: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put(`/auth/profile`, formData);
      
      if (response.data.success) {
        setUser({ ...user, ...formData } as any);
        setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
        setIsEditing(false);
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al actualizar perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(`/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al cambiar contraseña' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Administra tu información personal y configuración de cuenta</p>
      </div>

      {/* Mensaje de éxito/error */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Perfil */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={48} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.nombre}</h2>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Shield size={16} className="mr-1" />
                {user?.rol}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Personal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Información Personal</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      nombre: user?.nombre || '',
                      email: user?.email || '',
                      telefono: user?.telefono || '',
                    });
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Nombre Completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                icon={<User size={20} className="text-gray-400" />}
                disabled={!isEditing}
                required
              />

              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                icon={<Mail size={20} className="text-gray-400" />}
                disabled={!isEditing}
                required
              />

              <Input
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                icon={<Phone size={20} className="text-gray-400" />}
                disabled={!isEditing}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <Shield size={20} className="text-gray-600" />
                    <span className="text-gray-900 capitalize">{user?.rol}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miembro desde</label>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <Calendar size={20} className="text-gray-600" />
                    <span className="text-gray-900">
                      {user?.fechaCreacion ? new Date(user.fechaCreacion).toLocaleDateString('es-MX') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    isLoading={loading}
                    className="flex items-center space-x-2"
                  >
                    <Save size={20} />
                    <span>Guardar Cambios</span>
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Cambiar Contraseña */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Seguridad</CardTitle>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center space-x-2"
              >
                <Key size={16} />
                <span>Cambiar Contraseña</span>
              </Button>
            )}
          </div>
        </CardHeader>
        {isChangingPassword && (
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
              <Input
                label="Contraseña Actual"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                icon={<Key size={20} className="text-gray-400" />}
                required
              />

              <Input
                label="Nueva Contraseña"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                icon={<Key size={20} className="text-gray-400" />}
                required
              />

              <Input
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                icon={<Key size={20} className="text-gray-400" />}
                required
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                  className="flex items-center space-x-2"
                >
                  <Key size={20} />
                  <span>Cambiar Contraseña</span>
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};