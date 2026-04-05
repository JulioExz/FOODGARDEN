import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Locales } from './pages/locales/Locales';
import { Empleados } from './pages/empleados/Empleados';
import { Ventas } from './pages/ventas/Ventas';
import { Inventario } from './pages/inventario/Inventario';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/authStore';
import { Usuarios } from './pages/usuarios/Usuarios';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

// Componente para la ruta de login (redirige según el rol)
const LoginRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirigir según el rol
    if (user?.rol === 'empleado') {
      return <Navigate to="/ventas" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Login />;
};

// Componente para redirección inicial según rol
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Empleados van directo a ventas
  if (user?.rol === 'empleado') {
    return <Navigate to="/ventas" replace />;
  }
  
  // Otros roles van al dashboard
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const { checkAuth } = useAuthStore();
  
  // Verificar autenticación al cargar la app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<LoginRoute />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/locales"
          element={
            <ProtectedRoute>
              <Locales />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/usuarios"
          element={
           <ProtectedRoute>
              <Usuarios />
           </ProtectedRoute>
          }
        />

        <Route
          path="/empleados"
          element={
            <ProtectedRoute>
              <Empleados />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ventas"
          element={
            <ProtectedRoute>
              <Ventas />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <div className="text-2xl font-bold">Página de Reportes (Próximamente)</div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <div className="text-2xl font-bold">Página de Configuración (Próximamente)</div>
            </ProtectedRoute>
          }
        />
        
        {/* Redirección por defecto según rol */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;