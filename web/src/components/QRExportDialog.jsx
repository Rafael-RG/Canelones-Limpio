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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Exportar QR</h3>
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
          className="bg-white p-8 rounded-xl border-2 border-slate-200 flex flex-col items-center gap-6"
        >
          {/* Header */}
          <div className="text-center">
            <h4 className="text-lg font-bold text-primary">Canelones Limpio</h4>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{type}</p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4">
            <QRCode value={code} size={200} />
          </div>

          {/* Código y nombre */}
          <div className="text-center">
            <div className="font-mono text-3xl font-bold text-slate-900 tracking-wider mb-2">
              {code}
            </div>
            <div className="text-sm text-slate-600 font-medium max-w-[200px] break-words">
              {name}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="text-xs text-slate-400 text-center border-t pt-4 w-full">
            Escanee el código QR o ingrese manualmente
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
