# GridFlow
> **HKTE x EuroTech Hackathon**

GridFlow is an application that enables Vehicle-to-Building (V2B) and Vehicle-to-Grid (V2G) systems.

### V2G Concept
Energy prices are constantly fluctuating, influenced by factors such as weather conditions and electricity demand. When renewable energy sources like solar and wind generate abundant power, electricity prices tend to fall. However, prices can rise significantly during periods of low renewable generation or when demand peaks, such as when large numbers of people charge their devices or electric vehicles.

This is where Vehicle-to-Grid (V2G) technology becomes valuable. V2G enables electric vehicles not only to consume electricity from the grid but also to return stored energy when demand and prices are high. In essence, EVs can act as mobile energy storage units, helping to balance the grid while allowing owners to reduce energy costs or even generate additional income.

### Hong Kong
The shift toward electric freight transportation presents a unique opportunity to unlock large-scale distributed energy storage. Cross-border electric trucks are equipped with high-capacity batteries, yet much of this stored energy remains unused throughout their daily operations.

GridFlow helps logistics providers transform this surplus energy into a new revenue stream by optimizing when and where vehicles charge and discharge energy:

- **Strategic Charging:** Trucks charge using low-cost renewable energy during mandatory driver rest periods in Guangdong.
- **Smart Energy Deployment:** Upon arriving in Hong Kong, vehicles are directed to facilities where energy demand and electricity prices are highest.
- **Peak Demand Reduction:** Stored energy is discharged into warehouse microgrids, reducing peak electricity costs and demand charges.

> **The Operational Benefit:** Fleet operators generate additional revenue and reduce energy costs without changing delivery schedules or investing in new infrastructure.
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
