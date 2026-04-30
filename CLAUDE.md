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

Ogni app è un **git submodule** indipendente con il proprio repository GitHub e le proprie GitHub Actions.

```
/Progetto Gazza/                          # repo: MarcoDiGioia/progetto-gazza
├── .gitmodules                           # mappa dei submodule
├── apps/
│   ├── scadenze_dispensa/               # submodule → MarcoDiGioia/scadenze-dispensa
│   └── ricorda_farmaci/                 # submodule → MarcoDiGioia/ricorda-farmaci
│       ├── .github/workflows/           # CI/CD proprie del submodule
│       │   ├── deploy-production.yml    # trigger: push su main
│       │   └── deploy-internal.yml      # trigger: push su develop
│       ├── ENVIRONMENTS.md              # Documentazione sistema multi-ambiente
│       ├── mobile/                      # React Native 0.85 (Android + iOS)
│       │   ├── android/                 # Package: com.progettogazza.<appname>
│       │   ├── src/
│       │   │   ├── screens/
│       │   │   ├── components/
│       │   │   ├── services/            # DbService, AdsService, NotificheService
│       │   │   └── navigation/
│       │   ├── babel.config.js          # Include transform-inline-environment-variables
│       │   ├── .env.example             # Documenta la variabile ENV
│       │   └── package.json
│       ├── shared/                      # Logica condivisa mobile/web
│       │   └── src/
│       │       ├── models/
│       │       ├── context/
│       │       ├── services/            # Interfacce DbService
│       │       └── utils/
│       │           ├── config/          # Sistema multi-ambiente (dev/test/prod) ← OBBLIGATORIO
│       │           └── constants.ts
│       └── store/                       # Contenuti Play Store
└── Piani/                               # Documenti di brainstorming e ricerca
```

### Lavorare con i submodule

```bash
# Clonare il monorepo con tutti i submodule
git clone --recurse-submodules https://github.com/MarcoDiGioia/progetto-gazza.git

# Se già clonato senza --recurse-submodules
git submodule update --init --recursive

# Entrare nel submodule per fare modifiche
cd apps/<nome-app>
git checkout main          # o develop per il branch di test
# ... fai modifiche ...
git add . && git commit -m "[nome-app] ..."
git push

# Aggiornare il puntatore nel monorepo dopo un push nel submodule
cd ../..
git add apps/<nome-app>
git commit -m "update <nome-app> submodule ref"
git push
```

> **Regola:** le modifiche al codice dell'app vanno committate nel submodule. Il monorepo tiene solo il puntatore al commit corrente del submodule.

### Sincronizzazione automatica (OBBLIGATORIO per ogni nuova app)

Il monorepo aggiorna automaticamente i puntatori dei submodule tramite GitHub Actions:

- **`develop` del monorepo** segue sempre `develop` di tutti i subrepo
- **`main` del monorepo** segue sempre `main` di tutti i subrepo

**Come funziona:**
1. Il subrepo conclude il deploy → invia un `repository_dispatch` al monorepo con il branch (`develop` o `main`)
2. Il workflow `sync-submodules.yml` del monorepo si attiva, fa checkout del branch corretto, aggiorna i puntatori di tutti i submodule e pusha

**Segreto richiesto in ogni subrepo:** `PAT_MONOREPO_SYNC` — Personal Access Token GitHub con scope `repo`, che deve avere accesso al repo `MarcoDiGioia/progetto-gazza`. Lo stesso PAT va aggiunto anche in `progetto-gazza` (per permettere al workflow di sync di pushare).

**Step da aggiungere al termine di ogni `deploy-internal.yml` di un subrepo:**
```yaml
      - name: Notify parent monorepo to sync submodule ref
        if: success()
        run: |
          curl -s -X POST \
            -H "Authorization: Bearer ${{ secrets.PAT_MONOREPO_SYNC }}" \
            -H "Accept: application/vnd.github.v3+json" \
            https://api.github.com/repos/MarcoDiGioia/progetto-gazza/dispatches \
            -d '{"event_type":"submodule-updated","client_payload":{"branch":"develop"}}'
```

Per `deploy-production.yml` usare `"branch":"main"` nel payload.

---

## Standard obbligatori per ogni app

Ogni app nel monorepo DEVE implementare questi pattern. Sono non negoziabili.

### Sistema di configurazione multi-ambiente (OBBLIGATORIO)

La variabile `ENV=dev|test|prod` viene iniettata da Babel al bundle time. **Non è una selezione runtime.** Ogni app deve avere questa struttura:

```
shared/src/utils/
├── config/
│   ├── types.ts     # Interfaccia AppConfig
│   ├── index.ts     # Legge process.env.ENV, esporta il config corretto
│   ├── dev.ts       # Google Test IDs AdMob, DB: <app>_dev.db, debugMode: true
│   ├── test.ts      # Google Test IDs AdMob, DB: <app>_test.db, debugMode: true
│   └── prod.ts      # ID AdMob reali (da inserire), DB: <app>.db, debugMode: false
└── constants.ts     # Ri-esporta ADS_CONFIG, NOTIFICHE_CONFIG, DB_CONFIG, APP_INFO
```

Regole:
- I servizi importano solo da `constants.ts`, **mai** da `config/` direttamente
- Per aggiungere un'impostazione: aggiornare `types.ts` → tutti e tre i file env → `constants.ts`
- Documentare le differenze tra ambienti in `ENVIRONMENTS.md` nella root dell'app
- Includere `mobile/.env.example` con `ENV=dev` come default documentato

#### Comandi standard (validi per ogni app)

```bash
# Metro bundler
npm run start          # alias start:dev
npm run start:dev      # ENV=dev
npm run start:test     # ENV=test
npm run start:prod     # ENV=prod

# Android
npm run android        # alias android:dev
npm run android:dev
npm run android:test
npm run android:prod

# Qualità
npm run lint
npm run type-check
```

### Architettura dei servizi (OBBLIGATORIO)

Tutti i servizi sono **singleton** (`getInstance()`). Vengono inizializzati in sequenza in `App.tsx`:
```
dbService.init() → notificheService.init() → adsService.init()
```
I context sono definiti in `shared/` ma ricevono le istanze dei servizi tramite **props/injection** — non le importano direttamente. Questo permette di riutilizzare i context nella futura versione web.

### Path alias TypeScript + Babel (OBBLIGATORIO)

```json
// tsconfig.json paths
"@/*":       ["src/*"]           // mobile/src/
"@shared/*": ["../shared/src/*"] // shared/src/
```

```javascript
// babel.config.js aliases
'@':       './src'
'@shared': '../shared/src'
```

Includere sempre `"ignoreDeprecations": "6.0"` nel `tsconfig.json` per sopprimere i warning di `@tsconfig/react-native` (baseUrl, moduleResolution deprecati in TS 7).

### CI/CD (OBBLIGATORIO)

Ogni app ha:
- `.github/workflows/deploy-production.yml` — trigger su `main`, ENV=prod, track=production
- `.github/workflows/deploy-internal.yml` — trigger su `develop`, ENV=test, track=internal
- Package name Android: `com.progettogazza.<appname>`

---

## App presenti

### scadenze_dispensa → MarcoDiGioia/scadenze-dispensa

```bash
cd apps/scadenze_dispensa/mobile && npm install
npm run android   # avvia con config dev
```

### ricorda_farmaci → MarcoDiGioia/ricorda-farmaci

```bash
cd apps/ricorda_farmaci/mobile && npm install
npm run android   # avvia con config dev
```

---

## Workflow Git

- Commit in inglese: `[nome-app] brief description`
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

### 4. Verification Before Done — REGOLA ASSOLUTA

**Mai pushare codice non testato.** Ogni push deve avere build verificata.

Checklist obbligatoria prima di ogni `git push`:
1. `npm run type-check` → zero errori TypeScript
2. Build Android: `cd android && ./gradlew assembleDebug` → build completata senza errori
3. Se la build fallisce: bloccarsi, risolvere, solo poi procedere

"Sembra giusto" non è sufficiente — dimostrare con output concreto (log, build success).

Ask yourself: "Would a staff engineer approve this?"

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