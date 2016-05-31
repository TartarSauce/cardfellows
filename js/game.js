// handle to DOM elements
var startButtonElement = document.getElementById('startgame');

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
  window.setTimeout(flipCard, 1000);
  startTime = new Date();
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
      alert('CONGRATULATIONS, YOU GIT SUCCESS!');
      gameOver = true;
      reportTime();
    }
  } else {
    element.style.backgroundPosition = gameBoard[index].position;
    element.removeEventListener('click', logClick);
    alert('GAME OVER!');
    for (var i = 0; i < GAMEBOARDAREA; i++) {
      document.getElementById('img' + (i + 1)).style.backgroundPosition = gameBoard[i].position;
    };
    gameOver = true;
    reportTime();
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++
// report time to user
//+++++++++++++++++++++++++++++++++++++++++++++
function reportTime() {
  var endTime = new Date();
  var elapsedTimeMs = (endTime - startTime) / 1000;
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
// event handler for start button
//+++++++++++++++++++++++++++++++++++++++++++++
function startGame() {
  gameOver = false;
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
