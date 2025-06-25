import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';


import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Card = {
  id: number;
  card_no: string;
  image_path: string;
  is_active: number;
};

export default function CardsList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://complaints-bise.punjab.gov.pk/api/cards');
      const json = await response.json();
      const cardsList: Card[] = json.data || [];
      setCards(cardsList);
      setFilteredCards(cardsList);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      setSearchText("")
      fetchCards();
    }, [])
  );

  const handleSearch = () => {
    const filtered = cards.filter(card =>
      card.card_no.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCards(filtered);
  };


  const renderCard = ({ item }: { item: Card }) => (
    <View style={styles.card}>
      {item.image_path ? (
        <Image source={{ uri: item.image_path }} style={styles.cardImage} resizeMode="cover" />
      ) : null}
      <Text style={styles.cardNumber}>Card No: {item.card_no}</Text>
      <Text style={[styles.cardStatus, item.is_active ? styles.active : styles.inactive]}>
        {item.is_active ? '🟢 Active' : '🔴 Inactive'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Card Listings</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by card number"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noData}>No cards found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    height: 44,
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardStatus: {
    marginTop: 6,
    fontSize: 14,
  },
  active: {
    color: 'green',
  },
  inactive: {
    color: 'red',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});
