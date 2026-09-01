"""
export_demo_logs.py – Export Golden Demo Feasibility Logs for UI & Reporting
=============================================================================
"""

import os
import sys
import json

# Ensure repo root is on sys.path
_REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from src.feasibility_engine import get_demo_scenario_feasibility


def export_logs():
    data_dir = os.path.join(_REPO_ROOT, "data")
    os.makedirs(data_dir, exist_ok=True)

    demo_res = get_demo_scenario_feasibility()
    
    csv_path = os.path.join(data_dir, "feasibility_log_demo.csv")
    demo_res["feasibility_log_df"].to_csv(csv_path, index=False)
    print(f"[*] Exported: {csv_path}")

    json_path = os.path.join(data_dir, "feasibility_log_demo.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(demo_res["evaluation_results"], f, indent=2)
    print(f"[*] Exported: {json_path}")


if __name__ == "__main__":
    export_logs()
