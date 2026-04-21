import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { VoceSpesa } from '../models/VoceSpesa';
import type { IDbService } from '../services/DbService';

interface SpesaState {
  voci: VoceSpesa[];
  loading: boolean;
  error: string | null;
}

type SpesaAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_VOCI'; payload: VoceSpesa[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_VOCE'; payload: VoceSpesa }
  | { type: 'REMOVE_VOCE'; payload: number }
  | { type: 'MARK_ACQUISTATO'; payload: number }
  | { type: 'CLEAR_ERROR' };

function spesaReducer(state: SpesaState, action: SpesaAction): SpesaState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_VOCI':
      return { ...state, voci: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_VOCE':
      return { ...state, voci: [action.payload, ...state.voci] };
    case 'REMOVE_VOCE':
      return { ...state, voci: state.voci.filter(v => v.id !== action.payload) };
    case 'MARK_ACQUISTATO':
      return { ...state, voci: state.voci.filter(v => v.id !== action.payload) };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export interface SpesaContextType {
  state: SpesaState;
  refreshListaSpesa: () => Promise<void>;
  aggiungiVoceSpesa: (voce: Omit<VoceSpesa, 'id'>) => Promise<void>;
  segnaVoceAcquistata: (id: number) => Promise<void>;
  eliminaVoceSpesa: (id: number) => Promise<void>;
  clearError: () => void;
}

export const SpesaContext = createContext<SpesaContextType | undefined>(undefined);

interface SpesaProviderProps {
  children: React.ReactNode;
  dbService: IDbService;
}

export function SpesaProvider({ children, dbService }: SpesaProviderProps) {
  const [state, dispatch] = useReducer(spesaReducer, {
    voci: [],
    loading: false,
    error: null,
  });

  const refreshListaSpesa = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const voci = await dbService.getListaSpesa();
      dispatch({ type: 'SET_VOCI', payload: voci });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Errore sconosciuto',
      });
    }
  }, [dbService]);

  const aggiungiVoceSpesa = useCallback(
    async (voce: Omit<VoceSpesa, 'id'>) => {
      try {
        const newId = await dbService.aggiungiVoceSpesa(voce);
        const nuovaVoce: VoceSpesa = { ...voce, id: newId };
        dispatch({ type: 'ADD_VOCE', payload: nuovaVoce });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Errore sconosciuto',
        });
      }
    },
    [dbService]
  );

  const segnaVoceAcquistata = useCallback(
    async (id: number) => {
      try {
        await dbService.segnaVoceAcquistata(id);
        dispatch({ type: 'MARK_ACQUISTATO', payload: id });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Errore sconosciuto',
        });
      }
    },
    [dbService]
  );

  const eliminaVoceSpesa = useCallback(
    async (id: number) => {
      try {
        await dbService.eliminaVoceSpesa(id);
        dispatch({ type: 'REMOVE_VOCE', payload: id });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Errore sconosciuto',
        });
      }
    },
    [dbService]
  );

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <SpesaContext.Provider
      value={{
        state,
        refreshListaSpesa,
        aggiungiVoceSpesa,
        segnaVoceAcquistata,
        eliminaVoceSpesa,
        clearError,
      }}
    >
      {children}
    </SpesaContext.Provider>
  );
}

export function useSpesa(): SpesaContextType {
  const context = useContext(SpesaContext);
  if (!context) {
    throw new Error('useSpesa must be used within SpesaProvider');
  }
  return context;
}
