import React from 'react';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Panel de Control General
          </h2>
          <p className="text-slate-600">
            Estado global del servicio de recolección en el departamento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">recycling</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Recolección Total</h4>
            </div>
            <p className="text-3xl font-black">1,248</p>
            <p className="text-xs text-green-600 font-medium">+15% hoy</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">eco</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Unidades Eco</h4>
            </div>
            <p className="text-3xl font-black">12</p>
            <p className="text-xs text-slate-400 font-medium">85% operativos</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Eficiencia</h4>
            </div>
            <p className="text-3xl font-black">94%</p>
            <p className="text-xs text-slate-400 font-medium">Promedio semanal</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">warning</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Alertas</h4>
            </div>
            <p className="text-3xl font-black">4</p>
            <p className="text-xs text-red-500 font-medium">Requieren atención</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-primary/10 p-6 shadow-sm overflow-hidden">
          <h3 className="font-bold text-lg mb-4">Ubicación de Flota en Tiempo Real</h3>
          <div className="h-96 rounded-lg bg-slate-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-slate-400">map</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
