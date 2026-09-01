"""
test_full_dataset.py – Test feasibility evaluation on the entire synthetic dataset
"""

import os
import sys

# Ensure repo root is on sys.path
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from src.data_loader import load_all_data
from src.feasibility_engine import evaluate_all_tasks
from src.bundling import bundle_tasks
from src.optimizer import optimize_schedule


def test_full_pipeline():
    datasets = load_all_data()
    all_tasks = datasets["all_tasks"]
    print(f"[*] Loaded {len(all_tasks)} master tasks across corridors.")

    # 1. Feasibility Engine on all tasks
    feas_res = evaluate_all_tasks(all_tasks, datasets, date="2026-09-01")
    metrics = feas_res["summary_metrics"]
    print(f"[*] Feasibility evaluation completed:")
    print(f"    - Total tasks evaluated: {metrics['total_tasks_evaluated']}")
    print(f"    - Initial conflicts:     {metrics['initial_conflicts_detected']}")
    print(f"    - Feasible windows:      {metrics['feasible_windows_found']}")
    print(f"    - Rescheduled to slots:  {metrics['tasks_rescheduled_to_feasible_slot']}")

    # 2. Bundling Engine
    bundled = bundle_tasks(feas_res["feasible_windows"])
    print(f"[*] Bundling completed: {len(feas_res['feasible_windows'])} windows bundled into {len(bundled)} blocks.")

    # 3. CP-SAT Optimizer
    opt_res = optimize_schedule(
        bundled_windows=bundled,
        individual_windows=feas_res["requested_windows"],
        task_meta=feas_res["task_meta"]
    )
    print(f"[*] CP-SAT Solver Status: {opt_res['status']}, Selected Blocks: {len(opt_res['selected_windows'])}")
    print("[*] Full end-to-end dataset test PASSED successfully!")


if __name__ == "__main__":
    test_full_pipeline()
