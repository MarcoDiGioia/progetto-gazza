import React, { useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useProdotti } from '@shared/context/ProdottiContext';
import ProdottoCard from '../components/ProdottoCard';
import BannerAd from '../components/BannerAd';
import { BannerAdSize } from 'react-native-google-mobile-ads';

type Props = NativeStackScreenProps<any, 'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const { state, refreshProdotti, segnaProdottoConsumato, eliminaProdotto } = useProdotti();

  useEffect(() => {
    refreshProdotti();
  }, [refreshProdotti]);

  return (
    <SafeAreaView style={styles.safeArea}>
        <BannerAd size={BannerAdSize.LARGE_BANNER} />
      <View style={styles.container}>
        {state.error && <View style={styles.errorContainer}><Text style={styles.errorText}>{state.error}</Text></View>}
        {state.loading ? (
          <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#EF4444" /></View>
        ) : state.prodotti.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nessun prodotto nella dispensa</Text>
          </View>
        ) : (
          <FlatList data={state.prodotti} keyExtractor={(item) => item.id?.toString() || ''} renderItem={({ item }) => (
            <ProdottoCard prodotto={item} onConsumato={segnaProdottoConsumato} onElimina={eliminaProdotto} />
          )} contentContainerStyle={styles.listContent} />
        )}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AggiungiProdotto')}>
          <Ionicons name="add-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <BannerAd />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  listContent: { paddingVertical: 8, flexGrow: 1 },
  errorContainer: { backgroundColor: '#FEE2E2', paddingHorizontal: 16, paddingVertical: 10, margin: 8, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  errorText: { color: '#7F1D1D', fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginTop: 16 },
  fab: { position: 'absolute', bottom: 60, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
});
