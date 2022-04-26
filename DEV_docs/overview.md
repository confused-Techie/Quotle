Normal version has 6 guesses and plays audio along with typed text

The advanced version is only 5 guesses and only shows the quote on the screen.

----------------------

##Overview

* Golang Backend

* Frontend site, should do most of the heavy lifting

* Movie Database

* Audio Extraction and Storage

------------------

## Specifics

The movie database should be an array of JSON items, delivered alongside the page. Unless the search is to slow. So will have to do some testing.

The answer should also be a JSON object, that could be included in delivery of the HTML, although to hopefully prevent lamos from inspect elementing it, could be delivered as JSON alongside as well.

Additionally, mobile first design needs to be taken very seriously, additionally having this installable is a priority.

The themeing support should be togglable, but additionally, should have both themes in the same CSS stylesheet, and the page should use JS to query the user preference, and add the class to the page.

This will be a JavaScript powered Single Page Application.

------------------

## Page Layout

The title is centered in the header

The header will contain the following:
  * Title
  * Settings
    - Dark Mode
    - Feedback link to Github
  * About
    - Instructions on how to play
    - Information about its creation
  * Stats
    - Your previous stats based on cookies
      > Number of Times Played
      > Percentage of Wins
      > Distribution of Wins on guessing number

----------------------

## Page Components

* Header
* GameBoard
  - Audio Player
  - Text Box for Quote
  - Text Input
  - Previous Guesses
* Footer
* Instructions Modal
* Settings Modal
* Stats Modal

---------------

## Todo


* Change audio and answer every day
* JS Settings, dark mode.

* Start writing games.
