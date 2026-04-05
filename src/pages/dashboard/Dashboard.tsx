import React from 'react';
import { StatCard } from '../../components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DollarSign, ShoppingCart, Store, TrendingUp, Users, Package } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  // Datos de ejemplo
  const ventasSemanales = [
    { dia: 'Lun', ventas: 4500 },
    { dia: 'Mar', ventas: 5200 },
    { dia: 'Mié', ventas: 4800 },
    { dia: 'Jue', ventas: 6100 },
    { dia: 'Vie', ventas: 7500 },
    { dia: 'Sáb', ventas: 8900 },
    { dia: 'Dom', ventas: 7200 },
  ];

  const ventasPorLocal = [
    { local: 'Local 1', ventas: 12500 },
    { local: 'Local 2', ventas: 9800 },
    { local: 'Local 3', ventas: 15200 },
    { local: 'Local 4', ventas: 8600 },
    { local: 'Local 5', ventas: 11400 },
  ];

  const productosPopulares = [
    { nombre: 'Hamburguesa', valor: 35, color: '#ef4444' },
    { nombre: 'Pizza', valor: 28, color: '#f59e0b' },
    { nombre: 'Tacos', valor: 22, color: '#10b981' },
    { nombre: 'Sushi', valor: 15, color: '#3b82f6' },
  ];

  const ventasRecientes = [
    { id: 1, local: 'Local 3', producto: 'Hamburguesa Clásica', monto: 150, tiempo: '5 min' },
    { id: 2, local: 'Local 1', producto: 'Pizza Margarita', monto: 220, tiempo: '12 min' },
    { id: 3, local: 'Local 5', producto: 'Tacos al Pastor', monto: 95, tiempo: '18 min' },
    { id: 4, local: 'Local 2', producto: 'Sushi Roll', monto: 280, tiempo: '25 min' },
    { id: 5, local: 'Local 3', producto: 'Ensalada César', monto: 130, tiempo: '32 min' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de control del Food Garden</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Totales Hoy"
          value="$44,280"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Órdenes Procesadas"
          value="284"
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Locales Activos"
          value="12"
          icon={Store}
          trend={{ value: 0, isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Productos Vendidos"
          value="1,247"
          icon={Package}
          trend={{ value: 15.3, isPositive: true }}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Semanales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas de la Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasSemanales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="dia" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas por Local */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Local</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasPorLocal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="local" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="ventas" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productos Populares */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productosPopulares}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, valor }) => `${nombre} ${valor}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {productosPopulares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas Recientes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ventasRecientes.map((venta) => (
                <div
                  key={venta.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{venta.producto}</p>
                      <p className="text-sm text-gray-600">{venta.local}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${venta.monto}</p>
                    <p className="text-xs text-gray-500">hace {venta.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Store size={24} className="mb-2" />
              <p className="font-medium">Nuevo Local</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Users size={24} className="mb-2" />
              <p className="font-medium">Agregar Empleado</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Package size={24} className="mb-2" />
              <p className="font-medium">Inventario</p>
            </button>
            <button className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all">
              <TrendingUp size={24} className="mb-2" />
              <p className="font-medium">Ver Reportes</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};