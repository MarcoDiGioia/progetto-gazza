import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Prodotto } from '../models/Prodotto';
import type { IDbService } from '../services/DbService';
import { subDays } from 'date-fns';
import { formatDataScadenza } from '../utils/dateUtils';

export interface NotificheService {
  scheduleNotifica(params: {
    id: string;
    titolo: string;
    testo: string;
    dataNotifica: Date;
  }): Promise<void>;
  cancelNotifica(id: string): Promise<void>;
  cancelAllNotifiche(): Promise<void>;
}

export interface AdsService {
  onProdottoAggiunto(): void;
}

interface ProdottiState {
  prodotti: Prodotto[];
  loading: boolean;
  error: string | null;
}

type ProdottiAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_PRODOTTI'; payload: Prodotto[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_PRODOTTO'; payload: Prodotto }
  | { type: 'REMOVE_PRODOTTO'; payload: number }
  | { type: 'MARK_CONSUMATO'; payload: number }
  | { type: 'CLEAR_ERROR' };

function prodottiReducer(state: ProdottiState, action: ProdottiAction): ProdottiState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_PRODOTTI':
      return { ...state, prodotti: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_PRODOTTO':
      return {
        ...state,
        prodotti: [...state.prodotti, action.payload].sort((a, b) =>
          new Date(a.dataScadenza).getTime() - new Date(b.dataScadenza).getTime()
        ),
      };
    case 'REMOVE_PRODOTTO':
      return { ...state, prodotti: state.prodotti.filter(p => p.id !== action.payload) };
    case 'MARK_CONSUMATO':
      return { ...state, prodotti: state.prodotti.filter(p => p.id !== action.payload) };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export interface ProdottiContextType {
  state: ProdottiState;
  refreshProdotti: () => Promise<void>;
  aggiungiProdotto: (prodotto: Omit<Prodotto, 'id'>) => Promise<void>;
  segnaProdottoConsumato: (id: number) => Promise<void>;
  eliminaProdotto: (id: number) => Promise<void>;
  clearError: () => void;
}

export const ProdottiContext = createContext<ProdottiContextType | undefined>(undefined);

interface ProdottiProviderProps {
  children: React.ReactNode;
  dbService: IDbService;
  notificheService?: NotificheService;
  adsService?: AdsService;
}

export function ProdottiProvider({
  children,
  dbService,
  notificheService,
  adsService,
}: ProdottiProviderProps) {
  const [state, dispatch] = useReducer(prodottiReducer, {
    prodotti: [],
    loading: false,
    error: null,
  });

  const refreshProdotti = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const prodotti = await dbService.getProdotti();
      dispatch({ type: 'SET_PRODOTTI', payload: prodotti });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Errore sconosciuto',
      });
    }
  }, [dbService]);

  const aggiungiProdotto = useCallback(
    async (prodotto: Omit<Prodotto, 'id'>) => {
      try {
        const newId = await dbService.aggiungiProdotto(prodotto);
        const nuovoProdotto: Prodotto = { ...prodotto, id: newId };
        dispatch({ type: 'ADD_PRODOTTO', payload: nuovoProdotto });

        // Trigger notifiche e ads
        if (notificheService) {
          const dataScadenza = new Date(prodotto.dataScadenza);
          const dataNotifica = subDays(dataScadenza, 1);

          if (dataNotifica > new Date()) {
            await notificheService.scheduleNotifica({
              id: `prodotto_${newId}`,
              titolo: `${prodotto.nome} sta per scadere!`,
              testo: `Scade il ${formatDataScadenza(prodotto.dataScadenza)}`,
              dataNotifica,
            });
          }
        }

        if (adsService) {
          adsService.onProdottoAggiunto();
        }
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Errore sconosciuto',
        });
      }
    },
    [dbService, notificheService, adsService]
  );

  const segnaProdottoConsumato = useCallback(
    async (id: number) => {
      try {
        await dbService.segnaProdottoConsumato(id);
        if (notificheService) {
          await notificheService.cancelNotifica(`prodotto_${id}`);
        }
        dispatch({ type: 'MARK_CONSUMATO', payload: id });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Errore sconosciuto',
        });
      }
    },
    [dbService, notificheService]
  );

  const eliminaProdotto = useCallback(
    async (id: number) => {
      try {
        await dbService.eliminaProdotto(id);
        if (notificheService) {
          await notificheService.cancelNotifica(`prodotto_${id}`);
        }
        dispatch({ type: 'REMOVE_PRODOTTO', payload: id });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Errore sconosciuto',
        });
      }
    },
    [dbService, notificheService]
  );

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <ProdottiContext.Provider
      value={{
        state,
        refreshProdotti,
        aggiungiProdotto,
        segnaProdottoConsumato,
        eliminaProdotto,
        clearError,
      }}
    >
      {children}
    </ProdottiContext.Provider>
  );
}

export function useProdotti(): ProdottiContextType {
  const context = useContext(ProdottiContext);
  if (!context) {
    throw new Error('useProdotti must be used within ProdottiProvider');
  }
  return context;
}
