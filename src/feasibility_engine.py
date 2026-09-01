"""
feasibility_engine.py – Railway Feasibility & Conflict Engine (KavachX)
========================================================================
Validates candidate maintenance windows against hard operational, physical,
and safety constraints. Evaluates requested maintenance windows, detects
train/corridor/resource conflicts with explainable reasons, and searches
for alternative feasible maintenance slots.

Implements the 7 sequential checks:
  1. Corridor Availability (COA)
  2. Passenger Train Conflicts (Timetable)
  3. Goods Train Forecast Conflicts (Probability thresholding)
  4. Existing Approved Block Overlaps
  5. Maintenance Duration Sufficiency
  6. Resource & Maintenance Team Double-Booking
  7. Safety-Critical Hard Constraints & Isolation Protocols

Prepares candidate windows directly for Corridor Bundling (bundling.py)
and CP-SAT Optimization (optimizer.py).
"""

from __future__ import annotations

import os
import sys
import datetime
from typing import Any, Dict, List, Optional, Tuple, Union
import pandas as pd

# Ensure repository root is on sys.path
_ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ROOT_DIR not in sys.path:
    sys.path.insert(0, _ROOT_DIR)


# ---------------------------------------------------------------------------
# Time & Interval Helper Functions
# ---------------------------------------------------------------------------

_TIME_FMT = "%H:%M"


def to_minutes(t_val: Union[str, datetime.time, int]) -> int:
    """Convert a time representation (HH:MM string, datetime.time, or minutes) to integer minutes from midnight."""
    if isinstance(t_val, int):
        return t_val
    if isinstance(t_val, datetime.time):
        return t_val.hour * 60 + t_val.minute
    if isinstance(t_val, str):
        t_clean = t_val.strip()
        if ":" in t_clean:
            parts = t_clean.split(":")
            return int(parts[0]) * 60 + int(parts[1])
        try:
            return int(t_clean)
        except ValueError:
            raise ValueError(f"Cannot parse time string: '{t_val}'")
    raise TypeError(f"Unsupported time type: {type(t_val)}")


def minutes_to_str(minutes: int) -> str:
    """Convert integer minutes from midnight to HH:MM format."""
    minutes = minutes % (24 * 60)
    h = minutes // 60
    m = minutes % 60
    return f"{h:02d}:{m:02d}"


def parse_window_range(window_val: Union[str, Tuple[Any, Any], List[Any]]) -> Tuple[int, int]:
    """Parse a window string like '10:00-12:00' or tuple into (start_min, end_min)."""
    if isinstance(window_val, (tuple, list)) and len(window_val) == 2:
        return to_minutes(window_val[0]), to_minutes(window_val[1])
    if isinstance(window_val, str):
        parts = window_val.split("-")
        if len(parts) == 2:
            return to_minutes(parts[0]), to_minutes(parts[1])
    raise ValueError(f"Invalid window range format: {window_val}")


def intervals_overlap(start1: int, end1: int, start2: int, end2: int) -> bool:
    """
    Returns True if two closed/open intervals [start1, end1] and [start2, end2] intersect.
    Touching at boundaries (e.g. 10:00-11:00 and 11:00-12:00) is NOT an overlap.
    """
    return max(start1, start2) < min(end1, end2)


def parse_resources(res_val: Union[str, List[str], None]) -> List[str]:
    """Parse comma-separated or list of resources into a clean list of resource IDs."""
    if res_val is None:
        return []
    if isinstance(res_val, list):
        return [str(r).strip() for r in res_val if str(r).strip()]
    if isinstance(res_val, str):
        if not res_val.strip():
            return []
        return [r.strip() for r in res_val.split(",") if r.strip()]
    return [str(res_val).strip()]


def derive_safety_flags(task: Dict[str, Any]) -> Dict[str, Any]:
    """Derive safety and isolation flags based on department, task type, and severity."""
    dept = task.get("department", "")
    task_type = str(task.get("task_type", "")).lower()
    severity = int(task.get("defect_severity", 5))

    flags: Dict[str, Any] = {
        "power_off": True if (dept == "Traction" or "ohe" in task_type or "catenary" in task_type) else True,
        "isolation": "full" if (dept == "Engineering" or severity >= 8) else "full",
        "safety_critical": bool(task.get("safety_critical", severity >= 8 or int(task.get("criticality", 5)) >= 8))
    }
    return flags


# ---------------------------------------------------------------------------
# Core Feasibility & Conflict Checking Function
# ---------------------------------------------------------------------------

def check_window(
    task: Union[Dict[str, Any], pd.Series],
    candidate_start: Union[str, datetime.time, int],
    candidate_end: Union[str, datetime.time, int],
    corridor_id: Optional[str] = None,
    date: str = "2026-09-01",
    datasets: Optional[Dict[str, pd.DataFrame]] = None,
    existing_blocks: Optional[List[Dict[str, Any]]] = None,
    active_assignments: Optional[List[Dict[str, Any]]] = None,
    goods_prob_threshold: float = 0.50
) -> Dict[str, Any]:
    """
    Evaluates whether a candidate time window is feasible for a maintenance task
    by executing 7 sequential constraint checks.

    Parameters
    ----------
    task : dict or pd.Series
        Task attributes (task_id, department, corridor_id, estimated_duration, required_resources, etc.)
    candidate_start : str, datetime.time, or int
        Candidate window start time (e.g. "10:00")
    candidate_end : str, datetime.time, or int
        Candidate window end time (e.g. "12:00")
    corridor_id : str, optional
        Corridor ID (defaults to task['corridor_id'])
    date : str, default "2026-09-01"
        Date of maintenance
    datasets : dict, optional
        Unified datasets dict containing 'coa', 'timetable', 'goods_forecast'
    existing_blocks : list, optional
        List of previously approved blocks to avoid overlap
    active_assignments : list, optional
        List of active resource assignments to prevent double-booking
    goods_prob_threshold : float, default 0.50
        Probability threshold above which freight trains trigger conflict

    Returns
    -------
    dict
        {
            "feasible": bool,
            "violations": list[str],
            "checks_passed": list[str],
            "train_conflicts": list[str],
            "details": dict
        }
    """
    if isinstance(task, pd.Series):
        task_dict = task.to_dict()
    else:
        task_dict = dict(task)

    c_start_m = to_minutes(candidate_start)
    c_end_m = to_minutes(candidate_end)
    c_corr = str(corridor_id or task_dict.get("corridor_id", "")).strip()
    c_date = str(date).strip()

    c_start_str = minutes_to_str(c_start_m)
    c_end_str = minutes_to_str(c_end_m)

    violations: List[str] = []
    checks_passed: List[str] = []
    train_conflicts: List[str] = []
    conflict_details: Dict[str, Any] = {
        "coa_matched": False,
        "passenger_trains": [],
        "goods_trains": [],
        "existing_blocks": [],
        "duration_actual": c_end_m - c_start_m,
        "duration_required": int(task_dict.get("estimated_duration") or task_dict.get("requested_duration") or 60),
        "resource_conflicts": [],
        "safety_violations": []
    }

    # =========================================================================
    # CHECK 1: Corridor Availability (COA)
    # =========================================================================
    coa_passed = False
    if datasets is not None and "coa" in datasets and not datasets["coa"].empty:
        coa_df = datasets["coa"]
        corr_coa = coa_df[
            (coa_df["corridor_id"].astype(str) == c_corr) &
            (coa_df["date"].astype(str) == c_date) &
            (coa_df["status"].astype(str).str.lower() == "available")
        ]

        for _, row in corr_coa.iterrows():
            coa_s = to_minutes(row["available_start"])
            coa_e = to_minutes(row["available_end"])
            # The candidate window must be fully within the available slot
            if coa_s <= c_start_m and c_end_m <= coa_e:
                coa_passed = True
                conflict_details["coa_matched"] = True
                break

        if not coa_passed:
            available_slots = [
                f"{minutes_to_str(to_minutes(r['available_start']))}-{minutes_to_str(to_minutes(r['available_end']))}"
                for _, r in corr_coa.iterrows()
            ]
            slot_hint = f" (COA available: {', '.join(available_slots)})" if available_slots else " (No COA slots available)"
            violations.append(
                f"COA Availability Check Failed: Corridor {c_corr} is not open during {c_start_str}-{c_end_str}{slot_hint}"
            )
        else:
            checks_passed.append("Corridor available in COA")
    else:
        coa_passed = True
        checks_passed.append("Corridor availability assumed open (no COA dataset)")

    # =========================================================================
    # CHECK 2: Passenger Train Timetable Overlap
    # =========================================================================
    passenger_passed = True
    if datasets is not None and "timetable" in datasets and not datasets["timetable"].empty:
        tt_df = datasets["timetable"]
        corr_tt = tt_df[tt_df["corridor_id"].astype(str) == c_corr]

        for _, row in corr_tt.iterrows():
            arr_m = to_minutes(row["arrival_time"])
            dep_m = to_minutes(row["departure_time"])
            if intervals_overlap(c_start_m, c_end_m, arr_m, dep_m):
                passenger_passed = False
                t_id = row.get("train_id", "Unknown")
                t_type = row.get("train_type", "Passenger")
                t_str = f"Passenger Train {t_id} ({t_type}, {minutes_to_str(arr_m)}-{minutes_to_str(dep_m)})"
                train_conflicts.append(t_str)
                conflict_details["passenger_trains"].append({
                    "train_id": t_id,
                    "train_type": t_type,
                    "arrival": minutes_to_str(arr_m),
                    "departure": minutes_to_str(dep_m)
                })
                violations.append(f"Timetable Conflict: Intersects {t_str} on corridor {c_corr}")

    if passenger_passed:
        checks_passed.append("No passenger train conflict")

    # =========================================================================
    # CHECK 3: Goods Train Forecast Overlap (Probability >= Threshold)
    # =========================================================================
    goods_passed = True
    if datasets is not None and "goods_forecast" in datasets and not datasets["goods_forecast"].empty:
        gf_df = datasets["goods_forecast"]
        corr_gf = gf_df[gf_df["corridor_id"].astype(str) == c_corr]

        for _, row in corr_gf.iterrows():
            prob = float(row.get("probability", 1.0))
            if prob < goods_prob_threshold:
                continue

            arr_m = to_minutes(row["expected_start"])
            dep_m = to_minutes(row["expected_end"])
            if intervals_overlap(c_start_m, c_end_m, arr_m, dep_m):
                goods_passed = False
                t_id = row.get("train_id", "Unknown")
                t_type = row.get("train_type", "Goods")
                t_str = f"Goods Train {t_id} ({t_type}, {minutes_to_str(arr_m)}-{minutes_to_str(dep_m)}, prob={prob:.0%})"
                train_conflicts.append(t_str)
                conflict_details["goods_trains"].append({
                    "train_id": t_id,
                    "train_type": t_type,
                    "start": minutes_to_str(arr_m),
                    "end": minutes_to_str(dep_m),
                    "probability": prob
                })
                violations.append(f"Goods Forecast Conflict: Intersects {t_str} on corridor {c_corr}")

    if goods_passed:
        checks_passed.append("No goods train conflict (forecast clear)")

    # =========================================================================
    # CHECK 4: Existing Approved Block Overlap
    # =========================================================================
    block_passed = True
    if existing_blocks:
        for blk in existing_blocks:
            if str(blk.get("corridor_id")) == c_corr and str(blk.get("date", c_date)) == c_date:
                blk_s = to_minutes(blk["start_time"])
                blk_e = to_minutes(blk["end_time"])
                if intervals_overlap(c_start_m, c_end_m, blk_s, blk_e):
                    block_passed = False
                    blk_id = blk.get("block_id", "Approved Possession")
                    violations.append(
                        f"Existing Block Conflict: Overlaps with {blk_id} ({minutes_to_str(blk_s)}-{minutes_to_str(blk_e)}) on corridor {c_corr}"
                    )
                    conflict_details["existing_blocks"].append(blk)

    if block_passed:
        checks_passed.append("No conflict with existing approved blocks")

    # =========================================================================
    # CHECK 5: Maintenance Duration Check
    # =========================================================================
    duration_passed = True
    actual_duration = c_end_m - c_start_m
    required_duration = conflict_details["duration_required"]

    if actual_duration < required_duration:
        duration_passed = False
        violations.append(
            f"Duration Violation: Candidate window is {actual_duration}m, but task requires {required_duration}m"
        )
    else:
        checks_passed.append(f"Duration satisfied ({actual_duration}m >= {required_duration}m)")

    # =========================================================================
    # CHECK 6: Resource Availability (No Double-Booking)
    # =========================================================================
    resource_passed = True
    task_resources = parse_resources(task_dict.get("required_resources") or task_dict.get("resources"))

    if active_assignments and task_resources:
        for assign in active_assignments:
            if str(assign.get("date", c_date)) != c_date:
                continue
            assign_s = to_minutes(assign["start_time"])
            assign_e = to_minutes(assign["end_time"])
            if intervals_overlap(c_start_m, c_end_m, assign_s, assign_e):
                assign_res = parse_resources(assign.get("resources"))
                shared_res = set(task_resources) & set(assign_res)
                if shared_res:
                    resource_passed = False
                    res_str = ", ".join(sorted(shared_res))
                    violations.append(
                        f"Resource Double-Booking: Resource(s) [{res_str}] already assigned to task {assign.get('task_id', 'concurrent')} at {minutes_to_str(assign_s)}-{minutes_to_str(assign_e)}"
                    )
                    conflict_details["resource_conflicts"].extend(list(shared_res))

    if resource_passed:
        checks_passed.append("Required teams and resources available")

    # =========================================================================
    # CHECK 7: Safety Constraints & Flags
    # =========================================================================
    safety_passed = True
    safety_flags = derive_safety_flags(task_dict)

    # Hard safety rule: safety critical task cannot run if any train or power conflict exists
    if safety_flags.get("safety_critical") and (not passenger_passed or not goods_passed):
        safety_passed = False
        violations.append("Safety Hard Constraint: Safety-critical task cannot proceed during active train pathing")

    if safety_passed:
        checks_passed.append("Safety constraints satisfied")

    # Overall Feasibility
    is_feasible = (len(violations) == 0)

    return {
        "feasible": is_feasible,
        "task_id": task_dict.get("task_id", ""),
        "corridor_id": c_corr,
        "date": c_date,
        "candidate_start": c_start_str,
        "candidate_end": c_end_str,
        "violations": violations,
        "checks_passed": checks_passed,
        "train_conflicts": train_conflicts,
        "safety_flags": safety_flags,
        "resources": task_resources,
        "details": conflict_details
    }


# ---------------------------------------------------------------------------
# Window Search & Fallback Loop
# ---------------------------------------------------------------------------

def find_feasible_windows(
    task: Union[Dict[str, Any], pd.Series],
    datasets: Dict[str, pd.DataFrame],
    date: str = "2026-09-01",
    step_minutes: int = 30,
    max_fallback_attempts: int = 15,
    existing_blocks: Optional[List[Dict[str, Any]]] = None,
    active_assignments: Optional[List[Dict[str, Any]]] = None,
    goods_prob_threshold: float = 0.50
) -> Dict[str, Any]:
    """
    Evaluates the task's requested/preferred window. If rejected due to conflicts,
    steps forward in time (and across COA availability slots) to search for
    the earliest feasible fallback maintenance window.

    Returns
    -------
    dict
        {
            "task_id": str,
            "corridor_id": str,
            "date": str,
            "department": str,
            "requested_window": dict,
            "feasible_window": dict or None,
            "evaluation_history": list[dict],
            "fallback_attempts_count": int
        }
    """
    if isinstance(task, pd.Series):
        task_dict = task.to_dict()
    else:
        task_dict = dict(task)

    task_id = str(task_dict.get("task_id", ""))
    corridor_id = str(task_dict.get("corridor_id", "")).strip()
    department = str(task_dict.get("department", "Engineering")).strip()
    required_duration = int(task_dict.get("estimated_duration") or task_dict.get("requested_duration") or 60)

    # 1. Determine Initial Requested Window
    req_start_m: Optional[int] = None
    req_end_m: Optional[int] = None

    if "requested_start" in task_dict and "requested_end" in task_dict and task_dict["requested_start"] is not None:
        req_start_m = to_minutes(task_dict["requested_start"])
        req_end_m = to_minutes(task_dict["requested_end"])
    elif "preferred_window" in task_dict and task_dict["preferred_window"]:
        try:
            req_start_m, req_end_m = parse_window_range(task_dict["preferred_window"])
        except Exception:
            pass

    if req_start_m is None or req_end_m is None:
        req_start_m = 10 * 60  # Default to 10:00
        req_end_m = req_start_m + required_duration

    # If requested span is shorter than required duration, expand it
    if (req_end_m - req_start_m) < required_duration:
        req_end_m = req_start_m + required_duration

    # 2. Evaluate Requested Window
    req_check = check_window(
        task=task_dict,
        candidate_start=req_start_m,
        candidate_end=req_end_m,
        corridor_id=corridor_id,
        date=date,
        datasets=datasets,
        existing_blocks=existing_blocks,
        active_assignments=active_assignments,
        goods_prob_threshold=goods_prob_threshold
    )

    evaluation_history: List[Dict[str, Any]] = []
    evaluation_history.append({
        "attempt": 1,
        "type": "REQUESTED_WINDOW",
        "start_time": minutes_to_str(req_start_m),
        "end_time": minutes_to_str(req_end_m),
        "duration": req_end_m - req_start_m,
        "feasible": req_check["feasible"],
        "violations": req_check["violations"],
        "checks_passed": req_check["checks_passed"],
        "train_conflicts": req_check["train_conflicts"]
    })

    feasible_window: Optional[Dict[str, Any]] = None

    if req_check["feasible"]:
        feasible_window = {
            "task_id": task_id,
            "corridor_id": corridor_id,
            "date": date,
            "start_time": minutes_to_str(req_start_m),
            "end_time": minutes_to_str(req_end_m),
            "department": department,
            "safety_flags": req_check["safety_flags"],
            "resources": req_check["resources"],
            "duration": required_duration,
            "priority": task_dict.get("priority", "high"),
            "task_type": task_dict.get("task_type", "Maintenance"),
            "reasons_passed": req_check["checks_passed"],
            "is_rescheduled": False
        }
    else:
        # 3. Fallback Search Loop: Look across COA available slots & step forward
        candidate_start_times: List[int] = []

        # Gather start points from COA slots first
        if "coa" in datasets and not datasets["coa"].empty:
            coa_df = datasets["coa"]
            corr_coa = coa_df[
                (coa_df["corridor_id"].astype(str) == corridor_id) &
                (coa_df["date"].astype(str) == str(date)) &
                (coa_df["status"].astype(str).str.lower() == "available")
            ]
            for _, r in corr_coa.iterrows():
                coa_s = to_minutes(r["available_start"])
                coa_e = to_minutes(r["available_end"])
                # Step within COA slot
                curr = coa_s
                while curr + required_duration <= coa_e:
                    if curr not in candidate_start_times:
                        candidate_start_times.append(curr)
                    curr += step_minutes

        # Also add incremental daytime slots from requested start to 20:00
        curr = req_start_m + step_minutes
        max_time = 20 * 60
        while curr + required_duration <= max_time:
            if curr not in candidate_start_times:
                candidate_start_times.append(curr)
            curr += step_minutes

        # Sort candidate start times
        candidate_start_times.sort()

        attempt_idx = 2
        for cand_s in candidate_start_times:
            if attempt_idx > max_fallback_attempts + 1:
                break

            cand_e = cand_s + required_duration
            if cand_s == req_start_m:
                continue

            cand_check = check_window(
                task=task_dict,
                candidate_start=cand_s,
                candidate_end=cand_e,
                corridor_id=corridor_id,
                date=date,
                datasets=datasets,
                existing_blocks=existing_blocks,
                active_assignments=active_assignments,
                goods_prob_threshold=goods_prob_threshold
            )

            evaluation_history.append({
                "attempt": attempt_idx,
                "type": f"FALLBACK_SLOT_{attempt_idx - 1}",
                "start_time": minutes_to_str(cand_s),
                "end_time": minutes_to_str(cand_e),
                "duration": required_duration,
                "feasible": cand_check["feasible"],
                "violations": cand_check["violations"],
                "checks_passed": cand_check["checks_passed"],
                "train_conflicts": cand_check["train_conflicts"]
            })

            if cand_check["feasible"]:
                feasible_window = {
                    "task_id": task_id,
                    "corridor_id": corridor_id,
                    "date": date,
                    "start_time": minutes_to_str(cand_s),
                    "end_time": minutes_to_str(cand_e),
                    "department": department,
                    "safety_flags": cand_check["safety_flags"],
                    "resources": cand_check["resources"],
                    "duration": required_duration,
                    "priority": task_dict.get("priority", "high"),
                    "task_type": task_dict.get("task_type", "Maintenance"),
                    "reasons_passed": cand_check["checks_passed"],
                    "is_rescheduled": True,
                    "original_window": f"{minutes_to_str(req_start_m)}-{minutes_to_str(req_end_m)}"
                }
                break

            attempt_idx += 1

    return {
        "task_id": task_id,
        "corridor_id": corridor_id,
        "date": date,
        "department": department,
        "requested_window": {
            "start_time": minutes_to_str(req_start_m),
            "end_time": minutes_to_str(req_end_m),
            "feasible": req_check["feasible"],
            "violations": req_check["violations"],
            "train_conflicts": req_check["train_conflicts"]
        },
        "feasible_window": feasible_window,
        "evaluation_history": evaluation_history,
        "fallback_attempts_count": len(evaluation_history) - 1
    }


# ---------------------------------------------------------------------------
# High-Level Evaluation & Pipeline Integration
# ---------------------------------------------------------------------------

def evaluate_all_tasks(
    tasks: Union[pd.DataFrame, List[Dict[str, Any]]],
    datasets: Dict[str, pd.DataFrame],
    date: str = "2026-09-01",
    existing_blocks: Optional[List[Dict[str, Any]]] = None,
    goods_prob_threshold: float = 0.50
) -> Dict[str, Any]:
    """
    Runs the Feasibility & Conflict Engine across a collection of tasks.

    Produces:
      1. ``feasible_windows``: Formatted for bundling.py and optimizer.py
      2. ``requested_windows``: Annotated with train conflicts for Before-vs-After
      3. ``task_meta``: Resource & priority mapping for CP-SAT
      4. ``feasibility_log_df``: Tabular DataFrame for control-room UI & explainability
      5. ``summary_metrics``: KPI counts (total evaluated, conflicts detected, feasible resolved)

    Parameters
    ----------
    tasks : pd.DataFrame or list[dict]
        Tasks to evaluate
    datasets : dict[str, pd.DataFrame]
        Unified dataset dict from data_loader.py
    date : str
        Target planning date

    Returns
    -------
    dict
    """
    if isinstance(tasks, pd.DataFrame):
        task_list = tasks.to_dict(orient="records")
    else:
        task_list = list(tasks)

    feasible_windows: List[Dict[str, Any]] = []
    requested_windows: List[Dict[str, Any]] = []
    task_meta: Dict[str, Dict[str, Any]] = {}
    log_rows: List[Dict[str, Any]] = []

    conflicts_detected = 0
    feasible_count = 0
    rescheduled_count = 0

    for task in task_list:
        tid = str(task.get("task_id", ""))
        corridor = str(task.get("corridor_id", ""))
        dept = str(task.get("department", ""))
        priority_val = str(task.get("priority", "high")).lower()
        if "critical" in str(task.get("band", "")).lower() or task.get("criticality", 0) >= 8:
            priority_val = "high"

        # Map BDMS requested window if available
        if "bdms" in datasets and not datasets["bdms"].empty:
            b_match = datasets["bdms"][datasets["bdms"]["task_id"] == tid]
            if not b_match.empty:
                task["requested_start"] = b_match.iloc[0]["requested_start"]
                task["requested_end"] = b_match.iloc[0]["requested_end"]
                task["requested_duration"] = b_match.iloc[0]["requested_duration"]

        res = find_feasible_windows(
            task=task,
            datasets=datasets,
            date=date,
            existing_blocks=existing_blocks,
            goods_prob_threshold=goods_prob_threshold
        )

        req_w = res["requested_window"]
        feas_w = res["feasible_window"]

        # Track Requested Window for Before comparison
        requested_windows.append({
            "task_id": tid,
            "corridor_id": corridor,
            "date": date,
            "start_time": req_w["start_time"],
            "end_time": req_w["end_time"],
            "department": dept,
            "feasible": req_w["feasible"],
            "train_conflicts": req_w["train_conflicts"],
            "violations": req_w["violations"]
        })

        if not req_w["feasible"]:
            conflicts_detected += 1

        # Track Feasible Window for Downstream Bundling & Optimization
        if feas_w is not None:
            feasible_count += 1
            feasible_windows.append(feas_w)
            if feas_w.get("is_rescheduled"):
                rescheduled_count += 1

        # Populate Task Metadata for CP-SAT Optimizer
        task_meta[tid] = {
            "priority": priority_val,
            "resources": parse_resources(task.get("required_resources") or task.get("resources")),
            "department": dept,
            "corridor_id": corridor,
            "task_type": task.get("task_type", "Maintenance")
        }

        # Populate Flat Log Rows for UI Dashboard
        for entry in res["evaluation_history"]:
            log_rows.append({
                "Task_ID": tid,
                "Department": dept,
                "Corridor": corridor,
                "Date": date,
                "Attempt_Type": entry["type"],
                "Window": f"{entry['start_time']}-{entry['end_time']}",
                "Start_Time": entry["start_time"],
                "End_Time": entry["end_time"],
                "Duration_Mins": entry["duration"],
                "Status": "FEASIBLE" if entry["feasible"] else "CONFLICT REJECTED",
                "Violations": " | ".join(entry["violations"]) if entry["violations"] else "None",
                "Train_Conflicts": " | ".join(entry["train_conflicts"]) if entry["train_conflicts"] else "None",
                "Passed_Checks": " | ".join(entry["checks_passed"])
            })

    feasibility_log_df = pd.DataFrame(log_rows)

    summary_metrics = {
        "total_tasks_evaluated": len(task_list),
        "initial_conflicts_detected": conflicts_detected,
        "feasible_windows_found": feasible_count,
        "tasks_rescheduled_to_feasible_slot": rescheduled_count,
        "unresolvable_tasks": len(task_list) - feasible_count
    }

    return {
        "feasible_windows": feasible_windows,
        "requested_windows": requested_windows,
        "task_meta": task_meta,
        "feasibility_log_df": feasibility_log_df,
        "evaluation_results": log_rows,
        "summary_metrics": summary_metrics
    }


# ---------------------------------------------------------------------------
# Golden Demo Scenario Runner
# ---------------------------------------------------------------------------

def get_demo_scenario_feasibility(data_dir: Optional[str] = None) -> Dict[str, Any]:
    """
    Executes the Feasibility & Conflict Engine specifically on the SIH PS 26027 Golden Demo Scenario:
      - Corridor: C101
      - Date: 2026-09-01
      - Tasks:
          * M-ENG-01 (Track defect repair, req: 10:00-12:00, 120m)
          * M-SNT-01 (Signal maintenance, req: 10:00-11:30, 90m)
          * M-TRC-01 (OHE inspection & repair, req: 11:00-13:00, 120m)
      - Traffic:
          * Passenger P101 (10:30-11:00)
          * Goods G201 (12:00-12:30, prob=0.95)
      - Result:
          * 10:00-13:00 windows rejected due to train conflicts & COA availability
          * 13:00-16:00 alternative window accepted as FEASIBLE for all 3 departments.
    """
    # Import data loader
    from src.data_loader import load_all_data, get_golden_demo_data

    datasets = load_all_data(data_dir)
    golden_data = get_golden_demo_data(data_dir)
    demo_tasks = golden_data["tasks"]

    result = evaluate_all_tasks(
        tasks=demo_tasks,
        datasets=datasets,
        date="2026-09-01"
    )

    return result


# ---------------------------------------------------------------------------
# Standalone Smoke Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys
    # Reconfigure stdout to utf-8 if possible
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    print("=" * 80)
    print("  KavachX - Feasibility & Conflict Engine (Person 3 Smoke Test)")
    print("=" * 80)

    demo_res = get_demo_scenario_feasibility()
    metrics = demo_res["summary_metrics"]

    print(f"\n[*] Evaluated {metrics['total_tasks_evaluated']} Demo Tasks on Corridor C101:")
    print(f"    - Initial Conflicting Windows Detected: {metrics['initial_conflicts_detected']}")
    print(f"    - Feasible Alternative Windows Found:   {metrics['feasible_windows_found']}")
    print(f"    - Successfully Rescheduled to Slots:    {metrics['tasks_rescheduled_to_feasible_slot']}\n")

    print("Feasibility Evaluation Audit Log:")
    log_df = demo_res["feasibility_log_df"][["Task_ID", "Department", "Window", "Status", "Violations"]]
    with pd.option_context('display.max_columns', None, 'display.width', 200, 'display.max_colwidth', None):
        print(log_df.to_string(index=False))

    print("\n[*] Feasible Windows Output Ready for Person 4 Bundling:")
    for fw in demo_res["feasible_windows"]:
        print(f"    * Task: {fw['task_id']:<10} | Dept: {fw['department']:<12} | Feasible Window: {fw['start_time']}-{fw['end_time']} | Flags: {fw['safety_flags']}")
    print("=" * 80)
