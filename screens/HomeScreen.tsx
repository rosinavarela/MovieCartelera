import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const screenWidth = Dimensions.get('window').width;

type Movie = {
  movie: string;
  description: string;
  genre: string;
  posterURL: string;
  trailerURL: string;
  cinemaShows: {
    cinema: string;
    shows: {
      date: string;
      timeToDisplay: string;
      formatLang: string;
      screenName: string;
      genre: string;
      rating: string;
      ratingDescription: string;
    }[];
  }[];
};

export default function HomeScreen() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<string[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    axios.get('https://api.movie.com.uy/api/shows/rss/data')
      .then(res => {
        const movies: Movie[] = res.data.contentCinemaShows;
        setAllMovies(movies);

        // Extraer todos los nombres de los complejos sin repetir
        const uniqueCinemas = new Set<string>();
        movies.forEach(movie => {
          movie.cinemaShows.forEach(show => {
            uniqueCinemas.add(show.cinema);
          });
        });

        setCinemas(Array.from(uniqueCinemas));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al obtener datos:', err);
        setLoading(false);
      });
  }, []);

  const onSelectCinema = (cinema: string) => {
    setSelectedCinema(cinema);
    const moviesInCinema = allMovies.filter(movie =>
      movie.cinemaShows.some(show => show.cinema === cinema)
    );
    setFilteredMovies(moviesInCinema);
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Seleccioná Un Complejo</Text>
      <Picker
        selectedValue={selectedCinema}
        onValueChange={onSelectCinema}
        style={styles.picker}
        itemStyle={styles.pickerItem}  // Agrega este estilo para controlar el espaciado entre los elementos
      >
        <Picker.Item label="Elegí un complejo..." value={null} />
        {cinemas.map(cinema => (
          <Picker.Item key={cinema} label={cinema} value={cinema}/>
        ))}
      </Picker>

      {selectedCinema && (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item, index) => `${item.movie}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate('Detail', {
                  pelicula: item,
                  cinema: selectedCinema,
                })
              }            >
              <Image source={{ uri: item.posterURL }} style={styles.poster} resizeMode="cover" />
              <Text style={styles.title}>{item.movie}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#000' },
  header: { fontSize: 24, fontWeight: 'bold', marginTop:20, textAlign: 'center', color: '#fff'},
  picker: { marginBottom: 10, color:'#fff'},
  pickerItem: {color: '#fff', fontSize: 20},
  list: { alignItems: 'center'},
  item: { marginBottom: 20, marginTop:10, alignItems: 'center', color:'#fff'},
  poster: {
    width: screenWidth * 0.9,
    height: screenWidth * 1.3,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff' 
  },
});
