# NASA Space Biology Engine (Single Repository)

Unified monorepo (single repo form) containing:

- React + Vite UI (Dashboards, Simulation Deck, 3D Labs)
- Simulation engines (physiology, ecosystem, scenarios, missions, anomalies, replay, integrity ledger, news)
- Shared type system

## Key App Views

| View             | Path (internal)    | Purpose                                                             |
| ---------------- | ------------------ | ------------------------------------------------------------------- |
| Biology Lab      | `BiologyLab`       | Advanced 3D plant growth & environment tuning                       |
| Solar System     | `PlanetarySystem`  | Orbital + planetary visualization                                   |
| Survival Lab     | `SpaceSurvivalLab` | Early sandbox (legacy)                                              |
| AI Analytics     | `AIAnalytics`      | Insight generation (baseline)                                       |
| Mission Control  | `MissionControl`   | Mission data orchestration (early)                                  |
| Advanced Console | `AdvancedConsole`  | Aggregated insights / anomalies                                     |
| Simulation Deck  | `SimulationDeck`   | Integrated Scenarios + Human Physiology + Ecosystem + Ledger + News |
| Research Hub     | `Dashboard`        | Static research catalog & knowledge graph                           |

## Simulation Modules (in `src/services/`)

| File                  | Responsibility                                                           |
| --------------------- | ------------------------------------------------------------------------ |
| `physiologyEngine.ts` | Human adaptive decay & stress / radiation modeling                       |
| `ecosystemEngine.ts`  | Multi-population stochastic growth + stability/resilience metrics        |
| `missionGenerator.ts` | Procedural mission narrative & phases scaffold                           |
| `anomalyDetector.ts`  | Simple synthetic anomaly events (stub to extend)                         |
| `scenarioEngine.ts`   | Scenario presets (ISS, Mars transit, Solar storm) -> environment mapping |
| `securityLedger.ts`   | Hash-chain style integrity ledger (demo)                                 |
| `newsGenerator.ts`    | Threshold-driven alert/news item generation                              |
| `replayEngine.ts`     | Placeholder for timeline / branching playback                            |

## Core Types (`src/types/index.ts`)

Includes: ecosystems, missions, genomes, human physiology state (`HumanState`), environments, scenarios, security ledger entries, tamper events, news items, and more.

## Simulation Deck Data Loop

1. Scenario selected -> environment state resets -> human state reinitialized -> ecosystem reset.
2. Interval tick (default every 1s = 0.1 mission day):
   - `advanceHuman()` updates bone density, muscle mass, radiation, etc.
   - `advanceEcosystem()` mutates population health/diversity.
   - Snapshot recorded in `SecurityLedger`.
   - `generateNews()` emits alerts if thresholds cross.
3. User can Pause / Resume / Step / Reset / Verify / Tamper.

## Integrity Ledger Notes

This is a demonstrative hash chain (not cryptographically rigorous). Future improvements:

- Include canonical serialized payload in hash
- Strengthen recomputation function (currently prefix heuristic)
- Optional Merkle subtree for populations/genomes

## Local Development

Install deps and run dev server (auto picks a free port):

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

## Deployment (Render – Manual Static Site Method)

No `render.yaml` is needed. Use the dashboard:

1. Commit & push the repository so `package.json` is at repo root.
2. In Render: New → Static Site → pick this repo.
3. Settings:
   - Root Directory: (leave blank)
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - (Optional) Environment Variable: `NODE_VERSION=18`
4. Create Site → wait for build to finish.
5. Add SPA rewrite rule (Settings → Redirects/Rewrites):
   - Source: `/*` Destination: `/index.html` Action: `Rewrite`
6. Redeploy if you added the rewrite after the first deploy.

Environment Variables (future): prefix client-exposed ones with `VITE_`, e.g.:

```
VITE_API_BASE=https://example.com/api
```

Add them in Render → Environment; rebuild to apply.

## Roadmap (Inline)

- [ ] Replay timeline UI (slider + jump to snapshot)
- [ ] AI Insight integration into Simulation Deck with provenance ribbons
- [ ] Export mission dossier (JSON + markdown summary)
- [ ] Expand scenario library (Lunar Gateway, Deep Space cruise, Partial gravity habitat)
- [ ] Ecosystem stress injection events + adaptive evolution loop
- [ ] Ledger: stronger hash continuity & Merkle branches
- [ ] Performance budget: code-split heavy 3D modules

## Contributing

Single-repo structure keeps engines co-located—no package publishing step needed. Keep simulation logic framework-agnostic; UI pulls via clear functional contracts.

## Quick Engine Contract Examples

```ts
advanceHuman(prev: HumanState, env: EnvironmentState, dtDays: number): HumanState
advanceEcosystem(state: EcosystemState, genomes: OrganismGenome[]): EcosystemState
scenarioToEnvironment(profile: ScenarioProfile): EnvironmentState
ledger.addSnapshot(summary: string, payload: any): LedgerEntry
generateNews({ human, ecosystem, tamper }): NewsItem[]
```

## Testing (lightweight)

Run simple component probe:

```bash
node test-components.js
```

Add future unit tests under `src/__tests__/` using Vitest/Jest (not yet configured).

## License

Educational / research demonstration. Evaluate before using in critical contexts.

---

Maintains all simulation + UI layers in one repository per your request. Expand or restructure later if modular distribution becomes necessary.
