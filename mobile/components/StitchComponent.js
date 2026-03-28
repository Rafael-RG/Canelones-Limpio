import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Componente para renderizar diseños de Stitch dinámicamente
 */
const StitchComponent = ({ design, componentId, styles }) => {
  if (!design) {
    return (
      <View style={localStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={localStyles.loadingText}>Cargando diseño...</Text>
      </View>
    );
  }

  // TODO: Implementar renderizado basado en el tipo de componente de Stitch
  // Esto se personalizará según los diseños específicos que tengas

  return (
    <View style={[localStyles.componentContainer, styles]}>
      <Text style={localStyles.placeholderText}>
        Componente de Stitch: {componentId}
      </Text>
      {/* Aquí se renderizará el componente real basado en el diseño */}
    </View>
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
      <View style={localStyles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return children;
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  componentContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  placeholderText: {
    fontSize: 14,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StitchComponent;
