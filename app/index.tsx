import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Index() {
  const [verifyCardNo, setVerifyCardNo] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerify = async () => {

    Keyboard.dismiss();

    const trimmed = verifyCardNo.trim();
  
    const isValid = /^[a-zA-Z0-9]+$/.test(trimmed);
    if (!isValid) {
      setResult('❌ Card number must be alphanumeric with no spaces.');
      setCardImageUrl(null);
      return;
    }
  
    try {
      setLoading(true);
      setResult('');
      setCardImageUrl(null);
  
      const response = await fetch('https://complaints-bise.punjab.gov.pk/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ card_no: trimmed }),
      });
  
      const apiResponse = await response.json();
  
      if (apiResponse.status === true && apiResponse.data.image_path) {
        setResult('✅ Card number is verified.');
        setCardImageUrl(apiResponse.data.image_path);
      } else {
        setResult('❌ Card not found.');
      }
    } catch (error) {
      setResult('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      setVerifyCardNo("");
      setResult("");
      setCardImageUrl("")
    }, [])
  );
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔍 Card Verification</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter card number"
        value={verifyCardNo}
        onChangeText={setVerifyCardNo}
        keyboardType="default"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        <Text style={styles.verifyText}>Verify</Text>
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

      {cardImageUrl && (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: cardImageUrl }}
            style={styles.imagePreview}
          />
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    elevation: Platform.OS === 'android' ? 1 : 0,
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  verifyText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
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
  imagePreviewContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
});
