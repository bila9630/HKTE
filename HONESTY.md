# HONESTY.md
> Mandatory disclosure for the hackathon. This file lives at the root of your repository. Judges cross-check it against your code and your technical video.
>
> **The deal:** disclosed shortcuts are **not** penalized — that is the entire point of this file. Hidden ones are. Undisclosed pre-built code is heavily penalized, each undisclosed mock carries a small penalty, and a faked demo is heavily penalized. Telling the truth here costs you nothing.

---

## 1. Team — who did what

| Member | GitHub handle | Main contributions |
|---|---|---|
| Duc Kieu | bila9630 | Set up TanStack Start/Router architecture, implemented Mapbox GL 3D globe visualization, integrated route telemetry tracking, and built UI dock panels. |
| Fynn Weyrich | STAT1C-Sy | Set up TanStack Start/Router architecture, implemented Mapbox GL 3D globe visualization, integrated route telemetry tracking, and built UI dock panels. |
This was very much a pair programming excercise for Duc and Fynn so hard to seperate.

---

## 2. What is fully working
- **3D Globe Projection & Cam Controls:** Renders an immersive, interactive 3D map environment via Mapbox GL using smooth spinning, camera fly-to anchors, and fog effects.
- **Real-Time Truck Route Telemetry:** Renders animated vehicle marker assets traveling along active cargo pathways (Shenzhen-Central, Yantian-Wan Chai, Nanshan-Tsim Sha Tsui).
- **First-Person Follow Track:** User clicking a specific vehicle triggers an automated structural coordinate lock, shifting the camera view matrix to match the truck's position and orientation.
- **Responsive Navigation Dock:** Bottom panel and menu overlays successfully accept user filter events to isolate specific routes and zoom directly to boundary view scopes.

---

## 3. What is mocked, stubbed, or hardcoded

| What is faked | Where (file:line or folder) | Why we mocked it | What the real version would do |
|---|---|---|---|
| Optimization Engine | `src/lib/truckRoutes.ts` | The routing stops and state-of-charge tracking are structured within hardcoded route configs to ensure stable visuals during the hackathon. | An actual linear programming Simplex algorithm solver would calculate variables dynamically against live utility pricing API endpoints. |
| Embedded Mapbox Token | `src/components/Map.tsx` | Hardcoded directly inside the setup configurations to simplify standalone hackathon judges evaluation runs. | Pull securely from a server-verified backend environment profile variable mapping (`VITE_MAPBOX_TOKEN`). |

---

## 4. External APIs, services & data sources

| Service / API / dataset | Used for | Real call or mocked? | Auth (sandbox / test key / none) |
|---|---|---|---|
| Mapbox GL JS | Base maps, 3D building extrusions, map camera matrix management. | Real Call | Public client token |
| HK Transport Department [Dataset] | Baselining the 15,000 cross-border cargo vehicle trips. | Research Reference (Hardcoded targets) | None |
| CLP Power Tariff [Dataset] | Defining peak billing schedules and Demand Charges ($68.40 HKD/kVA). | Research Reference (Hardcoded targets) | None |
| Guangzhou Government [Dataset] | Baselining mainland electricity base tariff valley structures. | Research Reference (Hardcoded targets) | None |
| ioDynamics [Dataset] | Technical validation for 500kWh heavy truck battery payloads. | Research Reference (Hardcoded targets) | None |

---

## 5. Pre-existing code

| Item | Source (URL or description) | Roughly how much | License |
|---|---|---|---|
| Mapbox Architecture Foundation | Conceptual map initialization logic and standard GeoJSON layout parameters from previous project workflows. | Synthesized from scratch using prior memory (no direct code file block copying). | MIT |

---

## 6. Known limitations & next steps
- **Simplex Math Engine Pipeline:** Replace the hardcoded coordinate vectors in the map context files with an actively running mathematical linear programming backend to generate true real-time route optimization.
- **Dynamic Variable Ingestion:** Transition from reading static research datasets (CLP tariffs and cross-border volume targets) to live API webhooks reflecting variable grid conditions and custom border control delays.
- **True Bidirectional Telematics Integration:** Expand the dashboard tracking to interface with live EV fleet telemetry, enabling active battery state-of-charge communication through standard protocol brokers.
