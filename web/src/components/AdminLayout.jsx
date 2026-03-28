import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white px-10 py-3">
        <div className="flex items-center gap-4 text-primary cursor-pointer">
          <div className="size-6">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em]">Canelones Limpio</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <button className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full border-2 border-primary/20 bg-gray-300"></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden lg:flex w-72 bg-white border-r border-primary/5 p-6 flex-col gap-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary">location_city</span>
            </div>
            <div>
              <h1 className="text-sm font-bold">Intendencia Canelones</h1>
              <p className="text-primary text-xs font-medium">Gestión Ambiental</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <a href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary transition-all group">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Panel de Control</span>
            </a>
            <a href="/admin/collectors" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary transition-all group">
              <span className="material-symbols-outlined">badge</span>
              <span className="text-sm font-medium">Gestión de Personal</span>
            </a>
            <a href="/admin/housing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary transition-all group">
              <span className="material-symbols-outlined">home</span>
              <span className="text-sm font-medium">Censo Viviendas</span>
            </a>
            <a href="/admin/fleet" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-primary/5 hover:text-primary transition-all group">
              <span className="material-symbols-outlined">local_shipping</span>
              <span className="text-sm font-medium">Control de Flota</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto bg-background-light p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
