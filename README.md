# GridFlow - Bringing extra Energy from electric trucks into HongKong
> **Transforming Cross-Border Logistics Fleets into a Decentralized Energy Network.** Built for the Hackathon.

An immersive 3D spatial visualization and route optimization dashboard tracking electric heavy-duty truck fleets traveling between Mainland China and Hong Kong. **GridFlow** showcases how cross-boundary logistics vehicles can utilize their scheduled downtime and massive battery reserves to balance urban energy grids through Vehicle-to-Building (V2B) and Vehicle-to-Grid (V2G) systems.

---

## 💡 The Core Concept: Mobile Energy Storage

As freight fleets transition to heavy-duty electric trucks, they present a massive unexploited clean energy opportunity. A typical cross-border electric vehicle possesses a large battery capacity but only consumes a fraction of it on its standard physical route. 

GridFlow visualizes and optimizes how logistics providers can turn this massive, mobile battery surplus into a dual-revenue stream by capturing regional utility pricing structures:

*   **Strategic Fleet Charging:** Trucks charge utilizing clean, affordable solar energy during the driver's mandatory rest windows at logistics parks in Guangdong.
*   **Intelligent Demand Shaving:** Upon arrival in Hong Kong, our platform routes vehicles to dock at private warehouse microgrids during localized peak demand periods.
*   **Grid Peak Mitigation:** The trucks discharge their clean surplus energy directly into the facility's power network, drastically lowering the warehouse's reliance on expensive peak-hour grid electricity and shaving down high commercial peak demand charge penalties.

> **The Operational Benefit:** By aligning charging schedules with driver rest compliance laws and discharging during peak commercial utility hours, fleet operators can generate massive secondary operational savings and bonus revenue without altering a single delivery deadline or adding new physical assets.

---

## 🚀 Optimization Features

*   **3D Globe & Corridor Visualization:** An interactive Mapbox GL globe displaying real-time vehicle dispatch along active border shipping lanes.
*   **Map-Driven Route Routing:** Current route handling, stop coordinates, and spatial visualization logic are directly handled via the Mapbox GL integration engine to demonstrate seamless cross-border state-of-charge (SoC) transit flows. *(Future roadmap: Full integration of a dedicated linear programming Simplex solver to dynamically balance live utility price fluctuations).*
*   **Peak-Shaving Demand Monitoring:** Tracks localized 3D building extrusions and microgrid loads to pinpoint exactly where fleet discharges will yield the highest utility bill offsets.
*   **First-Person Telematics Follow Mode:** Click any truck to snap into a 3D first-person camera track, viewing live state-of-charge (SoC) and projected energy yields.

---

## 🛠️ Tech Stack

*   **Framework:** TanStack Start (React SSR framework) & TanStack Router
*   **Mapping & GIS Engine:** Mapbox GL JS with custom 3D building data, fog effects, and canvas animation layers
*   **Styling:** Tailwind CSS v4 & Radix UI primitives
*   **Build & Deploy:** Vite running on Vercel

---

## 📦 Project Structure

```text
src/
├── components/       # UI Components (Mapbox Viewport, GridFlow Fleet Sidebars, V2G Docks)
├── context/          # State providers (MapActions, EnergyPricingContext)
├── hooks/            # Custom React hooks (useTruckTelematics, useMapActions)
├── lib/              # Utility formulas, route coordinates, and tariff rules
├── routes/           # TanStack Router layout maps
└── styles.css        # Global CSS v4 setup
```

---

## 🚦 Getting Started

### Prerequisites
* Node.js 18+
* A Mapbox Access Token

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
Open `http://localhost:8080` to view the live dashboard.

### Environment Configuration
The project includes basic mock coordinates in `src/lib/truckRoutes.ts`. To plug into real-time routing tiles, create a `.env` file at the root level:
```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

---

## ⚖️ License
Created purely for hackathon competition. See `HONESTY.md` for a complete breakdown of features written during the hacking window and `LICENSE.md` for more info about licensing.
