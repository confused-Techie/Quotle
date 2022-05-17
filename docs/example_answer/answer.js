var answer = {
  name: "",
  director: "",
  genre: [ "", "", "" ],
  rating: "",
  gameID: 00,
  audioSrc: [
    "https://storage.googleapis.com/quotle-games/00/audio0.mp3",
    "https://storage.googleapis.com/quotle-games/00/audio1.mp3",
    "https://storage.googleapis.com/quotle-games/00/audio2.mp3",
    "https://storage.googleapis.com/quotle-games/00/audio3.mp3",
    "https://storage.googleapis.com/quotle-games/00/audio4.mp3",
    "https://storage.googleapis.com/quotle-games/00/audio5.mp3",
  ],
  alerts: {
    audio1: {},
    audio2: {},
    audio3: {},
    audio4: {},
    audio5: {},
    audio6: {},
  }
};
// To grab the data here take a look at The Movie Database https://www.themoviedb.org/?language=en-US
// name -- Has the match The Movie Database EXACTLY
// director -- Has to match The Movie Database EXACTLY
// genre -- Again has to match exactly, and try to include all possible values. Keeping case.
// rating -- While not required is helpful to know if the game can be played in front of certain audiences.
// gameID -- Should be left blank so I can fill out as needed.
// audioSrc -- Leave as it appears here, the 00 needs to match the gameID.
// alerts -- These are used to alert of language, violence, or volume of the audio clip. Below are some examples of the few valid alerts.

var alert_example1 = {
  type: "content",
  reason: "violence"
};

var alert_example2 = {
  type: "volume",
  reason: "loud"
};
