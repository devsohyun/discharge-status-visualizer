import requests

BASE = "https://environment.data.gov.uk/hydrology"

# Find water quality stations within 5km of Vauxhall Bridge (near Effra outlet)
r = requests.get(
    f"{BASE}/id/stations",
    params={
        # Isle of Effra
        "lat": 51.5008685,
        "long": -0.1225584,
        "dist": 2.5,
        "observedProperty": "dissolved-oxygen",
    },
)

stations = r.json()["items"]
for s in stations:
    print(s.get("label"), s.get("@id"))
