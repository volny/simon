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

let inputs = [];
const sequence = ['10', '00'];//, '00', '01', '10', '11', '00', '01'];

function checkClick() {
  console.debug('sequence:', sequence[inputs.length -1], 'input:', inputs[inputs.length -1]);

  if (sequence[inputs.length -1] === inputs[inputs.length -1]) {
    console.log('correct input')
  } else {
    console.log('wrong input')
    showMessage('Game Over');
    window.setTimeout(() => {
      showMessage('Highscore: ' + parseInt(inputs.length - 1).toString(), false);
    }, 700)
  }

}

function handleClick(e) {
  const canvasWidth = canvas.offsetWidth;
  const x = e.pageX - canvas.offsetLeft;
  const y = e.pageY - canvas.offsetTop;

  if (x < width / 2 && y < width /2) {
    activateQuarter('00');
    window.setTimeout(() => activateQuarter('00', true), 500);
    inputs.push('00');
  } else if (x < width / 2 && y > width / 2) {
    activateQuarter('01');
    window.setTimeout(() => activateQuarter('01', true), 500);
    inputs.push('01');
  } else if (x > width / 2 && y < width / 2) {
    activateQuarter('10');
    window.setTimeout(() => activateQuarter('10', true), 500);
    inputs.push('10');
  } else if (x > width / 2 && y > width / 2) {
    activateQuarter('11');
    window.setTimeout(() => activateQuarter('11', true), 500);
    inputs.push('11');
  }

  checkClick();

}

canvas.addEventListener('click', handleClick, false);
document.querySelector('#restart').addEventListener('click', () => {
  // remove gameover message
  if (document.querySelector('.message')) {
    document.body.removeChild(document.querySelector('.message'));
  }

  drawBoard();

  computersTurn(sequence);
}, false)

drawBoard();


function showMessage(string, destroy = true) {
  const message = document.createElement("p");
  message.className += "message animated zoomIn";
  const text = document.createTextNode(string);
  message.appendChild(text);
  document.body.insertBefore(message, canvas);
  if (destroy) {
    window.setTimeout(() => {
      document.body.removeChild(message);
    }, 700)
  }
}

function playSequence(coords, callback) {
  if (coords.length === 0) {
    callback();
    return false;
  }
  window.setTimeout(() => {
    activateQuarter(coords[0]);
    window.setTimeout(() => {
      activateQuarter(coords[0], true);
      playSequence(coords.slice(1, coords.length), callback);
    }, 800) // light-up duration
  }, 300) // break between light-up
}

function playersTurn() {
  showMessage('Your turn');
  inputs = [];
}

function computersTurn(coords) {
  showMessage('Watch closely');

  window.setTimeout(() => {
    playSequence(coords, playersTurn);
  }, 900)
}

