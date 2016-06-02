
var allPlayer = [];
var rankPlayer = [];
var highScoreTable = document.getElementById('high-scores');
var logOutButtonElement = document.getElementById('logoutgame');

function Player(name, time){
  this.name = name;
  this.score = time;
  allPlayer.push(this);
  console.log(this);
};

//compare score and push to rankPlayer
function rankingOrder() {
  rankPlayer = allPlayer.sort(function(a,b) {return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);} );
  console.log('rankPlayer = ' + rankPlayer);
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
  scoreCell.textContent = 'Time(s)';
  trElement.appendChild(scoreCell);

  highScoreTable.appendChild(trElement);
}
// using rankPlayer.length or max of 10
function renderTable() {
  for(var i = 0; i < rankPlayer.length ; i++) {
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
    highScoreTable.appendChild(trElement);
    if (i === 9) {
      break;
    }
  }
}

function logOutGame() {
  console.log('Logging user out');
  var activeUser = false;
  localStorage.setItem('activeUser', JSON.stringify(activeUser));
  location.assign('../index.html');
}

function outputTable() {
  // highScoreTable.innerHTML = '';
  rankingOrder();
  headerRow();
  renderTable();
}

logOutButtonElement.addEventListener('click', logOutGame);

(function(){
  if(localStorage.score) {
    var userName = JSON.parse(localStorage.getItem('name'));
    var newScore = parseInt(JSON.parse(localStorage.getItem('score')));
    var lsData = JSON.parse(localStorage.getItem('allData'));
    var returnUser = false;
    for (var i = 0; i < lsData.length; i++) {
      allPlayer[i] = lsData[i];
      if (userName === allPlayer[i].name){
        var oldScore = allPlayer[i].score;
        returnUser = true;
        if ((newScore > 0) && (newScore < oldScore)){
          allPlayer[i].score = newScore;
        }
        console.log( userName + ', Welcome Back! yours highest score = ' + allPlayer[i].score);
      }
    }
    console.log('userName = ' + userName + '; newScore = ' + newScore);
    console.log(allPlayer);
    if ((newScore === -1) || (returnUser)) {
      outputTable();
    } else {
      var newPlayer = new Player(userName, newScore);
      outputTable();
    }
    localStorage.setItem('allData', JSON.stringify(rankPlayer));
  }
})();
