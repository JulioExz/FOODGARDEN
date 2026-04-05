import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Package, Search, AlertTriangle, TrendingUp, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { ModalMovimiento } from '../../components/inventario/ModalMovimiento';
import type { Producto, MovimientoInventario } from '../../types';

export const Inventario: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocal, setFilterLocal] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<'entrada' | 'salida'>('entrada');

  const [productos, setProductos] = useState<Producto[]>([
    {
      id: '1',
      nombre: 'Tacos al Pastor',
      descripcion: 'Tacos de cerdo marinado',
      precio: 15,
      categoria: 'Platillos',
      localId: '1',
      stock: 45,
      estado: 'disponible',
    },
    {
      id: '2',
      nombre: 'Refresco 600ml',
      descripcion: 'Bebida carbonatada',
      precio: 20,
      categoria: 'Bebidas',
      localId: '1',
      stock: 8,
      estado: 'disponible',
    },
    {
      id: '3',
      nombre: 'Sushi Roll California',
      descripcion: 'Roll de cangrejo y aguacate',
      precio: 120,
      categoria: 'Platillos',
      localId: '2',
      stock: 25,
      estado: 'disponible',
    },
    {
      id: '4',
      nombre: 'Hamburguesa Clásica',
      descripcion: 'Carne, lechuga, tomate',
      precio: 85,
      categoria: 'Platillos',
      localId: '3',
      stock: 3,
      estado: 'disponible',
    },
  ]);

  const [movimientos] = useState<MovimientoInventario[]>([
    {
      id: '1',
      productoId: '1',
      productoNombre: 'Tacos al Pastor',
      localId: '1',
      tipo: 'entrada',
      cantidad: 50,
      motivo: 'Compra inicial',
      responsableId: '1',
      responsableNombre: 'Ana López',
      fecha: '2024-10-21T09:00:00',
    },
    {
      id: '2',
      productoId: '2',
      productoNombre: 'Refresco 600ml',
      localId: '1',
      tipo: 'salida',
      cantidad: 12,
      motivo: 'Venta',
      responsableId: '1',
      responsableNombre: 'Ana López',
      fecha: '2024-10-21T11:30:00',
    },
  ]);

  const locales = [
    { value: 'todos', label: 'Todos los Locales' },
    { value: '1', label: 'Tacos El Patrón' },
    { value: '2', label: 'Sushi Bar Tokio' },
    { value: '3', label: 'Burger House' },
  ];

  const handleOpenModal = (tipo: 'entrada' | 'salida') => {
    setTipoMovimiento(tipo);
    setIsModalOpen(true);
  };

  const handleSaveMovimiento = (movimiento: MovimientoInventario) => {
    // Actualizar el stock del producto
    setProductos(productos.map(p => {
      if (p.id === movimiento.productoId) {
        const nuevoStock = movimiento.tipo === 'entrada' 
          ? p.stock + movimiento.cantidad
          : p.stock - movimiento.cantidad;
        return { ...p, stock: nuevoStock };
      }
      return p;
    }));
    setIsModalOpen(false);
  };

  const filteredProductos = productos.filter(prod => {
    const matchSearch = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       prod.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocal = filterLocal === 'todos' || prod.localId === filterLocal;
    return matchSearch && matchLocal;
  });

  const totalProductos = productos.length;
  const productosStockBajo = productos.filter(p => p.stock <= 10).length;
  const productosAgotados = productos.filter(p => p.stock === 0).length;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'red', text: 'Agotado' };
    if (stock <= 10) return { color: 'yellow', text: 'Stock Bajo' };
    return { color: 'green', text: 'Disponible' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Inventario</h1>
          <p className="text-gray-600">Gestiona el stock de productos en tiempo real</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => handleOpenModal('entrada')}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <ArrowUpCircle size={20} />
            <span>Entrada</span>
          </Button>
          <Button
            onClick={() => handleOpenModal('salida')}
            variant="danger"
            className="flex items-center space-x-2"
          >
            <ArrowDownCircle size={20} />
            <span>Salida</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Productos</p>
                <h3 className="text-3xl font-bold text-blue-600">{totalProductos}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <h3 className="text-3xl font-bold text-yellow-600">{productosStockBajo}</h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agotados</p>
                <h3 className="text-3xl font-bold text-red-600">{productosAgotados}</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="text-red-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Inventario</p>
                <h3 className="text-3xl font-bold text-green-600">
                  ${valorInventario.toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {productosStockBajo > 0 && (
        <Card className="border-l-4 border-yellow-500 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-yellow-600" size={24} />
              <div>
                <h4 className="font-semibold text-yellow-900">Alerta de Stock Bajo</h4>
                <p className="text-sm text-yellow-700">
                  Hay {productosStockBajo} producto(s) con stock bajo. Considera hacer un pedido.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} className="text-gray-400" />}
            />
            <Select
              value={filterLocal}
              onChange={(e) => setFilterLocal(e.target.value)}
              options={locales}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.map((producto) => {
          const status = getStockStatus(producto.stock);
          return (
            <Card key={producto.id} hover>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${status.color}-100 rounded-lg flex items-center justify-center`}>
                        <Package className={`text-${status.color}-600`} size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{producto.nombre}</h3>
                        <p className="text-sm text-gray-500">{producto.categoria}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{producto.descripcion}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Precio:</span>
                      <span className="font-semibold text-gray-900">${producto.precio}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Stock:</span>
                      <span className={`font-bold text-2xl text-${status.color}-600`}>
                        {producto.stock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Valor:</span>
                      <span className="font-semibold text-gray-900">
                        ${(producto.precio * producto.stock).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-4 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status.color === 'red' ? 'bg-red-100 text-red-700' :
                      status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {status.text}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProductos.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">Intenta con otro término de búsqueda</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movimientos.slice(0, 5).map((mov) => (
              <div
                key={mov.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${
                    mov.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'
                  } rounded-lg flex items-center justify-center`}>
                    {mov.tipo === 'entrada' ? (
                      <ArrowUpCircle className="text-green-600" size={20} />
                    ) : (
                      <ArrowDownCircle className="text-red-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{mov.productoNombre}</p>
                    <p className="text-sm text-gray-600">
                      {mov.motivo} • {mov.responsableNombre}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(mov.fecha).toLocaleDateString('es-MX')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <ModalMovimiento
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMovimiento}
          tipo={tipoMovimiento}
          productos={productos}
        />
      )}
    </div>
  );
};