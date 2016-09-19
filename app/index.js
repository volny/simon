import './style.scss';

const canvas = document.querySelector('#gameboard');
const gb = canvas.getContext('2d');

// CANVAS SIZES
const width = 500;
const padding = 30;

function drawBoard() {
  // paint over board
  gb.fillStyle = '#eeeeee';
  gb.fillRect(0, 0, width, width);
}

drawBoard();

