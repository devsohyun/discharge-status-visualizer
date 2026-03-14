import json
import os
from datetime import datetime

import requests

# --- API Configuration ---
BASE_URL = "https://api.thameswater.co.uk/opendata/v2"
ENDPOINT = "/discharge/status"  # or "/discharge/alerts"
FULL_URL = f"{BASE_URL}{ENDPOINT}"

# --- Time ---
current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

# --- Output directory (based on endpoint) ---
if ENDPOINT == "/discharge/alerts":
    output_dir = "discharge/alerts"
    filename = f"{current_datetime}_alerts.json"
else:
    output_dir = "discharge/status"
    filename = f"{current_datetime}_status.json"

# --- Full file path ---
output_path = os.path.join(output_dir, filename)

print(f"Attempting to fetch data from: {FULL_URL}\n")

try:
    # 1. Make the GET request
    response = requests.get(FULL_URL)
    response.raise_for_status()

    # 2. Parse the JSON response body
    data = response.json()
    items = data.get("items", [])  # Extract the list of items

    if items:
        # 3. Open the output file in write mode ('w')
        with open(output_path, "w", encoding="utf-8") as f:
            # 4. Use json.dump() to write the Python list directly to the file
            # indent=4 ensures the file is neatly formatted and readable
            json.dump(items, f, indent=4)

        print(f"\n* ---- Success! All {len(items)} items saved to:")
        print(f"File path: ./{output_path}")
        print(f"File size: {os.path.getsize(output_path) / 1024:.2f} KB")

    else:
        print("\nNo discharge status items found in the response to save.")

except requests.exceptions.RequestException as e:
    print(f"\n* ---- An error occurred while making the API request: {e}")
