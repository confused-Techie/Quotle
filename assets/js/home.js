var theme,
  replay = false,
  currentGuessNumber = 1,
  guessesStrings = [],
  totalGameCount = 10,
  game_debug = false,
  debug_spoiler = false,
  log_collection = [];

/* theme = text based value for the pages current theme applied.
 * replay = Value determining weather or not this is a replay of a previous game. Preventing data from being saved if so.
 * currentGuessNumber = int to count up as the game guesses go on.
 * guessesStrings = Array of strings of all previous guesses made on this game.
 * totalGameCount = An int value for every single game created.
 * game_debug = boolean to say weather or not generic logging is enabled.
 * debug_spoiler = boolean to say weatherr or not spoiler free logging is enabled.
 * log_collection = array of function calls, keeping the log history during gameplay for troubleshooting.
 */

// An array representation of the game board.
// 0 = Unplayed Guess.
// 1 = Winning Guess.
// 2 = Director Correct
// 3 = Genre Correct
// 4 = Both Correct
// 5 = nothing correct.
// 0 is guess 1, 5 is guess 6.
var board = [0, 0, 0, 0, 0, 0];

/**
 * Namespace to access features specific to the DOM of the page.
 * @namespace
 */
var DOM_MANAGER = {
  /**
   * @desc Make the winner modal visible on the page, as well as disables the input methods for guesses. Additionally creating
   * confetti on the page.
   */
  WinnerModal: function () {
    document.getElementById("winner_modal").classList.add("show");
    document.getElementById("user_guess_input").disabled = true;
    document.getElementById("submit_btn").disabled = true;

    var myCanvas = document.createElement("canvas");
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;
    document.body.appendChild(myCanvas);

    var myConfetti = confetti.create(myCanvas, {
      userWorker: true,
      resize: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5, x: 0.5 },
    });
  },
  /**
   * @desc Allows the loser modal to viewable on the page. Additionally disabling input methods, and injecting the correct answer
   * into the loser modal text box.
   */
  LoserModal: function () {
    document
      .getElementById("loser_modal_msg")
      .insertAdjacentText(
        "beforeend",
        UTILS_COLLECTION.UnicornComposite(i18n_answer_text, answer.name)
      );
    document.getElementById("loser_modal").classList.add("show");
    document.getElementById("user_guess_input").disabled = true;
    document.getElementById("submit_btn").disabled = true;
  },
  /**
   * @desc Updates the text on the page of the amount of guesses left.
   */
  UpdateGuessesLeft: function () {
    // Because guesses are counted by which guess you are currently using, we have to increase the number to 7, to account for it.
    document.getElementById("guesses_left").innerText =
      7 - currentGuessNumber === 1
        ? UTILS_COLLECTION.UnicornComposite(
            i18n_guesses_left_one,
            7 - currentGuessNumber
          )
        : UTILS_COLLECTION.UnicornComposite(
            i18n_guesses_left_many,
            7 - currentGuessNumber
          );
  },
  /**
   * @desc Initializes all global event listeners and defines the functions they call.
   */
  GlobalEventListeners: function () {
    document
      .getElementById("about_btn")
      .addEventListener("click", BTN_COLLECTION.AboutBtn);
    document
      .getElementById("stats_btn")
      .addEventListener("click", BTN_COLLECTION.StatsBtn);
    document
      .getElementById("settings_btn")
      .addEventListener("click", BTN_COLLECTION.SettingsBtn);
    document
      .getElementById("user_guess_input")
      .addEventListener("click", BTN_COLLECTION.MediaSearchBtn);
    document
      .getElementById("user_guess_input")
      .addEventListener("input", BTN_COLLECTION.MediaSearchBtn);
    document
      .getElementById("submit_btn")
      .addEventListener("click", BTN_COLLECTION.CheckAnswerViaBtn);
    document
      .getElementById("shuffle_btn")
      .addEventListener("click", GAME_CONTROLLER.RandomPlay);
    document
      .getElementById("user_guess_input")
      .addEventListener("keyup", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
          GAME_CONTROLLER.PassAnswer(
            document.getElementById("user_guess_input").value
          );
        }
      });
  },
  /**
   * @desc Enables the theme requested. By adding the class to the body and changing images.
   * @param {string} requested_theme The theme wanted. 'dark' or 'light'
   */
  EnableTheme: function (requested_theme) {
    if (requested_theme == "dark") {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
    } else if (requested_theme == "light") {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
    }

    var themeImg = {
      dark: {
        src: [
          "/images/help-circle-white.svg",
          "/images/award-white.svg",
          "/images/settings-white.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
          "/images/github-white.svg",
          "/images/feather-white.svg",
          "/images/shuffle-white.svg",
        ],
        id: [
          "help-circle-img",
          "award-img",
          "settings-img",
          "footer-golang-img",
          "footer-github-img",
          "footer-feather-icon-img",
          "shuffle-img",
        ],
      },
      light: {
        src: [
          "/images/help-circle-black.svg",
          "/images/award-black.svg",
          "/images/settings-black.svg",
          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-plain.svg",
          "/images/github-black.svg",
          "/images/feather-black.svg",
          "/images/shuffle-black.svg",
        ],
        id: [
          "help-circle-img",
          "award-img",
          "settings-img",
          "footer-golang-img",
          "footer-github-img",
          "footer-feather-icon-img",
          "shuffle-img",
        ],
      },
    };
    for (var i = 0; i < themeImg[requested_theme].src.length; i++) {
      document.getElementById(themeImg[requested_theme].id[i]).src =
        themeImg[requested_theme].src[i];
    }
  },
  /**
   * @desc Checks if a theme is enabled via cookies or using media queries. Prioritizing media queries.
   */
  ThemeCheck: function () {
    var turnOnLight = () => {
      theme = "light";
      STORAGE_HANDLER.SetItem("theme", "light");
      this.EnableTheme("light");
    };

    var turnOffLight = () => {
      theme = "dark";
      STORAGE_HANDLER.SetItem("theme", "dark");
      this.EnableTheme("dark");
    };

    var availableTheme = STORAGE_HANDLER.GetTheme();
    if (availableTheme == "light") {
      LOG.Info("Light Mode Enabled via Cookies", "dom");
      turnOnLight();
    } else if (availableTheme == "dark") {
      LOG.Info("Dark Mode Enabled via Cookies", "dom");
      turnOffLight();
    } else if (availableTheme == "") {
      if (window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          LOG.Info("Dark Theme Preffered...", "dom");
          turnOffLight();
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          LOG.Info("White Theme Preffered...", "dom");
          turnOnLight();
        } else {
          LOG.Warn(
            "prefers-color-scheme not supported via Media Query. Are you still using IE?",
            "dom"
          );
          turnOffLight();
        }
      } else {
        LOG.Warn("Match Media not supported. Defaulting to Dark Theme", "dom");
        turnOffLight();
      }
    }
  },
  /**
   * @desc Clears the search results that are appearing on the page.
   */
  ClearSearchResults: function () {
    while (document.getElementById("searchResult").firstChild) {
      document
        .getElementById("searchResult")
        .removeChild(document.getElementById("searchResult").lastChild);
    }
  },
  /**
   * @desc Displays a guess on the page, attaching any requested classes to the element.
   * @param {string} eleID is the Element ID of which guess to modify.
   * @param {string} guessText is the raw text of the users guess.
   * @param {string[]} classArray Array of which classes to include made up of strings.
   */
  DisplayGuessAnswer: function (eleID, guessText, classArray) {
    document.getElementById(eleID).innerHTML = `<span>${guessText}</span>`;
    if (Array.isArray(classArray)) {
      for (let i = 0; i < classArray.length; i++) {
        document.getElementById(eleID).classList.add(classArray[i]);
      }
    }
  },
  /**
   * @desc Creates a snackbar alert with text specified.
   * @param {string} msg Is the text to show.
   */
  Snackbar: function (msg) {
    var snackbarEle = document.getElementById("snackbar");

    var snackbarMsg = snackbarEle.getElementsByClassName("msg")[0];

    snackbarMsg.innerText = msg;
    snackbarEle.classList.add("show");

    snackbarEle.addEventListener("animationend", function (event) {
      // since the snackbar uses snack-fadein and snack-fadeout
      // we know we only want to exit when fadein finishes
      if (event.animationName == "snack-fadeout") {
        snackbarEle.classList.remove("show");
      }
    });
  },
  /**
   * @desc Inserts the rating from the answer onto the page.
   */
  InsertRating: function () {
    try {
      if (answer.rating) {
        document.getElementById("movie_rating_text").innerText = answer.rating;
        document.getElementById("movie_rating").classList.add("show");
      } else {
        LOG.Warn("Seems this movie does not support the rating feature", "dom");
      }
    } catch (err) {
      LOG.Error(`Unable to Insert Movie Rating: ${err}`, "dom");
    }
  },
};

/**
 * Namespace to access features that dont fit anywhere else.
 * @namespace
 */
var UTILS_COLLECTION = {
  /**
   * @desc UnicornComposite is a carry-over function created in GoPage.
   * It is used to mimic C# Composite formatting.
   * @see {@link https://github.com/confused-Techie/GoPage/blob/main/docs/devDocs/JavaScript.md#LangHandlerJS|GoPage}
   * @summary Implementation of Composite Formatting from C#, originating from confused-Techie/GoPage
   * @param {string} arg0 The String to preform the method on.
   * @param {string} argN All other arguments afterwards can be keys, with as many as needed to fill the string.
   * Not enough or to many causing zero errors.
   * @returns {string} Composited String.
   * @example
   * UTILS_COLLECTION.UnicornComposite("How is this for a {0}, I hope it {1}", "Test", "Works");
   * // Outputs: "How is this for a Test, I hope it Works."
   */
  UnicornComposite: function () {
    var str = arguments[0];
    if (arguments.length > 1) {
      var t = typeof arguments[1];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[1];
      if (Array.isArray(args)) {
        args.shift();
      }
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  },
  /**
   * @desc Triggers all functions related to startup and initialization of the game.
   * @implements {GAME_CONTROLLER.AnswerCheck}
   * @implements {GAME_CONTROLLER.GameStatusCheck}
   * @implements {GAME_CONTROLLER.MediaFeatures}
   * @implements {DOM_MANAGER.InsertRating}
   * @implements {AUDIO_MANAGER.SetAudioSrc}
   * @implements {AUDIO_MANAGER.AudioController}
   */
  GameLoad: function () {
    GAME_CONTROLLER.AnswerCheck();
    GAME_CONTROLLER.GameStatusCheck();
    DOM_MANAGER.InsertRating();
    AUDIO_MANAGER.SetAudioSrc();
    AUDIO_MANAGER.AudioController();
    GAME_CONTROLLER.MediaFeatures();
  },
  /**
   * @desc Triggers all functions related to startup and initialization of the DOM or Page.
   * @implements {DOM_MANAGER.ThemeCheck}
   * @implements {DOM_MANAGER.UpdateGuessesLeft}
   * @implements {DOM_MANAGER.GlobalEventListeners}
   * @implements {UTILS_COLLECTION.FirstTimeVisitor}
   */
  PageLoad: function () {
    DOM_MANAGER.ThemeCheck();
    this.FirstTimeVisitor();
    DOM_MANAGER.UpdateGuessesLeft();
    DOM_MANAGER.GlobalEventListeners();
  },
  /**
   * @desc Will craft and append search results to the page.
   * @param {string[]} results Array of strings, representing the search results.
   * @implements {DOM_MANAGER.ClearSearchResults}
   * @implements {LOG}
   */
  SearchResults: function (results) {
    try {
      var searchRes = document.getElementById("searchResult");

      // remove the previous search results.
      DOM_MANAGER.ClearSearchResults();

      // then craft results
      for (let i = 0; i < results.length; i++) {
        var tmpHTML = `<p onclick="BTN_COLLECTION.EnterTextEvent(event);">${results[i]}</p>`;
        searchRes.insertAdjacentHTML("beforeend", tmpHTML);
      }
    } catch (err) {
      LOG.Error(`Error Occured crafting search results: ${err}`);
    }
  },
  /**
   * @desc Will attempt to detect if this user has visited before. To choose weather or not they need to see instructions on launch.
   * @implements {STORAGE_HANDLER.StorageAvailable}
   * @implements {LOG}
   * @implements {BTN_COLLECTION.AboutBtn}
   */
  FirstTimeVisitor: function () {
    if (STORAGE_HANDLER.StorageAvailable) {
      if (!localStorage.getItem("visitor")) {
        // they have never visited before, and dont have this set.
        localStorage.setItem("visitor", "true");
        LOG.Info("Welcome first time visitor");
        BTN_COLLECTION.AboutBtn();
      } else {
        LOG.Info("I've seen you here before. Welcome back.");
      }
    } else {
      LOG.Warn(
        "Local Storage is not available, making it impossible to tell if this is a first time visit."
      );
      LOG.Warn(
        "To error on the side of caution, the first visitor prompt will be provided"
      );
      BTN_COLLECTION.AboutBtn();
    }
  },
  /**
   * @desc Will attempt to determine what platform the user is on.
   * This only exists to fix and edge case bug occuring on iOS where the audio would fail to load properly.
   * @returns {string} An Identifier of the platform the user is on. Currently possible returns: iOS, unkown
   * @implements {LOG}
   */
  FindPlatformViaNavigator: function () {
    // This will be a simple attempt at detecting the platform a user is using via the navigator.platform API.
    // Since the website only fails on Mobile Safari,
    LOG.Info(navigator.platform);
    var iphoneValues = [
      "iPhone",
      "iPod",
      "iPad",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad Simulator",
    ];
    if (iphoneValues.includes(navigator.platform)) {
      return "iOS";
    } else {
      return "unknown";
    }
  },
  /**
  * @desc Cleans the users guess from search results. Since the search results contain extra data such as the year a movie was made
  * but the guess value does not, it was required to strip that data.
  * @param {string} guess The raw guess value, taken in from the search results.
  * @returns {string} The same value with the year data stripped.
  }
  */
  CleanGuessInput: function (guess) {
    var reg = new RegExp(" \\([0-9]{4}\\)$"); // This will make a space and four numbers with parenthesis, at the end of a string.
    return guess.replace(reg, "");
  },
  /**
   * @desc Creates text that can be shared to share the progress of your game board.
   * @returns {string} The proper game board represented as emojis to be shared.
   */
  CraftShareText: function () {
    const emoji_black_square = String.fromCodePoint(0x2b1b);
    const emoji_blue_square = String.fromCodePoint(0x1f7e6);
    const emoji_green_square = String.fromCodePoint(0x1f7e9);
    const emoji_orange_square = String.fromCodePoint(0x1f7e7);
    const emoji_red_square = String.fromCodePoint(0x1f7e5);
    const emoji_yellow_square = String.fromCodePoint(0x1f7e8);
    const emoji_white_square = String.fromCodePoint(0x2b1c);

    var finalString = `Quotle Game: ${answer.gameID} - `;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === 1) {
        finalString += emoji_green_square;
      }
      if (board[i] === 2) {
        finalString += emoji_blue_square;
      }
      if (board[i] === 3) {
        finalString += emoji_orange_square;
      }
      if (board[i] === 4) {
        finalString += emoji_yellow_square;
      }
      if (board[i] === 5) {
        finalString += emoji_black_square;
      }
      if (board[i] === 0) {
        finalString += emoji_white_square;
      }

      if (i === board.length - 1 && board[i] !== 1 && board[i] !== 0) {
        finalString += emoji_red_square;
      }
    }
    finalString += "\n https://quotle.dev";
    return finalString;
  },
  /**
   * @desc A function that when called will copy the ShareText to the users clipboard and create a notification alerting of this action.
   * @implements {LOG}
   * @implements {DOM_MANAGER.Snackbar}
   */
  CopyShareText: function () {
    if (!navigator.clipboard) {
      LOG.Warning("Clipboard API is not accessible");
    } else {
      navigator.clipboard.writeText(this.CraftShareText()).then(
        function () {
          LOG.Info("Successfully wrote to clipboard API");
          DOM_MANAGER.Snackbar("Successfully copied to clipboard.");
        },
        function () {
          LOG.Error("Failed to write to clipboard API");
        }
      );
    }
  },
  /**
   * @desc Existed purely to allow a user to call it and receive troubleshooting data in the cli of browser dev tools.
   */
  Trouble: function () {
    console.log("Sorry to see you are having trouble.");
    console.log(
      "Here are a few things you can do to gather helpful information to submit a bug report."
    );
    console.log(
      "Feel free to read the docs for more info. https://github.com/confused-Techie/Quotle/docs/troubleshoot.md"
    );
    console.log("1) Print Media Features: GAME_CONTROLLER.MediaFeatures()");
    console.log("2) Run Debug to get all available logs.");
    console.log("When running Debug you need to first enable it.");
    console.log(
      "Enable Game Debug to get generic Game Logs. Run: game_debug = true;"
    );
    console.log(
      "Enable Debug Spoilers to get guess check logs. Run: debug_spoiler = true;"
    );
    console.log("Once enabled run the Debug tool: LOG.Debug();");
  },
};

/**
 * Namespace to access features related to button clicks, or other events.
 * @namespace
 */
var BTN_COLLECTION = {
  /**
   * @desc Exists to respond to the GlobalEventListener for the About Button.
   * Enabling the about_modal when called.
   */
  AboutBtn: function () {
    document.getElementById("about_modal").classList.add("show");
  },
  /**
   * @desc Exists to respond to the GlobalEventListener for the Settings Button.
   * Enabling the settings_modal when called.
   */
  SettingsBtn: function () {
    document.getElementById("settings_modal").classList.add("show");
  },
  /**
   * @desc Responds to the submit button on the game board.
   * When clicked will take the value in the user guess text box and pass it to the Game Controller Pass Answer
   * After linting it in the Utils Collection Clean Guess Input.
   * @implements {GAME_CONTROLLER.PassAnswer}
   * @implements {UTILS_COLLECTION.CleanGuessInput}
   */
  CheckAnswerViaBtn: function () {
    GAME_CONTROLLER.PassAnswer(
      UTILS_COLLECTION.CleanGuessInput(
        document.getElementById("user_guess_input").value
      )
    );
  },
  /**
   * @desc Is called during clicks or key presses into the user guess search text box.
   * Passing this information to the Quotle API /search along with the users value.
   * Afterwards then passing the results from the API to the search results builder.
   * @implements {UTILS_COLLECTION.SearchResults}
   * @implements {LOG}
   */
  MediaSearchBtn: function (e) {
    console.log(e);
    var search = e.target.value;
    LOG.Info(search);

    fetch(`/api/search?value=${search}`)
      .then((res) => res.json())
      .then((result) => {
        UTILS_COLLECTION.SearchResults(result);
      });
  },
  /**
   * @desc Exists to respond to the user clicking on one of the search results. After an element is clicked, the search results
   * are cleared, since on mobile the submit button becomes covered by the search results.
   * @implements {UTILS_COLLECTION.CleanGuessInput}
   * @implements {DOM_MANAGER.ClearSearchResults}
   */
  EnterTextEvent: function (e) {
    document.getElementById("user_guess_input").value =
      UTILS_COLLECTION.CleanGuessInput(e.target.innerText);
    DOM_MANAGER.ClearSearchResults();
  },
  /**
   * @desc Responds to the stats button being clicked. Once called it will access local storage to start building text to appear
   * in the stats modal. And then enabling the modal.
   * @implements {STORAGE_HANDLER.StorageAvailable}
   */
  StatsBtn: function () {
    if (STORAGE_HANDLER.StorageAvailable) {
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
        // no stats saved.
        var tmpStringEmpty = `<p>You've played 0 times.</p><p>You've won 0 times.</p>`;
        document.getElementById("stats_modal_msg").innerHTML = tmpStringEmpty;
      }
    } else {
      var tmpStringErr = `<p>Without Cookies enabled this can't be shown 🙁</p>`;
      document.getElementById("stats_modal_msg").innerHTML = tmpStringErr;
    }

    document.getElementById("stats_modal").classList.add("show");
  },
};

/**
 * Namespace to access features related to audio playback.
 * @namespace
 */
var AUDIO_MANAGER = {
  /**
   * @desc This will set the audio source of the play button depending on the global currentGuessNumber.
   * @implements {LOG}
   */
  SetAudioSrc: function () {
    try {
      document.getElementById("audio-element").src =
        answer.audioSrc[currentGuessNumber - 1];
      document
        .getElementById(`audio${currentGuessNumber}-btn`)
        .classList.remove("disable");
    } catch (err) {
      LOG.Error(`Failed to set audio src: ${err}`, "audio");
    }
  },
  /**
   * @desc Will set the play button to a requested audio source.
   * @param {Object} event An Event() Object, to allow us to check if the requested audio is coming from an on page audio index click, and
   * if that requested audio is disabled.
   * @param {float} req The Index of the requested audio source from a 1 up count.
   * @implements {LOG}
   * @implements {GAME_CONTROLLER.AudioAlerts}
   */
  SetSpecificAudioSrc: function (event, req) {
    LOG.Info(`SetSpecificAudioSrc: ${req}`, "audio");
    try {
      // If the text within span is clicked, we check parent element
      // But if the button itself is clicked we need to check if the current element contains the disable class.
      if (
        event.target.parentElement.classList.contains("disable") ||
        event.target.classList.contains("disable")
      ) {
        LOG.Warn("Audio Element is disabled. Unable to change audio.", "audio");
      } else {
        LOG.Info("Setting audio src", "audio");
        document.getElementById("audio-element").src = answer.audioSrc[req - 1];

        GAME_CONTROLLER.AudioAlerts(req);
      }
    } catch (err) {
      LOG.Error(`Failed to set specific audio src: ${err}`, "audio");
    }
  },
  /**
   * @desc Very closely mimics the functionality of AUDIO_MANAGER.SetSpecificAudioSrc but does without a click. And can be used to change
   * the audio source programaticly.
   * @param {float} req The Index of the audio source, frrom a 1 up count.
   * @implements {LOG}
   */
  SetSpecificAudioSrcNoClick: function (req) {
    try {
      document.getElementById("audio-element").src = answer.audioSrc[req];
      document.getElementById(`audio${req}-btn`).classList.remove("disable");
    } catch (err) {
      LOG.Error(`Failed to set specific audio src: ${err}`, "audio");
    }
  },
  /**
   * @desc Enables all audio left in the game, starting at whatever the global currentGuessNumber is.
   * @implements {LOG}
   */
  EnableRemainingAudio: function () {
    try {
      for (var i = currentGuessNumber; i < 7; i++) {
        document.getElementById(`audio${i}-btn`).classList.remove("disable");
      }
    } catch (err) {
      LOG.Error(`Unable to enable all audio buttons: ${err}`, "audio");
    }
  },
  /**
   * @desc Starts the major audio controller. Responding to load events, and button clicks on the play button itself.
   * @implements {UTILS_COLLECTION.FindPlatformViaNavigator}
   * @implements {LOG}
   */
  AudioController: function () {
    var playIconContainer = document.getElementById("play-icon");
    var playIconImg = document.getElementById("play-icon-img");
    var audioElement = document.getElementById("audio-element");
    var state = "load";

    var showPlayIcon = function () {
      if (theme == "light") {
        playIconImg.src = "/images/play-white.svg";
      } else {
        playIconImg.src = "/images/play-black.svg";
      }
    };

    var showPauseIcon = function () {
      if (theme == "light") {
        playIconImg.src = "/images/pause-white.svg";
      } else {
        playIconImg.src = "/images/pause-black.svg";
      }
    };

    // Waiting for the readyState or loadeddata event fails to work on iPhone seemingly.
    // https://stackoverflow.com/a/11700424/12707685
    // Seemingly here iPhone will not preload content until user interaction, meaning I can't rely on the preload of data to then show a play icon.
    // While the goal of quotle was seemless, unbuffered audio playback that user expereince will have to be lessened, but attempting detection at
    // the platform a user is on will hopefully only make this less than ideal for a small amount of users.
    if (UTILS_COLLECTION.FindPlatformViaNavigator() == "iOS") {
      LOG.Warn(
        "Seems this is an iphone. Lets just change the icon agresively.",
        "audio"
      );
      state = "pause";
      showPlayIcon();
    }

    // Ensure that if the readystate has exceeded needs before this function has run.
    if (audioElement.readyState >= 3) {
      state = "pause";
      showPlayIcon();
    }
    // Otherwise listen for the event of that ready state firing.
    audioElement.addEventListener("loadeddata", function () {
      LOG.Info(
        `Audio Element Ready State: ${audioElement.readyState}`,
        "audio"
      );
      if (
        audioElement.readyState >= 3 &&
        UTILS_COLLECTION.FindPlatformViaNavigator() != "iOS"
      ) {
        // Had to add the not equal here, to ensure when iPhones start playing it doesn't immediatly change the play icon again after click.
        // 3 = HAVE_FUTURE_DATA
        state = "pause";
        showPlayIcon();
      }
    });
    // Listen for the audio clip ending, and allow it to be played again.
    audioElement.addEventListener("ended", function () {
      state = "pause";
      showPlayIcon();
    });
    // Listen for clicks on the audio play/pause button.
    playIconContainer.addEventListener("click", () => {
      LOG.Info(
        `Play Icon Container has been clicked. ReadyState: ${audioElement.readyState}; State: ${state}`,
        "audio"
      );
      if (state == "play") {
        showPlayIcon();
        audioElement.pause();
        state = "pause";
      } else if (state == "pause") {
        showPauseIcon();

        audioElement.play();
        state = "play";
      } else {
        // the data is still loading.
        LOG.Warn(
          `Play Icon Container has been clicked, even though the state isn't valid.`,
          "audio"
        );
      }
    });
  },
};

/**
 * Namespace to access features related to the game board.
 * @namespace
 */
var GAME_CONTROLLER = {
  /**
   * @desc Pass Answer handles taking a user guess, adding it to the guess history, clearing user guess text box, clearing search results.
   * then finally calling GAME_CONTROLLER.ValidateAnswer with the proper Element ID to then append the guess too.
   * @param {string} guess Raw text of the users guess.
   * @implements {DOM_MANAGER.ClearSearchResults}
   * @implements {GAME_CONTROLLER.ClearSearchResults}
   * @implements {GAME_CONTROLLER.ValidateAnswer}
   * @implements {LOG}
   */
  PassAnswer: function (guess) {
    // The new rewrite of the checkAnswer function.

    this.AddGuessToString(guess);

    // Clear the guess field.
    document.getElementById("user_guess_input").value = "";
    // clear the search results.
    DOM_MANAGER.ClearSearchResults();

    if (currentGuessNumber === 1) {
      this.ValidateAnswer(guess, "guess-one");
    } else if (currentGuessNumber === 2) {
      this.ValidateAnswer(guess, "guess-two");
    } else if (currentGuessNumber === 3) {
      this.ValidateAnswer(guess, "guess-three");
    } else if (currentGuessNumber === 4) {
      this.ValidateAnswer(guess, "guess-four");
    } else if (currentGuessNumber === 5) {
      this.ValidateAnswer(guess, "guess-five");
    } else if (currentGuessNumber === 6) {
      this.ValidateAnswer(guess, "guess-six");
    } else {
      LOG.Error("Had trouble displaying the guess results.", "game");
    }
  },
  /**
   * @desc Is the bulk of the Game Controller, using Quotle API's (/movie_match) to check the users guess data against the correct answer data.
   * Checking if they won, if they lost, got the director, genre, or both right. And calling required functions to make those changes, both in the
   * backend and frontend.
   * @param {string} guess Is the users raw guess text.
   * @param {string} eleID Is the element ID to make any modifications to, depending on this guess.
   * @implements {LOG}
   * @implements {DOM_MANAGER.DisplayGuessAnswer}
   * @implements {STORAGE_HANDLER.SetWinnerData}
   * @implements {STORAGE_HANDLER.SetLoserData}
   * @implements {STORAGE_HANDLER.SetProgressData}
   * @implements {GAME_CONTROLLER.NextGuess}
   * @implements {AUDIO_MANAGER.EnableRemainingAudio}
   * @implements {DOM_MANAGER.WinnerModal}
   * @implements {DOM_MANAGER.LoserModal}
   * @implements {DOM_MANAGER.Snackbar}
   */
  ValidateAnswer: function (guess, eleID) {
    fetch(`api/movie_match?value=${guess}`)
      .then((res) => res.json())
      .then((result) => {
        try {
          LOG.InfoSpoiler(
            "game",
            "ValidateAnswer: Guess: {0}; Answer.Name: {1}; Answer.Director: {2}",
            guess,
            answer.name,
            answer.director
          );
          //LOG.Info(`ValidateAnswer: Guess: ${guess}; Answer.Name: ${answer.name}; Answer.Director: ${answer.director}`, "game");
          LOG.Info(
            `ValidateAnswer: Movie_Match: Name: ${result.Name}; Director: ${result.Director}`,
            "game"
          );
          if (guess == answer.name && result.Director == answer.director) {
            LOG.Info("Correct Answer!", "game");
            // ITS CORRECT!
            DOM_MANAGER.DisplayGuessAnswer(eleID, guess, [
              "guessed",
              "correct",
            ]);

            board[currentGuessNumber - 1] = 1;
            // set winner saved data here
            STORAGE_HANDLER.SetProgressData();
            STORAGE_HANDLER.SetWinnerData();
            AUDIO_MANAGER.EnableRemainingAudio();
            this.NextGuess();
            DOM_MANAGER.WinnerModal();
          } else {
            LOG.Info("Incorrect Answer.", "game");
            // ITS INCORRECT
            // But lets see what they got right.
            var correctGenre = this.GenreCheck(result.Genre, answer.genre);
            var amountCorrect = "none";

            if (result.Director == answer.director && !correctGenre) {
              amountCorrect = "director";
            }
            if (correctGenre && result.Director != answer.director) {
              amountCorrect = "genre";
            }
            if (correctGenre && result.Director == answer.director) {
              amountCorrect = "both";
            }

            if (amountCorrect == "none") {
              LOG.Info("No extras correct.", "game");
              board[currentGuessNumber - 1] = 5;
            } else if (amountCorrect == "director") {
              LOG.Info("Director correct.", "game");
              board[currentGuessNumber - 1] = 2;
              DOM_MANAGER.Snackbar("Awesome you got the Director right!");
            } else if (amountCorrect == "genre") {
              LOG.Info("Genre Correct", "game");
              board[currentGuessNumber - 1] = 3;
              DOM_MANAGER.Snackbar("Rad you got the Genre right!");
            } else if (amountCorrect == "both") {
              LOG.Info("Director & Genre Correct", "game");
              board[currentGuessNumber - 1] = 4;
              DOM_MANAGER.Snackbar(
                "Fantastic you got both the Director and Genre right!"
              );
            }

            if (eleID == "guess-six") {
              LOG.Info("Player guessed the last guess.", "game");
              DOM_MANAGER.DisplayGuessAnswer(eleID, guess, [
                "guessed",
                amountCorrect,
                "lost",
              ]);
              // save progress, then losing data here.
              STORAGE_HANDLER.SetProgressData();
              STORAGE_HANDLER.SetLoserData();
              DOM_MANAGER.LoserModal();
            } else {
              // While providing amountCorrect will cause it to append none in most cases,
              // since no styling is applying to that class it'll be harmless, and simplify logic here.
              DOM_MANAGER.DisplayGuessAnswer(eleID, guess, [
                "guessed",
                amountCorrect,
              ]);
              // save progress here
              STORAGE_HANDLER.SetProgressData();
              this.NextGuess();
            }
          }
        } catch (err) {
          LOG.Error(
            `Made a bad guess buddy. It threw an error: ${err}`,
            "game"
          );

          if (eleID == "guess-six") {
            LOG.Info("Player made their last guess.", "game");
            DOM_MANAGER.DisplayGuessAnswer(eleID, guess, ["guessed", "lost"]);
            board[currentGuessNumber - 1] = 5;
            // save progress here, then losing data here
            STORAGE_HANDLER.SetProgressData();
            STORAGE_HANDLER.SetLoserData();
            DOM_MANAGER.LoserModal();
            //this.NextGuess();
          } else {
            DOM_MANAGER.DisplayGuessAnswer(eleID, guess, ["guessed"]);
            board[currentGuessNumber - 1] = 5;
            // Save progress here
            STORAGE_HANDLER.SetProgressData();
            this.NextGuess();
          }
        }
      })
      .catch((err) => {
        LOG.Error(`Made a bad guess buddy. It threw an error: ${err}`, "game");

        if (eleID == "guess-six") {
          LOG.Info("Player made their last guess.", "game");
          DOM_MANAGER.DisplayGuessAnswer(eleID, guess, ["guessed", "lost"]);
          board[currentGuessNumber - 1] = 5;
          // save progress here, then losing data here
          STORAGE_HANDLER.SetProgressData();
          STORAGE_HANDLER.SetLoserData();
          DOM_MANAGER.LoserModal();
        } else {
          DOM_MANAGER.DisplayGuessAnswer(eleID, guess, ["guessed"]);
          board[currentGuessNumber - 1] = 5;
          // save progress here
          STORAGE_HANDLER.SetProgressData();
          this.NextGuess();
        }
      });
  },
  /**
   * @desc Calls all functions needed to move to the next guess. After incremening the global currentGuessNumber
   * @implements {DOM_MANAGER.UpdateGuessesLeft}
   * @implements {AUDIO_MANAGER.SetAudioSrc}
   * @implements {GAME_CONTROLLER.AudioAlerts}
   */
  NextGuess: function () {
    currentGuessNumber++;
    DOM_MANAGER.UpdateGuessesLeft();
    AUDIO_MANAGER.SetAudioSrc();

    this.AudioAlerts(currentGuessNumber);
  },
  /**
   * @desc Handles the loading and checking for any Audio Alerts for the current audio source.
   * @param {float} num Is the audio item to check for. Coutning 1+
   * @implements {DOM_MANAGER.Snackbar}
   */
  AudioAlerts: function (num) {
    // check if the feature is supported
    if (answer.alerts) {
      // if supported, we can now check for a specific alert.
      if (answer.alerts[`audio${num}`].type) {
        // we know this specific peice of audio contains an alert
        // while in the future once more alerts are defined this can be more fleshed out, for now it will be rather simple.
        var curAlert = answer.alerts[`audio${num}`];
        if (curAlert.type == "volume" && curAlert.reason == "loud") {
          DOM_MANAGER.Snackbar("Warning! This next quote could be loud.");
        }
        if (curAlert.type == "content" && curAlert.reason == "violence") {
          DOM_MANAGER.Snackbar(
            "Warning! This next quote contains violent content."
          );
        }
      }
    }
  },
  /**
   * @desc Super simplistic way of adding a guess to the global guessesStrings array.
   * @param {string} guess The raw text of the users guess.
   */
  AddGuessToString: function (guess) {
    guessesStrings.push(guess);
  },
  /**
   * @desc Will check if a valid answer.js was served alongside this. And if it is invalid, its safe to assume it was inacccessible or more likely
   * doesn't exist, meaning the game for this gameID was never created. And so we will fallback to loading a random one, and notify the user of such.
   * @implements {LOG}
   * @implements {UTILS_COLLECTION.GameLoad}
   * @implements {DOM_MANAGER.Snackbar}
   */
  AnswerCheck: function () {
    if (typeof answer == "undefined") {
      LOG.Warn("there is no answer available.", "game");
      LOG.Warn("adding a random previous answer to play.", "game");
      // This uses 4 here since the highest level game created so far is 4. This could be periodically updated to include a more accurate number.
      // But since this should only show up in development, or in case I don't have a new game created, its not as important.
      const randomGameID = Math.floor(Math.random() * totalGameCount) + 1;

      const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = `https://storage.googleapis.com/quotle-games/${randomGameID}/answer.js`;
      });

      scriptPromise
        .then(() => {
          LOG.Info(
            `Successfully added new random answer with Game ID: ${randomGameID}`,
            "game"
          );
          // now this will recall the function to init all game dependent features.
          replay = true;
          UTILS_COLLECTION.GameLoad();
          DOM_MANAGER.Snackbar(
            "Unable to find the newest game. Grabbing a random one for you."
          );
        })
        .catch(() => {
          LOG.Error("had an error adding new answer script.", "game");
        });
    } // else the original answer was successfully loaded.
  },
  /**
   * @desc Used to initiate a random game load. Picking a random number from 1 - totalGameCount. And calling the Utils GameLoad functions.
   * @implements {LOG}
   * @implements {UTILS_COLLECTION.GameLoad}
   * @implements {DOM_MANAGER.Snackbar}
   */
  RandomPlay: function () {
    // this will replace answer with a new definition, chosen at random.
    LOG.Info(`Random Game load requested.`, "game");

    const randomGameID = Math.floor(Math.random() * totalGameCount) + 1;

    const scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      document.body.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.src = `https://storage.googleapis.com/quotle-games/${randomGameID}/answer.js`;
    });

    scriptPromise
      .then(() => {
        LOG.Info(`Successfully queried new game data`, "game");
        replay = true;
        UTILS_COLLECTION.GameLoad();
        DOM_MANAGER.Snackbar("New Random Game Loaded");
      })
      .catch(() => {
        LOG.Error("Error when creating new anwser.", "game");
      });
  },
  /**
   * @desc Used to check if two arrays of genres, have ANY matches. Returning true if so, false otherwise.
   * @param {Object} guess The Users guess Genre Array.
   * @param {Object} correct The Correct Answer Genre Array.
   * @returns {bool}
   */
  GenreCheck: function (guess, correct) {
    for (let i = 0; i < guess.length; i++) {
      if (correct.includes(guess[i])) {
        return true;
      }
    }
    return false;
  },
  /**
   * @desc Checks the status of the game. Useful to be called to recreate the game board, if a user left halfway through
   * and only has the progress local storage to go off of. Also is used to recreate after a return to a finished game.
   * @implements {STORAGE_HANDLER.FindCurrentGame}
   * @implements {DOM_MANAGER.DisplayGuessAnswer}
   * @implements {AUDIO_MANAGER.SetSpecificAudioSrcNoClick}
   * @implements {DOM_MANAGER.WinnerModal}
   * @implements {DOM_MANAGER.LoserModal}
   * @implements {DOM_MANAGER.EnableRemainingAudio}
   */
  GameStatusCheck: function () {
    if (!replay) {
      var curData = STORAGE_HANDLER.FindCurrentGame();

      if (curData) {
        var gameData = JSON.parse(curData);

        var applyBoardUpdates = function (ele, boardValue, guessValue, idx) {
          // if board is 0, then guesses will be undefined, so we need to ensure not to operate on those values.
          var tmpClassArray = ["guessed"];
          if (boardValue === 1) {
            tmpClassArray.push("correct");
          }
          if (boardValue === 2) {
            tmpClassArray.push("director");
          }
          if (boardValue === 3) {
            tmpClassArray.push("genre");
          }
          if (boardValue === 4) {
            tmpClassArray.push("both");
          }
          if (ele == "guess-six") {
            tmpClassArray.push("lost");
          }

          if (boardValue !== 0) {
            DOM_MANAGER.DisplayGuessAnswer(ele, guessValue, tmpClassArray);
            AUDIO_MANAGER.SetSpecificAudioSrcNoClick(idx++);
          }
        };

        var guessEleArray = [
          "guess-one",
          "guess-two",
          "guess-three",
          "guess-four",
          "guess-five",
          "guess-six",
        ];

        for (var i = 0; i < guessEleArray.length; i++) {
          applyBoardUpdates(
            guessEleArray[i],
            gameData.board[i],
            gameData.guesses[0],
            i
          );
        }

        if (gameData.complete) {
          // the game is already over.
          if (gameData.win) {
            // game has been won already
            DOM_MANAGER.WinnerModal();
          } else {
            // game has been lost already
            DOM_MANAGER.LoserModal();
          }
          AUDIO_MANAGER.EnableRemainingAudio();
        }
        // this oculd be used to rebuild the board since the game is not complete.
      } // else the currentgame cookie couldnt be found.
    } // else this game may or may not have been played. But we are replaying a previous game so we wont check.
  },
  /**
   * @desc Will log the available Media Features compatible for the current game.
   * @implements {LOG}
   */
  MediaFeatures: function () {
    if (typeof answer === "undefined") {
      LOG.Warn(
        "Unable to find media features. Since answer is undefined.",
        "game"
      );
    } else {
      var featuresObj = {
        alerts: false,
        rating: false,
      };
      if (answer.alerts) {
        featuresObj.alerts = true;
      }
      if (answer.rating) {
        featuresObj.rating = true;
      }

      LOG.Info(
        `Media Features: Alerts: ${featuresObj.alerts}; Rating: ${featuresObj.rating}`,
        "games"
      );
    }
  },
};

/**
 * Namespace to access features related to storage.
 * @namespace
 */
var STORAGE_HANDLER = {
  /**
   * @desc Tests and checks if local storage is available. Returning true if so. False otherwise.
   */
  StorageAvailable: function () {
    try {
      var x = "__storage_test__";
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // evething except firefox
        (e.code === 22 ||
          //firefox
          e.code === 1012 ||
          //test name field too, because code might not be present.
          //evething but firefox
          e.name === "QuotaExceededError" ||
          //firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge quotaexceedederror only if theres something already stored
        localStorage &&
        localStorage.length !== 0
      );
    }
  },
  /**
   * @desc Will get the item from local storage, after testing to ensure local storage is available.
   * @param {string} key The key of the Local Storage Item to get.
   * @implements {STORAGE_HANDLER.StorageAvailable}
   */
  GetItem: function (key) {
    return new Promise((resolve, reject) => {
      if (this.StorageAvailable) {
        if (!localStorage.getItem(key)) {
          // key doesn't exist.
          reject("no_key");
        } else {
          resolve(localStorage.getItem(key));
        }
      } else {
        reject("no_store");
      }
    });
  },
  /**
   * @desc Will set the item to local storage after ensuring it is available.
   * @param {string} key The Key to set.
   * @param {Object} value The value to set as. Could be an Object, Array, String, etc.
   * @implements {LOG}
   */
  SetItem: function (key, value) {
    if (this.StorageAvailable) {
      localStorage.setItem(key, value);
    } else {
      LOG.Error(
        `Local Storage isn't available. Unable to set ${key} to ${value}`,
        "store"
      );
    }
  },
  /**
   * @desc A simplified way of grabbing an item from local storage, where it grabs only the theme data. Then returning its value, or emtpy.
   */
  GetTheme: function () {
    if (this.StorageAvailable) {
      if (!localStorage.getItem("theme")) {
        return "";
      } else {
        return localStorage.getItem("theme");
      }
    } else {
      return "";
    }
  },
  /**
   * @desc Will attempt to find if and the value of any cookies related to the current game being played.
   * @returns {Object} Either the value of the key, unparsed. Or false if it fails or doesn't exist.
   * @implements {LOG}
   * @implements {STORAGE_HANDLER.StorageAvailable}
   */
  FindCurrentGame: function () {
    if (this.StorageAvailable) {
      var allKeys = Object.keys(localStorage);
      for (let i = 0; i < allKeys.length; i++) {
        var curKey = allKeys[i];

        try {
          if (curKey == `game-${answer.gameID}`) {
            return localStorage.getItem(curKey);
          }
        } catch (err) {
          if (typeof answer == "undefined") {
            // likely errored with no answer availabe. Seems answer check failed to do its job.
            LOG.Error(
              `Failed to find the current game in Local Storage beccause there is no answer available to check against.`,
              "store"
            );
            return false;
          } else {
            // generic error
            LOG.Warn(
              `Failed to find current game in local storage: ${err}`,
              "store"
            );
            return false;
          }
        }

        if (i == allKeys.length - 1) {
          return false;
        }
      }
    } else {
      return false;
    }
  },
  /**
   * @desc Made to set the Winner data into local storage. This will take all needed game elements and put them into an object in local storage.
   * @implements {STORAGE_HANDLER.UpdateStatsData}
   * @implements {STORAGE_HANDLER.CleanLastGameData}
   * @implements {LOG}
   */
  SetWinnerData: function () {
    if (!replay) {
      if (this.StorageAvailable) {
        var tmpObj = {
          gameid: answer.gameID,
          guessesAmount: currentGuessNumber,
          guesses: guessesStrings,
          complete: true,
          win: true,
          board: board,
        };

        localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));

        this.UpdateStatsData(true, currentGuessNumber - 1);

        this.CleanLastGameData();

        gtag("event", "won_game");
      } else {
        LOG.Error(
          "Local Storage unavailable, unable to set winner data",
          "store"
        );
      }
    } //else this game is being replayed, and data should not be saved.
  },

  /**
   * @desc Will set the Loser game data into local storage. Similar to Winner data.
   * @implements {STORAGE_HANDLER.UpdateStatsData}
   * @implements {STORAGE_HANDLER.CleanLastGameData}
   * @implements {LOG}
   */
  SetLoserData: function () {
    if (!replay) {
      if (this.StorageAvailable) {
        var tmpObj = {
          gameid: answer.gameID,
          guessesAmount: currentGuessNumber,
          guesses: guessesStrings,
          complete: true,
          win: false,
          board: board,
        };

        localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));

        this.UpdateStatsData(false, currentGuessNumber - 1);

        this.CleanLastGameData();

        gtag("event", "lost_game");
      } else {
        LOG.Error(
          "Local Storage unavailable, unable to set loser data.",
          "store"
        );
      }
    } // else this is a replay and progress should not be saved.
  },
  /**
   * @desc Will set the games progress into local storage.
   * @implements {STORAGE_HANDLER.StorageAvailable}
   * @implements {LOG}
   */
  SetProgressData: function () {
    if (!replay) {
      if (this.StorageAvailable) {
        var tmpObj = {
          gameid: answer.gameID,
          guessesAmount: currentGuessNumber,
          complete: false,
          win: false,
          board: board,
        };

        localStorage.setItem(`game-${answer.gameID}`, JSON.stringify(tmpObj));
      } else {
        LOG.Error(
          "Local Storage unavailable, unable to set progress data.",
          "store"
        );
      }
    }
  },
  /**
   * @desc Will update the last created or create a new Stats Local Storage Object, updating the data inside.
   * @implements {LOG}
   * @implements {STORAGE_HANDLER.StorageAvailable}
   */
  UpdateStatsData: function (gameWon, guessIdx) {
    if (this.StorageAvailable) {
      if (!localStorage.getItem("stats")) {
        // stats don't exist yet
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
        // stats already exist and we should append
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
      LOG.Error(
        "Local Storage unavailable, unable to set stats data.",
        "store"
      );
    }
  },
  /**
   * @desc Will remove any old games local storage data that exists, to avoid uneeded data sticking around.
   * @implements {STORAGE_HANDLER.StorageAvailable}
   * @implements {LOG}
   */
  CleanLastGameData: function () {
    if (this.StorageAvailable) {
      var allKeys = Object.keys(localStorage);

      for (let i = 0; i < allKeys.length; i++) {
        var curKey = allKeys[i];

        if (curKey != `game-${answer.gameID}` && curKey.startsWith("game-")) {
          // as long as it isn't our current game, but is a game key, remove it
          localStorage.removeItem(curKey);
        }
      }
    } else {
      LOG.Error(
        "Local Storage unavailable, unable to remove last game data.",
        "store"
      );
    }
  },
};

/**
 * Namespace to access better logging controls.
 * @namespace
 */
var LOG = {
  /**
   * @desc Determines the kind of logs to append into the log text based on predefined values.
   * @param {string} kind Is the type of logs to find the right text for. Valid Values: audio, game, dom, store, or empty. Otherwise ignored.
   * @returns {string} Formatted string to append into the beggining of logs.
   */
  DetermineKind: function (kind) {
    // There will be a few services that can properly logged.
    if (kind == "audio") return "AUDIO_SERVICE:: ";
    if (kind == "game") return "GAME_LOGIC:: ";
    if (kind == "dom") return "DOM_MANAGER:: ";
    if (kind == "store") return "STORAGE_HANDLER:: ";
    if (kind == "") return "GENERAL:: ";
  },
  /**
   * @desc Will check if the generic logs are enabled.
   * @returns {bool} True if logging is enabled. False otherwise.
   */
  Enabled: function () {
    if (game_debug) {
      return true;
    }
    return false;
  },
  /**
   * @desc Determines if Spoiler Debug Logs are enabled.
   * @returns {bool} True if they are, false otherwise.
   */
  Spoil: function () {
    if (debug_spoiler) {
      return true;
    }
    return false;
  },
  /**
   * @desc Info level logs.
   * @param {string} text Is the raw text to log.
   * @param {string} [kind=""] Is the id of the caller.
   */
  Info: function (text, kind = "") {
    if (this.Enabled()) {
      console.info(`${this.DetermineKind(kind)}${text}`);
    } else {
      log_collection.push(function () {
        LOG.Info(text, kind);
      });
    }
  },
  /**
   * @desc Warn Level Logs.
   * @param {string} text Is the raw text to log.
   * @param {string} [kind=""] Is the id of the caller.
   */
  Warn: function (text, kind = "") {
    if (this.Enabled()) {
      console.warn(`${this.DetermineKind(kind)}${text}`);
    } else {
      log_collection.push(function () {
        LOG.Warn(text, kind);
      });
    }
  },
  /**
   * @desc Error Level Logs.
   * @param {string} text Is the raw text to log.
   * @param {string} [kind=""] Is the id of the caller.
   */
  Error: function (text, kind = "") {
    if (this.Enabled()) {
      console.error(`${this.DetermineKind(kind)}${text}`);
    } else {
      log_collection.push(function () {
        LOG.Error(text, kind);
      });
    }
  },
  /**
   * @desc This is able to take pseudo variadic rest parameters as Composite Format Item Replacements. And will pass
   * them along to UTILS_COLLECTION.UnicornComposite
   * @summary Info Level Logs, supporting spoiler protection.
   * @param {string} [kind=""] Is the id of the caller.
   * @param {string} base The base string, with C# Composite String syntax.
   * @param {string[]} reps Array of strings that will preform the replacements within the text.
   */
  InfoSpoiler: function (kind = "", base, ...reps) {
    if (this.Enabled()) {
      if (this.Spoil()) {
        console.info(
          `${this.DetermineKind(kind)}${UTILS_COLLECTION.UnicornComposite(
            base,
            ...reps
          )}`
        );
      } else {
        let rep = [];
        for (let k = 0; k < reps.length; k++) {
          rep.push("[REDACTED]");
        }
        // Here instead of passing along my variadic rest parameters to UnicornComposite I instead,
        // create an array the same length as the original rest parameters of [REDACTED] and use the spread operator
        // to pass them to Unicorn as if they were native replacements.
        console.info(
          `${this.DetermineKind(kind)}${UTILS_COLLECTION.UnicornComposite(
            base,
            ...rep
          )}`
        );
      }
    } else {
      log_collection.push(function () {
        LOG.InfoSpoiler(kind, base, ...reps);
      });
    }
  },
  /**
   * @desc Made to help end users grab logs more easily. This will print any stored logs out to the console on call.
   */
  Debug: function () {
    for (var i = 0; i < log_collection.length; i++) {
      log_collection[i]();
    }
  },
};

window.onload = function () {
  UTILS_COLLECTION.PageLoad();
  UTILS_COLLECTION.GameLoad();

  var fancyConsole = [
    "font-weight: bold",
    "font-size: 50px",
    "color: red",
    "text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)",
  ].join(";");

  var semiFancyConsole = [
    "color: purple",
    "text-shadow: -1px 0 black, 1px 0 black, 0 -1px black",
    "font-size: 15px",
  ].join(";");

  console.log("%c Quotle!", fancyConsole);
  console.log("%c Hello welcome to the console!", semiFancyConsole);
  console.log(
    "%c Its wonderful to think you are here to help contribute to the project.",
    semiFancyConsole
  );
  console.log(
    "%c But if the Interns have taught me anything, I know people come here to cheat for answers.",
    semiFancyConsole
  );
  console.log(
    "%c So go ahead if thats the goal. See if you can figure out the simple API to query for the answers.",
    semiFancyConsole
  );
  console.log(
    "%c Otherwise please feel free to look around and contribute to the project! https://github.com/confused-Techie/Quotle",
    semiFancyConsole
  );
};
