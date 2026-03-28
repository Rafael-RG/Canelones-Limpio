import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { useDashboardStats } from '../hooks/useApi';

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando estadísticas...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-bold mb-2">Error al cargar datos</h3>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">Asegúrate de que el backend esté en ejecución en https://localhost:7001</p>
        </div>
      </AdminLayout>
    );
  }

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
            <p className="text-3xl font-black">{stats?.totalCollectionsToday || 0}</p>
            <p className="text-xs text-green-600 font-medium">
              {stats?.percentageChangeToday > 0 ? '+' : ''}{stats?.percentageChangeToday || 0}% hoy
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">eco</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Unidades Eco</h4>
            </div>
            <p className="text-3xl font-black">{stats?.totalVehicles || 0}</p>
            <p className="text-xs text-slate-400 font-medium">
              {stats?.operationalPercentage || 0}% operativos
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Eficiencia</h4>
            </div>
            <p className="text-3xl font-black">{stats?.averageEfficiency || 0}%</p>
            <p className="text-xs text-slate-400 font-medium">Promedio semanal</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">warning</span>
              <h4 className="text-xs font-bold uppercase text-slate-500">Alertas</h4>
            </div>
            <p className="text-3xl font-black">{stats?.totalAlerts || 0}</p>
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
