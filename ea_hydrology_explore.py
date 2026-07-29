import requests

BASE = "https://environment.data.gov.uk/hydrology"

stations = [
    # ("WATERMEADS", "E09037A"),
    ("THAMES_CADOGAN PIER", "CADOG2"),
    # ("SERPENTINE", "GPRS48A"),
    # ("SERPENTINE_HYDE PARK", "E18136A"),
    # ("THAMES_PUTNEY", "PUTNEY"),
    # ("THAMES_HAMMERSMITH", "HAMME2"),
]

for label, sid in stations:
    print(f"\n{'=' * 60}")
    print(f"STATION: {label}  [{sid}]")

    # Full station metadata
    r = requests.get(f"{BASE}/id/stations/{sid}.json")
    if not r.ok:
        print(f"  [failed: {r.status_code}]")
        continue
    meta = r.json().get("items", {})
    if isinstance(meta, list):
        meta = meta[0] if meta else {}

    print(f"  River   : {meta.get('riverName', '—')}")
    print(f"  Lat/Lon : {meta.get('lat')}, {meta.get('long')}")
    status = meta.get("status", {})
    print(f"  Status  : {status.get('label') if isinstance(status, dict) else status}")
    print(f"  Opened  : {meta.get('dateOpened', '—')}")
    print(f"  Closed  : {meta.get('dateClosed', 'still open')}")

    # Measures at this station
    m = requests.get(f"{BASE}/id/stations/{sid}/measures.json")
    if not m.ok:
        print(f"  [measures failed: {m.status_code}]")
        continue
    measures = m.json().get("items", [])
    print(f"  Measures ({len(measures)}):")

    for measure in measures:
        prop = measure.get("observedProperty", {})
        prop_l = prop.get("label") if isinstance(prop, dict) else str(prop)
        unit = measure.get("unitName", "—")
        period = measure.get("period", "—")
        m_id = measure.get("@id", "").split("/")[-1]
        print(f"    [{prop_l}]  unit={unit}  period={period}s  id={m_id}")

        # Latest reading
        rr = requests.get(
            f"{BASE}/id/measures/{m_id}/readings.json", params={"latest": True}
        )
        if rr.ok:
            readings = rr.json().get("items", [])
            if readings:
                v = readings[0]
                print(f"      → {v.get('value')} {unit}  at {v.get('dateTime')}")
            else:
                print("      → no readings")
        else:
            print(f"      → readings failed ({rr.status_code})")
