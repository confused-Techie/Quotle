# Contributing

## Provide Translations

Translations are handled by Crowdin. An invite to anyone who would like to help is always [open.](https://crwd.in/quotle)

## Create Guesses

If you would like to create guesses theres a few ways to do so. While a true and complete guess will have 3 types of files.

* answer.js
  - A JavaScript file that contains only the declaration of an answer variable, with all needed keys for the game.
* meta.txt
  - While this is used nowhere in the game logic it can be helpful for recreation or troubleshooting. Generally it is a list of all audio files, with the location within the movie they occur.
* *.mp3
  - These are the raw mp3 files of each quote, labeled `audio0.mp3` -> `audio5.mp3`.

Although any step from thinking of a movie, to finding the quotes to use, to finding the timestamps of the quotes within the film, to a fully finished guess is helpful. While an issue can be created with any of these, if you have the audio sources as well, feel free to send an email with those as attachments to `dev@lhbasics.com`.

Feel free to look through docs/example_answer/ for an example of an empty game.

For help creating these quotes refer to [the workflow](https://github.com/confused-Techie/Quotle/blob/main/docs/workflow.md).

## Improve Source Code

If you would like to improve the source code, feel free to take a look through the repo.

All backend logic is written in Golang, and is in the src/pkg/ directory, otherwise of course the main Golang script is Quotle.go at the root.

Otherwise the JavaScript frontend logic is within assets/js/home.js which is then minified before being served.

The JavaScript is written with jsdoc type comments, and has documentation created thats [readable](https://github.com/confused-Techie/Quotle/blob/main/docs/JavaScript.md).
