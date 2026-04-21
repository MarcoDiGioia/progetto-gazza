export interface Prodotto {
  id?: number;
  nome: string;
  dataScadenza: string;
  categoria: string;
  quantita: number;
  dataAggiunta: string;
  consumato: 0 | 1;
}

export type CategoriaProdotto =
  | 'Latticini'
  | 'Carne'
  | 'Pesce'
  | 'Verdura'
  | 'Frutta'
  | 'Bevande'
  | 'Condimenti'
  | 'Surgelati'
  | 'Altro';

export const CATEGORIE: CategoriaProdotto[] = [
  'Latticini',
  'Carne',
  'Pesce',
  'Verdura',
  'Frutta',
  'Bevande',
  'Condimenti',
  'Surgelati',
  'Altro',
];
