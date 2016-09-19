import './style.scss';

const canvas = document.querySelector('#gameboard');
const gb = canvas.getContext('2d');

// CANVAS SIZES
const width = 500;
const padding = 30;
const lineWidth = 15;

function drawBoard() {
  // paint over board
  gb.fillStyle = '#ffffff';
  gb.fillRect(0, 0, width, width);

  gb.beginPath();
  gb.fillStyle = '#d7dde1';
  gb.arc(width / 2, width / 2, width / 2 - padding + lineWidth, 0, 2 * Math.PI);
  gb.fill();

  gb.beginPath();
  gb.fillStyle = '#ecf0f1';
  gb.arc(width / 2, width / 2, width / 2 - padding, 0, 2 * Math.PI);
  gb.fill();

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

drawBoard();

