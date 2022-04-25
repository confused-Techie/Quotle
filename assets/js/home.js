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
  }

  addGuess() {
    this.GuessNumber++;
  }

  get guessNumber() {
    return this.GuessNumber;
  }

  localStorageAvailable() {
    try {
      var x = '__stroage_test__';
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

  setWinnerCookie() {
    var tmpObj = { gameid: answer.gameID, guessesAmount: this.GuessNumber, win: true, board: board };

    if (localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));
    } else {
      console.log('Unable to save data into local storage.');
    }

  }

  setLosingCookie() {
    var tmpObj = { gameid: answer.gameID, guessesAmount: this.GuessNumber, win: false, board: board };

    if (localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));
    } else {
      console.log('Unable to save data into local storage.');
    }

  }

  themeCookie(value) {
    if (localStorageAvailable) {
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

        } else {
          gameMaster.addGuess();
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

        }
      } catch(err) {
        console.log("Well shit you made a bad guess, buddy. This one caused an error. But heres your guess.");
        gameMaster.addGuess();
        document.getElementById(eleID).innerHTML = `<span>${guess}</span>`;
        document.getElementById(eleID).classList.add("guessed");

        board[gameMaster.guessNumber -1] = 5;
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
