import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Usuario desde el store
  const currentUser = user || {
    name: 'Usuario',
    role: 'Empleado',
    avatar: null
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const notifications = [
    { id: 1, message: 'Nueva venta registrada en Local 3', time: '5 min' },
    { id: 2, message: 'Inventario bajo en Local 1', time: '15 min' },
    { id: 3, message: 'Reporte mensual generado', time: '1 hora' },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 transition-all duration-300 z-40 ${
        sidebarOpen ? 'left-64' : 'left-20'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar locales, empleados, productos..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                </div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{currentUser.name || currentUser.nombre}</p>
                <p className="text-xs text-gray-500">{currentUser.role || currentUser.rol}</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Mi Perfil
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors">
                  Configuración
                </button>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};