import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getHistory } from '../utils/database';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Prediction: {item.prediction}</Text>
        <Text style={styles.text}>Solution: {item.solution}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disease History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
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
    marginBottom: 20,
    textAlign: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 10
  },
  image: {
    width: 80,
    height: 60,
    borderRadius: 5,
    marginRight: 10
  },
  infoContainer: {
    justifyContent: 'center'
  },
  text: {
    color: '#fff'
  }
});
