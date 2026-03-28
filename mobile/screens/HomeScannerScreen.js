import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';

export default function HomeScannerScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#008a45" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identificar Hogar</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity
        style={styles.content}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('HouseholdRating')}
      >
        <View style={styles.textSection}>
          <Text style={styles.title}>Escanee QR de Vivienda</Text>
          <Text style={styles.description}>
            Apunte la cámara al código del domicilio
          </Text>
        </View>

        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
            
            <View style={styles.scannerContent}>
              <MaterialIcons name="qr-code" size={120} color="rgba(0,138,69,0.3)" />
            </View>

            <View style={styles.scannerOverlay}>
              <View style={styles.scanFrame}>
                <View style={[styles.frameCorner, styles.frameTopLeft]} />
                <View style={[styles.frameCorner, styles.frameTopRight]} />
                <View style={[styles.frameCorner, styles.frameBottomLeft]} />
                <View style={[styles.frameCorner, styles.frameBottomRight]} />
                <View style={styles.scanLine} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Ingrese código manual"
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirmar Código</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 138, 69, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 100,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  scannerContainer: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 384,
    marginBottom: 40,
  },
  scannerFrame: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#008a45',
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    zIndex: 10,
  },
  cornerTopLeft: {
    top: -4,
    left: -4,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#008a45',
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: -4,
    right: -4,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#008a45',
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: -4,
    left: -4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#008a45',
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: -4,
    right: -4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#008a45',
    borderBottomRightRadius: 12,
  },
  scannerContent: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 256,
    height: 256,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  frameTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#008a45',
    borderTopLeftRadius: 8,
  },
  frameTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#008a45',
    borderTopRightRadius: 8,
  },
  frameBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#008a45',
    borderBottomLeftRadius: 8,
  },
  frameBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#008a45',
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 138, 69, 0.6)',
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  inputSection: {
    width: '100%',
    maxWidth: 384,
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.2)',
    textAlign: 'center',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#008a45',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
