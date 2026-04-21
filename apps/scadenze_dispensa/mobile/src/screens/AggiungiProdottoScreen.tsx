import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Text, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useProdotti } from '@shared/context/ProdottiContext';
import type { Prodotto, CategoriaProdotto } from '@shared/models/Prodotto';
import { CATEGORIE } from '@shared/models/Prodotto';
import { toISOString, formatDataScadenza } from '@shared/utils/dateUtils';
import BannerAd from '../components/BannerAd';

type Props = NativeStackScreenProps<any, 'AggiungiProdotto'>;

export default function AggiungiProdottoScreen({ navigation }: Props) {
  const { aggiungiProdotto } = useProdotti();
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaProdotto>('Altro');
  const [quantita, setQuantita] = useState('1');
  const [dataScadenza, setDataScadenza] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (_event: any, date?: Date) => {
    if (date) setDataScadenza(date);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Errore', 'Inserisci il nome del prodotto');
      return;
    }
    const quantitaNum = parseInt(quantita) || 1;
    if (quantitaNum < 1) {
      Alert.alert('Errore', 'La quantità deve essere almeno 1');
      return;
    }

    setLoading(true);
    try {
      const nuovoProdotto: Omit<Prodotto, 'id'> = {
        nome: nome.trim(),
        categoria,
        quantita: quantitaNum,
        dataScadenza: toISOString(dataScadenza),
        dataAggiunta: toISOString(new Date()),
        consumato: 0,
      };
      await aggiungiProdotto(nuovoProdotto);
      Alert.alert('Successo', 'Prodotto aggiunto correttamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Errore', error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.label}>Nome Prodotto *</Text>
            <TextInput style={styles.input} placeholder="Es: Latte fresco" value={nome} onChangeText={setNome} editable={!loading} />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={categoria} onValueChange={(value: CategoriaProdotto) => setCategoria(value)} enabled={!loading}>
                {CATEGORIE.map((cat) => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Quantità</Text>
            <TextInput style={styles.input} placeholder="1" keyboardType="number-pad" value={quantita} onChangeText={setQuantita} editable={!loading} />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Data Scadenza *</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)} disabled={loading}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.dateButtonText}>{formatDataScadenza(toISOString(dataScadenza))}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && <DateTimePicker value={dataScadenza} mode="date" display="spinner" onChange={handleDateChange} />}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()} disabled={loading}>
              <Text style={styles.cancelButtonText}>Annulla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Aggiungi</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1 },
  form: { padding: 16 },
  section: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1F2937' },
  pickerContainer: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, overflow: 'hidden' },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10 },
  dateButtonText: { marginLeft: 10, fontSize: 14, color: '#1F2937' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 24 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB' },
  submitButton: { backgroundColor: '#EF4444' },
  buttonDisabled: { opacity: 0.6 },
  cancelButtonText: { color: '#1F2937', fontSize: 16, fontWeight: '600' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
