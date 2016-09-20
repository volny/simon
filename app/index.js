import './style.scss';

const canvas = {
  dom: document.querySelector('#gameboard'),
  context: document.querySelector('#gameboard').getContext('2d'),
  width: 500,
  padding: 30,
  lineWidth: 15,
  backgroundColor: '#ecf0f1',
  lineColor: '#d7dde1',
  drawLines,
  drawDisks,
  drawBoard,
  drawQuarter,
  activateQuarter,
};

const game = {
  inputs: [],
  sequence: [],
  addToSequence,
  gameOver,
  checkClick,
  handleClick,
  showMessage,
  playSequence,
  playersTurn,
  computersTurn,
  restart
};

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

  canvas.drawDisks();
  canvas.drawLines();
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
      canvas.drawQuarter(Math.PI, Math.PI * (3/2), deactivate ? canvas.backgroundColor : '#2ecc71');
      break;
    case '10':
      canvas.drawQuarter(Math.PI * (3/2), Math.PI * 2, deactivate ? canvas.backgroundColor : '#e74c3c');
      break;
    case '01':
      canvas.drawQuarter(Math.PI / 2, Math.PI, deactivate ? canvas.backgroundColor : '#3498db');
      break;
    case '11':
      canvas.drawQuarter(0, Math.PI / 2, deactivate ? canvas.backgroundColor : '#f1c40f');
      break;
  }

  canvas.drawLines();
}

function addToSequence() {
  const coordinates = ['00', '01', '10', '11'];
  game.sequence.push(coordinates[Math.floor(Math.random() * coordinates.length)]);
}

function gameOver() {
  canvas.dom.removeEventListener('click', game.handleClick, false);
  game.showMessage('Game Over');
  window.setTimeout(() => {
    game.showMessage('Highscore: ' + parseInt(game.sequence.length - 1).toString(), false);
    document.querySelector('#restart').style.visibility = 'visible';
  }, 700);
}

function checkClick() {
  if (game.sequence[game.inputs.length -1] === game.inputs[game.inputs.length -1]) {
    if (game.sequence.length === game.inputs.length) {
      game.showMessage('Good Job!');
      window.setTimeout(() => {
        game.computersTurn(game.sequence);
      }, 700)
    }
  } else {
    game.gameOver();
  }
}

function handleClick(e) {
  const canvasWidth = canvas.dom.offsetWidth;
  const x = e.pageX - canvas.dom.offsetLeft;
  const y = e.pageY - canvas.dom.offsetTop;

  if (x < canvasWidth / 2 && y < canvasWidth / 2) {
    canvas.activateQuarter('00');
    window.setTimeout(() => canvas.activateQuarter('00', true), 500);
    game.inputs.push('00');
  } else if (x < canvasWidth / 2 && y > canvasWidth / 2) {
    canvas.activateQuarter('01');
    window.setTimeout(() => canvas.activateQuarter('01', true), 500);
    game.inputs.push('01');
  } else if (x > canvasWidth / 2 && y < canvasWidth / 2) {
    canvas.activateQuarter('10');
    window.setTimeout(() => canvas.activateQuarter('10', true), 500);
    game.inputs.push('10');
  } else if (x > canvasWidth / 2 && y > canvasWidth / 2) {
    canvas.activateQuarter('11');
    window.setTimeout(() => canvas.activateQuarter('11', true), 500);
    game.inputs.push('11');
  }

  game.checkClick();
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
    canvas.activateQuarter(coords[0]);
    window.setTimeout(() => {
      canvas.activateQuarter(coords[0], true);
      game.playSequence(coords.slice(1, coords.length), callback);
    }, 800) // light-up duration
  }, 300) // break between light-up
}

function playersTurn() {
  game.showMessage('Your turn');
  game.inputs = [];
  canvas.dom.addEventListener('click', game.handleClick, false);
}

function computersTurn(coords) {
  game.addToSequence();
  canvas.dom.removeEventListener('click', game.handleClick, false);
  game.showMessage('Watch closely');
  window.setTimeout(() => {
    game.playSequence(coords, game.playersTurn);
  }, 900)
}

function restart() {
  if (document.querySelector('.message')) {
    document.body.removeChild(document.querySelector('.message'));
  }
  canvas.drawBoard();
  game.sequence = [];
  game.computersTurn(game.sequence);

  this.textContent = 'Restart';
  this.style.visibility = 'hidden';
}


window.onload = function() {
  canvas.drawBoard();
  document.querySelector('#restart').addEventListener('click', game.restart, false)
};

