import './style.scss';

const canvas = document.querySelector('#gameboard');
const gb = canvas.getContext('2d');

// CANVAS SIZES
const width = 500;
const padding = 30;
const lineWidth = 15;

const backgroundColor = '#ecf0f1';
const lineColor = '#d7dde1';

function drawLines() {
  gb.lineWidth = lineWidth;
  gb.strokeStyle = lineColor;

  gb.beginPath();
  gb.moveTo(width / 2, padding);
  gb.lineTo(width / 2, width - padding);
  gb.stroke();

  gb.beginPath();
  gb.moveTo(padding, width / 2);
  gb.lineTo(width - padding, width / 2);
  gb.stroke();
}

function drawDisks() {
  gb.beginPath();
  gb.fillStyle = lineColor;
  gb.arc(width / 2, width / 2, width / 2 - padding + lineWidth, 0, 2 * Math.PI);
  gb.fill();

  gb.beginPath();
  gb.fillStyle = backgroundColor;
  gb.arc(width / 2, width / 2, width / 2 - padding, 0, 2 * Math.PI);
  gb.fill();
}

function drawBoard() {
  // paint over board
  gb.fillStyle = '#ffffff';
  gb.fillRect(0, 0, width, width);

  drawDisks();
  drawLines();
}

function drawQuarter(start, end, color) {
  gb.beginPath();
  gb.arc(width / 2, width / 2, (width / 2) - padding, start, end);
  gb.lineTo(width / 2, width / 2);
  gb.closePath();
  gb.fillStyle = color;
  gb.fill();
}

function activateQuarter(coordinates, deactivate) {
  switch (coordinates) {
    case '00':
      drawQuarter(Math.PI, Math.PI * (3/2), deactivate ? backgroundColor : '#2ecc71');
      break;
    case '10':
      drawQuarter(Math.PI * (3/2), Math.PI * 2, deactivate ? backgroundColor : '#e74c3c');
      break;
    case '01':
      drawQuarter(Math.PI / 2, Math.PI, deactivate ? backgroundColor : '#3498db');
      break;
    case '11':
      drawQuarter(0, Math.PI / 2, deactivate ? backgroundColor : '#f1c40f');
      break;
  }

  drawLines();
}

let history = [];

function handleClick(e) {
  const canvasWidth = canvas.offsetWidth;
  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;

  if (x < width / 2 && y < width /2) {
    activateQuarter('00');
    window.setTimeout(() => activateQuarter('00', true), 500);
    history.push('00');
  } else if (x < width / 2 && y > width / 2) {
    activateQuarter('01');
    window.setTimeout(() => activateQuarter('01', true), 500);
    history.push('01');
  } else if (x > width / 2 && y < width / 2) {
    activateQuarter('10');
    window.setTimeout(() => activateQuarter('10', true), 500);
    history.push('10');
  } else if (x > width / 2 && y > width / 2) {
    activateQuarter('11');
    window.setTimeout(() => activateQuarter('11', true), 500);
    history.push('11');
  }
}

canvas.addEventListener('click', handleClick, false);
document.querySelector('#restart').addEventListener('click', () => {
  drawBoard();
  history = [];

  play(sequence);
}, false)

drawBoard();

const sequence = ['10', '00', '00', '01', '10', '11', '00', '01'];

function play(coords) {
  var message = document.createElement("p");
  message.className += "message animated zoomIn";
  var text = document.createTextNode('Watch closely');
  message.appendChild(text);
  document.body.insertBefore(message, canvas); 
  window.setTimeout(() => {document.body.removeChild(message)}, 700)

  playSequence(coords);
}

function playSequence(coords) {
  if (coords.length === 0) {
    document.querySelector('#message').textContent = '';
    return false;
  }
  window.setTimeout(() => {
    activateQuarter(coords[0]);
    window.setTimeout(() => {
      activateQuarter(coords[0], true);
      playSequence(coords.slice(1, coords.length));
    }, 800) // light-up duration
  }, 300) // break between light-up
}

