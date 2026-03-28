import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MobileNav from '../components/MobileNav';

export default function HistoryScreen({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(12);

  const mockHistory = [
    { id: 1, date: '12/10/2023', time: '08:30 AM', address: 'Av. 18 de Julio 1450', collector: 'Carlos Pérez', status: 'Bueno', statusColor: '#16a34a' },
    { id: 2, date: '12/10/2023', time: '08:45 AM', address: 'Calle Los Álamos 452', collector: 'Juan García', status: 'Regular', statusColor: '#d97706' },
    { id: 3, date: '12/10/2023', time: '09:00 AM', address: 'Rivera 2345', collector: 'María López', status: 'Bueno', statusColor: '#16a34a' },
  ];

  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(
        <TouchableOpacity
          key={i}
          style={[styles.calendarDay, i === selectedDay && styles.calendarDaySelected]}
          onPress={() => setSelectedDay(i)}
        >
          <Text style={[styles.calendarDayText, i === selectedDay && styles.calendarDayTextSelected]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Historial Detallado</Text>
            <Text style={styles.headerSubtitle}>Registro completo de recolecciones municipales.</Text>
          </View>
          <TouchableOpacity style={styles.exportButton}>
            <MaterialIcons name="download" size={18} color="#fff" />
            <Text style={styles.exportButtonText}>Exportar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarSummaryRow}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity>
                <MaterialIcons name="chevron-left" size={24} color="#008a45" />
              </TouchableOpacity>
              <Text style={styles.calendarMonth}>Octubre 2023</Text>
              <TouchableOpacity>
                <MaterialIcons name="chevron-right" size={24} color="#008a45" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekdays}>
              {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map((day) => (
                <Text key={day} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Resumen del Día</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>1,248</Text>
                <Text style={styles.summaryLabel}>RECOLECCIONES</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>94%</Text>
                <Text style={styles.summaryLabel}>EFICIENCIA</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>12</Text>
                <Text style={styles.summaryLabel}>ALERTAS</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Fecha / Hora</Text>
            <Text style={styles.tableHeaderText}>Vivienda</Text>
            <Text style={styles.tableHeaderText}>Recolector</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
          </View>

          {mockHistory.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableCellBold}>{item.date}</Text>
                <Text style={styles.tableCellSmall}>{item.time}</Text>
              </View>
              <Text style={styles.tableCell}>{item.address}</Text>
              <Text style={styles.tableCell}>{item.collector}</Text>
              <View style={styles.tableCell}>
                <View style={[styles.statusBadge, { backgroundColor: `${item.statusColor}1a` }]}>
                  <Text style={[styles.statusText, { color: item.statusColor }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <MobileNav navigation={navigation} currentRoute="History" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8f7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  exportButton: {
    backgroundColor: '#008a45',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarSummaryRow: {
    gap: 24,
    marginBottom: 32,
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#008a45',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDay: {
    width: 40,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDaySelected: {
    backgroundColor: '#008a45',
  },
  calendarDayText: {
    fontSize: 12,
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#008a45',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#008a45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  summaryItem: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 138, 69, 0.05)',
    padding: 16,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#008a45',
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 138, 69, 0.05)',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  tableCellBold: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableCellSmall: {
    fontSize: 12,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
