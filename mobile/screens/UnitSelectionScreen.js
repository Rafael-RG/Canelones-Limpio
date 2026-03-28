import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import { useVehicles } from '../hooks/useApi';
import apiService from '../services/apiService';

export default function UnitSelectionScreen({ navigation, route }) {
  const { collector } = route.params || {};
  const { vehicles, loading, error } = useVehicles();
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (vehicles) {
      // Filtrar solo vehículos operativos (disponibles para uso)
      setAvailableVehicles(vehicles.filter(v => v.status === 'Operativo'));
    }
  }, [vehicles]);

  const handleSelectVehicle = async (vehicle) => {
    if (!collector) {
      Alert.alert('Error', 'No se encontró información del recolector');
      return;
    }

    try {
      setSelecting(true);

      // Crear sesión de recolección
      const session = await apiService.createSession({
        collectorId: collector.id,
        collectorName: collector.name,
        vehicleId: vehicle.id,
        startTime: new Date().toISOString(),
        status: 'Activa',
        zone: 'Zona General', // Sin campo assignedZone en vehicle
      });

      // Navegar a sesión activa
      navigation.navigate('CollectorSession', { 
        collector, 
        vehicle, 
        session 
      });
    } catch (err) {
      Alert.alert(
        'Error',
        'No se pudo iniciar la sesión: ' + err.message,
        [{ text: 'OK' }]
      );
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#008a45" />
        <Text style={styles.loadingText}>Cargando vehículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color="#dc2626" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#008a45" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Selección de Transporte</Text>
          <Text style={styles.headerSubtitle}>Seleccione la unidad asignada hoy</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {availableVehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="local-shipping" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No hay vehículos operativos</Text>
            <Text style={styles.emptySubtext}>Todos los vehículos están en uso o mantenimiento</Text>
          </View>
        ) : (
          availableVehicles.map((vehicle) => (
            <View key={vehicle.id} style={styles.unitCard}>
              <View style={styles.unitRow}>
                <View style={styles.unitImage}>
                  <MaterialIcons name="local-shipping" size={40} color="rgba(0,138,69,0.4)" />
                </View>
                
                <View style={styles.unitInfo}>
                  <View style={styles.unitHeader}>
                    <Text style={styles.unitTitle}>{vehicle.id}</Text>
                    <View style={[
                      styles.availableBadge,
                      { backgroundColor: vehicle.statusColor === 'green' ? '#dcfce7' : '#f3f4f6' }
                    ]}>
                      <Text style={[
                        styles.availableBadgeText,
                        { color: vehicle.statusColor === 'green' ? '#16a34a' : '#6b7280' }
                      ]}>{vehicle.status}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.unitType}>{vehicle.type}</Text>
                  
                  <View style={styles.unitStats}>
                    <View style={styles.statItem}>
                      <MaterialIcons name="scale" size={16} color="#64748b" />
                      <Text style={styles.statText}>{vehicle.capacity}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.selectButton, selecting && styles.selectButtonDisabled]}
                onPress={() => handleSelectVehicle(vehicle)}
                disabled={selecting}
              >
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.selectButtonText}>
                  {selecting ? 'Iniciando...' : 'Seleccionar Unidad'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <MobileNav navigation={navigation} currentRoute="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f5f8f7',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#008a45',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#94a3b8',
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 16,
  },
  unitImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitInfo: {
    flex: 1,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  availableBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availableBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#16a34a',
  },
  unitType: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  unitStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
  },
  selectButton: {
    backgroundColor: '#008a45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
