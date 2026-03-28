import React from 'react';
import AdminLayout from '../components/AdminLayout';

export default function AdminHousing() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black">Registro de Viviendas</h2>
          <p className="text-slate-500">Administre el padrón de domicilios y genere identificadores QR.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_home</span>
                Nueva Vivienda
              </h3>
              <div className="space-y-4">
                <input 
                  className="w-full rounded-lg border-slate-200 bg-background-light px-3 py-2"
                  placeholder="Calle"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    className="rounded-lg border-slate-200 bg-background-light px-3 py-2"
                    placeholder="Número"
                  />
                  <input 
                    className="rounded-lg border-slate-200 bg-background-light px-3 py-2"
                    placeholder="Apto"
                  />
                </div>
                <select className="w-full rounded-lg border-slate-200 bg-background-light px-3 py-2">
                  <option>Municipio A</option>
                  <option>Municipio B</option>
                  <option>Municipio C</option>
                </select>
                <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Generar QR
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2 overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
            <div className="p-4 border-b border-primary/10 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold">Viviendas Registradas</h3>
              <button className="text-primary text-sm font-semibold hover:underline">
                Filtrar
              </button>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3">Dirección</th>
                  <th className="px-6 py-3">Zona</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">Av. Rivera 2345</div>
                    <div className="text-xs text-slate-500">Apto 401</div>
                  </td>
                  <td className="px-6 py-4">Municipio CH</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 mx-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">print</span>
                    </button>
                    <button className="text-slate-400 mx-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">Calle Los Álamos 452</div>
                    <div className="text-xs text-slate-500">Casa</div>
                  </td>
                  <td className="px-6 py-4">Municipio B</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 mx-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">print</span>
                    </button>
                    <button className="text-slate-400 mx-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
