
var allPlayer = [];
var rankPlayer = [];
var scoreTable = document.getElementById('score-table');
var loginForm = document.getElementById('login');

function Player(name, time){
  this.name = name;
  this.score = time;
  this.ranking = 0;
  allPlayer.push(this);
  console.log(this);
};

// if input using instance of object, rankingOrder work
// if input using eventListener or localStorage, rankingOrder won't work

var sample2 = new Player('AAA', 4);
var sample3 = new Player('BBB', 5);
var sample1 = new Player('Bob', 3);
// var sample4 = new Player('CCC', 6);

function rankingOrder() {
  rankPlayer = [];
  var rank = 1;
  for (var time = 0; time < 61 && rankPlayer.length < allPlayer.length; time++) {
    for (var i = 0; i < allPlayer.length; i ++) {
      if (allPlayer[i].score === time) {
        allPlayer[i].ranking = rank++;
        rankPlayer.push(allPlayer[i]);
      }
    }
  }
  console.log(allPlayer);
  console.log(rankPlayer);
}

function headerRow() {
  //Ranking
  var trElement = document.createElement('tr');
  var rankingCell = document.createElement('th');
  rankingCell.textContent = 'Ranking';
  trElement.appendChild(rankingCell);
  //UserName
  var nameCell = document.createElement('th');
  nameCell.textContent = 'Name';
  trElement.appendChild(nameCell);
  //Score
  var scoreCell = document.createElement('th');
  scoreCell.textContent = 'Score';
  trElement.appendChild(scoreCell);

  scoreTable.appendChild(trElement);
}
// using rankPlayer.length or set a number of top 10-20???
function renderTable() {
  for(var i = 0; i < rankPlayer.length; i++) {
    var trElement = document.createElement('tr');
    var thRanking = document.createElement('th');
    thRanking.textContent = i + 1; //rankPlayer[i].ranking
    trElement.appendChild(thRanking);

    var tdName = document.createElement('td');
    tdName.textContent = rankPlayer[i].name;
    trElement.appendChild(tdName);

    var tdScore = document.createElement('td');
    tdScore.textContent = rankPlayer[i].score;
    trElement.appendChild(tdScore);

    scoreTable.appendChild(trElement);
  }
}

function outputTable() {
  scoreTable.innerHTML = '';
  rankingOrder();
  headerRow();
  renderTable();
}

function handlePlayerLogin(event) {
  console.log(event);
  event.preventDefault(); //prevents page reload
  var hName = event.target.username.value;
  var hScore = event.target.userscore.value;

  var newPlayer = new Player(hName, hScore);
  console.log(newPlayer);
  outputTable();
  localStorage.setItem('allData', JSON.stringify(allPlayer)); //rankPlayer

  event.target.username.value = null;
  event.target.userscore.value = null;
  console.log('You just cleared all the fields!');
}

loginForm.addEventListener('submit', handlePlayerLogin);

(function(){
  if(localStorage.allData) {
    var lsData = JSON.parse(localStorage.getItem('allData'));
    for (var i = 0; i < lsData.length; i++) {
      allPlayer[i] = lsData[i];
    }
    outputTable();
  } else {
    outputTable();
  }
})();
