import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Prodotto } from '@shared/models/Prodotto';
import { getGiorniMancanti, getSemaforoColore, getSemaforoColorHex } from '@shared/utils/semaforoUtils';
import { formatDataScadenza } from '@shared/utils/dateUtils';

interface ProdottoCardProps {
  prodotto: Prodotto;
  onConsumato: (id: number) => void;
  onElimina: (id: number) => void;
}

export default function ProdottoCard({ prodotto, onConsumato, onElimina }: ProdottoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const giorniMancanti = getGiorniMancanti(prodotto);
  const colore = getSemaforoColore(prodotto);
  const colorHex = getSemaforoColorHex(colore);

  const handleConsumato = () => {
    setMenuOpen(false);
    onConsumato(prodotto.id!);
  };

  const handleElimina = () => {
    setMenuOpen(false);
    Alert.alert(
      'Elimina Prodotto',
      `Sei sicuro di voler eliminare "${prodotto.nome}"?`,
      [
        { text: 'Annulla', onPress: () => {}, style: 'cancel' },
        { text: 'Elimina', onPress: () => onElimina(prodotto.id!), style: 'destructive' },
      ]
    );
  };

  const scadenzaText = giorniMancanti < 0
    ? `Scaduto da ${Math.abs(giorniMancanti)} giorni`
    : giorniMancanti === 0
    ? 'Scade oggi'
    : `Scade tra ${giorniMancanti} giorno${giorniMancanti === 1 ? '' : 'i'}`;

  return (
    <View style={styles.container}>
      <View style={[styles.colorDot, { backgroundColor: colorHex }]} />
      <View style={styles.content}>
        <Text style={styles.nome}>{prodotto.nome}</Text>
        <Text style={styles.categoria}>{prodotto.categoria} • Qty: {prodotto.quantita}</Text>
        <Text style={styles.scadenza}>{scadenzaText}</Text>
        <Text style={styles.dataScadenza}>{formatDataScadenza(prodotto.dataScadenza)}</Text>
      </View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuOpen(!menuOpen)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
      </TouchableOpacity>
      {menuOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleConsumato}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#22C55E" />
            <Text style={styles.dropdownText}>Consumato</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleElimina}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.dropdownText}>Elimina</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  categoria: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  scadenza: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  dataScadenza: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    minWidth: 150,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#1F2937',
  },
});
