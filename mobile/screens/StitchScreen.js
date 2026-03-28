import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import stitchService from '../services/stitchService';

/**
 * Componente para renderizar y mostrar una pantalla específica de Stitch
 */
export default function StitchScreen({ project, screen }) {
  const [screenData, setScreenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadScreen();
  }, [project, screen]);

  const loadScreen = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener detalles completos de la pantalla
      const response = await stitchService.callTool('get_screen', {
        project_name: project.name,
        screen_name: screen.name
      });
      
      console.log('Datos de la pantalla:', response);
      
      // Extraer los datos de la pantalla
      const screenInfo = response?.content?.[0]?.text 
        ? JSON.parse(response.content[0].text)
        : null;
      
      setScreenData(screenInfo);
    } catch (err) {
      console.error('Error cargando pantalla:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Cargando diseño...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadScreen}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!screenData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se pudo cargar la pantalla</Text>
      </View>
    );
  }

  // Renderizar la pantalla usando los datos de Stitch
  return (
    <ScrollView style={styles.container}>
      {/* Header de la pantalla */}
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>
          {screenData.display_name || screen.display_name || screen.name}
        </Text>
        {screenData.description && (
          <Text style={styles.screenDescription}>{screenData.description}</Text>
        )}
      </View>

      {/* Preview de la pantalla si existe */}
      {screenData.preview_url && (
        <View style={styles.previewContainer}>
          <Text style={styles.sectionTitle}>Vista Previa del Diseño</Text>
          <Image 
            source={{ uri: screenData.preview_url }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Componentes de la pantalla */}
      {screenData.components && screenData.components.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Componentes de la Pantalla</Text>
          {renderComponents(screenData.components)}
        </View>
      )}

      {/* Información técnica */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <InfoRow label="Proyecto" value={project.display_name || project.name} />
        <InfoRow label="Pantalla" value={screen.name} />
        {screenData.created_time && (
          <InfoRow label="Creado" value={new Date(screenData.created_time).toLocaleDateString()} />
        )}
        {screenData.updated_time && (
          <InfoRow label="Actualizado" value={new Date(screenData.updated_time).toLocaleDateString()} />
        )}
      </View>

      {/* Datos completos (para debugging) */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => console.log('Datos completos:', screenData)}>
          <Text style={styles.debugButton}>Ver datos completos en consola</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * Renderiza los componentes de la pantalla
 */
function renderComponents(components) {
  return components.map((component, index) => (
    <View key={index} style={styles.componentCard}>
      <Text style={styles.componentType}>{component.type || 'Componente'}</Text>
      {component.text && <Text style={styles.componentText}>{component.text}</Text>}
      {component.properties && (
        <Text style={styles.componentProps}>
          {JSON.stringify(component.properties, null, 2)}
        </Text>
      )}
    </View>
  ));
}

/**
 * Componente para mostrar una fila de información
 */
function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  content: {
    marginTop: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dataItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dataRow: {
    marginBottom: 8,
  },
  dataKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 14,
    color: '#333',
  },
  dataText: {
    fontSize: 14,
    color: '#333',
  },
});
