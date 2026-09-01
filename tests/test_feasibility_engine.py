"""
test_feasibility_engine.py – Comprehensive Test Suite for Person 3
===================================================================
Tests all 7 feasibility checks, interval calculation helpers, fallback search
loop, and full pipeline integration with bundling and optimization.
"""

import os
import sys
import unittest
import pandas as pd

# Reconfigure stdout for utf-8
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure repo root is on sys.path
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from src.data_loader import load_all_data, get_golden_demo_data
from src.feasibility_engine import (
    to_minutes,
    minutes_to_str,
    intervals_overlap,
    parse_resources,
    derive_safety_flags,
    check_window,
    find_feasible_windows,
    evaluate_all_tasks,
    get_demo_scenario_feasibility
)
from src.bundling import bundle_tasks
from src.optimizer import optimize_schedule


class TestFeasibilityEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.datasets = load_all_data()

    def test_01_time_helpers(self):
        """Test time parsing and conversion helpers."""
        self.assertEqual(to_minutes("00:00"), 0)
        self.assertEqual(to_minutes("10:30"), 630)
        self.assertEqual(to_minutes("23:59"), 1439)
        self.assertEqual(minutes_to_str(630), "10:30")
        self.assertEqual(minutes_to_str(0), "00:00")

    def test_02_interval_overlap(self):
        """Test interval intersection logic."""
        # Non-overlapping intervals
        self.assertFalse(intervals_overlap(600, 720, 720, 800))  # 10:00-12:00 and 12:00-13:20 (touching)
        self.assertFalse(intervals_overlap(600, 700, 720, 800))  # Gap between

        # Overlapping intervals
        self.assertTrue(intervals_overlap(600, 720, 630, 660))   # 10:00-12:00 and 10:30-11:00
        self.assertTrue(intervals_overlap(600, 720, 500, 650))   # Starts before, ends inside
        self.assertTrue(intervals_overlap(600, 720, 650, 800))   # Starts inside, ends after

    def test_03_passenger_train_conflict_check(self):
        """Test that candidate window overlapping passenger train P101 is rejected."""
        task = {
            "task_id": "TEST-ENG-01",
            "department": "Engineering",
            "corridor_id": "C101",
            "estimated_duration": 120,
            "required_resources": "Heavy Tamper"
        }
        # Passenger train P101 is 10:30-11:00 on C101
        res = check_window(
            task=task,
            candidate_start="10:00",
            candidate_end="12:00",
            corridor_id="C101",
            date="2026-09-01",
            datasets=self.datasets
        )
        self.assertFalse(res["feasible"])
        self.assertTrue(any("Passenger Train P101" in v for v in res["violations"]))

    def test_04_goods_train_conflict_check(self):
        """Test that candidate window overlapping goods train G201 is rejected."""
        task = {
            "task_id": "TEST-TRC-01",
            "department": "Traction",
            "corridor_id": "C101",
            "estimated_duration": 120,
            "required_resources": "OHE Tower Wagon"
        }
        # Goods train G201 is 12:00-12:30 (prob=0.95) on C101
        res = check_window(
            task=task,
            candidate_start="11:00",
            candidate_end="13:00",
            corridor_id="C101",
            date="2026-09-01",
            datasets=self.datasets
        )
        self.assertFalse(res["feasible"])
        self.assertTrue(any("Goods Train G201" in v for v in res["violations"]))

    def test_05_coa_availability_check(self):
        """Test that candidate window outside COA availability window is flagged."""
        task = {
            "task_id": "TEST-SNT-01",
            "department": "S&T",
            "corridor_id": "C101",
            "estimated_duration": 90,
            "required_resources": "Signal Team"
        }
        # C101 COA on 2026-09-01 is 13:00-16:00
        res = check_window(
            task=task,
            candidate_start="08:00",
            candidate_end="09:30",
            corridor_id="C101",
            date="2026-09-01",
            datasets=self.datasets
        )
        self.assertFalse(res["feasible"])
        self.assertTrue(any("COA Availability Check Failed" in v for v in res["violations"]))

    def test_06_duration_check(self):
        """Test that insufficient time window duration is rejected."""
        task = {
            "task_id": "TEST-DUR-01",
            "department": "Engineering",
            "corridor_id": "C101",
            "estimated_duration": 120
        }
        # Providing only 60 minutes for a 120-minute task
        res = check_window(
            task=task,
            candidate_start="13:00",
            candidate_end="14:00",
            corridor_id="C101",
            date="2026-09-01",
            datasets=self.datasets
        )
        self.assertFalse(res["feasible"])
        self.assertTrue(any("Duration Violation" in v for v in res["violations"]))

    def test_07_resource_double_booking_check(self):
        """Test that concurrent tasks demanding the same resource are rejected."""
        task = {
            "task_id": "TEST-RES-02",
            "department": "Engineering",
            "corridor_id": "C102",
            "estimated_duration": 60,
            "required_resources": "Heavy Tamper A, Track Gang"
        }
        active_assignments = [
            {
                "task_id": "ACTIVE-01",
                "date": "2026-09-01",
                "start_time": "14:00",
                "end_time": "16:00",
                "resources": ["Heavy Tamper A"]
            }
        ]
        res = check_window(
            task=task,
            candidate_start="14:30",
            candidate_end="15:30",
            corridor_id="C102",
            date="2026-09-01",
            datasets=self.datasets,
            active_assignments=active_assignments
        )
        self.assertFalse(res["feasible"])
        self.assertTrue(any("Resource Double-Booking" in v for v in res["violations"]))

    def test_08_window_search_fallback(self):
        """Test fallback search loop finds feasible window for M-ENG-01."""
        task = {
            "task_id": "M-ENG-01",
            "department": "Engineering",
            "corridor_id": "C101",
            "estimated_duration": 120,
            "preferred_window": "10:00-12:00",
            "required_resources": "Heavy Tamper, Track Relay Gang",
            "defect_severity": 9,
            "criticality": 10
        }
        res = find_feasible_windows(
            task=task,
            datasets=self.datasets,
            date="2026-09-01"
        )
        self.assertFalse(res["requested_window"]["feasible"])
        self.assertIsNotNone(res["feasible_window"])
        self.assertEqual(res["feasible_window"]["start_time"], "13:00")
        self.assertEqual(res["feasible_window"]["end_time"], "15:00")

    def test_09_golden_demo_scenario_integration(self):
        """Test end-to-end integration of Golden Demo scenario."""
        demo_res = get_demo_scenario_feasibility()
        summary = demo_res["summary_metrics"]

        # All 3 tasks must have initial conflicts detected and successfully resolved
        self.assertEqual(summary["total_tasks_evaluated"], 3)
        self.assertEqual(summary["initial_conflicts_detected"], 3)
        self.assertEqual(summary["feasible_windows_found"], 3)

        # Feed to bundling
        bundled = bundle_tasks(demo_res["feasible_windows"])
        self.assertEqual(len(bundled), 1)
        self.assertEqual(bundled[0]["corridor_id"], "C101")
        self.assertEqual(bundled[0]["start_time"], "13:00")
        self.assertEqual(set(bundled[0]["departments"]), {"Engineering", "S&T", "Traction"})

        # Feed to optimizer
        opt_res = optimize_schedule(
            bundled_windows=bundled,
            individual_windows=demo_res["requested_windows"],
            task_meta=demo_res["task_meta"]
        )
        self.assertIn(opt_res["status"], ["OPTIMAL", "FEASIBLE"])
        self.assertEqual(len(opt_res["selected_windows"]), 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
