import type { Prodotto } from '../models/Prodotto';
import type { VoceSpesa } from '../models/VoceSpesa';
import { DB_CONFIG } from '../utils/constants';

export interface IDbService {
  init(): Promise<void>;
  aggiungiProdotto(prodotto: Omit<Prodotto, 'id'>): Promise<number>;
  getProdotti(): Promise<Prodotto[]>;
  segnaProdottoConsumato(id: number): Promise<void>;
  eliminaProdotto(id: number): Promise<void>;
  aggiornaProdotto(prodotto: Prodotto): Promise<void>;
  aggiungiVoceSpesa(voce: Omit<VoceSpesa, 'id'>): Promise<number>;
  getListaSpesa(): Promise<VoceSpesa[]>;
  segnaVoceAcquistata(id: number): Promise<void>;
  eliminaVoceSpesa(id: number): Promise<void>;
  aggiornaVoceSpesa(voce: VoceSpesa): Promise<void>;
  svuotaProdotti(): Promise<void>;
  svuotaListaSpesa(): Promise<void>;
  svuotaTutto(): Promise<void>;
}

// Implementazione specifiche della piattaforma saranno in mobile/DbService e web/DbService
export { DB_CONFIG };
