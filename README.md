# Exam Seating Arrangement Solver (DAA PBL Project)

An interactive, React-based web application that automates conflict-free classroom seating arrangements to prevent student cheating during examinations. Powered by a **recursive backtracking algorithm** with **8-neighbor adjacency constraints**.

## 🚀 Features

- **Backtracking Algorithm**:
  - Traverses the 2D classroom grid cell-by-cell (`0` to `Rows × Cols - 1`).
  - **`isSafe` Validation**: Checks all 8 neighboring desks (North, South, East, West, North-East, North-West, South-East, South-West) to guarantee that no two students taking the same subject sit next to or diagonally across from each other.
  - **Pruning & Degree Heuristics**: Prioritizes placing the most constrained subjects first, achieving sub-millisecond execution times.
  - **King's Graph Independence Bound**: Pre-computes mathematical feasibility $\lceil R/2 \rceil \times \lceil C/2 \rceil$ to immediately identify impossible configurations without deep recursion stalls.
- **Dynamic Classroom & Subject Management**:
  - Configurable grid dimensions (Rows & Columns) with quick increment/decrement controls.
  - Add, edit, or remove subjects dynamically with custom student counts and color palettes.
  - Real-time Capacity Meter showing desk occupancy percentage and seat buffer.
- **Interactive Visualization Board**:
  - Distinct rounded desk cards with clear borders, student seat numbers, and subject tags.
  - Dynamic harmonious color coding (Sapphire Blue, Emerald Green, Royal Violet, Warm Amber, Crimson Rose, etc.).
  - Light-gray styling for empty desks.
  - **Interactive 8-Neighbor Adjacency Inspector**: Hover over any occupied or empty desk to highlight its surrounding 8-desk anti-cheating safety perimeter.
- **Solving Modes**:
  - **Instant Solve**: Ultra-fast synchronous recursive backtracking.
  - **Animated Visualization**: Step-by-step visual playback with adjustable speed (Slow / Normal / Fast) to watch the algorithm place candidates, test safety, and backtrack.
- **Comprehensive Feedback & Error Reporting**:
  - Instant error notifications when a configuration is mathematically impossible or capacity is exceeded.
  - Auto-expand recommendation button to calculate a larger grid size.
  - Algorithm telemetry: Execution time (ms), Recursive steps, Backtracks count, and desk utilization.
  - Print seating chart feature.

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Modern iconography)
- **Canvas Confetti** (Success animations)

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run algorithmic validation test suite
node test-algorithm.js

# Build production bundle
npm run build
```
