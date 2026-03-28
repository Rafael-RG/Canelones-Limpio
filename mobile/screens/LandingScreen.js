import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';

export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="recycling" size={32} color="#008a45" />
        </View>
        <Text style={styles.headerTitle}>Intendencia de Canelones</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="recycling" size={50} color="#008a45" />
          </View>
          <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
          <Text style={styles.welcomeText}>
            Sistema de gestión de recolección de residuos. Selecciona tu perfil para comenzar.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CollectorAuth')}
          >
            <View style={styles.buttonIcon}>
              <MaterialIcons name="local-shipping" size={30} color="#fff" />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitle}>Identificar Recolector</Text>
              <Text style={styles.buttonSubtitle}>Acceso para personal municipal</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('History')}
          >
            <View style={styles.buttonIconSecondary}>
              <MaterialIcons name="history" size={30} color="#008a45" />
            </View>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonTitleSecondary}>Ver Historial</Text>
              <Text style={styles.buttonSubtitleSecondary}>Registro de recolecciones</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="rgba(0,138,69,0.5)" />
          </TouchableOpacity>
        </View>
      </View>

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
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingRight: 48,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  welcomeSection: {
    width: '100%',
    maxWidth: 448,
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 80,
  },
  iconCircle: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 448,
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008a45',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  buttonContent: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(0, 138, 69, 0.2)',
  },
  buttonIconSecondary: {
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  buttonTitleSecondary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008a45',
    marginBottom: 2,
  },
  buttonSubtitleSecondary: {
    fontSize: 14,
    color: '#64748b',
  },
});
