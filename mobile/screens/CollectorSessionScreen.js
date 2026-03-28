import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';

export default function CollectorSessionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialIcons name="menu" size={30} color="#008a45" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSmall}>INTENDENCIA DE CANELONES</Text>
          <Text style={styles.headerTitle}>Sesión Activa</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.profileImage} />
          <View>
            <Text style={styles.cardLabel}>Recolector Identificado</Text>
            <Text style={styles.cardName}>Juan Pérez</Text>
            <Text style={styles.cardId}>ID Funcionario: #88492</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.unitIcon}>
            <MaterialIcons name="local-shipping" size={50} color="#008a45" />
          </View>
          <View>
            <Text style={styles.cardLabel}>Unidad de Transporte</Text>
            <Text style={styles.cardName}>Unidad 405</Text>
            <Text style={styles.cardId}>Sector B - Ruta Urbana</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('HomeScanner')}
        >
          <MaterialIcons name="qr-code-scanner" size={50} color="#fff" />
          <Text style={styles.scanButtonTitle}>Identificar Hogar</Text>
          <Text style={styles.scanButtonSubtitle}>Escanear QR de vivienda</Text>
        </TouchableOpacity>

        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>RUTA ACTIVA: BARRIO SUR</Text>
            <MaterialIcons name="location-on" size={24} color="#008a45" />
          </View>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <View style={styles.locationPin}>
                <View style={styles.locationDot} />
              </View>
            </View>
          </View>
        </View>
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
    borderWidth: 4,
    borderColor: 'rgba(0, 138, 69, 0.2)',
    backgroundColor: '#e2e8f0',
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
