# Gestione Ambienti — Scadenze Dispensa

Questo documento spiega come configurare, personalizzare e avviare l'app nei tre ambienti supportati: **dev**, **test** e **prod**.

---

## Come funziona

Il sistema legge la variabile d'ambiente `ENV` al momento del build/start. Babel la inietta staticamente nel bundle tramite `babel-plugin-transform-inline-environment-variables`, quindi il codice compilato contiene già i valori corretti per quell'ambiente — non c'è logica di selezione a runtime.

```
ENV=prod npm run android:prod
       │
       └─▶ Babel inietta "prod" nel bundle
              │
              └─▶ config/index.ts carica config/prod.ts
                     │
                     └─▶ constants.ts espone i valori corretti
                            │
                            └─▶ AdsService, DbService, NotificheService usano quei valori
```

---

## Struttura dei file di configurazione

```
shared/src/utils/
├── config/
│   ├── types.ts     — Interfaccia TypeScript (AppConfig)
│   ├── index.ts     — Entry point: legge ENV e seleziona il config
│   ├── dev.ts       — Configurazione sviluppo locale
│   ├── test.ts      — Configurazione staging/QA
│   └── prod.ts      — Configurazione produzione (Play Store)
└── constants.ts     — Ri-esporta i valori dal config attivo
```

---

## Differenze tra gli ambienti

| Impostazione             | dev                          | test                          | prod                           |
|--------------------------|------------------------------|-------------------------------|--------------------------------|
| **AdMob Banner ID**      | Google Test ID               | Google Test ID                | ID reale AdMob                 |
| **AdMob Interstitial ID**| Google Test ID               | Google Test ID                | ID reale AdMob                 |
| **Nome database**        | `scadenze_dispensa_dev.db`   | `scadenze_dispensa_test.db`   | `scadenze_dispensa.db`         |
| **debugMode**            | `true`                       | `true`                        | `false`                        |
| **Canale notifiche**     | `scadenze_dispensa_channel`  | `scadenze_dispensa_channel`   | `scadenze_dispensa_channel`    |

> **Perché database diversi?** Dev e test usano file `.db` separati, così puoi svuotare/modificare i dati di test senza toccare quelli di produzione installati sul telefono.

---

## Comandi disponibili

### Metro (bundler — per sviluppo con hot reload)

```bash
npm run start          # alias di start:dev
npm run start:dev      # ENV=dev  → Google Test IDs, DB dev
npm run start:test     # ENV=test → Google Test IDs, DB test
npm run start:prod     # ENV=prod → ID AdMob reali, DB prod
```

### Android

```bash
npm run android        # alias di android:dev
npm run android:dev    # Build debug con configurazione dev
npm run android:test   # Build debug con configurazione test
npm run android:prod   # Build debug con configurazione prod
```

### iOS

```bash
npm run ios            # alias di ios:dev
npm run ios:dev        # Build debug con configurazione dev
npm run ios:test       # Build debug con configurazione test
npm run ios:prod       # Build debug con configurazione prod
```

> **Nota:** Per generare l'APK/IPA di rilascio da caricare sugli store, usa i comandi nativi di Android Studio / Xcode dopo aver avviato Metro con `npm run start:prod`.

---

## Come personalizzare un ambiente

### Modificare le chiavi AdMob di produzione

Apri `shared/src/utils/config/prod.ts` e sostituisci i placeholder con gli ID reali del tuo account AdMob:

```typescript
ads: {
  bannerId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',      // ← sostituisci
  interstitialId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // ← sostituisci
},
```

Gli ID si trovano su [AdMob Console](https://admob.google.com) → App → Unità Annuncio.

### Modificare il nome del database

In `shared/src/utils/config/dev.ts` (o `test.ts` / `prod.ts`):

```typescript
db: {
  name: 'scadenze_dispensa_dev.db', // cambia il nome del file SQLite
},
```

### Aggiungere una nuova impostazione configurabile per ambiente

1. **Aggiungi il campo all'interfaccia** in `shared/src/utils/config/types.ts`:

```typescript
export interface AppConfig {
  // ...campi esistenti...
  analytics: {
    trackingId: string;
    enabled: boolean;
  };
}
```

2. **Aggiungi il valore in ogni file di ambiente** (`dev.ts`, `test.ts`, `prod.ts`):

```typescript
analytics: {
  trackingId: 'UA-TEST-123',
  enabled: false, // disabilitato in dev
},
```

3. **Esponilo in `constants.ts`** se necessario, oppure importa `config` direttamente dove serve:

```typescript
import config from '@shared/utils/config';

if (config.analytics.enabled) {
  // traccia evento
}
```

---

## Regole di sicurezza

| Cosa | Regola |
|------|--------|
| Google Test IDs AdMob | Possono stare in `dev.ts` e `test.ts` — sono pubblici per design |
| ID AdMob reali | Possono stare in `prod.ts` — finiscono nel bundle dell'APK comunque |
| API keys, token backend, secret | **Mai** nei file `config/*.ts` — usare variabili d'ambiente separate non committate |
| File `.env.prod.local` | Già in `.gitignore` — usalo per secret locali che non vanno in git |

---

## Verifica rapida dell'ambiente attivo

Puoi controllare quale ambiente è caricato aggiungendo temporaneamente un log in `App.tsx`:

```typescript
import config from '@shared/utils/config';
console.log('Ambiente attivo:', config.ENV);
console.log('Database:', config.db.name);
console.log('Debug mode:', config.app.debugMode);
```

Oppure guarda la schermata Impostazioni dell'app: mostra `APP_INFO.NAME` e `APP_INFO.VERSION` che vengono dal config attivo.
