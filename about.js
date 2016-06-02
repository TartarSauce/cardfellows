var pressStart  = document.getElementById('inner-play');
pressStart.addEventListener('click', checkActiveUser);

function checkActiveUser() {
  var activeUser = JSON.parse(localStorage.getItem('activeUser'));
  if (activeUser){
    window.location.assign('html/game.html');
  } else {
    window.location.assign('html/login.html');
  }
}
