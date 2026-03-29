import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';

export default function QRExportDialog({ isOpen, onClose, code, name, type = 'Recolector' }) {
  const qrRef = useRef(null);

  const handleExport = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 3, // Mayor resolución para impresión
      });

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QR-${type}-${code}.png`;
        link.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      alert('Error al exportar QR: ' + err.message);
    }
  };

  if (!isOpen) return null;

  const isHogar = type === 'Hogar';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Exportar Credencial QR</h3>
            <p className="text-sm text-slate-500 mt-1">{type}: {name}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Área de QR para exportar */}
        <div 
          ref={qrRef} 
          style={{
            width: '380px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Barra superior verde */}
          <div style={{ background: '#15803d', height: '10px', width: '100%' }}></div>
          
          {/* Header con logo y título */}
          <div style={{ padding: '24px 20px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '10px' }}>
                <svg viewBox="0 0 48 48" width="32" height="32" fill="#15803d" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#15803d', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Canelones</h2>
                <p style={{ margin: 0, color: '#15803d', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>Limpio</p>
              </div>
            </div>
          </div>

          {/* Etiqueta de tipo */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ background: '#15803d', color: 'white', display: 'inline-block', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>
              {type.toUpperCase()}
            </div>
            <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {isHogar ? 'Identificación de Vivienda' : 'Credencial de Recolector'}
            </p>
          </div>

          {/* Área del QR con esquinas decorativas */}
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', padding: '15px', background: 'white' }}>
              {/* Esquinas decorativas */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '3px solid #15803d', borderLeft: '3px solid #15803d' }}></div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '3px solid #15803d', borderRight: '3px solid #15803d' }}></div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '3px solid #15803d', borderLeft: '3px solid #15803d' }}></div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '3px solid #15803d', borderRight: '3px solid #15803d' }}></div>
              
              {/* QR Code */}
              <div style={{ background: 'white', padding: '10px' }}>
                <QRCode value={code} size={180} />
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '10px', color: '#64748b', fontWeight: 600, margin: '0 20px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {isHogar ? 'Escanee para verificar gestión de residuos' : 'Escanee para identificar recolector'}
          </p>

          {/* Footer con datos */}
          <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                {isHogar ? 'Vivienda Nº' : 'Recolector ID'}
              </p>
              <h3 style={{ margin: 0, fontSize: '42px', color: '#15803d', fontWeight: 800, lineHeight: '1' }}>
                {code}
              </h3>
            </div>
            <div style={{ textAlign: 'right', maxWidth: '180px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#15803d">
                  {isHogar ? (
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                  ) : (
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  )}
                </svg>
                <p style={{ margin: 0, fontSize: '10px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isHogar ? 'Dirección Registrada' : 'Nombre Completo'}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 800, wordBreak: 'break-word' }}>
                {name}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b', fontWeight: 500, fontStyle: 'italic' }}>
                {isHogar ? 'Municipio de Canelones' : 'Personal Operativo Autorizado'}
              </p>
            </div>
          </div>

          {/* Barra decorativa inferior */}
          <div style={{ height: '6px', width: '100%', display: 'flex' }}>
            <div style={{ flex: 1, background: '#86efac' }}></div>
            <div style={{ flex: 1, background: '#4ade80' }}></div>
            <div style={{ flex: 1, background: '#22c55e' }}></div>
            <div style={{ flex: 1, background: '#16a34a' }}></div>
            <div style={{ flex: 1, background: '#15803d' }}></div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Descargar PNG
          </button>
        </div>
      </div>
    </div>
  );
}
