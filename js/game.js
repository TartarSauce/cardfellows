
//+++++++++++++++++++++++++++++++++++++++++++++
// all global variables, including handles to DOM elements
//+++++++++++++++++++++++++++++++++++++++++++++
// handle to DOM elements
var startButtonElement = document.getElementById('startgame');
var gameTimerElement = document.getElementById('gametimer');
var logOutButtonElement = document.getElementById('logoutgame');

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
      var card = new Card(positionString);
      if ((card.position === '-150px 0px') || (card.position === '-300px 0px') ||
          (card.position === '-450px 0px') || (card.position === '-600px 0px') ||
          (card.position === '-750px 0px') || (card.position === '0px -150px') ||
          (card.position === '-150px -150px') || (card.position === '-300px -150px')) {
        card.isStaff = true;
      }
    }
  }
  firstCard = deck.shift();   // discard first card, its the back card
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
    gameBoard.push(deck[i]);
    if (deck[i].isStaff) {staffCount++;}
  }

  // remove the html element that reports game over status
  if (document.getElementById('gameoveralert')) {
    var gameAreaEl = document.getElementById('gamearea');
    gameAreaEl.removeChild(document.getElementById('gameoveralert'));
  }

  // show cards for 5 seconds before closing them
  window.setTimeout(flipCard, 5000);
}

//+++++++++++++++++++++++++++++++++++++++++++++
// handle user clicks during game
//+++++++++++++++++++++++++++++++++++++++++++++
function handleClick() {
  console.log(event);
  var index = event.target.alt;
  var element = document.getElementById(event.target.id);
  if (gameBoard[index].isStaff) {
    element.style.backgroundPosition = gameBoard[index].position;
    element.removeEventListener('click', handleClick);
    staffCount--;
    if (staffCount === 0) {
      gameOverAlert('SUCCESS!', 'green');
      for (var i = 0; i < GAMEBOARDAREA; i++) {
        document.getElementById('img' + (i + 1)).removeEventListener('click', handleClick);
      };
      reportTime();
      gameOver = true;
      totalSeconds = 0;
      startButtonElement.innerHTML = 'START GAME';
      startButtonElement.addEventListener('click', startGame);
    }
  } else {
    element.style.backgroundPosition = gameBoard[index].position;
    element.removeEventListener('click', handleClick);
    gameOverAlert('WRONG CARD!', 'red');
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      document.getElementById('img' + (i + 1)).style.backgroundPosition = gameBoard[i].position;
      document.getElementById('img' + (i + 1)).removeEventListener('click', handleClick);
    };
    localStorage.setItem('score', (JSON.stringify(Math.round(-1))));
    gameOver = true;
    totalSeconds = 0;
    startButtonElement.innerHTML = 'START GAME';
    startButtonElement.addEventListener('click', startGame);
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++
// create a new div to report game complete status
// green = success, red = fail
// styling of this div is already in css for #gameoveralert
//+++++++++++++++++++++++++++++++++++++++++++++
function gameOverAlert(string, color) {
  var alertDiv = document.createElement('div');
  alertDiv.id = 'gameoveralert';
  alertDiv.style.color = color;
  var gameAreaEl = document.getElementById('gamearea');
  gameAreaEl.appendChild(alertDiv);
  alertDiv.innerHTML = string;
}

//+++++++++++++++++++++++++++++++++++++++++++++
// update time to local storage ONLY IF game sucessful
//+++++++++++++++++++++++++++++++++++++++++++++
function reportTime() {
  var endTime = new Date();
  var elapsedTimeMs = (endTime - startTime) / 1000;
  localStorage.setItem('score', (JSON.stringify(Math.round(elapsedTimeMs))));
}

//+++++++++++++++++++++++++++++++++++++++++++++
// flip cards after showing them for 5 seconds
//+++++++++++++++++++++++++++++++++++++++++++++
function flipCard() {
  if (allCardsFaceUp) {
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      var el = document.getElementById('img' + (i + 1));
      el.style.backgroundPosition = '0px 0px';
      el.addEventListener('click', handleClick);
    }
    allCardsFaceUp = false;
  } else if (!allCardsFaceUp){
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      var el = document.getElementById('img' + (i + 1));
      el.style.backgroundPosition = gameBoard[i].position;
      el.removeEventListener('click', handleClick);
    };
    allCardsFaceUp = true;
  }

  startTime = new Date();
  showClock();
}

//+++++++++++++++++++++++++++++++++++++++++++++
// function for showing timer on game screen
//+++++++++++++++++++++++++++++++++++++++++++++
function showClock() {
  if (!gameOver) {
    ++totalSeconds;
    m = checkTime(parseInt(totalSeconds / 60));
    s = checkTime(totalSeconds % 60);
    document.getElementById('gametimer').innerHTML = m + ':' + s;
    var t = setTimeout(showClock, 1000);
  }
  else {
    totalSeconds = 0;
    document.getElementById('gametimer').innerHTML = '00:00';
  }

  // reset game if exceeded 3 minutes/180 seconds
  if (totalSeconds > 180) {
    gameTimedOut();
  }
}

// helper function for formatting time
function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  } // add zero in front of numbers < 10
  return i;
}

//+++++++++++++++++++++++++++++++++++++++++++++
// terminate game if exceeding 3 seconds
//+++++++++++++++++++++++++++++++++++++++++++++
function gameTimedOut() {
  gameOverAlert('GAME TIMED OUT', 'red');
  for (var i = 0; i < GAMEBOARDAREA; i++) {
    document.getElementById('img' + (i + 1)).style.backgroundPosition = gameBoard[i].position;
    document.getElementById('img' + (i + 1)).removeEventListener('click', handleClick);
  };
  localStorage.setItem('score', (JSON.stringify(Math.round(-1))));
  gameOver = true;
  totalSeconds = 0;
  startButtonElement.innerHTML = 'START GAME';
  startButtonElement.addEventListener('click', startGame);
}

//+++++++++++++++++++++++++++++++++++++++++++++
// event handler for start button
//+++++++++++++++++++++++++++++++++++++++++++++
function startGame() {
  gameOver = false;
  startButtonElement.innerHTML = 'GOOD LUCK!';
  startButtonElement.removeEventListener('click', startGame);

  if (!gameOver) {
    gameBoard = [];
    shuffleDeck();
    setGameBoard();
  }
  allCardsFaceUp = true;
}

//+++++++++++++++++++++++++++++++++++++++++++++
// event handler for log out button
//+++++++++++++++++++++++++++++++++++++++++++++
function logOutGame() {
  console.log('Logging user out');
  var activeUser = false;
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  window.location.assign('../index.html');
}

//+++++++++++++++++++++++++++++++++++++++++++++
// MAIN CODE EXECUTION
//+++++++++++++++++++++++++++++++++++++++++++++
deck = [];
createDeck();
startButtonElement.addEventListener('click', startGame);
logOutButtonElement.addEventListener('click', logOutGame);
