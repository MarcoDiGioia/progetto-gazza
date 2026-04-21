import type { Prodotto } from '../models/Prodotto';

export type SemaforoColore = 'red' | 'orange' | 'yellow' | 'green';

export function getGiorniMancanti(prodotto: Prodotto): number {
  const oggi = new Date();
  const scadenza = new Date(prodotto.dataScadenza);
  return Math.floor((scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24));
}

export function getSemaforoColore(prodotto: Prodotto): SemaforoColore {
  const giorni = getGiorniMancanti(prodotto);
  if (giorni < 0) return 'red';
  if (giorni <= 3) return 'orange';
  if (giorni <= 7) return 'yellow';
  return 'green';
}

export function getSemaforoColorHex(colore: SemaforoColore): string {
  const colorMap: Record<SemaforoColore, string> = {
    red: '#EF4444',
    orange: '#F97316',
    yellow: '#FBBF24',
    green: '#22C55E',
  };
  return colorMap[colore];
}

export function isScaduto(prodotto: Prodotto): boolean {
  return getGiorniMancanti(prodotto) < 0;
}

export function isScadenzaImminente(prodotto: Prodotto): boolean {
  return getGiorniMancanti(prodotto) <= 3;
}
