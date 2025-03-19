import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.text}>
        Configure your app settings here (e.g., backend IP, BLE setup, etc.).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20
  },
  header: {
    fontSize: 24,
    color: '#00FF7F',
    fontWeight: 'bold',
    marginBottom: 20
  },
  text: {
    color: '#fff'
  }
});
