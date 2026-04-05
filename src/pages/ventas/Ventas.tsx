import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Plus, Search, ShoppingCart, DollarSign, TrendingUp, Calendar, FileText, Download } from 'lucide-react';
import { ModalVenta } from '../../components/ventas/ModalVenta';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import type { Venta } from '../../types';

export const Ventas: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocal, setFilterLocal] = useState('todos');
  const [filterFecha, setFilterFecha] = useState('hoy');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determinar permisos según rol
  const isEmpleado = user?.rol === 'empleado';
  const canViewCharts = !isEmpleado; // Solo admin, dueño y gerente ven gráficas
  const canFilterByLocal = user?.rol === 'admin' || user?.rol === 'dueño';

  const [ventas, setVentas] = useState<Venta[]>([
    {
      id: '1',
      localId: '1',
      localNombre: 'Tacos El Patrón',
      empleadoId: '1',
      empleadoNombre: 'Ana López',
      productos: [
        { productoId: '1', nombre: 'Tacos al Pastor', cantidad: 3, precioUnitario: 15, subtotal: 45 },
        { productoId: '2', nombre: 'Refresco', cantidad: 2, precioUnitario: 20, subtotal: 40 },
      ],
      subtotal: 85,
      impuestos: 13.6,
      total: 98.6,
      metodoPago: 'efectivo',
      fecha: '2024-10-21T10:30:00',
      estado: 'completada',
    },
    {
      id: '2',
      localId: '2',
      localNombre: 'Sushi Bar Tokio',
      empleadoId: '3',
      empleadoNombre: 'Laura Martínez',
      productos: [
        { productoId: '3', nombre: 'Sushi Roll California', cantidad: 2, precioUnitario: 120, subtotal: 240 },
      ],
      subtotal: 240,
      impuestos: 38.4,
      total: 278.4,
      metodoPago: 'tarjeta',
      fecha: '2024-10-21T11:15:00',
      estado: 'completada',
    },
    {
      id: '3',
      localId: '3',
      localNombre: 'Burger House',
      empleadoId: '2',
      empleadoNombre: 'Pedro Sánchez',
      productos: [
        { productoId: '4', nombre: 'Hamburguesa Clásica', cantidad: 1, precioUnitario: 85, subtotal: 85 },
        { productoId: '5', nombre: 'Papas Fritas', cantidad: 1, precioUnitario: 35, subtotal: 35 },
      ],
      subtotal: 120,
      impuestos: 19.2,
      total: 139.2,
      metodoPago: 'transferencia',
      fecha: '2024-10-21T12:00:00',
      estado: 'completada',
    },
  ]);

  // Datos para gráficas
  const ventasDelDia = [
    { hora: '8:00', monto: 250 },
    { hora: '10:00', monto: 450 },
    { hora: '12:00', monto: 890 },
    { hora: '14:00', monto: 1200 },
    { hora: '16:00', monto: 780 },
    { hora: '18:00', monto: 1450 },
    { hora: '20:00', monto: 980 },
  ];

  const ventasPorLocal = [
    { local: 'Tacos', ventas: 2500 },
    { local: 'Sushi', ventas: 3200 },
    { local: 'Burger', ventas: 2800 },
    { local: 'Pizza', ventas: 1900 },
  ];

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSave = (venta: Venta) => {
    setVentas([venta, ...ventas]);
    setIsModalOpen(false);
  };

  // Empleado solo ve sus propias ventas
  const ventasFiltradas = isEmpleado 
    ? ventas.filter(v => v.empleadoId === user?.id)
    : ventas;

  const filteredVentas = ventasFiltradas.filter(venta => {
    const matchSearch = venta.localNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       venta.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocal = filterLocal === 'todos' || venta.localNombre === filterLocal;
    return matchSearch && matchLocal;
  });

  const totalVentasHoy = filteredVentas.reduce((acc, v) => acc + v.total, 0);
  const cantidadOrdenes = filteredVentas.length;
  const ticketPromedio = cantidadOrdenes > 0 ? totalVentasHoy / cantidadOrdenes : 0;

  const locales = [
    { value: 'todos', label: 'Todos los Locales' },
    { value: 'Tacos El Patrón', label: 'Tacos El Patrón' },
    { value: 'Sushi Bar Tokio', label: 'Sushi Bar Tokio' },
    { value: 'Burger House', label: 'Burger House' },
  ];

  // Función para generar corte de caja (empleado)
  const handleCorteCaja = () => {
    const reporte = `
═══════════════════════════════════════
        CORTE DE CAJA - EMPLEADO
═══════════════════════════════════════
Empleado: ${user?.nombre}
Fecha: ${new Date().toLocaleDateString('es-MX')}
Hora: ${new Date().toLocaleTimeString('es-MX')}

───────────────────────────────────────
RESUMEN DE VENTAS
───────────────────────────────────────
Total de Órdenes: ${cantidadOrdenes}
Total Efectivo: $${filteredVentas.filter(v => v.metodoPago === 'efectivo').reduce((acc, v) => acc + v.total, 0).toFixed(2)}
Total Tarjeta: $${filteredVentas.filter(v => v.metodoPago === 'tarjeta').reduce((acc, v) => acc + v.total, 0).toFixed(2)}
Total Transferencia: $${filteredVentas.filter(v => v.metodoPago === 'transferencia').reduce((acc, v) => acc + v.total, 0).toFixed(2)}

───────────────────────────────────────
TOTAL DEL TURNO: $${totalVentasHoy.toFixed(2)}
───────────────────────────────────────

═══════════════════════════════════════
    `;

    // Crear blob y descargar
    const blob = new Blob([reporte], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corte-caja-${user?.nombre}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEmpleado ? 'Mis Ventas' : 'Gestión de Ventas'}
          </h1>
          <p className="text-gray-600">
            {isEmpleado 
              ? 'Registra ventas y consulta tu turno' 
              : 'Registra y monitorea las ventas en tiempo real'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isEmpleado && (
            <Button 
              onClick={handleCorteCaja} 
              variant="outline"
              className="flex items-center space-x-2"
            >
              <FileText size={20} />
              <span>Mi Corte de Caja</span>
            </Button>
          )}
          <Button onClick={handleCreate} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Nueva Venta</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {isEmpleado ? 'Mis Ventas Hoy' : 'Ventas Hoy'}
                </p>
                <h3 className="text-3xl font-bold text-green-600">
                  ${totalVentasHoy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {isEmpleado ? 'Mis Órdenes' : 'Órdenes'}
                </p>
                <h3 className="text-3xl font-bold text-blue-600">{cantidadOrdenes}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
                <h3 className="text-3xl font-bold text-purple-600">
                  ${ticketPromedio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Solo para Admin, Dueño y Gerente */}
      {canViewCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Hora</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ventasDelDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hora" stroke="#6b7280" />
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
                    dataKey="monto"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ventas por Local</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
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
                  <Bar dataKey="ventas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder={isEmpleado ? "Buscar mis ventas..." : "Buscar por local o empleado..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} className="text-gray-400" />}
            />
            {canFilterByLocal && (
              <Select
                value={filterLocal}
                onChange={(e) => setFilterLocal(e.target.value)}
                options={locales}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEmpleado ? 'Mis Ventas del Día' : 'Historial de Ventas'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredVentas.map((venta) => (
              <div
                key={venta.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{venta.localNombre}</h4>
                        <p className="text-sm text-gray-500">
                          {!isEmpleado && `${venta.empleadoNombre} • `}
                          {new Date(venta.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-13 space-y-1">
                      {venta.productos.map((prod, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {prod.cantidad}x {prod.nombre} - ${prod.subtotal}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${venta.total.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        venta.metodoPago === 'efectivo' ? 'bg-blue-100 text-blue-700' :
                        venta.metodoPago === 'tarjeta' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {venta.metodoPago}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {venta.estado}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVentas.length === 0 && (
            <div className="py-12 text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay ventas registradas
              </h3>
              <p className="text-gray-600">
                {isEmpleado ? 'Comienza registrando tu primera venta del día' : 'Comienza registrando una nueva venta'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <ModalVenta
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};