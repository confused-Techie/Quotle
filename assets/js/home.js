var theme;

// An array representation of the game board.
// 0 = Unplayed Guess.
// 1 = Winning Guess.
// 2 = Director Correct
// 3 = Genre Correct
// 4 = Both Correct
// 5 = nothing correct.
// 0 is guess 1, 5 is guess 6.
var board = [ 0, 0, 0, 0, 0, 0 ];

class GameMaster {
  constructor() {
    this.GuessNumber = 1;
    this.GuessesString = [];
  }

  addGuess() {
    this.GuessNumber++;
  }

  addGuessString(guess) {
    this.GuessesString.push(guess);
  }

  get guessNumber() {
    return this.GuessNumber;
  }

  localStorageAvailable() {
    try {
      var x = '__storage_test__';
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } catch(e) {
      return e instanceof DOMException && (
        // everything except firefox
        e.code === 22 ||
        // firefox
        e.code === 1012 ||
        // test name field too, because code might not be present
        // everything except firefox
        e.name === 'QuotaExceededError' ||
        // firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge quotaexceedederror only if theres something already stored
        (localStorage && localStorage.length !== 0);
    }
  }

  cleanLastGameCookie() {
    var allCookieKeys = Object.keys(localStorage);

    for (let i = 0; i < allCookieKeys.length; i++) {
      var curKey = allCookieKeys[i];

      if (curKey != `game-${answer.gameID}` && curKey.startsWith('game-')) {
        // as long as it isn't our current game, but is a game key, remove it.
        localStorage.removeItem(curKey);
      }
    }
  }

  setWinnerCookie() {
    var tmpObj = { gameid: answer.gameID, guessesAmount: this.GuessNumber, guesses: this.GuessesString, complete: true, win: true, board: board };

    if (this.localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));

      this.updateStatsCookie(true, this.GuessNumber-1);

      this.cleanLastGameCookie();
    } else {
      console.log('Unable to save data into local storage.');
    }

  }

  setLosingCookie() {
    var tmpObj = { gameid: answer.gameID, guessesAmount: this.GuessNumber, guesses: this.GuessesString, complete: true, win: false, board: board };

    if (this.localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));

      this.updateStatsCookie(false, this.GuessNumber-1);

      this.cleanLastGameCookie();
    } else {
      console.log('Unable to save data into local storage.');
    }
  }

  setProgressCookie() {
    var tmpObj = { gameid: answer.gameID, guessesAmount: this.GuessNumber, complete: false, win: false, board: board };

    if (this.localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));
    } else {
      console.log("Unable to save data into local storage.");
    }
  }

  updateStatsCookie(gameWon, guessIdx) {
    if (this.localStorageAvailable) {

      if (!localStorage.getItem('stats')) {

        var tmpObj = { gamesWon: 0, gamesPlayed: 0, guessDistro: [0, 0, 0, 0, 0, 0] };

        tmpObj.gamesPlayed++;

        if (gameWon) {
          tmpObj.gamesWon++;
        }

        tmpObj.guessDistro[guessIdx]++;

        localStorage.setItem('stats', JSON.stringify(tmpObj));

      } else {
        var prev = localStorage.getItem('stats');
        prev = JSON.parse(prev);

        prev.gamesPlayed++;

        if (gameWon) {
          prev.gamesWon++;
        }

        prev.guessDistro[guessIdx]++;

        localStorage.setItem('stats', JSON.stringify(prev));

      }
    } else {
      console.log("Unable to access local storage.");
    }
  }

  themeCookie(value) {
    if (this.localStorageAvailable) {
      localStorage.setItem('theme', value);
    } else {
      console.log('Unable to save data into local storage');
    }
  }

  get themeCookieValue() {
    if (!localStorage.getItem('theme')) {
      return "";
    } else {
      return localStorage.getItem('theme');
    }
  }
}

var gameMaster = new GameMaster();


window.onload = function() {
  // first we check the colour
  themeCheck();

  setAudioSrc();
  // call the function in charge of play/pause
  audioController();

  // Here we can setup the initial Button handlers
  document.getElementById("about_btn").addEventListener("click", aboutBtnEvent);
  document.getElementById("stats_btn").addEventListener("click", statsBtnEvent);
  document.getElementById("settings_btn").addEventListener("click", settingsBtnEvent);
  document.getElementById("user_guess_input").addEventListener("input", mediaSearch);

  document.getElementById("user_guess_input").addEventListener("keyup", function(event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      checkAnswer(document.getElementById("user_guess_input").value);
    }
  });
  document.getElementById("submit_btn").addEventListener("click", checkAnswerViaBtn);
}

function themeCheck() {
  if (gameMaster.themeCookieValue == "light") {
    console.log('Light Mode Enabled via Cookies.');
    enableLightTheme();

  } else if (gameMaster.themeCookieValue == "dark") {
    console.log('Dark Mode Enabled via Cookies.');
    enableDarkTheme();

  } else if (gameMaster.themeCookieValue == "") {

    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Dark Mode preffered.');
        enableDarkTheme();

      } else if (window.matchMedia('(prefers-color-scheme: light)')) {
        console.log('White Mode preffered.');
        enableLightTheme();

      } else {
        console.log('prefers-color-scheme not supported via Media Query. Are you using IE still?');
        enableDarkTheme();
      }
    } else {
      console.log('Match Media not supported.');
      enableDarkTheme();
    }

  }
}

function enableLightTheme() {
  theme = 'light';
  gameMaster.themeCookie('light');

  document.body.classList.remove('dark-theme'); // Remove Dark Theme if present. If not will throw no error.
  document.body.classList.add('light-theme');

  document.body.getElementById("help-cirle-img").src = "/images/help-circle-black.svg";
  document.getElementById("award-img").src = "/images/award-black.svg";
  document.getElementById("settings-img").src = "/images/settings-black.svg";

  document.getElementById("footer-golang-img").src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-plain.svg";
  document.getElementById("footer-github-img").src = "/images/github-black.svg";
  document.getElementById("footer-feather-icon-img").src = "/images/feather-black.svg";
}

function enableDarkTheme() {
  theme = 'dark';
  gameMaster.themeCookie('dark');

  document.body.classList.remove('light-theme');  // Remove Light Theme if present. If not will throw no error.
  document.body.classList.add('dark-theme');

  document.getElementById("help-circle-img").src = "/images/help-circle-white.svg";
  document.getElementById("award-img").src = "/images/award-white.svg";
  document.getElementById("settings-img").src = "/images/settings-white.svg";

  document.getElementById("footer-golang-img").src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg";
  document.getElementById("footer-github-img").src = "/images/github-white.svg";
  document.getElementById("footer-feather-icon-img").src = "/images/feather-white.svg";
}

function aboutBtnEvent(event) {
  document.getElementById("about_modal").classList.add("show");
}

function statsBtnEvent(event) {
  if (gameMaster.localStorageAvailable) {
    if (localStorage.getItem('stats')) {
      var stats = JSON.parse(localStorage.getItem('stats'));
      var findPercent = (x, y) => {
        return (x / y) * 100;
      };

      var tmpBar = `
        <div class="chart-wrap">
          <div class="grid">
            <div class="bar" style="--bar-value: ${findPercent(stats.guessDistro[0], stats.gamesPlayed)}%;" data-name="Guess 1" title="Guess 1 ${findPercent(stats.guessDistro[0], stats.gamesPlayed)}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(stats.guessDistro[1], stats.gamesPlayed)}%;" data-name="Guess 2" title="Guess 2 ${findPercent(stats.guessDistro[1], stats.gamesPlayed)}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(stats.guessDistro[2], stats.gamesPlayed)}%;" data-name="Guess 3" title="Guess 3 ${findPercent(stats.guessDistro[2], stats.gamesPlayed)}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(stats.guessDistro[3], stats.gamesPlayed)}%;" data-name="Guess 4" title="Guess 4 ${findPercent(stats.guessDistro[3], stats.gamesPlayed)}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(stats.guessDistro[4], stats.gamesPlayed)}%;" data-name="Guess 5" title="Guess 5 ${findPercent(stats.guessDistro[4], stats.gamesPlayed)}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(stats.guessDistro[5], stats.gamesPlayed)}%;" data-name="Guess 6" title="Guess 6 ${findPercent(stats.guessDistro[5], stats.gamesPlayed)}%"> </div>
          </div>
        </div>
        `;
      var tmpString = `<p>You've played ${stats.gamesPlayed} times.</p><p>You've won ${stats.gamesWon} times.</p>${tmpBar}`;
      document.getElementById("stats_modal_msg").innerHTML = tmpString;
    } else {
      // no stats saved
      var tmpString = `<p>You've played 0 times.</p><p>You've won 0 times.</p>`;
      document.getElementById("stats_modal_msg").innerHTML = tmpString;
    }
  } else {
    var tmpString = `<p>Without Cookies enabled this can't be shown 🙁</p>`;
    document.getElementById("stats_modal_msg").innerHTML = tmpString;
  }
  document.getElementById("stats_modal").classList.add("show");
}

function settingsBtnEvent(event) {
  document.getElementById("settings_modal").classList.add("show");
}

function mediaSearch(e) {
  var search = e.target.value;

  fetch(`/api/search?value=${search}`)
    .then((res) =>  res.json())
    .then((result) => {
      console.log(`Search Returned:`);
      console.log(result);
      searchResults(result);
    });

}

function searchResults(results) {
  try {

    var searchRes = document.getElementById("searchResult");

    // first we want to remove all previous search results.
    while (searchRes.firstChild) {
      searchRes.removeChild(searchRes.lastChild);
    }

    // then craft the result to return
    for (let i = 0; i < results.Results.length; i++) {
      var tmpHTML = `<p onclick="enterText('${results.Results[i].Name}');">${results.Results[i].Name}</p>`;
      searchRes.insertAdjacentHTML("beforeend", tmpHTML);
    }

  } catch(err) {
    console.log(`Error Occured crafting Search Results: ${err}`);
  }
}

function enterText(text) {
  document.getElementById("user_guess_input").value = text;
}


function setAudioSrc() {
  document.getElementById("audio-element").src = answer.audioSrc[gameMaster.guessNumber -1];
}

function audioController() {
  var playIconContainer = document.getElementById("play-icon");
  var playIconImg = document.getElementById("play-icon-img");
  var audioElement = document.getElementById("audio-element");

  let state = "pause";

  // Even when enabling network throttling within Chrome, it seems prioritizing the download of audio view preload="auto" it is fully loaded by the time this script runs.
  // Which means that when the function waits for an event that has already fired the event handler is never hit. So we will add a static check during function run time checking readyState.

  if (audioElement.readyState >= 3) {
    if (theme == 'light') {
      playIconImg.src = "/images/play-white.svg";
    } else {
      playIconImg.src = "/images/play-black.svg";
    }
  }

  audioElement.addEventListener('loadeddata', function() {
    console.log(`Audio Element: ${audioElement.readyState}`);
    if (audioElement.readyState >= 3) {
      // 3 = HAVE_FUTURE_DATA; Current data as well as at least two frames.
      if (theme == 'light') {
        playIconImg.src = "/images/play-white.svg";
      } else {
        playIconImg.src = "/images/play-black.svg";
      }
    }
  });

  playIconContainer.addEventListener("click", () => {
    if (state === "play") {
      if (theme == 'light') {
        playIconImg.src = "/images/pause-white.svg";
      } else {
        playIconImg.src = "/images/pause-black.svg";
      }
      audioElement.play();
      state = "pause";
    } else {
      if (theme == 'light') {
        playIconImg.src = "/images/play-white.svg";
      } else {
        playIconImg.src = "/images/play-black.svg";
      }
      audioElement.pause();
      state = "play";
    }
  });
}

function checkAnswerViaBtn() {
  checkAnswer(document.getElementById("user_guess_input").value);
}

function checkAnswer(guess) {
  gameMaster.addGuessString(guess);
  // we also want to clear the guess field.
  document.getElementById("user_guess_input").value = "";
  // and we want to clear the search results
  while(document.getElementById("searchResult").firstChild) {
    document.getElementById("searchResult").removeChild(document.getElementById("searchResult").lastChild);
  }

  if (gameMaster.guessNumber === 1) {
    displayAnswer(guess, "guess-one");
  } else if (gameMaster.guessNumber === 2) {
    displayAnswer(guess, "guess-two");
  } else if (gameMaster.guessNumber === 3) {
    displayAnswer(guess, "guess-three");
  } else if (gameMaster.guessNumber === 4) {
    displayAnswer(guess, "guess-four");
  } else if (gameMaster.guessNumber === 5) {
    displayAnswer(guess, "guess-five");
  } else if (gameMaster.guessNumber === 6) {
    displayAnswer(guess, "guess-six");
    document.getElementById("guess-six").classList.add("lost");
    document.getElementById("loser_modal").classList.add("show");
    gameMaster.setLosingCookie();
  } else {
    console.log("Had trouble displaying the guess results.");
    // or alternatively the game is over and they didn't win. at all.
  }
}

function displayAnswer(guess, eleID ) {

  fetch(`/api/movie_match?value=${guess}`)
    .then((res) => res.json())
    .then((result) => {
      try {
        if (guess == answer.name) {
          // its correct!
          document.getElementById(eleID).innerHTML = `<span>${guess}</span>`;
          document.getElementById(eleID).classList.add("guessed");
          document.getElementById(eleID).classList.add("correct");

          document.getElementById("winner_modal").classList.add("show");

          board[gameMaster.guessNumber -1] = 1;
          gameMaster.setWinnerCookie();

          gameMaster.addGuess();
          setAudioSrc();

          // finally we also want to launch some confetti
          var myCanvas = document.createElement('canvas');
          myCanvas.width = window.innerWidth;
          myCanvas.height = window.innerHeight;
          document.body.appendChild(myCanvas);

          var myConfetti = confetti.create(myCanvas, {
            useWorker: true,
            resize: true,
          });

          myConfetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.5, x: 0.5 }
          });

        } else {
          // its incorrect, lets see if they got any parts right.
          document.getElementById(eleID).innerHTML = `<span>${guess}</span>`;
          document.getElementById(eleID).classList.add("guessed");

          var correctGenre = checkGenre(result.Genre, answer.genre);
          var amountCorrect = "none";

          if (result.Director == answer.director && !correctGenre) {
            document.getElementById(eleID).classList.add("director");
            amountCorrect = "director";
          }

          if (correctGenre && result.Director != answer.director) {
            document.getElementById(eleID).classList.add("genre");
            amountCorrect = "genre";
          }

          if (correctGenre && result.Director == answer.director) {
            document.getElementById(eleID).classList.add("both");
            amountCorrect = "both";
          }

          if (amountCorrect == "none") {
            board[gameMaster.guessNumber -1] = 5;
          } else if (amountCorrect == "director") {
            board[gameMaster.guessNumber -1] = 2;
          } else if (amountCorrect == "genre") {
            board[gameMaster.guessNumber -1] = 3;
          } else if (amountCorrect == "both") {
            board[gameMaster.guessNumber -1] = 4;
          }

          gameMaster.addGuess();
          gameMaster.setProgressCookie();
          setAudioSrc();
        }
      } catch(err) {
        console.log("Well shit you made a bad guess, buddy. This one caused an error. But heres your guess.");

        document.getElementById(eleID).innerHTML = `<span>${guess}</span>`;
        document.getElementById(eleID).classList.add("guessed");

        board[gameMaster.guessNumber -1] = 5;

        gameMaster.addGuess();
        gameMaster.setProgressCookie();
        setAudioSrc();
      }
    });
}

function checkGenre(guess, correct) {
  for (let i = 0; i < guess.length; i++) {
    if (correct.includes(guess[i])) {
      return true;
    }
  }
  return false;
}
