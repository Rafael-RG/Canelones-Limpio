import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useVehicles } from '../hooks/useApi';

export default function AdminFleet() {
  const { vehicles, loading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [formData, setFormData] = useState({
    id: '',
    type: 'Carga Trasera',
    capacity: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createVehicle(formData);
      setFormData({ id: '', type: 'Carga Trasera', capacity: '' });
      setShowForm(false);
    } catch (err) {
      alert(`Error al crear vehículo: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (vehicle) => {
    const statusOptions = [
      { status: 'Operativo', color: 'green' },
      { status: 'Mantenimiento', color: 'yellow' },
      { status: 'Fuera de Servicio', color: 'red' }
    ];
    const currentIndex = statusOptions.findIndex(opt => opt.status === vehicle.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    try {
      await updateVehicle(vehicle.id, { 
        status: nextStatus.status, 
        statusColor: nextStatus.color 
      });
    } catch (err) {
      alert(`Error al actualizar estado: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
    
    try {
      await deleteVehicle(id);
    } catch (err) {
      alert(`Error al eliminar vehículo: ${err.message}`);
    }
  };

  if (loading && vehicles.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando vehículos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black">Gestión de Flota</h2>
              <p className="text-slate-500">Supervise las unidades de transporte.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Vehículo'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {showForm && (
          <section className="bg-white border border-primary/10 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Registrar Nuevo Vehículo</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">ID del Vehículo</label>
                <input 
                  className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                  placeholder="Ej: MT-1024"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Tipo</label>
                <select 
                  className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option>Carga Trasera</option>
                  <option>Carga Lateral</option>
                  <option>Utilitario Eléctrico</option>
                  <option>Compactador</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Capacidad</label>
                <input 
                  className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                  placeholder="Ej: 15.0 t"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-3 bg-primary text-white font-bold py-3 px-8 rounded-lg justify-self-end hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
              </button>
            </form>
          </section>
        )}

        <div className="bg-white rounded-xl border border-primary/10 p-4 shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
              <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
              <input 
                type="text"
                placeholder="Buscar vehículo, tipo o estado..."
                className="flex-1 border-none outline-none text-sm bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
            <span className="text-xs text-slate-500">{filteredVehicles.length} resultados</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-xl border border-primary/10 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">local_shipping</span>
              <p className="text-slate-400">{vehicles.length === 0 ? 'No hay vehículos registrados. Crea uno arriba.' : 'No se encontraron resultados.'}</p>
            </div>
          ) : (
            filteredVehicles.map((unit) => (
              <div 
                key={unit.id}
                className="p-4 bg-white rounded-xl border border-primary/10 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-4xl text-primary/40">
                    local_shipping
                  </span>
                  <div>
                    <p className="font-bold text-lg">{unit.id}</p>
                    <p className="text-xs text-slate-500">{unit.type}</p>
                    <p className="text-sm text-slate-600 mt-1">Capacidad: {unit.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold
                      ${unit.statusColor === 'green' ? 'bg-green-100 text-green-700' : ''}
                      ${unit.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${unit.statusColor === 'red' ? 'bg-red-100 text-red-700' : ''}
                    `}
                  >
                    {unit.status}
                  </span>
                  <button 
                    onClick={() => handleStatusChange(unit)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
                    title="Cambiar estado"
                  >
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(unit.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-primary/10 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Estadísticas de la Flota</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total de Unidades</p>
              <p className="text-3xl font-black text-primary">{vehicles.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Operativas</p>
              <p className="text-3xl font-black text-green-600">
                {vehicles.filter(u => u.statusColor === 'green').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">En Mantenimiento</p>
              <p className="text-3xl font-black text-yellow-600">
                {vehicles.filter(u => u.statusColor === 'yellow').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
