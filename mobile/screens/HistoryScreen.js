import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import { useSession } from '../contexts/SessionContext';
import { useSessions } from '../hooks/useApi';

export default function HistoryScreen({ navigation }) {
  const { activeSession } = useSession();
  const { sessions, loading, refresh } = useSessions();
  const [refreshing, setRefreshing] = useState(false);

  // Filtrar sesiones del usuario actual
  const userSessions = sessions?.filter(session => {
    if (activeSession) {
      return session.collectorId === activeSession.collector.id;
    }
    return true; // Si no hay sesión activa, mostrar todas
  }) || [];

  // Ordenar por fecha más reciente
  const sortedSessions = [...userSessions].sort((a, b) => {
    return new Date(b.startTime) - new Date(a.startTime);
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'En progreso';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activa': return '#10b981';
      case 'finalizada': return '#64748b';
      case 'pausada': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const calculateStats = () => {
    const totalCollections = sortedSessions.reduce((sum, s) => sum + (s.totalCollections || 0), 0);
    const completedSessions = sortedSessions.filter(s => s.status === 'Finalizada').length;
    return {
      totalCollections,
      completedSessions,
      totalSessions: sortedSessions.length
    };
  };

  const stats = calculateStats();

  // Si no hay sesión activa, mostrar mensaje
  if (!activeSession) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="history" size={32} color="#008a45" />
            <View>
              <Text style={styles.headerTitle}>Mi Historial</Text>
              <Text style={styles.headerSubtitle}>No disponible</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.emptyContainer}>
            <MaterialIcons name="lock-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Acceso Restringido</Text>
            <Text style={styles.emptyText}>
              Debe identificarse como recolector para acceder a su historial de sesiones
            </Text>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.backButtonText}>Ir a Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <MobileNav navigation={navigation} currentRoute="History" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#008a45']} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="history" size={32} color="#008a45" />
            <View>
              <Text style={styles.headerTitle}>Mi Historial</Text>
              <Text style={styles.headerSubtitle}>
                {activeSession 
                  ? `Sesiones de ${activeSession.collector.name}`
                  : 'Todas las sesiones'
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialIcons name="work" size={24} color="#008a45" />
            <Text style={styles.statValue}>{stats.totalSessions}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color="#10b981" />
            <Text style={styles.statValue}>{stats.completedSessions}</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialIcons name="home-work" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{stats.totalCollections}</Text>
            <Text style={styles.statLabel}>Recolecciones</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando historial...</Text>
          </View>
        ) : sortedSessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Sin Historial</Text>
            <Text style={styles.emptyText}>
              {activeSession 
                ? 'No hay sesiones registradas para este usuario'
                : 'No hay sesiones registradas en el sistema'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.sessionsContainer}>
            <Text style={styles.sectionTitle}>Sesiones Recientes</Text>
            
            {sortedSessions.map((session) => (
              <TouchableOpacity 
                key={session.id} 
                style={styles.sessionCard}
                onPress={() => navigation.navigate('SessionDetail', { session })}
                activeOpacity={0.7}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionHeaderLeft}>
                    <MaterialIcons 
                      name={session.status === 'Activa' ? 'play-circle' : 'check-circle'} 
                      size={24} 
                      color={getStatusColor(session.status)} 
                    />
                    <View>
                      <Text style={styles.sessionDate}>
                        {formatDate(session.startTime)}
                      </Text>
                      <Text style={styles.sessionTime}>
                        {formatTime(session.startTime)} - {session.endTime ? formatTime(session.endTime) : 'En progreso'}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                    <Text style={styles.statusText}>{session.status}</Text>
                  </View>
                </View>

                <View style={styles.sessionDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="person" size={18} color="#64748b" />
                    <Text style={styles.detailText}>{session.collectorName || session.collectorId}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <MaterialIcons name="local-shipping" size={18} color="#64748b" />
                    <Text style={styles.detailText}>{session.vehicleId}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <MaterialIcons name="location-on" size={18} color="#64748b" />
                    <Text style={styles.detailText}>{session.zone || 'Sin zona'}</Text>
                  </View>
                </View>

                <View style={styles.sessionStats}>
                  <View style={styles.sessionStat}>
                    <Text style={styles.sessionStatValue}>{session.totalCollections || 0}</Text>
                    <Text style={styles.sessionStatLabel}>Recolecciones</Text>
                  </View>
                  
                  <View style={styles.sessionDivider} />
                  
                  <View style={styles.sessionStat}>
                    <Text style={styles.sessionStatValue}>
                      {formatDuration(session.startTime, session.endTime)}
                    </Text>
                    <Text style={styles.sessionStatLabel}>Duración</Text>
                  </View>
                </View>

                <View style={styles.viewDetailsRow}>
                  <Text style={styles.viewDetailsText}>Ver detalles</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#008a45" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <MobileNav navigation={navigation} currentRoute="History" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8f7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#008a45',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  sessionTime: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  sessionDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  sessionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  sessionStat: {
    flex: 1,
    alignItems: 'center',
  },
  sessionStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#008a45',
  },
  sessionStatLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#008a45',
  },
  sessionDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
});
