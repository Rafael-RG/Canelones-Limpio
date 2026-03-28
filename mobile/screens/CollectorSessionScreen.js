import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import { useRatings } from '../hooks/useApi';
import apiService from '../services/apiService';

export default function CollectorSessionScreen({ navigation, route }) {
  const { collector, vehicle, session } = route.params || {};
  const { ratings, refetch } = useRatings(session?.id);
  const [sessionData, setSessionData] = useState(session);

  useEffect(() => {
    // Refrescar calificaciones cada 10 segundos
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleFinishSession = async () => {
    Alert.alert(
      'Finalizar Sesión',
      '¿Desea finalizar la jornada de recolección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.finishSession(session.id);

              Alert.alert(
                'Sesión Finalizada',
                'La jornada ha sido completada exitosamente',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
              );
            } catch (err) {
              Alert.alert('Error', 'No se pudo finalizar la sesión: ' + err.message);
            }
          },
        },
      ]
    );
  };

  if (!collector || !vehicle || !session) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color="#dc2626" />
        <Text style={styles.errorText}>No se encontró información de la sesión</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleFinishSession}>
          <MaterialIcons name="logout" size={30} color="#dc2626" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSmall}>INTENDENCIA DE CANELONES</Text>
          <Text style={styles.headerTitle}>Sesión Activa</Text>
        </View>
        <TouchableOpacity onPress={refetch}>
          <MaterialIcons name="refresh" size={30} color="#008a45" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.profileImage}>
            <MaterialIcons name="person" size={40} color="#008a45" />
          </View>
          <View>
            <Text style={styles.cardLabel}>Recolector Identificado</Text>
            <Text style={styles.cardName}>{collector.name}</Text>
            <Text style={styles.cardId}>ID: {collector.id}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.unitIcon}>
            <MaterialIcons name="local-shipping" size={50} color="#008a45" />
          </View>
          <View>
            <Text style={styles.cardLabel}>Unidad de Transporte</Text>
            <Text style={styles.cardName}>{vehicle.id}</Text>
            <Text style={styles.cardId}>{vehicle.type} - {vehicle.capacity}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Estadísticas de Hoy</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <MaterialIcons name="home" size={32} color="#008a45" />
              <Text style={styles.statNumber}>{ratings?.length || 0}</Text>
              <Text style={styles.statLabel}>Hogares</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="star" size={32} color="#f59e0b" />
              <Text style={styles.statNumber}>
                {ratings?.length > 0 
                  ? (() => {
                      const ratingValues = { good: 5, regular: 3, bad: 1 };
                      const total = ratings.reduce((sum, r) => sum + (ratingValues[r.rating] || 0), 0);
                      return (total / ratings.length).toFixed(1);
                    })()
                  : '0.0'}
              </Text>
              <Text style={styles.statLabel}>Promedio</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('HomeScanner', { collector, vehicle, session })}
        >
          <MaterialIcons name="qr-code-scanner" size={50} color="#fff" />
          <Text style={styles.scanButtonTitle}>Identificar Hogar</Text>
          <Text style={styles.scanButtonSubtitle}>Escanear QR de vivienda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History', { collector })}
        >
          <MaterialIcons name="history" size={24} color="#008a45" />
          <Text style={styles.historyButtonText}>Ver Historial</Text>
        </TouchableOpacity>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#008a45',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#f5f8f7',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 138, 69, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 30,
  },
  headerSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#008a45',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.05)',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  unitIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#008a45',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  cardId: {
    fontSize: 14,
    color: '#64748b',
  },
  scanButton: {
    backgroundColor: '#008a45',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  scanButtonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#008a45',
    marginBottom: 16,
  },
  historyButtonText: {
    color: '#008a45',
    fontWeight: 'bold',
    fontSize: 16,
  },
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 138, 69, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 138, 69, 0.05)',
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#008a45',
  },
  mapContainer: {
    height: 160,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#cbd5e1',
    position: 'relative',
  },
  locationPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
  locationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#008a45',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
