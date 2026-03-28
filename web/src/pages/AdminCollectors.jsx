import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useCollectors } from '../hooks/useApi';
import QRExportDialog from '../components/QRExportDialog';

export default function AdminCollectors() {
  const { collectors, loading, error, createCollector, deleteCollector, updateCollector } = useCollectors();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    document: '',
    shift: 'Mañana',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [qrExport, setQrExport] = useState({ isOpen: false, code: '', name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredCollectors = collectors.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      await createCollector(formData);
      setFormData({ id: '', name: '', document: '', shift: 'Mañana' });
      setSuccessMessage('Recolector creado exitosamente');
      setShowForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(`Error al crear recolector: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este recolector?')) return;
    
    try {
      await deleteCollector(id);
    } catch (err) {
      alert(`Error al eliminar recolector: ${err.message}`);
    }
  };

  const handleStatusToggle = async (collector) => {
    const newStatus = collector.status === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await updateCollector(collector.id, { status: newStatus });
    } catch (err) {
      alert(`Error al actualizar estado: ${err.message}`);
    }
  };

  if (loading && collectors.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando recolectores...</p>
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
              <h2 className="text-3xl font-black">Administración de Recolectores</h2>
              <p className="text-slate-500">Gestione el personal operativo y genere credenciales QR.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Recolector'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-600 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {showForm && (
          <section className="bg-white border border-primary/10 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span>
            Registrar Nuevo
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">ID</label>
              <input 
                className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                placeholder="Ej: RM"
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Nombre Completo</label>
              <input 
                className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                placeholder="Ej: Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Documento ID</label>
              <input 
                className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                placeholder="1.234.567-8"
                value={formData.document}
                onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Turno</label>
              <select 
                className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                value={formData.shift}
                onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
              >
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white font-bold py-3 px-8 rounded-lg md:col-span-4 justify-self-end hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
            </button>
          </form>
        </section>
        )}

        <section className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
          <div className="p-4 border-b border-primary/10 bg-slate-50">
            <div className="flex items-center gap-3 max-w-md">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-slate-200">
                <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                <input 
                  type="text"
                  placeholder="Buscar recolector, ID o documento..."
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
              <span className="text-xs text-slate-500">{filteredCollectors.length} resultados</span>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Recolector</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Turno</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredCollectors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    {collectors.length === 0 ? 'No hay recolectores registrados. Crea uno arriba.' : 'No se encontraron resultados.'}
                  </td>
                </tr>
              ) : (
                filteredCollectors.map((c) => (
                  <tr key={c.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {c.id}
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{c.document}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                        {c.shift}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`size-2 rounded-full ${c.status === 'Activo' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <span className="text-xs">{c.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => setQrExport({ isOpen: true, code: c.id, name: c.name })}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                        title="Exportar QR"
                      >
                        <span className="material-symbols-outlined text-sm align-middle">qr_code</span>
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(c)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
                        title="Cambiar estado"
                      >
                        <span className="material-symbols-outlined text-sm align-middle">swap_horiz</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-sm align-middle">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>

      <QRExportDialog 
        isOpen={qrExport.isOpen}
        onClose={() => setQrExport({ isOpen: false, code: '', name: '' })}
        code={qrExport.code}
        name={qrExport.name}
        type="Recolector"
      />
    </AdminLayout>
  );
}
