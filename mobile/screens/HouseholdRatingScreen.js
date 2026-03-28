import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';

export default function HouseholdRatingScreen({ navigation }) {
  const handleRating = (rating) => {
    // Aquí se guardaría la calificación
    navigation.navigate('CollectorSession');
  };

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
              <Text style={styles.houseAddress}>Calle Los Álamos 452</Text>
            </View>
            <Text style={styles.houseId}>ID-8829-X</Text>
          </View>

          <View style={styles.houseImageContainer}>
            <View style={styles.houseImagePlaceholder}>
              <MaterialIcons name="home" size={60} color="#cbd5e1" />
            </View>
          </View>
        </View>

        <View style={styles.ratingsSection}>
          <Text style={styles.ratingsTitle}>CALIFICAR RECOLECCIÓN</Text>

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingGood]}
            onPress={() => handleRating('good')}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="thumb-up" size={36} color="#059669" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>Buena</Text>
              <Text style={styles.ratingDescription}>Correctamente separados.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingRegular]}
            onPress={() => handleRating('regular')}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="remove-circle-outline" size={36} color="#d97706" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>Regular</Text>
              <Text style={styles.ratingDescription}>Separación parcial.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ratingCard, styles.ratingBad]}
            onPress={() => handleRating('bad')}
          >
            <View style={styles.ratingIcon}>
              <MaterialIcons name="thumb-down" size={36} color="#dc2626" />
            </View>
            <View style={styles.ratingText}>
              <Text style={styles.ratingTitle}>Mala</Text>
              <Text style={styles.ratingDescription}>Totalmente mezclados.</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('CollectorSession')}
        >
          <Text style={styles.nextButtonText}>SIGUIENTE HOGAR</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
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
    // borderColor will be applied on press
  },
  ratingRegular: {
    // borderColor will be applied on press
  },
  ratingBad: {
    // borderColor will be applied on press
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
