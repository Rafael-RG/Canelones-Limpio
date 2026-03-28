import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { MOCK_UNITS } from '../data/mockData';

export default function AdminFleet() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black">Gestión de Flota</h2>
          <p className="text-slate-500">Supervise las unidades de transporte.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {MOCK_UNITS.map((unit) => (
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
              <span 
                className={`px-3 py-1 rounded-full text-[10px] font-bold
                  ${unit.statusColor === 'green' ? 'bg-green-100 text-green-700' : ''}
                  ${unit.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${unit.statusColor === 'red' ? 'bg-red-100 text-red-700' : ''}
                `}
              >
                {unit.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-primary/10 p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Estadísticas de la Flota</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total de Unidades</p>
              <p className="text-3xl font-black text-primary">{MOCK_UNITS.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Operativas</p>
              <p className="text-3xl font-black text-green-600">
                {MOCK_UNITS.filter(u => u.statusColor === 'green').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">En Mantenimiento</p>
              <p className="text-3xl font-black text-yellow-600">
                {MOCK_UNITS.filter(u => u.statusColor === 'yellow').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
