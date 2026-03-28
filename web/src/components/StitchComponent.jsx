import React from 'react';
import './StitchComponent.css';

/**
 * Componente para renderizar diseños de Stitch dinámicamente
 */
const StitchComponent = ({ design, componentId, className }) => {
  if (!design) {
    return (
      <div className="stitch-loading">
        <div className="spinner"></div>
        <p>Cargando diseño...</p>
      </div>
    );
  }

  // TODO: Implementar renderizado basado en el tipo de componente de Stitch
  // Esto se personalizará según los diseños específicos que tengas

  return (
    <div className={`stitch-component ${className || ''}`}>
      <p className="stitch-placeholder">
        Componente de Stitch: {componentId}
      </p>
      {/* Aquí se renderizará el componente real basado en el diseño */}
    </div>
  );
};

/**
 * Contenedor para manejar la carga de diseños
 */
export const StitchDesignLoader = ({ designId, children, onLoad }) => {
  const [design, setDesign] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carga de diseño
    // En producción, esto llamaría a stitchService.getDesign(designId)
    const loadDesign = async () => {
      setLoading(true);
      // const designData = await stitchService.getDesign(designId);
      // setDesign(designData);
      setTimeout(() => {
        setDesign({ id: designId, loaded: true });
        setLoading(false);
        if (onLoad) onLoad();
      }, 1000);
    };

    loadDesign();
  }, [designId, onLoad]);

  if (loading) {
    return (
      <div className="stitch-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default StitchComponent;
