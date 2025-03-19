import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SensorCard({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 8,
    margin: 5,
    width: '45%'
  },
  label: {
    color: '#888',
    fontSize: 14
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
