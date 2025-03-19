import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import SensorCard from '../components/SensorCard';
import { insertHistory } from '../utils/database';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState('N/A');
  const [solution, setSolution] = useState('N/A');
  const [sensorData, setSensorData] = useState({
    moisture: '--',
    temp: '--',
    pH: '--',
    npk: 'N:-- P:-- K:--'
  });

  useEffect(() => {
    // Fetch sensor data on mount
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    try {
      // Replace with your backend or ESP32 IP/port
      const response = await axios.get('http://YOUR_BACKEND_IP:8000/sensor-data');
      setSensorData(response.data);
    } catch (error) {
      console.log('Error fetching sensor data:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const sendForPrediction = async () => {
    if (!imageUri) return;
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'leaf.jpg',
        type: 'image/jpeg'
      });

      const response = await axios.post(
        'http://YOUR_BACKEND_IP:8000/predict',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setPrediction(response.data.prediction);
      setSolution(response.data.solution);

      // Save to local history
      insertHistory(response.data.prediction, response.data.solution, imageUri);

    } catch (error) {
      console.log('Error in prediction:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Plant Health AI</Text>

      <View style={styles.sensorContainer}>
        <SensorCard label="Soil Moisture" value={`${sensorData.moisture}%`} />
        <SensorCard label="Temperature" value={`${sensorData.temp}°C`} />
        <SensorCard label="pH Level" value={`${sensorData.pH}`} />
        <SensorCard label="NPK Levels" value={`${sensorData.npk}`} />
      </View>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.previewText}>No image selected</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>📁 Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.buttonText}>📸 Capture Image</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.predictButton} onPress={sendForPrediction}>
        <Text style={styles.buttonText}>Predict Disease</Text>
      </TouchableOpacity>

      <View style={styles.predictionContainer}>
        <Text style={styles.predictionText}>Disease Prediction: {prediction}</Text>
        <Text style={styles.predictionText}>Suggested Solution: {solution}</Text>
      </View>
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
  sensorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  imageContainer: {
    marginVertical: 20,
    alignItems: 'center'
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 10
  },
  previewText: {
    color: '#888',
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10
  },
  buttonText: {
    color: '#00FF7F',
    fontWeight: 'bold'
  },
  predictButton: {
    backgroundColor: '#006400',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center'
  },
  predictionContainer: {
    marginTop: 20
  },
  predictionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5
  }
});
