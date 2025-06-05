import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      const favorites = json ? JSON.parse(json) : [];
      const exists = favorites.some(p => p.id === product.id);
      setIsFavorite(exists);
    } catch (e) {
      console.error('Erro ao verificar favorito:', e);
    }
  };

  const toggleFavorite = async () => {
    try {
      const json = await AsyncStorage.getItem('favorites');
      let favorites = json ? JSON.parse(json) : [];

      if (isFavorite) {
        favorites = favorites.filter(p => p.id !== product.id);
        Alert.alert('Removido dos favoritos');
      } else {
        favorites.push(product);
        Alert.alert('Adicionado aos favoritos');
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error('Erro ao atualizar favorito:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Button
        title={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        onPress={toggleFavorite}
        color={isFavorite ? 'red' : 'green'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
});
