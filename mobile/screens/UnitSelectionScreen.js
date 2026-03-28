import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import { MOCK_UNITS } from '../data/mockData';

export default function UnitSelectionScreen({ navigation }) {
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
        {MOCK_UNITS.slice(0, 2).map((unit) => (
          <View key={unit.id} style={styles.unitCard}>
            <View style={styles.unitRow}>
              <View style={styles.unitImage}>
                <MaterialIcons name="local-shipping" size={40} color="rgba(0,138,69,0.4)" />
              </View>
              
              <View style={styles.unitInfo}>
                <View style={styles.unitHeader}>
                  <Text style={styles.unitTitle}>Unidad {unit.id.split('-')[1]}</Text>
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableBadgeText}>Disponible</Text>
                  </View>
                </View>
                
                <Text style={styles.unitType}>{unit.type}</Text>
                
                <View style={styles.unitStats}>
                  <View style={styles.statItem}>
                    <MaterialIcons name="ev-station" size={16} color="#64748b" />
                    <Text style={styles.statText}>85%</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialIcons name="straighten" size={16} color="#64748b" />
                    <Text style={styles.statText}>12k km</Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => navigation.navigate('CollectorSession')}
            >
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.selectButtonText}>Seleccionar Unidad</Text>
            </TouchableOpacity>
          </View>
        ))}
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
