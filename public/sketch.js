// grid settings
let cellW = 60;
let cellH = 60;
let gap = 30;
let cols, rows;
let positions = [];
let depthLayers = 5;

let hoveredIndex = -1;
let previousHover = -1;

// data
let jsonData;
let data = [];

function preload() {
  jsonData = loadJSON('/discharge/status/data.json');
}

// let cam = {
//   x: 0,
//   y: 0,
//   z: 0,
//   th: 0,
//   phi: 0,
//   lookAt: {
//     x: 0,
//     y: 0,
//     z: 0,
//   }
// }

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); //webgl: (0,0) = center of canvas

  // if it's an object, convert to array
  data = Object.values(jsonData);

  console.log('data length:', data.length);

  calculateGrid();
  generatePositions();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
  generatePositions();
}

function calculateGrid() {
  cols = floor((width - gap) / (cellW + gap));
  rows = ceil(data.length / cols);
}

function generatePositions() {
  positions = [];

  let totalGridWidth = cols * (cellW + gap) - gap;
  let totalGridHeight = rows * (cellH + gap) - gap;

  let startX = -totalGridWidth / 2;
  let startY = -totalGridHeight / 2;

  for (let i = 0; i < data.length; i++) {
    let col = i % cols;
    let row = floor(i / cols);

    let x = startX + col * (cellW + gap);
    let y = startY + row * (cellH + gap);

    positions.push(createVector(x, y, 0));
  }
}

function generateDummyData(n) {
  for (let i = 0; i < n; i++) {
    data.push({ id: i, title: 'Item ' + i });
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
  // ambientLight(225);
  // translate(0,0, mouseX)
  // camera(0, 0, height / 2 / tan(PI / 6), 0, 0, 0, 0, 1, 0);

  hoveredIndex = -1;

  let worldMouseX = mouseX - width / 2;
  let worldMouseY = mouseY - height / 2;

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

    for (let d = 0; d < depthLayers; d++) {
      push();
      translate(x, y, -d * 30);

      if (i === hoveredIndex) {
        // hovered
        fill(255, 0, 0, 255 - d * 60);
      } else {
        // not hovered
        fill(100, 255 - d * 60);
      }
      plane(cellW, cellH);
      pop();
    }
  }

  if (hoveredIndex !== previousHover) {
    updateInfoPanel(hoveredIndex);
    previousHover = hoveredIndex;
  }
}
