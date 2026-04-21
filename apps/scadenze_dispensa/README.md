# Scadenze Dispensa Gratis - Multi-platform

Monorepo per Scadenze Dispensa Gratis con supporto mobile (React Native) e futuro web (React).

## Struttura

```
scadenze_dispensa/
├── shared/                  # Logica condivisa tra piattaforme
│   ├── src/
│   │   ├── models/          # Prodotto.ts, VoceSpesa.ts
│   │   ├── services/        # Interfacce DbService, AdsService, NotificheService
│   │   ├── utils/           # semaforoUtils.ts, dateUtils.ts, constants.ts
│   │   └── context/         # ProdottiContext.tsx, SpesaContext.tsx
│   └── package.json         # Dipendenze condivise (date-fns, types)
│
├── mobile/                  # React Native (Android/iOS)
│   ├── src/
│   │   ├── screens/         # HomeScreen, AggiungiProdottoScreen, ListaSpesaScreen, ImpostazioniScreen
│   │   ├── components/      # ProdottoCard, BannerAd
│   │   └── navigation/      # AppNavigator
│   ├── services/            # DbService (op-sqlite), NotificheService (Notifee), AdsService
│   ├── package.json
│   ├── tsconfig.json
│   ├── App.tsx
│   └── index.js
│
├── web/                     # React Web (futura)
│   ├── src/
│   │   ├── pages/           # Home, AggiungiProdotto, ListaSpesa, Impostazioni
│   │   ├── components/      # ProdottoCard, BannerAd (versione HTML/CSS)
│   │   └── layout/          # Navigation, Layout
│   ├── package.json
│   └── App.tsx
│
└── README.md
```

## Setup Mobile (React Native)

```bash
cd mobile
npm install
npm run android      # Avvia su emulatore Android
```

Prerequisiti:
- Node.js 16+
- Android SDK (minSDK 21)
- NDK 25.1 (per op-sqlite)

## Funzionalità Attualmente Implementate

✅ **Mobile (React Native)**:
- Gestione prodotti dispensa con notifiche scadenze
- Lista spesa integrata
- Semaforo visuale (rosso/arancione/giallo/verde)
- Database SQLite locale
- Annunci banner e interstitial

⏳ **Web (React)** — da implementare

## Condivisione di Codice

La cartella `shared/` contiene tutta la logica pura:
- **Modelli**: `Prodotto.ts`, `VoceSpesa.ts`
- **Utilità**: `semaforoUtils.ts`, `dateUtils.ts`
- **Context**: `ProdottiContext.tsx`, `SpesaContext.tsx`
- **Servizi**: interfacce astratte per DbService

Quando si crea la versione web:
1. Importa i modelli e le utilità da `shared/`
2. Implementa `DbService` per IndexedDB/Firestore
3. Riadatta `components/` per HTML/CSS (solo UI)

## Configurazione AdMob

In `shared/src/utils/constants.ts`, gli ID di test sono pre-configurati. Per il release, sostituisci con i tuoi ID reali e aggiorna `mobile/android/app/src/main/AndroidManifest.xml`.
