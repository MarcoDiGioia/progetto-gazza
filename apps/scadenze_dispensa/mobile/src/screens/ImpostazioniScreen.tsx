import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { dbService } from '../services/DbService';
import { notificheService } from '../services/NotificheService';
import { useProdotti } from '@shared/context/ProdottiContext';
import { useSpesa } from '@shared/context/SpesaContext';
import { APP_INFO } from '@shared/utils/constants';
import BannerAd from '../components/BannerAd';

export default function ImpostazioniScreen() {
  const { refreshProdotti } = useProdotti();
  const { refreshListaSpesa } = useSpesa();
  const [loading, setLoading] = useState(false);

  const handleSvuotaProdotti = () => {
    Alert.alert('Svuota Dispensa', 'Sei sicuro? Questa azione non può essere annullata.', [
      { text: 'Annulla', onPress: () => {}, style: 'cancel' },
      {
        text: 'Svuota',
        onPress: async () => {
          setLoading(true);
          try {
            await dbService.svuotaProdotti();
            await notificheService.cancelAllNotifiche();
            await refreshProdotti();
            Alert.alert('Successo', 'Dispensa svuotata');
          } catch (error) {
            Alert.alert('Errore', error instanceof Error ? error.message : 'Errore sconosciuto');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSvuotaListaSpesa = () => {
    Alert.alert('Svuota Lista Spesa', 'Sei sicuro? Questa azione non può essere annullata.', [
      { text: 'Annulla', onPress: () => {}, style: 'cancel' },
      {
        text: 'Svuota',
        onPress: async () => {
          setLoading(true);
          try {
            await dbService.svuotaListaSpesa();
            await refreshListaSpesa();
            Alert.alert('Successo', 'Lista spesa svuotata');
          } catch (error) {
            Alert.alert('Errore', error instanceof Error ? error.message : 'Errore sconosciuto');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSvuotaTutto = () => {
    Alert.alert('Svuota Tutto', 'Sei sicuro? Questa azione cancellerà tutti i dati.', [
      { text: 'Annulla', onPress: () => {}, style: 'cancel' },
      {
        text: 'Svuota Tutto',
        onPress: async () => {
          setLoading(true);
          try {
            await dbService.svuotaTutto();
            await notificheService.cancelAllNotifiche();
            await refreshProdotti();
            await refreshListaSpesa();
            Alert.alert('Successo', 'Tutti i dati sono stati eliminati');
          } catch (error) {
            Alert.alert('Errore', error instanceof Error ? error.message : 'Errore sconosciuto');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestione Dati</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.option} onPress={handleSvuotaProdotti} disabled={loading}>
              <View style={styles.optionContent}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Svuota Dispensa</Text>
                  <Text style={styles.optionSubtitle}>Elimina tutti i prodotti</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.option} onPress={handleSvuotaListaSpesa} disabled={loading}>
              <View style={styles.optionContent}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Svuota Lista Spesa</Text>
                  <Text style={styles.optionSubtitle}>Elimina tutti gli articoli</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.option} onPress={handleSvuotaTutto} disabled={loading}>
              <View style={styles.optionContent}>
                <Ionicons name="warning-outline" size={24} color="#DC2626" />
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Svuota Tutto</Text>
                  <Text style={styles.optionSubtitle}>Elimina tutti i dati</Text>
                </View>
              </View>
              {loading ? <ActivityIndicator size="small" color="#EF4444" /> : <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni App</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{APP_INFO.NAME}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versione</Text>
              <Text style={styles.infoValue}>{APP_INFO.VERSION}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sviluppato da</Text>
              <Text style={styles.infoValue}>{APP_INFO.AUTHOR}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrizione</Text>
          <View style={styles.card}>
            <Text style={styles.description}>Scadenze Dispensa Gratis è un'app semplice per tracciare le scadenze dei prodotti nella tua dispensa.</Text>
            <Text style={styles.description}>Ricevi notifiche quando un prodotto sta per scadere e gestisci la tua lista spesa.</Text>
            <Text style={styles.description}>Tutti i dati vengono salvati localmente. Nessuna connessione internet richiesta.</Text>
          </View>
        </View>
      </ScrollView>

      <BannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16, paddingVertical: 12 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  option: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  optionContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  optionText: { marginLeft: 12, flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  optionSubtitle: { fontSize: 13, color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#E5E7EB' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  description: { fontSize: 13, lineHeight: 20, color: '#6B7280', paddingHorizontal: 16, paddingVertical: 8 },
});
