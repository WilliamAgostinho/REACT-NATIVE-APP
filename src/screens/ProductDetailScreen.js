import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const FAVORITES_KEY = '@favorites';

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        const exists = parsedFavorites.some(item => item.id === product.id);
        setIsFavorite(exists);
      }
    } catch (error) {
      console.error('Erro ao verificar favoritos:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let parsedFavorites = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        parsedFavorites = parsedFavorites.filter(item => item.id !== product.id);
        Alert.alert('Sucesso', 'Produto removido dos favoritos');
      } else {
        parsedFavorites.push(product);
        Alert.alert('Sucesso', 'Produto adicionado aos favoritos');
      }

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(parsedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={{ width: 24 }} />
      </View>

      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
          <View style={styles.rating}>
            <Icon name="star" size={18} color="#FBBF24" />
            <Text style={styles.ratingText}>{product.rating?.rate || '4.5'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: isFavorite ? '#ff4d4d' : '#111' }]}
          onPress={toggleFavorite}
        >
          <Icon 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={20} 
            color="#fff" 
            style={styles.buttonIcon}
          />
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 6,
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#111',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 20,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
});
