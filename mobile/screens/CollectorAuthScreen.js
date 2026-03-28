import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';
import { useCollectors } from '../hooks/useApi';

export default function CollectorAuthScreen({ navigation }) {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { authenticateCollector, error } = useCollectors();

  const handleAuthenticate = async (code) => {
    try {
      setIsScanning(true);
      const collector = await authenticateCollector(code || qrCode);
      
      // Navegar a selección de unidad, pasando datos del recolector
      navigation.navigate('UnitSelection', { collector });
    } catch (err) {
      Alert.alert(
        'Error de Autenticación',
        err.message || 'No se pudo autenticar el recolector',
        [{ text: 'OK' }]
      );
    } finally {
      setIsScanning(false);
    }
  };

  const simulateScan = () => {
    // Para pruebas, genera un código simulado o usa uno conocido
    const mockCode = 'RM'; // Usa un ID real de tu base de datos
    handleAuthenticate(mockCode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="badge" size={24} color="#008a45" />
          </View>
          <View>
            <Text style={styles.headerTitle}>INTENDENCIA</Text>
            <Text style={styles.headerSubtitle}>de CANELONES</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.title}>Identificación</Text>
          <Text style={styles.description}>
            Ingrese su ID de recolector para iniciar la jornada (ej: RM, EB)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scannerFrame}
          onPress={simulateScan}
          disabled={isScanning}
        >
          <View style={styles.scannerBorder}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            
            <View style={styles.scannerContent}>
              <MaterialIcons name="qr-code-scanner" size={80} color="#008a45" />
              <View style={styles.scanLine} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={simulateScan}
            disabled={isScanning}
          >
            <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>
              {isScanning ? 'AUTENTICANDO...' : 'ESCANEAR CÓDIGO'}
            </Text>
          </TouchableOpacity>

          <View style={styles.manualInputContainer}>
            <TextInput
              style={styles.manualInput}
              placeholder="ID de recolector (ej: RM)"
              value={qrCode}
              onChangeText={setQrCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={styles.manualButton}
              onPress={() => handleAuthenticate()}
              disabled={!qrCode || isScanning}
            >
              <Text style={styles.secondaryButtonText}>INGRESAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={20} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.secureInfo}>
          <MaterialIcons name="lock" size={16} color="#94a3b8" />
          <Text style={styles.secureText}>Conexión Segura ID-Canelones</Text>
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#008a45',
    fontWeight: '600',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  textSection: {
    width: '100%',
    maxWidth: 448,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  scannerFrame: {
    width: 280,
    aspectRatio: 1,
    marginBottom: 40,
  },
  scannerBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(0, 138, 69, 0.2)',
    borderRadius: 12,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#008a45',
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#008a45',
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#008a45',
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#008a45',
    borderBottomRightRadius: 12,
  },
  scannerContent: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#008a45',
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 448,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#008a45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  manualInputContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  manualInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  manualButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'rgba(0, 138, 69, 0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#008a45',
    fontWeight: '600',
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
  },
  secureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  secureText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
