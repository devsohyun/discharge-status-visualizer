import json
import os
from datetime import datetime

import requests

# --- API Configuration ---
BASE_URL = "https://api.thameswater.co.uk/opendata/v2"
ENDPOINT = "/discharge/status"  # ✅ Fixed: was "/discharge/discharge"
FULL_URL = f"{BASE_URL}{ENDPOINT}"

# --- Time ---
current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

# --- Output directory and filenames (based on endpoint) ---
if ENDPOINT == "/discharge/alerts":
    output_dir = "discharge/alerts"
    filename = f"{current_datetime}_alerts.json"
else:
    output_dir = "discharge/status"
    filename = f"{current_datetime}_status.json"

latest_filename = "latest.json"

# --- Full file paths ---
output_path = os.path.join(output_dir, filename)
latest_path = os.path.join(output_dir, latest_filename)

print(f"Attempting to fetch data from: {FULL_URL}\n")

try:
    response = requests.get(FULL_URL)
    response.raise_for_status()

    data = response.json()
    items = data.get("items", [])

    if items:
        os.makedirs(output_dir, exist_ok=True)

        # --- Save 1: Timestamped archive file ---
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=4)

        # --- Save 2: Stable "latest" file (always overwritten) ---
        with open(latest_path, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=4)

        print(f"\n* ---- Success! All {len(items)} items saved to:")
        print(
            f"  Timestamped : ./{output_path}  ({os.path.getsize(output_path) / 1024:.2f} KB)"
        )
        print(
            f"  Latest      : ./{latest_path}  ({os.path.getsize(latest_path) / 1024:.2f} KB)"
        )

    else:
        print("\nNo items found in the response to save.")

except requests.exceptions.RequestException as e:
    print(f"\n* ---- An error occurred while making the API request: {e}")
