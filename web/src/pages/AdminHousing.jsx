import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useHouseholds } from '../hooks/useApi';
import QRExportDialog from '../components/QRExportDialog';

export default function AdminHousing() {
  const { households, loading, error, createHousehold, deleteHousehold } = useHouseholds();
  const [formData, setFormData] = useState({
    id: '',
    address: '',
    zone: '',
    qrCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrExport, setQrExport] = useState({ isOpen: false, code: '', name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredHouseholds = households.filter(h => 
    h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generar QR code simple si no se proporciona
      const qrCode = formData.qrCode || `QR-${Date.now()}`;
      await createHousehold({ ...formData, qrCode });
      setFormData({ id: '', address: '', zone: '', qrCode: '' });
      setShowForm(false);
    } catch (err) {
      alert(`Error al crear vivienda: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta vivienda?')) return;
    
    try {
      await deleteHousehold(id);
    } catch (err) {
      alert(`Error al eliminar vivienda: ${err.message}`);
    }
  };

  if (loading && households.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando viviendas...</p>
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
              <h2 className="text-3xl font-black">Registro de Viviendas</h2>
              <p className="text-slate-500">Administre el padrón de domicilios y genere identificadores QR.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
            >
              {showForm ? 'Cancelar' : '+ Nueva Vivienda'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {showForm && (
          <section className="bg-white border border-primary/10 rounded-xl p-6 shadow-sm max-w-2xl">
            <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_home</span>
              Nueva Vivienda
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold block mb-1">ID</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 bg-background-light px-3 py-2"
                    placeholder="Ej: ID-8829-X"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Dirección</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 bg-background-light px-3 py-2"
                    placeholder="Calle Los Álamos 452"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Zona</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 bg-background-light px-3 py-2"
                    placeholder="Zona Norte"
                    value={formData.zone}
                    onChange={(e) => setFormData(prev => ({ ...prev, zone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-1">Código QR (opcional)</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 bg-background-light px-3 py-2"
                    placeholder="Se genera automáticamente"
                    value={formData.qrCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, qrCode: e.target.value }))}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="md:col-span-2 bg-primary text-white font-bold py-3 px-8 rounded-lg justify-self-end hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Generar QR y Guardar'}
                </button>
              </form>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
            <div className="p-4 border-b border-primary/10 bg-slate-50">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="font-bold">Viviendas Registradas ({households.length})</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-slate-200">
                  <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                  <input 
                    type="text"
                    placeholder="Buscar dirección, ID o zona..."
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
                <span className="text-xs text-slate-500">{filteredHouseholds.length} resultados</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-3">Dirección</th>
                    <th className="px-6 py-3">Zona</th>
                    <th className="px-6 py-3">QR Code</th>
                    <th className="px-6 py-3">Recolecciones</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredHouseholds.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                        {households.length === 0 ? 'No hay viviendas registradas. Crea una en el formulario.' : 'No se encontraron resultados.'}
                      </td>
                    </tr>
                  ) : (
                    filteredHouseholds.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{h.address}</div>
                          <div className="text-xs text-slate-500">ID: {h.id}</div>
                        </td>
                        <td className="px-6 py-4">{h.zone}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                            {h.qrCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs">
                            <span className="text-green-600 font-bold">{h.goodRatings}</span> / 
                            <span className="text-yellow-600 font-bold"> {h.regularRatings}</span> / 
                            <span className="text-red-600 font-bold"> {h.badRatings}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Total: {h.totalCollections}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setQrExport({ isOpen: true, code: h.id, name: h.address })}
                            className="text-slate-400 mx-1 hover:text-primary transition-colors"
                            title="Exportar QR"
                          >
                            <span className="material-symbols-outlined text-base">qr_code</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(h.id)}
                            className="text-slate-400 mx-1 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </section>
      </div>

      <QRExportDialog 
        isOpen={qrExport.isOpen}
        onClose={() => setQrExport({ isOpen: false, code: '', name: '' })}
        code={qrExport.code}
        name={qrExport.name}
        type="Hogar"
      />
    </AdminLayout>
  );
}
