# Discharge Status Visualizer

Thames Water storm discharge visualizer

## Description

London has multiple rivers that were buried underground, which once flowed into the River
Thames. The historical habit of discharging sewage into these smaller rivers shaped their
current buried form. To this day, water companies continue to discharge sewage into the
River Thames during overflow events.

Thames Water is the only water company in the UK that publicly releases storm discharge
data. Growing public demand for transparency around health and environmental concerns has
highlighted the need for accessible information. As part of the Lost River research
project, this work proposes an unconventional mapping visualisation of London's sewer
system and its existence as a network of lost rivers.

## Getting Started

### Dependencies

Install packages in terminal.
```bash
npm install
```

### Running the Program

Check number 2 from [Known Issue](https://github.com/devsohyun/discharge-status-visualizer?tab=readme-ov-file#known-issue).
```bash
node app.js
```

### Executing

#### Python (Optional)

You need Python installed on your machine to run the script that requests data from the
Thames Water API. A sample JSON file for testing is already prepared in the `discharge/`
directory — only follow the steps below if you want to fetch the latest data.

1. Install Python from [python.org](https://www.python.org/downloads/).
2. Install the `datetime` package:
```bash
pip install DateTime
```
3. Run the script to download the latest JSON file:
```bash
python thames_water_discharge.py
```
4. Check the `discharge/` directory to confirm the latest files have been downloaded.
5. Open `index.html` with a live server.

## Help

### Known Issue

1. Mouse hover position is currently inaccurate in the WebGL environment due to a mismatch
between world position and mouse position coordinates. This will be addressed in a future
update.
2. There is a nodejs server `app.js` with node modules in directory. This doesn't really work right now as a server. However, this was prepared for a centralised system in the future to run python code whenever it is needed to request API to update json file from the client side. Thus, you can just Go Live from the `index.html` file for now.