import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSession } from '../contexts/SessionContext';

export default function MobileNav({ navigation, currentRoute }) {
  const { activeSession } = useSession();
  const isActive = (routeName) => currentRoute === routeName;

  const handleHistoryPress = () => {
    if (!activeSession) {
      Alert.alert(
        'Acceso Restringido',
        'Debe identificarse como recolector para ver el historial',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('History');
  };

  return (
    <View style={styles.nav}>
      <View style={styles.navContent}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialIcons 
            name="home" 
            size={24} 
            color={isActive('Home') ? '#008a45' : '#94a3b8'} 
          />
          <Text style={[styles.navText, isActive('Home') && styles.navTextActive]}>
            INICIO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, !activeSession && styles.navItemDisabled]} 
          onPress={handleHistoryPress}
          disabled={!activeSession && currentRoute !== 'History'}
        >
          <MaterialIcons 
            name="history" 
            size={24} 
            color={isActive('History') ? '#008a45' : (!activeSession ? '#cbd5e1' : '#94a3b8')} 
          />
          <Text style={[
            styles.navText, 
            isActive('History') && styles.navTextActive,
            !activeSession && styles.navTextDisabled
          ]}>
            HISTORIAL
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 138, 69, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  navContent: {
    flexDirection: 'row',
    maxWidth: 448,
    marginHorizontal: 'auto',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navItemDisabled: {
    opacity: 0.5,
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#94a3b8',
  },
  navTextActive: {
    color: '#008a45',
  },
  navTextDisabled: {
    color: '#cbd5e1',
  },
});
