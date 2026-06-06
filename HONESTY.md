# HONESTY.md

## Development Declaration

This project (HKTE - Hong Kong Truck Explorer) was conceptualized and developed entirely during the hackathon timeframe.

### Prior Experience

Our team entered the hackathon with prior experience using Mapbox GL from other projects. This foundation included:
- Familiarity with Mapbox's API, styling system, and 3D environment features.
- Understanding of map projections, camera controls, and layer management.
- Experience structuring GeoJSON data and map animations.

### Hackathon Development

While our prior experience with spatial visualization informed our architecture, the implementation submitted for this project is entirely original. 

To maximize our output during the limited hackathon window, we utilized AI coding assistants as part of our development workflow. These tools were used to help scaffold boilerplate code, accelerate the translation of our mathematical optimization logic (the Simplex solver) into JavaScript, and refine the Tailwind/Radix UI components. 

No pre-existing Mapbox codebase, private templates, or proprietary logistics software from previous projects were copied or reused. Every line of React/TypeScript, the specific route optimization logic, and the TanStack Start integration were built specifically for this event.

---

## Data & Research Sources

To ensure our Vehicle-to-Grid (V2G) arbitrage model was grounded in real-world economics and logistics constraints, we utilized the following public data sources during our research:

### 1. Cross-Border Logistics Traffic
*   **Hong Kong Transport Department:** [Monthly Traffic and Transport Digest](https://data.gov.hk/en-data/dataset/hk-td-tis_10-monthly-traffic-and-transport-digest)
    *   *Usage:* Analyzed Section 8 (Cross Boundary Vehicular Traffic) to baseline the average 15,000 daily goods vehicle trips entering Hong Kong via checkpoints like Lok Ma Chau and Shenzhen Bay.

### 2. Hong Kong Energy Tariffs
*   **CLP Power Hong Kong:** [Commercial Bulk Tariff Table](https://www.clp.com.hk/content/dam/clphk/documents/tariff-adjustment-2025/Tariff%20Table%20-%20English%20(2025-01-01)_updated.pdf)
    *   *Usage:* Extracted the On-Peak (9:00 AM - 9:00 PM) energy rates and, crucially, the commercial Demand Charge ($68.40 HKD per kVA) to calculate the financial viability of peak-demand shaving in warehouses.

### 3. Mainland China (Guangdong) Energy Prices
*   **Guangzhou Municipal People's Government:** [Electricity Price List of Guangzhou (PDF)](https://www.gz.gov.cn/attachment/0/89/89550/6432486.pdf)
    *   *Usage:* Utilized official large-scale industrial and commercial tariff schedules to establish our baseline charging costs in the mainland. This allowed us to calculate the exact arbitrage spread when moving power across the border into Hong Kong.

### 4. Electric Truck Hardware Constraints
*   **ioDynamics:** [Comparison of Electric Trucks](https://www.iodynamics.de/blog/comparison-of-electric-trucks/)
    *   *Usage:* Validated the hardware assumptions for our V2G model, confirming that modern heavy-duty electric commercial trucks now feature battery capacities in the 500 kWh range. This confirms the mathematical viability of retaining a ~300 kWh usable surplus after accounting for the ~200 kWh required for the physical cross-border route.