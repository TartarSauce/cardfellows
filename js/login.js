
var allPlayer = [];
var rankPlayer = [];
var scoreTable = document.getElementById('score-table');
var loginForm = document.getElementById('login');

function Player(name, time){
  this.name = name;
  this.score = time;
  // this.ranking = 0;
  allPlayer.push(this);
  console.log(this);
};

var sample1 = new Player('Bob', 3);
var sample2 = new Player('AAA', 4);
var sample3 = new Player('BBB', 5);
//compare score and push to rankPlayer
function rankingOrder() {
  rankPlayer = allPlayer.sort(function(a,b) {return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);} );
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
// using rankPlayer.length or set a number of top 10-20??? //rankPlayer.length
function renderTable() {
  for(var i = 0; i < 3 ; i++) {
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
  // scoreTable.innerHTML = '';
  rankingOrder();
  headerRow();
  renderTable();
}

function handlePlayerLogin(event) {
  console.log(event);
  event.preventDefault(); //prevents page reload
  var hName = event.target.username.value;
  var hScore = event.target.userscore.value;//for testing purpose
  var activeUser = true;

  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  localStorage.setItem('name', JSON.stringify(hName));
  localStorage.setItem('score', JSON.stringify(hScore));// for testing purpose
  localStorage.setItem('allData', JSON.stringify(rankPlayer));
  location.assign('game.html');
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
