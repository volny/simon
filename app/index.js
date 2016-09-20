import './style.scss';

const canvas = {
  dom: document.querySelector('#gameboard'),
  context: document.querySelector('#gameboard').getContext('2d'),
  width: 500,
  padding: 30,
  lineWidth: 15,
  backgroundColor: '#ecf0f1',
  lineColor: '#d7dde1'
}

function drawLines() {
  canvas.context.lineWidth = canvas.lineWidth;
  canvas.context.strokeStyle = canvas.lineColor;

  canvas.context.beginPath();
  canvas.context.moveTo(canvas.width / 2, canvas.padding);
  canvas.context.lineTo(canvas.width / 2, canvas.width - canvas.padding);
  canvas.context.stroke();

  canvas.context.beginPath();
  canvas.context.moveTo(canvas.padding, canvas.width / 2);
  canvas.context.lineTo(canvas.width - canvas.padding, canvas.width / 2);
  canvas.context.stroke();
}

function drawDisks() {
  canvas.context.beginPath();
  canvas.context.fillStyle = canvas.lineColor;
  canvas.context.arc(canvas.width / 2, canvas.width / 2, canvas.width / 2 - canvas.padding + canvas.lineWidth, 0, 2 * Math.PI);
  canvas.context.fill();

  canvas.context.beginPath();
  canvas.context.fillStyle = canvas.backgroundColor;
  canvas.context.arc(canvas.width / 2, canvas.width / 2, canvas.width / 2 - canvas.padding, 0, 2 * Math.PI);
  canvas.context.fill();
}

function drawBoard() {
  // paint over board
  canvas.context.fillStyle = '#ffffff';
  canvas.context.fillRect(0, 0, canvas.width, canvas.width);

  drawDisks();
  drawLines();
}

function drawQuarter(start, end, color) {
  canvas.context.beginPath();
  canvas.context.arc(canvas.width / 2, canvas.width / 2, (canvas.width / 2) - canvas.padding, start, end);
  canvas.context.lineTo(canvas.width / 2, canvas.width / 2);
  canvas.context.closePath();
  canvas.context.fillStyle = color;
  canvas.context.fill();
}

function activateQuarter(coordinates, deactivate) {
  switch (coordinates) {
    case '00':
      drawQuarter(Math.PI, Math.PI * (3/2), deactivate ? canvas.backgroundColor : '#2ecc71');
      break;
    case '10':
      drawQuarter(Math.PI * (3/2), Math.PI * 2, deactivate ? canvas.backgroundColor : '#e74c3c');
      break;
    case '01':
      drawQuarter(Math.PI / 2, Math.PI, deactivate ? canvas.backgroundColor : '#3498db');
      break;
    case '11':
      drawQuarter(0, Math.PI / 2, deactivate ? canvas.backgroundColor : '#f1c40f');
      break;
  }

  drawLines();
}

let inputs = [];
const sequence = []; //['10', '00'];//, '00', '01', '10', '11', '00', '01'];

function addToSequence() {
  const coordinates = ['00', '01', '10', '11'];
  sequence.push(coordinates[Math.floor(Math.random() * coordinates.length)]);
}

function gameOver() {
  canvas.dom.removeEventListener('click', handleClick, false);
  showMessage('Game Over');
  window.setTimeout(() => {
    showMessage('Highscore: ' + parseInt(sequence.length - 1).toString(), false);
    document.querySelector('#restart').style.visibility = 'visible';
  }, 700);
}

function checkClick() {
  console.debug('sequence:', sequence[inputs.length -1], 'input:', inputs[inputs.length -1]);

  if (sequence[inputs.length -1] === inputs[inputs.length -1]) {
    if (sequence.length === inputs.length) {
      showMessage('Good Job!');
      window.setTimeout(() => {
        computersTurn(sequence);
      }, 700)
    }
  } else {
    gameOver();
  }
}

function handleClick(e) {
  const canvasWidth = canvas.dom.offsetWidth;
  const x = e.pageX - canvas.dom.offsetLeft;
  const y = e.pageY - canvas.dom.offsetTop;

  if (x < canvas.width / 2 && y < canvas.width /2) {
    activateQuarter('00');
    window.setTimeout(() => activateQuarter('00', true), 500);
    inputs.push('00');
  } else if (x < canvas.width / 2 && y > canvas.width / 2) {
    activateQuarter('01');
    window.setTimeout(() => activateQuarter('01', true), 500);
    inputs.push('01');
  } else if (x > canvas.width / 2 && y < canvas.width / 2) {
    activateQuarter('10');
    window.setTimeout(() => activateQuarter('10', true), 500);
    inputs.push('10');
  } else if (x > canvas.width / 2 && y > canvas.width / 2) {
    activateQuarter('11');
    window.setTimeout(() => activateQuarter('11', true), 500);
    inputs.push('11');
  }

  checkClick();
}

function showMessage(string, destroy = true) {
  const message = document.createElement("p");
  message.className += "message animated zoomIn";
  const text = document.createTextNode(string);
  message.appendChild(text);
  document.body.insertBefore(message, canvas.dom);
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
  // enable input
  canvas.dom.addEventListener('click', handleClick, false);
}

function computersTurn(coords) {
  addToSequence();
  canvas.dom.removeEventListener('click', handleClick, false);
  showMessage('Watch closely');
  window.setTimeout(() => {
    playSequence(coords, playersTurn);
  }, 900)
}

function restart() {
  if (document.querySelector('.message')) {
    document.body.removeChild(document.querySelector('.message'));
  }
  drawBoard();
  computersTurn(sequence);

  this.textContent = 'Restart';
  this.style.visibility = 'hidden';
}

document.querySelector('#restart').addEventListener('click', restart, false)

window.onload = function() {
  drawBoard();
};

