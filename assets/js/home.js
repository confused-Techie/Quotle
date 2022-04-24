
var theme;

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
}

function themeCheck() {
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

function enableLightTheme() {
  theme = 'light';

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
  document.getElementById("about_modal").style.display = "block";
}

function statsBtnEvent(event) {
  document.getElementById("stats_modal").style.display = "block";
}

function settingsBtnEvent(event) {
  document.getElementById("settings_modal").style.display = "block";
}

function mediaSearch(e) {
  var search = e.target.value;


}

function searchResults(results) {
  try {

    var searchRes = document.getElementById("searchResult");

    // first we want to remove all previous search results.
    while (searchResults.firstChild) {
      searchResults.removeChild(searchResults.lastChild);
    }

    // then craft the result to return
    for (let i = 0; i < results.length; i++) {
      // add the smart stuff here.
    }

  } catch(err) {
    console.log(`Error Occured crafting Search Results: ${err}`);
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
