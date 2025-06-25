import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddCard() {

  const [cardNo, setCardNo] = useState <string>("");
  const [cardImage, setCardImage] = useState <string>("");
  const [result, setResult] = useState<string>("");


  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera and media library permissions are required.');
      return false;
    }
  
    return true;
  };


  const takePhoto = async () => {
     const hasPermission = await requestPermissions();
    if (!hasPermission) return;
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });
  
    if (!result.canceled) {
      const photo = result.assets[0].uri;
      setCardImage(photo);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
  if (!hasPermission) return;
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0].uri;
      setCardImage(image);
    }
  };

  const handleSubmit = async () => {
    if (!cardNo || !cardImage) {
      setResult('❌ Please enter card number and upload an image.');
      return;
    }
  
    try {
      setResult('⏳ Uploading...');
      const formData = new FormData();

      const image = {
        uri: cardImage, // Ensure this is correct
        name: 'upload.jpg', // Or derive from original filename if available
        type: 'image/jpeg', // You can also use 'image/png'
      };

      formData.append('card_no', cardNo);
      formData.append('image', image);

      const response = await fetch('https://complaints-bise.punjab.gov.pk/api/add-card', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
      if (data.status === true) {
        setResult(`✅ ${data.message}`)
        setCardNo("");
        setCardImage("");
      } else {
        setResult(`❌ ${data.message}`)
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResult('❌ An error occurred while uploading.');
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      setCardNo("");
      setResult("");
      setCardImage("")
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add New Card</Text>

      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter card number"
        value={cardNo}
        onChangeText={setCardNo}
        keyboardType="default"
      />

      <Text style={styles.label}>Upload Card Image</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>📷 Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <Text style={styles.buttonText}>🖼️ Gallery</Text>
        </TouchableOpacity>
      </View>

      {cardImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: cardImage }} style={styles.imagePreview} />
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
      {result !== '' && (
        <View
          style={[
            styles.resultBox,
            result.includes('✅') ? styles.success : styles.error,
          ]}
        >
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  resultBox: {
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  success: {
    backgroundColor: '#d1f7c4',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#fde2e2',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
