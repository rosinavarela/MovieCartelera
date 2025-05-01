import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

export default function DetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
  const { pelicula, cinema } = route.params;

  const sanitizedCinema = cinema ? cinema.toLowerCase().trim() : "";
  const horariosParaCine = pelicula.cinemaShows.filter(
    (show: any) => show.cinema.toLowerCase().trim() === sanitizedCinema
  );

  const horarios = horariosParaCine.length > 0 ? horariosParaCine[0].shows : [];

  const horariosAgrupados = horarios.reduce((acc: any, show: any) => {
    const partes = show.timeToDisplay.trim().split(' ');
    const hora = partes.pop();
    const fecha = partes.join(' ');
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push({ ...show, hora });
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pelicula.movie}</Text>
      <Image source={{ uri: pelicula.posterURL }} style={styles.poster} />

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.description}>{pelicula.description}</Text>

      <Text style={styles.sectionTitle}>Género</Text>
      <Text style={styles.infoText}>{pelicula.genre}</Text>

      {pelicula.trailerURL && (
        <>
          <Text style={styles.sectionTitle}>Trailer</Text>
          <View style={styles.webviewContainer}>
            <WebView
              source={{ uri: pelicula.trailerURL }}
              style={styles.webview}
              allowsFullscreenVideo
            />
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Horarios en {cinema}</Text>
      {Object.keys(horariosAgrupados).length > 0 ? (
        Object.entries(horariosAgrupados).map(([fecha, shows]: [string, any[]]) => (
          <View key={fecha} style={styles.dateGroup}>
            <Text style={styles.dateTitle}>{fecha}</Text>
            {shows.map((show, index) => (
              <Text key={index} style={styles.timeRow}>
                {show.hora} - {show.formatLang}
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text>No hay horarios disponibles para este complejo.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop: 10, textAlign: 'center', color: '#fff' },
  poster: {
    width: screenWidth * 0.9,
    height: screenWidth * 1.3,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#fff' },
  description: { fontSize: 16, textAlign: 'justify', color: '#fff' },
  infoText: { fontSize: 16, marginBottom: 10, color: '#fff'},
  webviewContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  webview: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 15,
    color: '#fff'
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff'
  },
  timeRow: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff'
  },
});
