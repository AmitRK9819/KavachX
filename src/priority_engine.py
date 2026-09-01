"""
priority_engine.py
KavachX Prototype — Person 2 Module: AI Maintenance Priority Engine

Takes maintenance tasks (from Person 1's data_loader / synthetic_data.json)
and produces an explainable 0-100 priority score for each task.

No ML. Pure weighted scoring + template-based explanation text, exactly per spec:

    score = 0.25*criticality + 0.20*urgency + 0.20*defect_severity
            + 0.20*failure_risk + 0.15*asset_impact

Each input factor is expected on a 0-10 scale. Final score is scaled to 0-100.

Bands:
    90-100 -> Critical
    75-89  -> High
    50-74  -> Medium
    0-49   -> Low
"""

import json
import os
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional

import pandas as pd


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

WEIGHTS = {
    "criticality": 0.25,
    "urgency": 0.20,
    "defect_severity": 0.20,
    "failure_risk": 0.20,
    "asset_impact": 0.15,
}

BAND_THRESHOLDS = [
    (90, 100, "Critical"),
    (75, 89, "High"),
    (50, 74, "Medium"),
    (0, 49, "Low"),
]

# asset_impact is intentionally NOT in this list -- Person 1's real synthetic_data.json
# (tms/smms/tdms records) does not include an asset_impact field. It's derived instead
# (see _derive_asset_impact below). If Person 1 later adds a real asset_impact field,
# score_task() will use it directly and skip the derivation.
REQUIRED_FIELDS = ["criticality", "urgency", "defect_severity", "failure_risk"]
ALL_SCORE_FIELDS = REQUIRED_FIELDS + ["asset_impact"]

# Human-readable labels used inside the generated reason sentence
FACTOR_LABELS = {
    "criticality": "criticality",
    "urgency": "urgency",
    "defect_severity": "defect severity",
    "failure_risk": "failure risk",
    "asset_impact": "impact on corridor availability",
}

TASK_TYPE_PHRASES = {
    "Track Defect Repair": "critical track defect",
    "Track Inspection": "routine track inspection",
    "Signal Maintenance": "signalling maintenance issue",
    "Signal Inspection": "signal inspection item",
    "OHE Inspection": "overhead traction (OHE) inspection",
    "OHE Maintenance": "overhead traction (OHE) maintenance job",
}


# ---------------------------------------------------------------------------
# Core scoring
# ---------------------------------------------------------------------------

def _normalize_0_10(value: float) -> float:
    """Clamp/normalize a raw factor value onto a 0-10 scale.

    Person 1's data is expected to already hand us 0-10 values. This
    normalizer just guards against bad/out-of-range input (e.g. someone
    accidentally passing a 0-100 value or a negative number) so the engine
    never silently produces a garbage score.
    """
    try:
        v = float(value)
    except (TypeError, ValueError):
        return 0.0

    if v < 0:
        return 0.0
    if v > 10:
        # If it looks like a 0-100 value that slipped through, rescale it.
        if v <= 100:
            return round(v / 10, 2)
        return 10.0
    return round(v, 2)


def _derive_asset_impact(task_row: dict) -> float:
    """Derive a 0-10 'impact on asset availability' proxy when the raw data
    doesn't provide one directly (Person 1's tms/smms/tdms records don't).

    Rationale: a task's impact on asset availability is a function of (a) how
    overdue it already is -- longer-neglected defects have a bigger latent
    impact on the asset -- and (b) how long it will occupy the corridor once
    scheduled (estimated_duration). Both are capped and blended 50/50 onto a
    0-10 scale.

    NOTE: This is a reasonable stand-in for the hackathon MVP, not a claim
    about real railway asset-impact modelling. Flag this to your team --
    if Person 1 (or the judges) prefer a different definition of asset
    impact, swap this function out; score_task() will pick up a real
    'asset_impact' field automatically if one is added to the data.
    """
    overdue_days = task_row.get("overdue_days", 0) or 0
    duration_min = task_row.get("estimated_duration", task_row.get("estimated_duration_min", 0)) or 0

    overdue_component = min(overdue_days, 15) / 15 * 5   # 0-5
    duration_component = min(duration_min, 180) / 180 * 5  # 0-5

    return round(overdue_component + duration_component, 2)


def _get_asset_impact(task_row: dict) -> float:
    if task_row.get("asset_impact") is not None:
        return task_row["asset_impact"]
    return _derive_asset_impact(task_row)


def _band_for_score(score: float) -> str:
    for low, high, label in BAND_THRESHOLDS:
        if low <= score <= high:
            return label
    return "Low"


def _top_contributing_factors(breakdown: Dict[str, float], n: int = 2) -> List[str]:
    """Return the top-n factor keys by raw (unweighted) value, tie-broken by weight."""
    ranked = sorted(
        breakdown.keys(),
        key=lambda k: (breakdown[k], WEIGHTS[k]),
        reverse=True,
    )
    return ranked[:n]


def _build_reason_text(task_row: dict, breakdown: Dict[str, float], band: str) -> str:
    """Template-based sentence generation — no LLM needed."""
    top_factors = _top_contributing_factors(breakdown, n=2)
    factor_phrase = " and ".join(FACTOR_LABELS[f] for f in top_factors)

    task_type = task_row.get("task_type", "maintenance task")
    subject_phrase = TASK_TYPE_PHRASES.get(task_type, task_type.lower() if task_type else "maintenance task")

    urgency_word = {
        "Critical": "requires immediate scheduling",
        "High": "should be scheduled soon",
        "Medium": "can be scheduled in the normal planning cycle",
        "Low": "can be deferred if needed",
    }[band]

    overdue = task_row.get("overdue_days")
    overdue_clause = f", overdue by {overdue} days," if overdue else ""

    return (
        f"{subject_phrase.capitalize()}{overdue_clause} driven primarily by high "
        f"{factor_phrase}. This task {urgency_word}."
    )


def score_task(task_row: dict) -> dict:
    """
    Score a single task.

    Parameters
    ----------
    task_row : dict
        Must contain: criticality, urgency, defect_severity, failure_risk,
        asset_impact (each 0-10). Should also contain task_id, department,
        corridor_id, task_type for a richer explanation (optional).

    Returns
    -------
    dict with keys: task_id, score, band, breakdown, reason_text
    """
    missing = [f for f in REQUIRED_FIELDS if f not in task_row]
    if missing:
        raise ValueError(f"Task {task_row.get('task_id', '?')} missing required fields: {missing}")

    breakdown = {f: _normalize_0_10(task_row[f]) for f in REQUIRED_FIELDS}
    breakdown["asset_impact"] = _normalize_0_10(_get_asset_impact(task_row))

    raw_score = sum(WEIGHTS[f] * breakdown[f] for f in ALL_SCORE_FIELDS)  # 0-10 scale
    score = round(raw_score * 10, 1)  # -> 0-100 scale
    score = max(0.0, min(100.0, score))

    band = _band_for_score(score)
    reason_text = _build_reason_text(task_row, breakdown, band)

    return {
        "task_id": task_row.get("task_id", "UNKNOWN"),
        "department": task_row.get("department"),
        "corridor_id": task_row.get("corridor_id"),
        "task_type": task_row.get("task_type"),
        "score": score,
        "band": band,
        "breakdown": breakdown,
        "reason_text": reason_text,
    }


def format_explainability_block(result: dict) -> str:
    """Formats a single scored task into the console-style block from the spec:

        TASK: TMS001 | Score: 94 | Critical
        Criticality 9/10, Urgency 9/10, Severity 9/10, Failure Risk 8/10, Asset Impact 10/10
        Reason: ...
    """
    b = result["breakdown"]
    line1 = f"TASK: {result['task_id']} | Score: {result['score']} | {result['band']}"
    line2 = (
        f"Criticality {b['criticality']}/10, Urgency {b['urgency']}/10, "
        f"Severity {b['defect_severity']}/10, Failure Risk {b['failure_risk']}/10, "
        f"Asset Impact {b['asset_impact']}/10"
    )
    line3 = f"Reason: {result['reason_text']}"
    return "\n".join([line1, line2, line3])


# ---------------------------------------------------------------------------
# Batch processing
# ---------------------------------------------------------------------------

def score_all_tasks(tasks: List[dict]) -> pd.DataFrame:
    """Score a list of task dicts and return a ranked DataFrame (highest score first)."""
    results = [score_task(t) for t in tasks]

    # Flatten breakdown dict into separate columns for the DataFrame/CSV
    rows = []
    for r in results:
        row = {
            "task_id": r["task_id"],
            "department": r["department"],
            "corridor_id": r["corridor_id"],
            "task_type": r["task_type"],
            "score": r["score"],
            "band": r["band"],
            "criticality": r["breakdown"]["criticality"],
            "urgency": r["breakdown"]["urgency"],
            "defect_severity": r["breakdown"]["defect_severity"],
            "failure_risk": r["breakdown"]["failure_risk"],
            "asset_impact": r["breakdown"]["asset_impact"],
            "reason_text": r["reason_text"],
        }
        rows.append(row)

    df = pd.DataFrame(rows)
    df = df.sort_values(by="score", ascending=False).reset_index(drop=True)
    df.insert(0, "rank", df.index + 1)
    return df


def load_tasks(json_path: str) -> List[dict]:
    """Loads Person 1's synthetic_data.json.

    Actual shape shipped by Person 1: a dict with separate lists per
    department system --
        {"tms": [...], "smms": [...], "tdms": [...], "bdms": [...],
         "coa": [...], "timetable": [...], "goods_forecast": [...]}
    Only tms/smms/tdms contain maintenance tasks (the ones we score) --
    bdms/coa/timetable/goods_forecast are consumed by Person 3's
    feasibility engine, not here.

    Also supports a flat list of tasks, or {"tasks": [...]}, in case the
    schema changes later.
    """
    with open(json_path, "r") as f:
        data = json.load(f)

    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        if "tasks" in data:
            return data["tasks"]

        task_system_keys = ["tms", "smms", "tdms"]
        if any(k in data for k in task_system_keys):
            tasks: List[dict] = []
            for key in task_system_keys:
                tasks.extend(data.get(key, []))
            return tasks

    raise ValueError(
        "synthetic_data.json must be a list of tasks, a dict with a 'tasks' key, "
        "or a dict containing 'tms'/'smms'/'tdms' task lists"
    )


def run(json_path: Optional[str] = None, output_csv: str = "priority_scores.csv") -> pd.DataFrame:
    """Main entrypoint Person 6's app.py / main.py can call.

    If json_path is None or the file doesn't exist yet (Person 1 hasn't
    finished), falls back to the built-in demo scenario so the rest of the
    team isn't blocked.
    """
    if json_path and os.path.exists(json_path):
        tasks = load_tasks(json_path)
    else:
        print(f"[priority_engine] '{json_path}' not found — using built-in demo scenario tasks.")
        tasks = DEMO_TASKS

    df = score_all_tasks(tasks)
    df.to_csv(output_csv, index=False)
    print(f"[priority_engine] Wrote {len(df)} scored tasks to {output_csv}")
    return df


# ---------------------------------------------------------------------------
# Demo scenario tasks (M01-M05) — matches the corridor C-101 demo narrative
# ---------------------------------------------------------------------------

DEMO_TASKS = [
    {
        "task_id": "M01",
        "department": "Engineering",
        "corridor_id": "C-101",
        "task_type": "Track Defect Repair",
        "criticality": 10,
        "urgency": 9,
        "defect_severity": 9,
        "failure_risk": 9,
        "asset_impact": 9,
        "overdue_days": 12,
        "estimated_duration_min": 120,
    },
    {
        "task_id": "M02",
        "department": "S&T",
        "corridor_id": "C-101",
        "task_type": "Signal Maintenance",
        "criticality": 7,
        "urgency": 8,
        "defect_severity": 7,
        "failure_risk": 6,
        "asset_impact": 7,
        "overdue_days": 5,
        "estimated_duration_min": 90,
    },
    {
        "task_id": "M03",
        "department": "Traction",
        "corridor_id": "C-101",
        "task_type": "OHE Inspection",
        "criticality": 8,
        "urgency": 6,
        "defect_severity": 8,
        "failure_risk": 7,
        "asset_impact": 8,
        "overdue_days": 3,
        "estimated_duration_min": 120,
    },
    {
        "task_id": "M04",
        "department": "Engineering",
        "corridor_id": "C-102",
        "task_type": "Track Inspection",
        "criticality": 5,
        "urgency": 4,
        "defect_severity": 5,
        "failure_risk": 5,
        "asset_impact": 6,
        "overdue_days": 0,
        "estimated_duration_min": 120,
    },
    {
        "task_id": "M05",
        "department": "S&T",
        "corridor_id": "C-103",
        "task_type": "Signal Inspection",
        "criticality": 3,
        "urgency": 3,
        "defect_severity": 3,
        "failure_risk": 3,
        "asset_impact": 4,
        "overdue_days": 0,
        "estimated_duration_min": 60,
    },
]


# ---------------------------------------------------------------------------
# Lightweight self-tests (spec explicitly asks: confirm M01 lands "Critical")
# Run with: python priority_engine.py
# ---------------------------------------------------------------------------

def _self_test(tasks: Optional[List[dict]] = None, headline_task_id: str = "M01"):
    tasks = tasks if tasks is not None else DEMO_TASKS
    df = score_all_tasks(tasks)

    if headline_task_id in df["task_id"].values:
        headline = df[df["task_id"] == headline_task_id].iloc[0]
        assert headline["band"] == "Critical", (
            f"{headline_task_id} expected Critical, got {headline['band']} (score={headline['score']})"
        )
        print(f"[priority_engine] {headline_task_id} confirmed Critical (score={headline['score']}).")
    else:
        print(f"[priority_engine] Note: '{headline_task_id}' not found in this dataset, skipping that check.")

    # Every score must fall inside 0-100
    assert df["score"].between(0, 100).all(), "All scores must be within 0-100"

    print("[priority_engine] Self-tests passed.")
    print()
    print("Ranked tasks (top 10):")
    print(df[["rank", "task_id", "department", "corridor_id", "score", "band"]].head(10).to_string(index=False))
    print()
    print(f"Explainability sample ({df.iloc[0]['task_id']}):")
    top_task = next(t for t in tasks if t.get("task_id") == df.iloc[0]["task_id"])
    print(format_explainability_block(score_task(top_task)))


if __name__ == "__main__":
    # Try the real data path first (data/synthetic_data.json relative to repo root),
    # fall back to the demo tasks baked into this file if Person 1 hasn't pushed yet.
    data_path = "data/synthetic_data.json"
    if os.path.exists(data_path):
        real_tasks = load_tasks(data_path)
        # M-ENG-01 is the Engineering track-defect task with the highest urgency
        # in the real dataset -- the natural "critical" anchor task for the demo.
        _self_test(tasks=real_tasks, headline_task_id="M-ENG-01")
    else:
        _self_test(tasks=DEMO_TASKS, headline_task_id="M01")

    print()
    run(json_path=data_path, output_csv="priority_scores.csv")
