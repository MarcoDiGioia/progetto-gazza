import { open, type DB } from '@op-engineering/op-sqlite';
import type { Prodotto } from '@shared/models/Prodotto';
import type { VoceSpesa } from '@shared/models/VoceSpesa';
import type { IDbService } from '@shared/services/DbService';
import { DB_CONFIG } from '@shared/utils/constants';

class DbService implements IDbService {
  private static instance: DbService;
  private db: DB | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.db = open({ name: DB_CONFIG.NAME });
      await this.createTables();
      this.isInitialized = true;
    } catch (error) {
      console.error('DbService init error:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS prodotti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        dataScadenza TEXT NOT NULL,
        categoria TEXT NOT NULL,
        quantita INTEGER DEFAULT 1,
        dataAggiunta TEXT NOT NULL,
        consumato INTEGER DEFAULT 0
      )
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS lista_spesa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        quantita INTEGER DEFAULT 1,
        dataAggiunta TEXT NOT NULL,
        acquistato INTEGER DEFAULT 0
      )
    `);
  }

  async aggiungiProdotto(prodotto: Omit<Prodotto, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.execute(
      `INSERT INTO prodotti (nome, dataScadenza, categoria, quantita, dataAggiunta, consumato)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prodotto.nome, prodotto.dataScadenza, prodotto.categoria, prodotto.quantita, prodotto.dataAggiunta, prodotto.consumato]
    );
    return result.insertId || 0;
  }

  async getProdotti(): Promise<Prodotto[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.execute(
      `SELECT * FROM prodotti WHERE consumato = 0 ORDER BY dataScadenza ASC`
    );
    return (result.rows ?? []) as unknown as Prodotto[];
  }

  async segnaProdottoConsumato(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(
      `UPDATE prodotti SET consumato = 1 WHERE id = ?`,
      [id]
    );
  }

  async eliminaProdotto(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`DELETE FROM prodotti WHERE id = ?`, [id]);
  }

  async aggiornaProdotto(prodotto: Prodotto): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(
      `UPDATE prodotti SET nome=?, dataScadenza=?, categoria=?, quantita=?, consumato=? WHERE id=?`,
      [prodotto.nome, prodotto.dataScadenza, prodotto.categoria, prodotto.quantita, prodotto.consumato, prodotto.id!]
    );
  }

  async aggiungiVoceSpesa(voce: Omit<VoceSpesa, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.execute(
      `INSERT INTO lista_spesa (nome, quantita, dataAggiunta, acquistato) VALUES (?, ?, ?, ?)`,
      [voce.nome, voce.quantita, voce.dataAggiunta, voce.acquistato]
    );
    return result.insertId || 0;
  }

  async getListaSpesa(): Promise<VoceSpesa[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.execute(
      `SELECT * FROM lista_spesa WHERE acquistato = 0 ORDER BY dataAggiunta DESC`
    );
    return (result.rows ?? []) as unknown as VoceSpesa[];
  }

  async segnaVoceAcquistata(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(
      `UPDATE lista_spesa SET acquistato = 1 WHERE id = ?`,
      [id]
    );
  }

  async eliminaVoceSpesa(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`DELETE FROM lista_spesa WHERE id = ?`, [id]);
  }

  async aggiornaVoceSpesa(voce: VoceSpesa): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(
      `UPDATE lista_spesa SET nome=?, quantita=?, acquistato=? WHERE id=?`,
      [voce.nome, voce.quantita, voce.acquistato, voce.id!]
    );
  }

  async svuotaProdotti(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`DELETE FROM prodotti`);
  }

  async svuotaListaSpesa(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`DELETE FROM lista_spesa`);
  }

  async svuotaTutto(): Promise<void> {
    await this.svuotaProdotti();
    await this.svuotaListaSpesa();
  }
}

export const dbService = DbService.getInstance();
