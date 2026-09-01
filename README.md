# KavachX — AI-Assisted Unified Railway Block Planning System

**SIH Problem Statement 26027:** AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways.

---

## Architecture Pipeline

```
Unified Railway Data Layer (TMS, SMMS, TDMS, BDMS, COA, Timetable, Goods Forecast)
       │
       ▼
AI Maintenance Priority Engine (Explainable 0–100 Scoring & Banding)
       │
       ▼
Feasibility & Conflict Engine (Person 3 — Operational & Safety Constraints Check)
       │
       ▼
Corridor Bundling Engine (Person 4 — Multi-Department Compatibility & Grouping)
       │
       ▼
Google OR-Tools CP-SAT Optimizer (Person 4 — Global Constraint Optimization)
       │
       ▼
Weekly & Monthly Coordinated Block Plans (Person 5)
       │
       ▼
Control-Room Decision Support Dashboard (Person 6)
       │
       ▼
Authorized Railway Human Approval
```

---

## Person 3 — Feasibility & Conflict Engine

### Core Responsibilities
1. **Multi-Factor Rule-Based Conflict Checks (7-Stage Validation)**:
   - **COA Availability**: Verifies corridor status is `Available` and covers requested time span.
   - **Passenger Train Timetable**: Detects temporal intersections with passenger train arrivals/departures.
   - **Goods Train Forecast**: Checks conflicts against freight paths exceeding confidence threshold ($\ge 0.50$).
   - **Existing Approved Blocks**: Prevents overlaps with already committed possessions.
   - **Maintenance Duration**: Confirms candidate window length is sufficient for task completion.
   - **Resource Non-Duplication**: Prevents double-booking of machinery, gangs, and specialized crews.
   - **Safety-Critical Constraints**: Enforces hard safety requirements and isolation protocols.

2. **Automated Window Search & Fallback Resolution**:
   - If initial requested window is conflicted, automatically searches available COA slots and incremental daytime intervals.
   - Returns the earliest feasible window with detailed audit logging.

3. **Output Formats**:
   - Feasible windows structured for `bundling.bundle_tasks()` and `optimizer.optimize_schedule()`.
   - Comprehensive audit log (`data/feasibility_log_demo.csv` and `data/feasibility_log_demo.json`) for dashboard display.

---

## Running Person 3 Demos and Tests

### 1. Run Person 3 Live Demo
```bash
python src/run_person3_demo.py
```

### 2. Run Comprehensive Unit Test Suite
```bash
python -m unittest tests/test_feasibility_engine.py
```

### 3. Run Standalone Feasibility Engine Smoke Test
```bash
python src/feasibility_engine.py
```

### 4. Export Feasibility Audit Logs
```bash
python src/export_demo_logs.py
```
