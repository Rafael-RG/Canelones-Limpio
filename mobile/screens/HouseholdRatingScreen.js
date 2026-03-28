import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import apiService from '../services/apiService';

export default function HouseholdRatingScreen({ navigation, route }) {
  const { collector, vehicle, session, household } = route.params || {};
  const [selectedRating, setSelectedRating] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleRating = async (ratingType) => {
    if (!session || !household || !collector) {
      Alert.alert('Error', 'Faltan datos de la sesión, hogar o recolector');
      return;
    }

    try {
      setSaving(true);
      setSelectedRating(ratingType);

      await apiService.createRating({
        householdId: household.id,
        collectorId: collector.id,
        sessionId: session.id,
        rating: ratingType,
        notes: notes || '',
      });

      navigation.navigate('Home');
    } catch (err) {
      Alert.alert(
        'Error al Guardar',
        err.message || 'No se pudo registrar la calificación',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const handleNoCollection = () => {
    Alert.alert(
      'Sin Recolección',
      '¿El hogar no sacó residuos? No se registrará calificación.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  if (!household) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={48} color="#dc2626" />
        <Text style={styles.errorText}>No se encontró información del hogar</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="qr-code-scanner" size={24} color="#008a45" />
          </View>
          <View>
            <Text style={styles.headerSmall}>Módulo de Inspección</Text>
            <Text style={styles.headerTitle}>EcoScan Pro</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.houseCard}>
          <View style={styles.houseHeader}>
            <View>
              <View style={styles.identifiedBadge}>
                <Text style={styles.identifiedText}>HOGAR IDENTIFICADO</Text>
              </View>
              <Text style={styles.houseAddress}>{household.address}</Text>
            </View>
            <Text style={styles.houseId}>{household.id}</Text>
          </View>

          <View style={styles.houseInfo}>
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={16} color="#64748b" />
              <Text style={styles.infoText}>Zona: {household.zone}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="qr-code" size={16} color="#64748b" />
              <Text style={styles.infoText}>QR: {household.qrCode}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingsSection}>
          <Text style={styles.ratingsTitle}>CALIFICAR SEPARACIÓN DE RESIDUOS</Text>

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingGood]}
            onPress={() => handleRating('good')}
            disabled={saving}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="thumb-up" size={36} color="#10b981" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>Buena</Text>
              <Text style={styles.ratingDescription}>Bien separados</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingRegular]}
            onPress={() => handleRating('regular')}
            disabled={saving}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="remove-circle-outline" size={36} color="#f59e0b" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>Regular</Text>
              <Text style={styles.ratingDescription}>Separación parcial</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingBad]}
            onPress={() => handleRating('bad')}
            disabled={saving}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="thumb-down" size={36} color="#dc2626" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>Mala</Text>
              <Text style={styles.ratingDescription}>Mal separados</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingNoCollection]}
            onPress={handleNoCollection}
            disabled={saving}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="block" size={36} color="#64748b" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>No se recolectó</Text>
              <Text style={styles.ratingDescription}>Sin residuos en el hogar</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notas adicionales (opcional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Agregar comentarios..."
              placeholderTextColor="#94a3b8"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              editable={!saving}
            />
          </View>
        </View>

        {saving && (
          <View style={styles.savingContainer}>
            <Text style={styles.savingText}>Guardando calificación...</Text>
          </View>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 138, 69, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#008a45',
  },
  headerTitle: {
    fontSize: 16,
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
  houseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  houseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  identifiedBadge: {
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  identifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#008a45',
  },
  houseAddress: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  houseId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#008a45',
    fontFamily: 'monospace',
  },
  houseImageContainer: {
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  houseImagePlaceholder: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingsSection: {
    gap: 12,
  },
  ratingsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingGood: {
    borderColor: '#10b981',
  },
  ratingRegular: {
    borderColor: '#f59e0b',
  },
  ratingBad: {
    borderColor: '#dc2626',
  },
  ratingNoCollection: {
    borderColor: '#64748b',
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  ratingIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  ratingDescription: {
    fontSize: 10,
    color: '#64748b',
  },
  notesSection: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  savingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  savingText: {
    fontSize: 16,
    color: '#008a45',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#008a45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
