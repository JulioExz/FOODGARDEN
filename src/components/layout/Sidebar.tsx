import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(); // ✅ Agregado 'user'

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'dueño', 'gerente', 'empleado'] },
    { path: '/usuarios', icon: Users, label: 'Usuarios', roles: ['admin'] },
    { path: '/locales', icon: Store, label: 'Locales', roles: ['admin', 'dueño'] },
    { path: '/empleados', icon: Users, label: 'Empleados', roles: ['admin', 'dueño', 'gerente'] },
    { path: '/ventas', icon: ShoppingCart, label: 'Ventas', roles: ['admin', 'dueño', 'gerente', 'empleado'] },
    { path: '/inventario', icon: Package, label: 'Inventario', roles: ['admin', 'dueño', 'gerente'] },
    { path: '/reportes', icon: FileText, label: 'Reportes', roles: ['admin', 'dueño', 'gerente'] },
  ];

  // Filtrar menú según rol
  const menuFiltrado = menuItems.filter(item => 
    item.roles.includes(user?.rol || '')
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Food Garden</h2>
              <p className="text-xs text-gray-400">Gestión de Ventas</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-auto"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuFiltrado.map((item) => { // ✅ Cambiado a menuFiltrado
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg shadow-primary-500/50'
                  : 'hover:bg-gray-700'
              }`}
            >
              <Icon size={22} />
              {isOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full"
        >
          <LogOut size={22} />
          {isOpen && <span className="font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};