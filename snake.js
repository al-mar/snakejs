window.onload = function() {
  var settings = {
    size: [30, 30],
    initialLength: 4,
    moveDelay: 100
  };

  var keyMap = {
    "37": [-1,  0], // left
    "38": [ 0, -1], // up
    "39": [ 1,  0], // right
    "40": [ 0,  1]  // down
  }

  // A game state.
  var body = [], position = [settings.size[0] >> 1, settings.size[1] >> 1];
  var directions = [[1,0]], score = 0, lastDirection;

  // Initialization.
  document.getElementById('gameOverMessage').className = '';

  var gameField = document.getElementById('gameField');
  gameField.innerHTML = "<table>" + Array(settings.size[1] + 1)
    .join("<tr>" + Array(settings.size[0] + 1).join("<td></td>") + "</tr>") + "</table>";

  document.onkeydown = function(ev) {
    var tmp = keyMap[(ev || window.event).keyCode];
    var last = directions.length
        ? directions[directions.length - 1]
        : (lastDirection || [0, 0]);
        
    if (tmp && !(tmp[0] * last[0] + tmp[1] * last[1]))
      directions.push(tmp);
  };

  // The main loop.
  (function move() {
    lastDirection = directions.length ? directions.shift() : lastDirection; // The direction of the previous step.
    body.push(position); // Body grows to the position of the head.
    position = [position[0] + lastDirection[0], position[1] + lastDirection[1]]; // A head position.
    var currentCell = position[0] < 0 || position[1] < 0 || position[0] >= settings.size[0] || position[1] >= settings.size[1]
      ? "wall"
      : getCell(position).className;

    if (currentCell == 'wall' || currentCell == 'body') { // Game over
      document.getElementById('gameOverMessage').className = 'visible';
      document.onkeydown = null;
      window.setTimeout(function() { document.onkeydown = window.onload; }, 300);
      return;
    }

    getCell(body.slice(-1)[0]).className = 'body'; // The body goes to the position of the head.
    getCell(position).className = 'head'; // The head moves to a new position

    if (body.length > settings.initialLength && currentCell != 'food') {
      getCell(body.shift()).className = ''; // Removing the tail if the snake isn't growing.
    } else if (body.length == settings.initialLength || currentCell == 'food') {
      placeFood(); // Food has been eaten or never been shown. Placing a new piece.
      score += currentCell == 'food' ? 1 : 0; // Increasing a player's score if the food was eaten
      document.getElementById('score').innerHTML = "Score: " + score
    }
    window.setTimeout(move, settings.moveDelay);
  })();

  // Gets a game table cell for position 'pos'.
  function getCell(pos) { return gameField.querySelector("table").rows[pos[1]].cells[pos[0]]; }

  // Places a new piece of food in a random empty cell.
  function placeFood() {
    if (!isThereEmptyCell()) return;
    var cell = getCell([~~(Math.random() * settings.size[0]), ~~(Math.random() * settings.size[1])]);
    if (cell.className) placeFood();
    else cell.className = 'food';
  }
  
  // Returns true if there's at least one empty cell on the field.
  function isThereEmptyCell() {
    for (var i = settings.size[0]; i--;)
      for (var j = settings.size[1]; j--;)
        if (!getCell([i, j]).className)
          return true;
  }
}
