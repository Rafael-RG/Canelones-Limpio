import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MobileNav from '../components/MobileNav';
import { useSession } from '../contexts/SessionContext';
import { useCollectors, useVehicles, useHouseholds } from '../hooks/useApi';
import apiService from '../services/apiService';

export default function HomeScreen({ navigation }) {
  const { activeSession, startSession, endSession } = useSession();
  
  return (
    <View style={styles.container}>
      {activeSession ? (
        <ActiveSessionView 
          navigation={navigation}
          activeSession={activeSession}
          endSession={endSession}
        />
      ) : (
        <AuthenticationView 
          navigation={navigation}
          startSession={startSession}
        />
      )}
      <MobileNav navigation={navigation} currentRoute="Home" />
    </View>
  );
}

// Vista cuando NO hay sesión activa - Autenticación
function AuthenticationView({ navigation, startSession }) {
  const [step, setStep] = useState('auth'); // 'auth' o 'vehicle'
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [collector, setCollector] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  
  const { authenticateCollector } = useCollectors();
  const { vehicles, loading: loadingVehicles, refetch: refreshVehicles } = useVehicles();

  const handleAuthenticate = async (code) => {
    try {
      setIsLoading(true);
      const authenticatedCollector = await authenticateCollector(code || qrCode);
      setCollector(authenticatedCollector);
      setStep('vehicle');
      setShowCamera(false);
      // Refrescar vehículos en segundo plano
      refreshVehicles().catch(err => {
        console.error('Error al refrescar vehículos:', err);
      });
    } catch (err) {
      Alert.alert(
        'Error de Autenticación',
        err.message || 'No se pudo autenticar el recolector',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!isLoading && data) {
      handleAuthenticate(data);
    }
  };

  const openCamera = async () => {
    if (!permission) {
      Alert.alert('Solicitando Permisos', 'Esperando permisos de cámara...');
      return;
    }
    
    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Sin Permisos',
          'La aplicación necesita acceso a la cámara para escanear códigos QR',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleSelectVehicle = async (vehicle) => {
    try {
      setIsLoading(true);
      
      // Crear sesión en backend
      const sessionData = {
        collectorId: collector.id,
        collectorName: collector.name,
        vehicleId: vehicle.id,
        startTime: new Date().toISOString(),
        status: 'Activa',
        zone: vehicle.type || 'General'
      };
      
      const session = await apiService.createSession(sessionData);
      
      // Guardar sesión en contexto
      startSession(collector, vehicle, session);
    } catch (err) {
      Alert.alert(
        'Error al Iniciar Sesión',
        err.message || 'No se pudo crear la sesión',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'vehicle' && collector) {
    const operationalVehicles = vehicles?.filter(v => v.status === 'Operativo') || [];
    
    return (
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('auth')}>
            <MaterialIcons name="arrow-back" size={24} color="#008a45" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seleccionar Vehículo</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.collectorInfo}>
            <MaterialIcons name="person" size={40} color="#008a45" />
            <View style={styles.collectorDetails}>
              <Text style={styles.collectorName}>{collector.name}</Text>
              <Text style={styles.collectorId}>ID: {collector.id}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Vehículos Disponibles</Text>
          
          {loadingVehicles ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando vehículos...</Text>
            </View>
          ) : operationalVehicles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="warning" size={48} color="#94a3b8" />
              <Text style={styles.emptyText}>No hay vehículos operativos disponibles</Text>
            </View>
          ) : (
            operationalVehicles.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() => handleSelectVehicle(vehicle)}
                disabled={isLoading}
              >
                <View style={styles.vehicleIcon}>
                  <MaterialIcons name="local-shipping" size={32} color="#008a45" />
                </View>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleId}>{vehicle.id}</Text>
                  <Text style={styles.vehicleType}>{vehicle.type}</Text>
                  <View style={styles.vehicleStats}>
                    <View style={styles.statItem}>
                      <MaterialIcons name="inventory" size={16} color="#64748b" />
                      <Text style={styles.statText}>{vehicle.capacity} kg</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: vehicle.statusColor || '#10b981' }]}>
                      <Text style={styles.statusText}>{vehicle.status}</Text>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Vista de autenticación inicial
  return (
    <View style={styles.content}>
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

      <View style={styles.authContent}>
        <View style={styles.textSection}>
          <Text style={styles.title}>Identificación</Text>
          <Text style={styles.description}>
            {isLoading ? 'Autenticando...' : (showCamera ? 'Apunte al código QR' : 'Escanee o ingrese su ID de recolector')}
          </Text>
        </View>

        {showCamera ? (
          <View style={styles.cameraContainerAuth}>
            <CameraView
              onBarcodeScanned={isLoading ? undefined : handleBarCodeScanned}
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scanFrame}>
                <View style={[styles.frameCorner, styles.frameTopLeft]} />
                <View style={[styles.frameCorner, styles.frameTopRight]} />
                <View style={[styles.frameCorner, styles.frameBottomLeft]} />
                <View style={[styles.frameCorner, styles.frameBottomRight]} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeCameraButton}
              onPress={() => setShowCamera(false)}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.scannerFrame}
            onPress={openCamera}
            disabled={isLoading}
          >
            <View style={styles.scannerBorder}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
              
              <View style={styles.scannerContent}>
                <MaterialIcons name="qr-code-scanner" size={80} color="#008a45" />
                <Text style={styles.tapToScanText}>Toque para activar cámara</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.buttonsContainer}>
          {!showCamera && (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={openCamera}
              disabled={isLoading}
            >
              <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'AUTENTICANDO...' : 'ESCANEAR CÓDIGO'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.manualInputContainer}>
            <TextInput
              style={styles.manualInput}
              placeholder="ID de recolector (ej: RM)"
              value={qrCode}
              onChangeText={setQrCode}
              autoCapitalize="characters"
              editable={!isLoading}
            />
            <TouchableOpacity 
              style={[styles.manualButton, (!qrCode || isLoading) && styles.manualButtonDisabled]}
              onPress={() => handleAuthenticate()}
              disabled={!qrCode || isLoading}
            >
              <MaterialIcons name="arrow-forward" size={24} color={!qrCode || isLoading ? "#94a3b8" : "#008a45"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// Vista cuando HAY sesión activa - Escáner de casas
function ActiveSessionView({ navigation, activeSession, endSession }) {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { getHouseholdByQr } = useHouseholds();

  const handleScanHousehold = async (code) => {
    try {
      setIsScanning(true);
      const household = await getHouseholdByQr(code || qrCode);
      
      if (!household) {
        Alert.alert(
          'Hogar No Encontrado',
          'El código no corresponde a ningún hogar registrado',
          [{ text: 'OK' }]
        );
        return;
      }

      // Navegar a pantalla de calificación
      navigation.navigate('HouseholdRating', { 
        collector: activeSession.collector,
        vehicle: activeSession.vehicle,
        session: activeSession.session,
        household 
      });
      setQrCode('');
      setShowCamera(false);
    } catch (err) {
      Alert.alert(
        'Error al Escanear',
        err.message || 'No se pudo identificar el hogar',
        [{ text: 'OK' }]
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!isScanning && data) {
      handleScanHousehold(data);
    }
  };

  const openCamera = async () => {
    if (!permission) {
      Alert.alert('Solicitando Permisos', 'Esperando permisos de cámara...');
      return;
    }
    
    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Sin Permisos',
          'La aplicación necesita acceso a la cámara para escanear códigos QR',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleEndSession = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro que desea finalizar la jornada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Finalizar sesión en backend
              await apiService.endSession(activeSession.session.id);
              
              endSession();
            } catch (err) {
              Alert.alert(
                'Error',
                'No se pudo cerrar la sesión: ' + err.message,
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.content}>
      <View style={styles.activeHeader}>
        <View style={styles.sessionInfo}>
          <View style={styles.sessionRow}>
            <MaterialIcons name="person" size={20} color="#fff" />
            <Text style={styles.sessionText}>{activeSession.collector.name}</Text>
          </View>
          <View style={styles.sessionRow}>
            <MaterialIcons name="local-shipping" size={20} color="#fff" />
            <Text style={styles.sessionText}>{activeSession.vehicle.id}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.endSessionButton}
          onPress={handleEndSession}
        >
          <MaterialIcons name="exit-to-app" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerArea}>
        <View style={styles.textSection}>
          <Text style={styles.title}>Escanear Hogar</Text>
          <Text style={styles.description}>
            {isScanning ? 'Identificando hogar...' : (showCamera ? 'Apunte al código QR' : 'Active la cámara para escanear')}
          </Text>
        </View>

        <View style={styles.scannerContainer}>
          {showCamera ? (
            <View style={styles.cameraContainer}>
              <CameraView
                onBarcodeScanned={isScanning ? undefined : handleBarCodeScanned}
                style={styles.camera}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
              />
              <View style={styles.scannerOverlay}>
                <View style={styles.scanFrame}>
                  <View style={[styles.frameCorner, styles.frameTopLeft]} />
                  <View style={[styles.frameCorner, styles.frameTopRight]} />
                  <View style={[styles.frameCorner, styles.frameBottomLeft]} />
                  <View style={[styles.frameCorner, styles.frameBottomRight]} />
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeCameraButton}
                onPress={() => setShowCamera(false)}
              >
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.scannerFrameLarge}
              onPress={openCamera}
              disabled={isScanning}
            >
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
              
              <View style={styles.scannerContent}>
                <MaterialIcons 
                  name="qr-code-scanner" 
                  size={120} 
                  color={isScanning ? "rgba(0,138,69,0.7)" : "rgba(0,138,69,0.3)"} 
                />
                <Text style={styles.tapToScanText}>Toque para activar cámara</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese código manual"
            placeholderTextColor="#94a3b8"
            value={qrCode}
            onChangeText={setQrCode}
            autoCapitalize="characters"
            editable={!isScanning}
          />
          <TouchableOpacity 
            style={[styles.confirmButton, (!qrCode || isScanning) && styles.confirmButtonDisabled]}
            onPress={() => handleScanHousehold()}
            disabled={!qrCode || isScanning}
          >
            <Text style={styles.confirmButtonText}>
              {isScanning ? 'Verificando...' : 'Confirmar Código'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8f7',
  },
  content: {
    flex: 1,
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -2,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#008a45',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sessionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  endSessionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  scannerFrame: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scannerBorder: {
    width: 240,
    height: 240,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#008a45',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scannerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapToScanText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  buttonsContainer: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008a45',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  manualInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  manualButton: {
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualButtonDisabled: {
    opacity: 0.5,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  collectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  collectorDetails: {
    flex: 1,
  },
  collectorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  collectorId: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
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
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 138, 69, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  vehicleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  scannerArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scannerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cameraContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cameraContainerAuth: {
    width: '100%',
    height: 300,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#10b981',
    borderWidth: 4,
  },
  frameTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  frameTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  frameBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  frameBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  closeCameraButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scannerFrameLarge: {
    width: 280,
    height: 280,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  confirmButton: {
    backgroundColor: '#008a45',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
