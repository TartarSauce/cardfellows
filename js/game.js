
// handle to DOM elements
var startButtonElement = document.getElementById('startgame');
var gameTimerElement = document.getElementById('gametimer');

// all constants at global scope
var CARDHEIGHT = 150;
var CARDWIDTH = 150;
var ROWS = 5;
var COLS = 6;
var TOTALCARDS = (ROWS * COLS) - 1;
var GAMEBOARDAREA = 18;  // 16 squares, or 4x4 grid

// all variables at global scope
var deck = [];
var gameBoard = [];
var allCardsFaceUp = true;
var firstCard;
var gameOver = false;
var staffCount = 0;
var startTime = 0;
var gameStarted = true;
var totalSeconds = 0;

//+++++++++++++++++++++++++++++++++++++++++++++
// Class definition for game card
//+++++++++++++++++++++++++++++++++++++++++++++
function Card(position) {
  this.position = position;
  this.isFaceUp = true;
  this.isStaff = false;
  deck.push(this);
};

//+++++++++++++++++++++++++++++++++++++++++++++
// Create a deck from card objects
//+++++++++++++++++++++++++++++++++++++++++++++
function createDeck() {
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      var yPos = y * -CARDHEIGHT;
      var xPos = x * -CARDWIDTH;
      var positionString = xPos + 'px ' + yPos + 'px';
      //coordinateArray.push(positionString);
      var card = new Card(positionString);
      if ((card.position === '-150px 0px') || (card.position === '-300px 0px') ||
          (card.position === '-450px 0px') || (card.position === '-600px 0px') ||
          (card.position === '-750px 0px') || (card.position === '0px -150px') ||
          (card.position === '-150px -150px') || (card.position === '-300px -150px')) {
        card.isStaff = true;
      }
    }
  }
  firstCard = deck.shift();   // discard first card
  // console.log(firstCard);
  // console.log(deck.length);
}

//+++++++++++++++++++++++++++++++++++++++++++++
// shuffle deck
//+++++++++++++++++++++++++++++++++++++++++++++
function shuffleDeck() {
  for (var i = deck.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var tempLocation = deck[i];
    deck[i] = deck[randomIndex];
    deck[randomIndex] = tempLocation;
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++
// set up game board
//+++++++++++++++++++++++++++++++++++++++++++++
function setGameBoard() {
  staffCount = 0;
  for (var i = 0; i < GAMEBOARDAREA; i++) {
    var el = document.getElementById('img' + (i + 1));
    el.style.backgroundPosition = deck[i].position;
    el.alt = i;
    el.addEventListener('click', logClick);
    gameBoard.push(deck[i]);
    if (deck[i].isStaff) {staffCount++;}
  }

  if (document.getElementById('gameoveralert')) {
    var gameAreaEl = document.getElementById('gamearea');
    gameAreaEl.removeChild(document.getElementById('gameoveralert'));
  }
  // get name from LocalStorage
  window.setTimeout(flipCard, 2000);
  startTime = new Date();
  showClock();
}

//+++++++++++++++++++++++++++++++++++++++++++++
// event handler for reading user clicks during game
//+++++++++++++++++++++++++++++++++++++++++++++
function logClick() {
  console.log(event);
  var index = event.target.alt;
  var element = document.getElementById(event.target.id);
  if (gameBoard[index].isStaff) {
    element.style.backgroundPosition = gameBoard[index].position;
    element.removeEventListener('click', logClick);
    staffCount--;
    if (staffCount === 0) {
      gameOver = true;
      gameOverAlert();
      reportTime();
      totalSeconds = 0;
      // write score to localstorage
    }
  } else {
    element.style.backgroundPosition = gameBoard[index].position;
    element.removeEventListener('click', logClick);
    gameOverAlert();
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      document.getElementById('img' + (i + 1)).style.backgroundPosition = gameBoard[i].position;
    };
    localStorage.setItem('score', (JSON.stringify(Math.round(-1))));
    gameOver = true;
    totalSeconds = 0;
  }
}

function gameOverAlert() {
  var alertDiv = document.createElement('div');
  alertDiv.id = 'gameoveralert';
  alertDiv.style.display = 'inline-block';
  alertDiv.style.padding = '10px';
  alertDiv.style.backgroundColor = 'white';
  alertDiv.style.fontFamily = 'Press Start 2P';
  alertDiv.style.fontSize = '16px';
  alertDiv.style.backgroundColor = 'white';
  alertDiv.style.color = 'red';
  console.log(alertDiv);
  var gameAreaEl = document.getElementById('gamearea');
  gameAreaEl.appendChild(alertDiv);
  alertDiv.innerHTML = 'GAME OVER';
}

//+++++++++++++++++++++++++++++++++++++++++++++
// report time to user
//+++++++++++++++++++++++++++++++++++++++++++++
function reportTime() {
  var endTime = new Date();
  var elapsedTimeMs = (endTime - startTime) / 1000;
  localStorage.setItem('score', (JSON.stringify(Math.round(elapsedTimeMs))));
  alert('You took ' + Math.round(elapsedTimeMs) + ' seconds.');
}

//+++++++++++++++++++++++++++++++++++++++++++++
// flip cards after showing them for a brief instant
//+++++++++++++++++++++++++++++++++++++++++++++
function flipCard() {
  if (allCardsFaceUp) {
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      document.getElementById('img' + (i + 1)).style.backgroundPosition = '0px 0px';
    }
    allCardsFaceUp = false;
  } else if (!allCardsFaceUp){
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      document.getElementById('img' + (i + 1)).style.backgroundPosition = gameBoard[i].position;
    };
    allCardsFaceUp = true;
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++
// function for showing timer on game screen
//+++++++++++++++++++++++++++++++++++++++++++++
function showClock() {
  if (!gameOver) {
    ++totalSeconds;
    m = checkTime(parseInt(totalSeconds / 60));
    s = checkTime(totalSeconds % 60);
    document.getElementById('gametimer').innerHTML =
    m + ':' + s;
    var t = setTimeout(showClock, 1000);
  }
  else {
    totalSeconds = 0;
    document.getElementById('gametimer').innerHTML = '00:00';
  }
}

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  } // add zero in front of numbers < 10
  return i;
}

//+++++++++++++++++++++++++++++++++++++++++++++
// event handler for start button
//+++++++++++++++++++++++++++++++++++++++++++++
function startGame() {
  gameOver = false;
  gameStarted = true;

  if (!gameOver) {
    gameBoard = [];
    shuffleDeck();
    setGameBoard();
  }
  allCardsFaceUp = true;
}

//+++++++++++++++++++++++++++++++++++++++++++++
// MAIN CODE EXECUTION
//+++++++++++++++++++++++++++++++++++++++++++++
deck = [];
createDeck();
startButtonElement.addEventListener('click', startGame);
