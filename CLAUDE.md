# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Panoramica

**Progetto Gazza** è un monorepo di app mobile (React Native) semplici e focalizzate, monetizzate con Google AdMob. Ogni app risolve un singolo problema specifico, funziona completamente offline e non richiede account o backend.

### Tre pilastri obbligatori per ogni app
1. **Nome catchy e semplice** — comprensibile all'utente medio
2. **Problema specifico** — una sola funzionalità principale
3. **Funzionamento locale** — zero cloud, zero account (solo AdMob/analytics consentiti)

---

## Struttura del Monorepo

```
/Progetto Gazza/
├── apps/
│   └── scadenze_dispensa/       # App attiva: traccia scadenze alimentari
│       ├── mobile/              # React Native 0.85 (Android + iOS)
│       │   ├── android/         # Package: com.progettogazza.scadenzedispensa
│       │   ├── ios/
│       │   ├── src/
│       │   │   ├── screens/
│       │   │   ├── components/
│       │   │   ├── services/    # DbService, AdsService, NotificheService
│       │   │   └── navigation/
│       │   ├── babel.config.js  # Include transform-inline-environment-variables
│       │   └── package.json
│       ├── shared/              # Logica condivisa mobile/web
│       │   └── src/
│       │       ├── models/      # Prodotto.ts, VoceSpesa.ts
│       │       ├── context/     # ProdottiContext, SpesaContext
│       │       ├── services/    # Interfacce DbService
│       │       └── utils/
│       │           ├── config/  # Sistema multi-ambiente (dev/test/prod)
│       │           └── constants.ts
│       └── web/                 # Placeholder, non ancora implementato
└── Piani/                       # Documenti di brainstorming e ricerca
```

---

## App: scadenze_dispensa

### Comandi di sviluppo

```bash
cd apps/scadenze_dispensa/mobile

npm install

# Metro bundler
npm run start          # dev (default)
npm run start:test     # test
npm run start:prod     # prod

# Android
npm run android        # dev
npm run android:test
npm run android:prod

# iOS
npm run ios            # dev
npm run ios:test
npm run ios:prod

npm run lint
npm run type-check
npm run test
```

### Sistema di configurazione ambienti

La variabile `ENV=dev|test|prod` viene iniettata da Babel al bundle time. Non è una selezione runtime.

```
shared/src/utils/config/
├── index.ts    # legge process.env.ENV, esporta il config corretto
├── dev.ts      # Google Test IDs AdMob, DB: scadenze_dispensa_dev.db, debugMode: true
├── test.ts     # Google Test IDs AdMob, DB: scadenze_dispensa_test.db, debugMode: true
├── prod.ts     # ID AdMob reali (da inserire), DB: scadenze_dispensa.db, debugMode: false
└── types.ts    # Interfaccia AppConfig
```

`constants.ts` ri-esporta `ADS_CONFIG`, `NOTIFICHE_CONFIG`, `DB_CONFIG`, `APP_INFO` leggendo dal config attivo. I servizi importano solo da `constants.ts`, non da `config/` direttamente.

Per aggiungere una nuova impostazione configurabile: aggiungerla a `types.ts`, poi a tutti e tre i file env, poi esporla in `constants.ts`.

### Architettura dei servizi

Tutti i servizi sono singleton (`getInstance()`). Vengono inizializzati in sequenza in `App.tsx`:
```
dbService.init() → notificheService.init() → adsService.init()
```
I context (`ProdottiContext`, `SpesaContext`) sono definiti in `shared/` ma ricevono le istanze dei servizi tramite props/injection — non le importano direttamente. Questo permette di riutilizzare i context nella futura versione web con implementazioni diverse dei servizi.

### Path alias (TypeScript + Babel)
- `@/*` → `mobile/src/*`
- `@shared/*` → `shared/src/*`

---

## Workflow Git

- Commit in inglese: `[scadenze-dispensa] brief description`
- Branch: `feature/nome-app/descrizione`, `bugfix/nome-app/descrizione`
- `main` = codice pronto per la produzione

## Monetizzazione

Ogni app usa AdMob con:
- **Banner** — fondo schermata, persistente
- **Interstitial** — ogni N azioni utente (es. ogni 3 prodotti aggiunti)

Gli ID AdMob di test (Google ufficiali) stanno in `config/dev.ts` e `config/test.ts`. Gli ID reali vanno in `config/prod.ts` — si ottengono da [admob.google.com](https://admob.google.com).

## Workflow Orchestration

### 1. Plan Mode Default

Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)

- If something goes sideways, STOP and re-plan immediately

- Use plan mode for verification steps, not just building

- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy

Use subagents liberally to keap main context window clean

Offload research, exploration, and parallel analysis to subagents

For complex problems, throw more compute at it via subagents

- One task per subagent for focused execution

### 3. Self-Improvement Loop

- After ANY correction from the user: update tasks/lessons.md with the pattern

Write rules for yourself that prevent the same mistake

Ruthlessly iterate on these lessons until mistake rate drops

- Review lessons at session start for relevant project

### 4. Verification Before Done

- Never mark a task complete without proving it works

- Diff behavior between main and your changes when relevant

Ask yourself: "Would a staff engineer approve this?"

- Run tests, check logs, demonstrate conrectness

### 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"

- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"

Skip this for simple, obvious fixes -- don't over-engineer

- Challenge your own work before presenting it

### 6. Autonomous Bug Figing

When given a bug report: just fix it. Don't ask for hand-holding

- Point at logs, arrors, falling tests -- then resolve them

Zero context switching required from the user

- Go fix failing Cl tests without being told how

## Task Management

1. Plan First: Write plan to tasks/todo.md with checkable items

2. Verify Plan: Check in before starting implementation

3. Track Progress: Mark items complete as you go

4. Explain Changes: High-level summary at each step

5. Document Results: Add review section to tasks/todo.md

6. Capture Lessons: Update tasks/lessons md after corrections

## Core Principles

- Simplicity First: Make every change as simple as possible. Impact minimal code.

No Laziness: Find root couses. No temporary fixes. Senior developer standards.

- Minimal Impact: Only touch what's necessary. No side effects with new bugs.