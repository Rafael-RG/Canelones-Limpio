import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary/10 p-4 rounded-2xl mb-4">
            <svg fill="currentColor" className="text-primary w-16 h-16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Canelones Limpio</h1>
          <p className="text-slate-500">Panel de Administración</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Ingrese su usuario"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  <span>Ingresar</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              Sistema de gestión de residuos - Intendencia de Canelones
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            ¿Necesita ayuda? Contacte al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
}
