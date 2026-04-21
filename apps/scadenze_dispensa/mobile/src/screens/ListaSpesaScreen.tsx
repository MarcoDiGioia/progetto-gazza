import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, SafeAreaView, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSpesa } from '@shared/context/SpesaContext';
import type { VoceSpesa } from '@shared/models/VoceSpesa';
import { toISOString } from '@shared/utils/dateUtils';
import BannerAd from '../components/BannerAd';

export default function ListaSpesaScreen() {
  const { state, refreshListaSpesa, aggiungiVoceSpesa, segnaVoceAcquistata, eliminaVoceSpesa } = useSpesa();
  const [showAddModal, setShowAddModal] = useState(false);
  const [nuovaVoce, setNuovaVoce] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshListaSpesa();
  }, [refreshListaSpesa]);

  const handleAddVoce = async () => {
    if (!nuovaVoce.trim()) {
      Alert.alert('Errore', 'Inserisci il nome della voce');
      return;
    }
    setLoading(true);
    try {
      const voce: Omit<VoceSpesa, 'id'> = {
        nome: nuovaVoce.trim(),
        quantita: 1,
        dataAggiunta: toISOString(new Date()),
        acquistato: 0,
      };
      await aggiungiVoceSpesa(voce);
      setNuovaVoce('');
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleElimina = (id: number) => {
    Alert.alert('Elimina Voce', 'Sei sicuro?', [
      { text: 'Annulla', onPress: () => {}, style: 'cancel' },
      { text: 'Elimina', onPress: () => eliminaVoceSpesa(id), style: 'destructive' },
    ]);
  };

  const renderItem = ({ item }: { item: VoceSpesa }) => (
    <View style={styles.voceContainer}>
      <TouchableOpacity style={styles.checkbox} onPress={() => segnaVoceAcquistata(item.id!)}>
        <Ionicons name="checkmark-circle-outline" size={24} color="#22C55E" />
      </TouchableOpacity>
      <View style={styles.voceContent}>
        <Text style={styles.voceName}>{item.nome}</Text>
        <Text style={styles.voceQty}>Qty: {item.quantita}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleElimina(item.id!)}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lista Spesa</Text>
        </View>

        {state.error && <View style={styles.errorContainer}><Text style={styles.errorText}>{state.error}</Text></View>}

        {state.loading ? (
          <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#EF4444" /></View>
        ) : state.voci.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Lista spesa vuota</Text>
          </View>
        ) : (
          <FlatList data={state.voci} keyExtractor={(item) => item.id?.toString() || ''} renderItem={renderItem} contentContainerStyle={styles.listContent} />
        )}

        <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={() => !loading && setShowAddModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Aggiungi Voce</Text>
              <TextInput style={styles.modalInput} placeholder="Nome articolo" value={nuovaVoce} onChangeText={setNuovaVoce} editable={!loading} />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setShowAddModal(false)} disabled={loading}>
                  <Text style={styles.modalButtonText}>Annulla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonSubmit]} onPress={handleAddVoce} disabled={loading}>
                  {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.modalButtonSubmitText}>Aggiungi</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <BannerAd />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  listContent: { paddingVertical: 8, flexGrow: 1 },
  errorContainer: { backgroundColor: '#FEE2E2', paddingHorizontal: 16, paddingVertical: 10, margin: 8, borderRadius: 6, borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  errorText: { color: '#7F1D1D', fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginTop: 16 },
  voceContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 12, marginVertical: 4, marginHorizontal: 8, borderRadius: 8, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  checkbox: { padding: 8, marginRight: 8 },
  voceContent: { flex: 1 },
  voceName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  voceQty: { fontSize: 13, color: '#6B7280' },
  deleteButton: { padding: 8, marginLeft: 8 },
  fab: { position: 'absolute', bottom: 60, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  modalInput: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1F2937', marginBottom: 16 },
  modalButtonContainer: { flexDirection: 'row', gap: 10 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: 'center', backgroundColor: '#F3F4F6' },
  modalButtonText: { color: '#1F2937', fontSize: 16, fontWeight: '600' },
  modalButtonSubmit: { backgroundColor: '#EF4444' },
  modalButtonSubmitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
