# Weltraum-App – Moderne Toolchain

Dieses Projekt ersetzt die alte GitHub-Pages-Variante durch eine modulare Vite/React/TypeScript-Codebasis. NASA-Daten, lokale Himmelsereignisse und Layout-Elemente liegen jetzt als Komponenten und Services vor und lassen sich Schritt für Schritt ins neue Design überführen.

## Quickstart

```bash
npm install
npm run dev
```

Standardmäßig ruft das Frontend die NASA-APIs direkt auf – ideal für GitHub Pages, da kein Backend nötig ist. Lege dafür eine `.env.local` an (oder kopiere `.env.local.example`) und setze deinen echten Schlüssel sowie Standort-Defaults.

### Environment Variablen

| Variable                | Beschreibung                                     | Beispiel                       |
| ----------------------- | ------------------------------------------------ | ------------------------------ |
| `VITE_NASA_API_KEY`     | Pers. NASA Key (nur ohne Proxy im Browser nötig) | `abc123`                       |
| `VITE_NASA_PROXY_URL`   | Optional: NASA-Proxy-Route (z. B. `/api/nasa/`)  | (leer lassen für GitHub Pages) |
| `VITE_ISS_PROXY_URL`    | Optional: ISS-Proxy (z. B. `/api/iss/`)          | (leer lassen für GitHub Pages) |
| `VITE_LOCATION_LABEL`   | Standortname für Panels                          | `Buchloe`                      |
| `VITE_LOCATION_LAT/LON` | Koordinaten für SunCalc + ISS                    | `48.0833` / `10.8333`          |
| `VITE_ISS_PASSES`       | Anzahl der geladenen ISS-Passagen                | `3`                            |
| `VITE_MARS_DEFAULT_SOL` | Standard-SOL für Mars-Rover-Bilder               | `1000`                         |

## Serverless-Proxies (NASA & ISS)

Um sensible Requests nicht im Browser auszuführen, liegen die Proxies unter:

- `api/nasa/[...path].ts` – injiziert den Server-Env `NASA_API_KEY` und erlaubt nur relevante NASA-Endpoints.
- `api/iss/[...path].ts` – kapselt die `open-notify`-ISS-Pass-API inkl. Caching, damit die UI nicht von Rate-Limits blockiert wird.

### Deployment-Schritte (Vercel)

1. `npm install -g vercel` (falls noch nicht vorhanden) und `vercel login`.
2. `vercel env add NASA_API_KEY` ausführen und den gleichen NASA-Key hinterlegen (nur für den NASA-Proxy nötig).
3. Optional: `vercel env add LOCATION_LAT` etc., falls die Standorte später serverseitig konfiguriert werden sollen.
4. `vercel dev` um lokal Frontend + Functions zu starten **oder** `vercel deploy` für Produktion.
5. Aktiviere im Frontend den gewünschten Proxy, indem du in `.env.local` `VITE_NASA_PROXY_URL=/api/nasa/` bzw. `VITE_ISS_PROXY_URL=/api/iss/` setzt. Bei aktiver Variable laufen die Requests automatisch über die Serverless-Funktionen.

> Hinweis: Für GitHub Pages / reines `npm run dev` müssen `VITE_NASA_PROXY_URL` und `VITE_ISS_PROXY_URL` auskommentiert bleiben, da hier kein Serverless-Backend zur Verfügung steht.

## Weitere Skripte

| Befehl                 | Zweck                              |
| ---------------------- | ---------------------------------- |
| `npm run lint`         | ESLint (Flat Config, React + a11y) |
| `npm run test`         | Vitest + Testing Library           |
| `npm run format`       | Prettier (Write)                   |
| `npm run format:check` | Prettier (Check)                   |
| `npm run build`        | Type-Check + Produktionsbuild      |

## Ordnerstruktur (Auszug)

```
src/
  api/            # Services (NASA, Astro, ISS, Proxy-Konfiguration)
  components/     # Layout-, Section- und UI-Komponenten
  hooks/          # Gemeinsame React Hooks (z. B. useAsyncData)
  styles/         # Globales Theming & Layoutbasis
public/media/     # Statische Assets wie Weltallvideo.mp4
api/nasa/[...path].ts  # Vercel Serverless Proxy für NASA
api/iss/[...path].ts   # Serverless Proxy für Open-Notify/ISS
```

## Weiteres Vorgehen

- Celestial Events stammen aus den NASA-DONKI-Notifications und werden mit kuratierten Meteor-Schauern (`src/api/mocks/events.ts`) kombiniert.
- Sobald das Proxy-Setup stabil läuft, können wir nach und nach neue UI-/UX-Elemente einziehen, ohne Keys im Client zu halten.
- Für Produktion (z. B. Vercel) `vercel env add NASA_API_KEY` setzen, `VITE_NASA_PROXY_URL=/api/nasa/` und `VITE_ISS_PROXY_URL=/api/iss/` in `.env.production` o. ä. definieren.
- Design-Overhaul folgt als eigener Schritt (Farbschema, Interaktionen, Motion-System, etc.).
- Fallback-Daten liegen in `src/api/mocks`, damit Tests/Storybook reproduzierbare Zustände verwenden können.
