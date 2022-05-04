var theme;

// An array representation of the game board.
// 0 = Unplayed Guess.
// 1 = Winning Guess.
// 2 = Director Correct
// 3 = Genre Correct
// 4 = Both Correct
// 5 = nothing correct.
// 0 is guess 1, 5 is guess 6.
var board = [0, 0, 0, 0, 0, 0];

class GameMaster {
  constructor() {
    this.GuessNumber = 1;
    this.GuessesString = [];
  }

  addGuess() {
    this.GuessNumber++;
  }

  equalGuess(num) {
    this.GuessNumber = num;
  }

  addGuessString(guess) {
    this.GuessesString.push(guess);
  }

  get guessNumber() {
    return this.GuessNumber;
  }

  localStorageAvailable() {
    try {
      var x = "__storage_test__";
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except firefox
        (e.code === 22 ||
          // firefox
          e.code === 1012 ||
          // test name field too, because code might not be present
          // everything except firefox
          e.name === "QuotaExceededError" ||
          // firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge quotaexceedederror only if theres something already stored
        localStorage &&
        localStorage.length !== 0
      );
    }
  }

  cleanLastGameCookie() {
    var allCookieKeys = Object.keys(localStorage);

    for (let i = 0; i < allCookieKeys.length; i++) {
      var curKey = allCookieKeys[i];

      if (curKey != `game-${answer.gameID}` && curKey.startsWith("game-")) {
        // as long as it isn't our current game, but is a game key, remove it.
        localStorage.removeItem(curKey);
      }
    }
  }

  findCurrentGameCookie() {
    if (this.localStorageAvailable) {
      var allCookieKeys = Object.keys(localStorage);

      for (let i = 0; i < allCookieKeys.length; i++) {
        var curKey = allCookieKeys[i];

        try {
          if (curKey == `game-${answer.gameID}`) {
            return curKey;
          }
        } catch(err) {
          console.log(`Failed to check if cookie equaled answer. Answer may not be available.`);
          return false;
        }

        if (i == allCookieKeys.length -1) {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  setWinnerCookie() {
    var tmpObj = {
      gameid: answer.gameID,
      guessesAmount: this.GuessNumber,
      guesses: this.GuessesString,
      complete: true,
      win: true,
      board: board,
    };

    if (this.localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));

      this.updateStatsCookie(true, this.GuessNumber - 1);

      this.cleanLastGameCookie();
    } else {
      console.log("Unable to save data into local storage.");
    }
  }

  setLosingCookie() {
    var tmpObj = {
      gameid: answer.gameID,
      guessesAmount: this.GuessNumber,
      guesses: this.GuessesString,
      complete: true,
      win: false,
      board: board,
    };

    if (this.localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));

      this.updateStatsCookie(false, this.GuessNumber - 1);

      this.cleanLastGameCookie();
    } else {
      console.log("Unable to save data into local storage.");
    }
  }

  setProgressCookie() {
    var tmpObj = {
      gameid: answer.gameID,
      guessesAmount: this.GuessNumber,
      complete: false,
      win: false,
      board: board,
    };

    if (this.localStorageAvailable) {
      localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));
    } else {
      console.log("Unable to save data into local storage.");
    }
  }

  updateStatsCookie(gameWon, guessIdx) {
    if (this.localStorageAvailable) {
      if (!localStorage.getItem("stats")) {
        var tmpObj = {
          gamesWon: 0,
          gamesPlayed: 0,
          guessDistro: [0, 0, 0, 0, 0, 0],
        };

        tmpObj.gamesPlayed++;

        if (gameWon) {
          tmpObj.gamesWon++;
        }

        tmpObj.guessDistro[guessIdx]++;

        localStorage.setItem("stats", JSON.stringify(tmpObj));
      } else {
        var prev = localStorage.getItem("stats");
        prev = JSON.parse(prev);

        prev.gamesPlayed++;

        if (gameWon) {
          prev.gamesWon++;
        }

        prev.guessDistro[guessIdx]++;

        localStorage.setItem("stats", JSON.stringify(prev));
      }
    } else {
      console.log("Unable to access local storage.");
    }
  }

  themeCookie(value) {
    if (this.localStorageAvailable) {
      localStorage.setItem("theme", value);
    } else {
      console.log("Unable to save data into local storage");
    }
  }

  get themeCookieValue() {
    if (!localStorage.getItem("theme")) {
      return "";
    } else {
      return localStorage.getItem("theme");
    }
  }
}

var gameMaster = new GameMaster();

window.onload = function () {
  // first we check the colour
  themeCheck();

  firstTimeVisit();

  gameStatusCheck();

  setAudioSrc();
  // call the function in charge of play/pause
  audioController();

  // Here we can setup the initial Button handlers
  document.getElementById("about_btn").addEventListener("click", aboutBtnEvent);
  document.getElementById("stats_btn").addEventListener("click", statsBtnEvent);
  document
    .getElementById("settings_btn")
    .addEventListener("click", settingsBtnEvent);
  document
    .getElementById("user_guess_input")
    .addEventListener("input", mediaSearch);

  document
    .getElementById("user_guess_input")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter" || event.keyCode === 13) {
        checkAnswer(document.getElementById("user_guess_input").value);
      }
    });
  document
    .getElementById("submit_btn")
    .addEventListener("click", checkAnswerViaBtn);

  var fancyConsole = "font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)";
  var semiFancyConsole = "color:purple; text-shadow: -1px 0 black, 1px 0 black, 0 -1px black; font-size: 15px;";
  console.log('%c Quotle!', fancyConsole);
  console.log('%c Hello welcome to the console!', semiFancyConsole);
  console.log('%c Its wonderful to think you are here to help contribute to the project.', semiFancyConsole);
  console.log('%c But if the Interns have taught me anything, I know people come here to cheat for answers.', semiFancyConsole);
  console.log('%c So go ahead if thats the goal. See if you can figure out the simple API to query for the answers.', semiFancyConsole);
  console.log('%c Otherwise please feel free to look around and contribute to the project! https://github.com/confused-Techie/Quotle', semiFancyConsole);
};

function gameStatusCheck() {
  if (gameMaster.localStorageAvailable) {
    var curCookie = gameMaster.findCurrentGameCookie();

    if (curCookie) {
      cookieData = JSON.parse(localStorage.getItem(curCookie));
      if (cookieData.complete) {
        // the game is already over.
        if (cookieData.win) {
          // winner modal needs to appear

          document.getElementById("winner_modal").classList.add("show");

          // we can also launch our confetti.
          var myCanvas = document.createElement("canvas");
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
            origin: { y: 0.5, x: 0.5 },
          });
        } else {
          // loser modal needs to appear.

          document.getElementById("loser_modal_msg").insertAdjacentText("beforeend", UnicornComposite(i18n_answer_text, answer.name));
          document.getElementById("loser_modal").classList.add("show");
        }
      }
      // this could contain all references to rebuild the game board.

    }
    // this will be set as false if for whatever reason the cookie couldn't be found.
  } else {
    console.log('Local Storage not enabled. Unable to check game status.');
  }
}

function themeCheck() {
  if (gameMaster.themeCookieValue == "light") {
    console.log("Light Mode Enabled via Cookies.");
    enableLightTheme();
  } else if (gameMaster.themeCookieValue == "dark") {
    console.log("Dark Mode Enabled via Cookies.");
    enableDarkTheme();
  } else if (gameMaster.themeCookieValue == "") {
    if (window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        console.log("Dark Mode preffered.");
        enableDarkTheme();
      } else if (window.matchMedia("(prefers-color-scheme: light)")) {
        console.log("White Mode preffered.");
        enableLightTheme();
      } else {
        console.log(
          "prefers-color-scheme not supported via Media Query. Are you using IE still?"
        );
        enableDarkTheme();
      }
    } else {
      console.log("Match Media not supported.");
      enableDarkTheme();
    }
  }
}

function enableLightTheme() {
  theme = "light";
  gameMaster.themeCookie("light");

  document.body.classList.remove("dark-theme"); // Remove Dark Theme if present. If not will throw no error.
  document.body.classList.add("light-theme");

  document.getElementById("help-circle-img").src =
    "/images/help-circle-black.svg";
  document.getElementById("award-img").src = "/images/award-black.svg";
  document.getElementById("settings-img").src = "/images/settings-black.svg";

  document.getElementById("footer-golang-img").src =
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-plain.svg";
  document.getElementById("footer-github-img").src = "/images/github-black.svg";
  document.getElementById("footer-feather-icon-img").src =
    "/images/feather-black.svg";
}

function enableDarkTheme() {
  theme = "dark";
  gameMaster.themeCookie("dark");

  document.body.classList.remove("light-theme"); // Remove Light Theme if present. If not will throw no error.
  document.body.classList.add("dark-theme");

  document.getElementById("help-circle-img").src =
    "/images/help-circle-white.svg";
  document.getElementById("award-img").src = "/images/award-white.svg";
  document.getElementById("settings-img").src = "/images/settings-white.svg";

  document.getElementById("footer-golang-img").src =
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg";
  document.getElementById("footer-github-img").src = "/images/github-white.svg";
  document.getElementById("footer-feather-icon-img").src =
    "/images/feather-white.svg";
}

function firstTimeVisit() {
  if (gameMaster.localStorageAvailable) {
    if (!localStorage.getItem("visitor")) {
      // if it doesn't exist, we have never set it, and this is the first time coming here. Otherwise if it does then they have come before.
      localStorage.setItem("visitor", "true");
      console.log('Welcome first time visitor');
      aboutBtnEvent();

    } else {
      console.log("I've seen you here before. Welcome back.");
    }
  } else {
    console.log('Local Storage is not currently accessible. Making it impossible to determine weather this is a first time visit. Or not.');
    console.log('We will error on the side of caution and assume it is.');
    aboutBtnEvent();
  }
}

function aboutBtnEvent() {
  document.getElementById("about_modal").classList.add("show");
}

function statsBtnEvent() {
  if (gameMaster.localStorageAvailable) {
    if (localStorage.getItem("stats")) {
      var stats = JSON.parse(localStorage.getItem("stats"));
      var findPercent = (x, y) => {
        return (x / y) * 100;
      };

      var tmpBar = `
        <div class="chart-wrap">
          <div class="grid">
            <div class="bar" style="--bar-value: ${findPercent(
              stats.guessDistro[0],
              stats.gamesPlayed
            )}%;" data-name="Guess 1" title="Guess 1 ${findPercent(
        stats.guessDistro[0],
        stats.gamesPlayed
      )}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(
              stats.guessDistro[1],
              stats.gamesPlayed
            )}%;" data-name="Guess 2" title="Guess 2 ${findPercent(
        stats.guessDistro[1],
        stats.gamesPlayed
      )}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(
              stats.guessDistro[2],
              stats.gamesPlayed
            )}%;" data-name="Guess 3" title="Guess 3 ${findPercent(
        stats.guessDistro[2],
        stats.gamesPlayed
      )}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(
              stats.guessDistro[3],
              stats.gamesPlayed
            )}%;" data-name="Guess 4" title="Guess 4 ${findPercent(
        stats.guessDistro[3],
        stats.gamesPlayed
      )}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(
              stats.guessDistro[4],
              stats.gamesPlayed
            )}%;" data-name="Guess 5" title="Guess 5 ${findPercent(
        stats.guessDistro[4],
        stats.gamesPlayed
      )}%"> </div>
            <div class="bar" style="--bar-value: ${findPercent(
              stats.guessDistro[5],
              stats.gamesPlayed
            )}%;" data-name="Guess 6" title="Guess 6 ${findPercent(
        stats.guessDistro[5],
        stats.gamesPlayed
      )}%"> </div>
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

function settingsBtnEvent() {
  document.getElementById("settings_modal").classList.add("show");
}

function mediaSearch(e) {
  var search = e.target.value;

  fetch(`/api/search?value=${search}`)
    .then((res) => res.json())
    .then((result) => {
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
    for (let i = 0; i < results.length; i++) {
      var tmpHTML = `<p onclick="enterTextEvent(event);">${results[i]}</p>`;
      searchRes.insertAdjacentHTML("beforeend", tmpHTML);
    }
  } catch (err) {
    console.log(`Error Occured crafting Search Results: ${err}`);
  }
}

/*eslint-disable-next-line no-unused-vars*/
function enterTextEvent(e) {
  document.getElementById("user_guess_input").value = e.target.innerText;

  // Since on mobile, the search results cover the submit button, we want to remove them after the tap here.
  while (document.getElementById("searchResult").firstChild) {
    document
      .getElementById("searchResult")
      .removeChild(document.getElementById("searchResult").lastChild);
  }
}

function setAudioSrc() {
  try {
    document.getElementById("audio-element").src =
      answer.audioSrc[gameMaster.guessNumber - 1];
  } catch(err) {
    console.log(`Failed to set audio src: ${err}`);
  }
}

function audioController() {
  var playIconContainer = document.getElementById("play-icon");
  var playIconImg = document.getElementById("play-icon-img");
  var audioElement = document.getElementById("audio-element");

  let state = "pause";

  // Even when enabling network throttling within Chrome, it seems prioritizing the download of audio view preload="auto" it is fully loaded by the time this script runs.
  // Which means that when the function waits for an event that has already fired the event handler is never hit. So we will add a static check during function run time checking readyState.

  if (audioElement.readyState >= 3) {
    if (theme == "light") {
      playIconImg.src = "/images/play-white.svg";
    } else {
      playIconImg.src = "/images/play-black.svg";
    }
  }

  audioElement.addEventListener("loadeddata", function () {
    console.log(`Audio Element: ${audioElement.readyState}`);
    if (audioElement.readyState >= 3) {
      // 3 = HAVE_FUTURE_DATA; Current data as well as at least two frames.
      if (theme == "light") {
        playIconImg.src = "/images/play-white.svg";
      } else {
        playIconImg.src = "/images/play-black.svg";
      }
    }
  });

  audioElement.addEventListener("ended", function () {
    if (theme == "light") {
      playIconImg.src = "/images/play-white.svg";
    } else {
      playIconImg.src = "/images/play-black.svg";
    }
  });

  playIconContainer.addEventListener("click", () => {
    if (state === "play") {
      if (theme == "light") {
        playIconImg.src = "/images/pause-white.svg";
      } else {
        playIconImg.src = "/images/pause-black.svg";
      }
      audioElement.play();
      state = "pause";
    } else {
      if (theme == "light") {
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
  while (document.getElementById("searchResult").firstChild) {
    document
      .getElementById("searchResult")
      .removeChild(document.getElementById("searchResult").lastChild);
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
  } else {
    console.log("Had trouble displaying the guess results.");
    // or alternatively the game is over and they didn't win. at all.
  }
}

function displayAnswer(guess, eleID) {
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

          board[gameMaster.guessNumber - 1] = 1;
          gameMaster.setWinnerCookie();

          gameMaster.addGuess();
          //setAudioSrc();

          // finally we also want to launch some confetti
          var myCanvas = document.createElement("canvas");
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
            origin: { y: 0.5, x: 0.5 },
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
            board[gameMaster.guessNumber - 1] = 5;
          } else if (amountCorrect == "director") {
            board[gameMaster.guessNumber - 1] = 2;
          } else if (amountCorrect == "genre") {
            board[gameMaster.guessNumber - 1] = 3;
          } else if (amountCorrect == "both") {
            board[gameMaster.guessNumber - 1] = 4;
          }

          gameMaster.addGuess();
          gameMaster.setProgressCookie();

          if (eleID == "guess-six") {
            document.getElementById("guess-six").classList.add("lost");
            document.getElementById("loser_modal_msg").insertAdjacentText("beforeend", UnicornComposite(i18n_answer_text, answer.name));
            document.getElementById("loser_modal").classList.add("show");
            gameMaster.setLosingCookie();
          } else {
            setAudioSrc();
          }
        }
      } catch (err) {
        console.log(
          "Well shit you made a bad guess, buddy. This one caused an error. But heres your guess."
        );

        document.getElementById(eleID).innerHTML = `<span>${guess}</span>`;
        document.getElementById(eleID).classList.add("guessed");

        board[gameMaster.guessNumber - 1] = 5;

        gameMaster.addGuess();
        gameMaster.setProgressCookie();

        if (eleID == "guess-six") {
          document.getElementById("guess-six").classList.add("lost");
          document.getElementById("loser_modal_msg").insertAdjacentText("beforeend", UnicornComposite(i18n_answer_text, answer.name));
          document.getElementById("loser_modal").classList.add("show");
          gameMaster.setLosingCookie();
        } else {
          setAudioSrc();
        }
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

function UnicornComposite() {
  var str = arguments[0];
  if (arguments.length > 1) {
    var t = typeof arguments[1];
    var key;
    var args = "string" === t || "number" === t ? Array.prototype.slice.call(arguments) : arguments[1];

    if (Array.isArray(args)) {
      args.shift();
    }

    for (key in args) {
      str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }
  }
  return str;
}
