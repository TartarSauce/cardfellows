
var allPlayer = [];
var rankPlayer = [];
var highScoreTable = document.getElementById('high-scores');

function Player(name, time){
  this.name = name;
  this.score = time;
  // this.ranking = 0;
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
  scoreCell.textContent = 'Score';
  trElement.appendChild(scoreCell);

  highScoreTable.appendChild(trElement);
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

    highScoreTable.appendChild(trElement);
  }
}

function outputTable() {
  // highScoreTable.innerHTML = '';
  rankingOrder();
  headerRow();
  renderTable();
}

(function(){
  if(localStorage.score) {
    var userName = JSON.parse(localStorage.getItem('name'));
    var userScore = JSON.parse(localStorage.getItem('score'));
    var lsData = JSON.parse(localStorage.getItem('allData'));
    for (var i = 0; i < lsData.length; i++) {
      allPlayer[i] = lsData[i];
    }
    console.log('userName = ' + userName + '; userScore = ' + userScore);
    console.log(allPlayer);
    if (userScore === '-1') {
      outputTable();
    } else {
      var newPlayer = new Player(userName, userScore);
      outputTable();
      localStorage.setItem('allData', JSON.stringify(rankPlayer));
    }
  }
})();
