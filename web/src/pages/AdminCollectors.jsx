import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { MOCK_COLLECTORS } from '../data/mockData';

export default function AdminCollectors() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black">Administración de Recolectores</h2>
          <p className="text-slate-500">Gestione el personal operativo y genere credenciales QR.</p>
        </div>

        <section className="bg-white border border-primary/10 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span>
            Registrar Nuevo
          </h3>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Nombre Completo</label>
              <input 
                className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Documento ID</label>
              <input 
                className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3"
                placeholder="1.234.567-8"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Turno</label>
              <select className="rounded-lg border-primary/20 bg-primary/5 h-12 px-3">
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
              </select>
            </div>
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg md:col-span-3 justify-self-end hover:bg-primary/90 transition-colors">
              Guardar Registro
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
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
              {MOCK_COLLECTORS.map((c) => (
                <tr key={c.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {c.id}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{c.doc}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                      {c.shift}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`size-2 rounded-full ${c.status === 'Activo' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs">{c.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">qr_code_2</span>
                      QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  );
}
