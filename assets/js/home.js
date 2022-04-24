
var mediaDB;

window.onload = function() {
  // first we check the colour
  themeCheck();

  // Here we can setup the initial Button handlers
  document.getElementById("about_btn").addEventListener("click", aboutBtnEvent);
  document.getElementById("stats_btn").addEventListener("click", statsBtnEvent);
  document.getElementById("settings_btn").addEventListener("click", settingsBtnEvent);
  document.getElementById("user_guess_input").addEventListener("input", mediaSearch);

  // then to fetch the movie database
  fetch('/static/media.json')
    .then((response) => response.json())
    .then((data) => {
      mediaDB = data;
    });
}

function themeCheck() {
  if (window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('Dark Mode preffered.');

      document.body.classList.remove('light-theme');  // Remove Light Theme if present. If not will throw no error.
      document.body.classList.add('dark-theme');

      document.getElementById("help-circle-img").src = "/images/help-circle-white.svg";
      document.getElementById("award-img").src = "/images/award-white.svg";
      document.getElementById("settings-img").src = "/images/settings-white.svg";

      document.getElementById("footer-golang-img").src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg";
      document.getElementById("footer-github-img").src = "/images/github-white.svg";
      document.getElementById("footer-feather-icon-img").src = "/images/feather-white.svg";

    } else if (window.matchMedia('(prefers-color-scheme: light)')) {
      console.log('White Mode preffered.');

      document.body.classList.remove('dark-theme'); // Remove Dark Theme if present. If not will throw no error.
      document.body.classList.add('light-theme');

      document.body.getElementById("help-cirle-img").src = "/images/help-circle-black.svg";
      document.getElementById("award-img").src = "/images/award-black.svg";
      document.getElementById("settings-img").src = "/images/settings-black.svg";

      document.getElementById("footer-golang-img").src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-plain.svg";
      document.getElementById("footer-github-img").src = "/images/github-black.svg";
      document.getElementById("footer-feather-icon-img").src = "/images/feather-black.svg";

    } else {
      console.log('prefers-color-scheme not supported via Media Query. Are you using IE still?');
    }
  } else {
    console.log('Match Media not supported.');
  }
}

function aboutBtnEvent(event) {
  document.getElementById("about_modal").style.display = "block";
}

function statsBtnEvent(event) {

}

function settingsBtnEvent(event) {

}

function mediaSearch(e) {
  var search = e.srcElement.value;
  
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
