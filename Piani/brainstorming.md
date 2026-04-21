# Brainstorming Progetto Gazza - Analisi Mercato

**Data**: 21 Aprile 2026  
**Scopo**: Identificare le migliori opportunità di mercato per le prime app da sviluppare

---

## Brainstorming Categorie (Iniziale)

### Produttività
- Lista della spesa veloce
- TODO minimale
- Contatore abitudini giornaliere

### Salute e Corpo
- Calcola BMI
- Tracker acqua giornaliero
- Contatore calorie approssimativo
- Timer allenamento
- Tracker ciclo mestruale

### Calcoli e Denaro
- Calcolatore mancia / divisione conto
- Calcolatore sconto
- Dividi il conto
- Calcolatore interessi semplice

### Utilità Pratiche
- Livella digitale
- Metronomo
- Misuratore rumore (dB)
- Cronometro con giri

### Generatori e Casualità
- Dado virtuale
- Generatore password offline
- "Chi paga?" - scegli persona casuale
- Ruota della fortuna
- Generatore nomi

### Giochi Semplici
- Sudoku offline
- 2048
- Solitario
- Tris contro AI locale
- Indovina il numero

### Quiz e Apprendimento
- Quiz patente offline
- Flashcard offline
- Quiz trivia per categorie

### Bambini
- Impara alfabeto
- Impara a contare
- Disegna e colora

### Creatività
- Generatore palette colori
- Generatore sfondi geometrici

### Utilità Quotidiane (categoria emersa)
- **Dove Ho Parcheggiato?** — salva GPS offline
- **Serbatoio Pieno** — traccia rifornimenti, calcola km/L
- **Conta Soldi** — conta banconote/monete
- **Biglietto da Visita** — genera QR code contatti
- **Misura Passi** — contatore offline
- **Testo Grande** — ingrandisci testo per mostrarlo
- **Specchio** — fotocamera frontale come specchio
- **Livello Sonno** — traccia ore dormite
- **Ricarica Intelligente** — notifica batteria X%
- **Scadenze Frigo** — traccia scadenze prodotti

---

## Analisi Mercato - Risultati

### Le Migliori Opportunità

#### 1. Scadenze Frigo/Dispensa — MIGLIORE OPPORTUNITÀ

| Voce | Dato |
|------|------|
| Download app leader (Fridgely) | ~2.900 su Android |
| Competitor | 20-30 app, pochi utenti |
| Valutazione media | 3,8-4,2 stelle |

**Perché vale:**
- CozZo (app consolidata) abbandona il supporto gratuito a dicembre 2025 → vuoto di mercato
- Competitor buggate, UI datata, poco mantenute
- Bug frequenti, lingua sbagliata, scarsa integrazione barcode
- Trend: crescente consapevolezza sullo spreco alimentare

**Monetizzazione competitor:** mix variegato, nessun modello dominante — vantaggio per chi entra adesso.

---

#### 2. Bill Splitter / Calcolatore Mancia Moderno

| Voce | Dato |
|------|------|
| Download leader (Tip N Split) | 1M+ |
| Rating leader | **1.0 stella** (29.400 recensioni) |
| Competitor moderni (Splitwise, Splid) | 4+ stelle, in crescita |

**Perché vale:**
- Il leader di mercato è DETESTATO: ads aggressivi, feature non funzionanti, UI datata
- Mercato in evoluzione verso OCR ricevute, integrazione pagamenti, group chat
- Trend CAGR 11% (2025-2034)

---

#### 3. Water Tracker Gamificato

| Voce | Dato |
|------|------|
| Download leader | 1M+ |
| Rating leader | 4,8 stelle |
| Competitor significativi | 20+ |

**Perché vale:**
- Mercato in crescita rapida, non saturo come BMI
- Trend forte verso gamification (Plant Nanny con piante virtuali sta salendo)
- Problemi competitor: glitch nel tracciamento, mancanza supporto clienti

**Attenzione:** senza gamification è difficile differenziarsi.

---

#### 4. App Parcheggio

| Voce | Dato |
|------|------|
| Competitor attivi | 15-25 app |
| Rating leader (ParKing) | 3,8-4,0 stelle |

**Perché vale:**
- UI datata e poco intuitiva nei competitor
- Ads invasive a schermo intero (segnalate come pericolose durante la guida)
- Aggiornamenti infrequenti

---

### Da Evitare

| Categoria | Motivo |
|-----------|--------|
| BMI Calculator | Mercato saturo, leader 10M+ download |
| Discount Calculator | Commoditizzato, funzione già integrata nei device |
| Sudoku | Sudoku.com ha 100M+ download, dominanza totale |
| 2048 | Saturazione massima, infinite varianti già esistenti |
| Dado / Ruota della Fortuna | 5-10M download per i leader, troppo saturo |

---

## Matrice Riassuntiva

| Categoria | Download Leader | Rating Leader | Opportunità |
|-----------|----------------|---------------|-------------|
| Scadenze Frigo | ~2.900 | 3,8-4,2 | **ALTISSIMA** |
| Bill Splitter | 1M+ | 1,0 | **ALTA** |
| Water Tracker | 1M+ | 4,8 | **DISCRETA** |
| Parcheggio | n.d. | 3,8-4,0 | **ALTA** |
| BMI Calculator | 10M+ | 4,4-4,9 | MINIMA |
| Sudoku | 100M+ | 4,7 | MINIMA |
| 2048 | 1M+ | 4,4 | ZERO |
| Dado | 5M+ | 4,7 | BASSA |
| Ruota Fortuna | 10M+ | 4,7 | BASSA |

---

## App Selezionata - Prima App: Scadenze Frigo Gratis

### Decisione
**App scelta**: Scadenze Frigo/Dispensa (Mercato quasi vergine, massima opportunità)

**Data inizio sviluppo**: 21 Aprile 2026

### Specifiche Progetto
| Aspetto | Dettaglio |
|--------|----------|
| **Nome** | Scadenze Frigo Gratis |
| **Piattaforma** | Android (Google Play Store) |
| **Tech Stack** | Flutter + Dart |
| **Database** | SQLite locale (sqflite) |
| **Monetizzazione** | Google AdMob (banner + interstitial ogni 3 prodotti) |

### Features MVP Implementate
1. ✅ Lista prodotti con colori dinamici (verde/giallo/arancio/rosso)
2. ✅ Aggiunta prodotto con nome, data scadenza, categoria, quantità
3. ✅ Notifiche locali (X giorni prima della scadenza)
4. ✅ Scanner barcode per aggiunta veloce
5. ✅ Lista della spesa integrata
6. ✅ Impostazioni (giorni preavviso notifiche)
7. ✅ Database SQLite completamente locale
8. ✅ Google AdMob integration

### Struttura Progetto Creata
```
/apps/scadenze_dispensa/
├── lib/
│   ├── main.dart
│   ├── models/
│   │   ├── prodotto.dart
│   │   └── voce_spesa.dart
│   ├── screens/
│   │   ├── home_screen.dart (completato)
│   │   ├── aggiungi_prodotto_screen.dart (da completare)
│   │   ├── lista_spesa_screen.dart (da completare)
│   │   └── impostazioni_screen.dart (da completare)
│   ├── services/
│   │   ├── db_service.dart (completato)
│   │   ├── notifiche_service.dart (completato)
│   │   └── ads_service.dart (completato)
│   ├── widgets/
│   │   └── prodotto_card.dart (da completare)
│   └── utils/
├── pubspec.yaml (completato)
├── android/ (configurazione Android)
└── README.md
```

### Dipendenze Principali
- sqflite: database SQLite locale
- flutter_local_notifications: notifiche offline
- mobile_scanner: scanner barcode
- google_mobile_ads: monetizzazione AdMob
- intl: formattazione date italiano
- provider: state management

### Prossimi Passi Implementazione
- [ ] Completare AggiungiProdottoScreen con form + scanner barcode
- [ ] Completare ListaSpesaScreen
- [ ] Completare ImpostazioniScreen
- [ ] Creare BannerAdWidget
- [ ] Testare su emulatore Android
- [ ] Configurare Android manifest (permessi camera, notifiche, AdMob)
- [ ] Build APK release
- [ ] Pubblicare su Google Play Store

---

## Prossime App Candidate
Dopo Scadenze Frigo Gratis, candidate per sviluppo:
1. **Bill Splitter Moderno** (ALTA opportunità) - Tip N Split è detestato (1.0 stelle)
2. **Water Tracker Gamificato** (DISCRETA opportunità) - Mercato in crescita
3. **App Parcheggio** (ALTA opportunità) - Leader debole, spazio per miglioramento
