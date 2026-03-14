// grid settings
let cellW = 60;
let cellH = 60;
let gap = 30;
let cols, rows;
let positions = [];
let depthLayers = 5;
let colors = [];

// hover state
let hoveredIndex = -1;
let previousHover = -1;

// data
let jsonData;
let data = [];

// load JSON data from the specified path
function preload() {
  jsonData = loadJSON('/discharge/status/latest.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // webgl: (0,0) = center of canvas

  // if it's an object, convert to array
  data = Object.values(jsonData);

  calculateGrid();
  generatePositions();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
  generatePositions();
}

function calculateGrid() {
  // calculate number of columns and rows based on canvas size and cell size
  cols = floor((width - gap) / (cellW + gap));
  rows = ceil(data.length / cols);
}

function generatePositions() {
  // reset positions and colors for each data point in a grid layout
  positions = [];
  colors = [];

  // calculate total grid width and height
  let totalGridWidth = cols * (cellW + gap) - gap;
  let totalGridHeight = rows * (cellH + gap) - gap;

  // start position to center the grid
  let startX = -totalGridWidth / 2;
  let startY = -totalGridHeight / 2;

  // generate positions and colors for each data point
  for (let i = 0; i < data.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);

    let x = startX + col * (cellW + gap);
    let y = startY + row * (cellH + gap);

    positions.push(createVector(x, y, 0));
    // create a random color with more green and less red/blue
    colors.push(color(random(20, 50), random(40, 80), random(20, 50)));
  }
}

function updateInfoPanel(index) {
  if (index === -1 || !data[index]) {
    return;
  }

  let item = data[index];

  document.getElementById('name').innerText = item.locationName;
  document.getElementById('permit-number').innerText = item.permitNumber;
  document.getElementById('grid-ref').innerText = item.locationGridRef;
  document.getElementById('british-national-grid').innerText =
    'x: ' + item.x + ', y: ' + item.y;
  document.getElementById('alert-status').innerText = item.alertStatus;
  document.getElementById('status-changed').innerText = new Date(
    item.statusChanged,
  ).toLocaleString();
  document.getElementById('receiving-water-course').innerText =
    item.receivingWaterCourse;
}

function draw() {
  background(30);
  orbitControl();

  // determine which cell is hovered
  hoveredIndex = -1;

  // convert mouse position to world coordinates
  let worldMouseX = mouseX - width / 2;
  let worldMouseY = mouseY - height / 2;

  // check each cell's position against the mouse position
  for (let i = 0; i < positions.length; i++) {
    let x = positions[i].x;
    let y = positions[i].y;

    if (
      worldMouseX > x - cellW / 2 &&
      worldMouseX < x + cellW / 2 &&
      worldMouseY > y - cellH / 2 &&
      worldMouseY < y + cellH / 2
    ) {
      hoveredIndex = i;
    }

    // draw depth layers for each cell
    for (let d = 0; d < depthLayers; d++) {
      push();
      translate(x, y, -d * 30);

      if (i === hoveredIndex) {
        // hovered
        fill(255, 0, 0, 255 - d * 60);
      } else {
        // not hovered
        fill(100, 255 - d * 60);
        let c = colors[i];
        fill(red(c), green(c), blue(c), 255 - d * 60);
      }
      plane(cellW, cellH);
      pop();
    }
  }

  // update info panel only when hovered index changes
  if (hoveredIndex !== previousHover) {
    updateInfoPanel(hoveredIndex);
    previousHover = hoveredIndex;
  }
}
