import './style.scss';

const canvas = document.querySelector('#gameboard');
const gb = canvas.getContext('2d');

// CANVAS SIZES
const width = 500;
const padding = 30;
const lineWidth = 15;

function drawLines() {
  gb.lineWidth = lineWidth;
  gb.strokeStyle = '#d7dde1';

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
  gb.fillStyle = '#d7dde1';
  gb.arc(width / 2, width / 2, width / 2 - padding + lineWidth, 0, 2 * Math.PI);
  gb.fill();

  gb.beginPath();
  gb.fillStyle = '#ecf0f1';
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

function activateQuarter(coordinates) {
  switch (coordinates) {
    case '00':
      drawQuarter(Math.PI, Math.PI * (3/2), '#2ecc71');
      break;
    case '10':
      drawQuarter(Math.PI * (3/2), Math.PI * 2, '#e74c3c');
      break;
    case '01':
      drawQuarter(Math.PI / 2, Math.PI, '#3498db');
      break;
    case '11':
      drawQuarter(0, Math.PI / 2, '#f1c40f');
      break;
  }

  drawLines();
}

function handleClick(e) {
  const canvasWidth = canvas.offsetWidth;
  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;

  if (x < width / 2 && y < width /2) {
    activateQuarter('00');
    window.setTimeout(drawBoard, 500);
  } else if (x < width / 2 && y > width / 2) {
    activateQuarter('01');
    window.setTimeout(drawBoard, 500);
  } else if (x > width / 2 && y < width / 2) {
    activateQuarter('10');
    window.setTimeout(drawBoard, 500);
  } else if (x > width / 2 && y > width / 2) {
    activateQuarter('11');
    window.setTimeout(drawBoard, 500);
  }
}

canvas.addEventListener('click', handleClick, false);

drawBoard();
//activateQuarter('00');
//activateQuarter('10');
//activateQuarter('01');
//activateQuarter('11');

