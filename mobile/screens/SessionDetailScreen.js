import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import { useRatings } from '../hooks/useApi';
import apiService from '../services/apiService';

export default function SessionDetailScreen({ navigation, route }) {
  const { session } = route.params || {};
  const { ratings, loading, refetch } = useRatings();
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 2000);
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#dc2626" />
          <Text style={styles.errorText}>Sesión no encontrada</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Filtrar calificaciones de esta sesión
  const sessionRatings = ratings?.filter(r => r.sessionId === session.id) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
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

  const getRatingColor = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'good': return '#10b981';
      case 'regular': return '#f59e0b';
      case 'bad': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'good': return 'thumb-up';
      case 'regular': return 'remove-circle-outline';
      case 'bad': return 'thumb-down';
      default: return 'help-outline';
    }
  };

  const getRatingLabel = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'good': return 'Buena';
      case 'regular': return 'Regular';
      case 'bad': return 'Mala';
      default: return rating;
    }
  };

  const handleEditRating = (rating) => {
    const currentRating = getRatingLabel(rating.rating);
    const options = [];
    
    // Solo mostrar opciones diferentes a la actual
    if (rating.rating !== 'good') {
      options.push({
        text: '👍 Cambiar a Buena',
        onPress: () => updateRating(rating.id, 'good'),
      });
    }
    
    if (rating.rating !== 'regular') {
      options.push({
        text: '👌 Cambiar a Regular',
        onPress: () => updateRating(rating.id, 'regular'),
      });
    }
    
    if (rating.rating !== 'bad') {
      options.push({
        text: '👎 Cambiar a Mala',
        onPress: () => updateRating(rating.id, 'bad'),
      });
    }
    
    options.push({ text: 'Cancelar', style: 'cancel' });
    
    Alert.alert(
      'Editar Calificación',
      `Hogar: ${rating.householdAddress || rating.householdId}\nCalificación actual: ${currentRating}`,
      options
    );
  };

  const updateRating = async (ratingId, newRating) => {
    try {
      const rating = sessionRatings.find(r => r.id === ratingId);
      if (!rating) {
        throw new Error('Calificación no encontrada');
      }
      
      await apiService.updateRating(rating.householdId, ratingId, {
        rating: newRating,
        notes: `${rating.notes || ''} (Editado: ${new Date().toLocaleString('es-UY')})`
      });
      
      await refetch();
      showToast('✓ Calificación actualizada');
    } catch (err) {
      Alert.alert(
        'Error',
        'No se pudo actualizar la calificación: ' + err.message,
        [{ text: 'OK' }]
      );
    }
  };

  const handleDeleteRating = (ratingId) => {
    const rating = sessionRatings.find(r => r.id === ratingId);
    if (!rating) {
      Alert.alert('Error', 'Calificación no encontrada');
      return;
    }
    
    Alert.alert(
      'Eliminar Calificación',
      '¿Está seguro que desea eliminar esta calificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteRating(rating.householdId, ratingId);
              await refetch();
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar: ' + err.message);
            }
          }
        }
      ]
    );
  };

  const calculateStats = () => {
    const goodCount = sessionRatings.filter(r => r.rating === 'good').length;
    const regularCount = sessionRatings.filter(r => r.rating === 'regular').length;
    const badCount = sessionRatings.filter(r => r.rating === 'bad').length;
    
    return { goodCount, regularCount, badCount, total: sessionRatings.length };
  };

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#008a45" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Sesión</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#008a45']} />
        }
      >
        {/* Info de la Sesión */}
        <View style={styles.sessionInfoCard}>
          <View style={styles.sessionInfoHeader}>
            <MaterialIcons name="event" size={24} color="#008a45" />
            <Text style={styles.sessionInfoTitle}>Información de la Sesión</Text>
          </View>
          
          <View style={styles.sessionInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{formatDate(session.startTime)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Inicio</Text>
              <Text style={styles.infoValue}>{formatTime(session.startTime)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fin</Text>
              <Text style={styles.infoValue}>
                {session.endTime ? formatTime(session.endTime) : 'En progreso'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text style={[styles.infoValue, { color: '#008a45' }]}>{session.status}</Text>
            </View>
          </View>

          <View style={styles.sessionInfoRow}>
            <MaterialIcons name="person" size={20} color="#64748b" />
            <Text style={styles.sessionInfoText}>{session.collectorName || session.collectorId}</Text>
          </View>
          
          <View style={styles.sessionInfoRow}>
            <MaterialIcons name="local-shipping" size={20} color="#64748b" />
            <Text style={styles.sessionInfoText}>{session.vehicleId}</Text>
          </View>
          
          <View style={styles.sessionInfoRow}>
            <MaterialIcons name="location-on" size={20} color="#64748b" />
            <Text style={styles.sessionInfoText}>{session.zone || 'Sin zona'}</Text>
          </View>
        </View>

        {/* Estadísticas de Calificaciones */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumen de Calificaciones</Text>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#ecfdf5' }]}>
              <MaterialIcons name="thumb-up" size={28} color="#10b981" />
              <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.goodCount}</Text>
              <Text style={styles.statLabel}>Buenas</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
              <MaterialIcons name="remove-circle-outline" size={28} color="#f59e0b" />
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.regularCount}</Text>
              <Text style={styles.statLabel}>Regulares</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
              <MaterialIcons name="thumb-down" size={28} color="#dc2626" />
              <Text style={[styles.statValue, { color: '#dc2626' }]}>{stats.badCount}</Text>
              <Text style={styles.statLabel}>Malas</Text>
            </View>
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total de Recolecciones</Text>
            <Text style={styles.totalValue}>{stats.total}</Text>
          </View>
        </View>

        {/* Lista de Calificaciones */}
        <View style={styles.ratingsContainer}>
          <Text style={styles.sectionTitle}>Calificaciones Detalladas</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando calificaciones...</Text>
            </View>
          ) : sessionRatings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="inbox" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No hay calificaciones registradas en esta sesión</Text>
            </View>
          ) : (
            sessionRatings.map((rating, index) => (
              <View key={rating.id} style={styles.ratingCard}>
                <View style={styles.ratingHeader}>
                  <View style={styles.ratingNumber}>
                    <Text style={styles.ratingNumberText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.ratingHeaderInfo}>
                    <Text style={styles.ratingAddress}>
                      {rating.householdAddress || `Hogar ${rating.householdId}`}
                    </Text>
                    <Text style={styles.ratingTime}>
                      {new Date(rating.timestamp || session.startTime).toLocaleTimeString('es-UY', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(rating.rating) }]}>
                    <MaterialIcons name={getRatingIcon(rating.rating)} size={20} color="#fff" />
                  </View>
                </View>

                {rating.notes && (
                  <View style={styles.ratingNotes}>
                    <MaterialIcons name="note" size={16} color="#64748b" />
                    <Text style={styles.ratingNotesText}>{rating.notes}</Text>
                  </View>
                )}

                <View style={styles.ratingActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditRating(rating)}
                  >
                    <MaterialIcons name="edit" size={18} color="#008a45" />
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRating(rating.id)}
                  >
                    <MaterialIcons name="delete" size={18} color="#dc2626" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {toast.visible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      <MobileNav navigation={navigation} currentRoute="History" />
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
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 138, 69, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#008a45',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sessionInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  sessionInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sessionInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sessionInfoText: {
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  totalCard: {
    backgroundColor: '#008a45',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  ratingsContainer: {
    marginBottom: 16,
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
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
  },
  ratingCard: {
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
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ratingNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  ratingHeaderInfo: {
    flex: 1,
  },
  ratingAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  ratingTime: {
    fontSize: 12,
    color: '#64748b',
  },
  ratingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingNotes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  ratingNotesText: {
    flex: 1,
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  ratingActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008a45',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#dc2626',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#008a45',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
