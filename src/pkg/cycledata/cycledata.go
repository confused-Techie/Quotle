package cycledata

import (
  "strconv"
  "os"
  "io/ioutil"
  logger "github.com/confused-Techie/Quotle/src/pkg/logger"
)

var GAMEID = 1

// UpdateData should be called to update the GameID, and start the function to move data as needed.
func UpdateData() {
  GAMEID++
  ManageData(false)
}

func ManageData(firstCall bool) {
  // first remove the data that currently is in each folder.

  if !firstCall {
    RemoveAnswer()
    RemoveAudio()
  }

  AddAnswer("./games/"+strconv.Itoa(GAMEID)+"/answer.js", "./assets/static/answer.js")
  AddAudio(
    []string{"./games"+strconv.Itoa(GAMEID)+"/audio1.mp3", "./games"+strconv.Itoa(GAMEID)+"/audio2.mp3", "./games"+strconv.Itoa(GAMEID)+"/audio3.mp3", "./games"+strconv.Itoa(GAMEID)+"/audio4.mp3", "./games"+strconv.Itoa(GAMEID)+"/audio5.mp3", "./games"+strconv.Itoa(GAMEID)+"/audio6.mp3"},
    []string{"./assets/audio/audio1.mp3", "./assets/audio2.mp3", "./assets/audio3.mp3", "./assets/audio4.mp3", "./assets/audio5.mp3", "./assets/audio6.mp3"})
}

func RemoveAnswer() {
  err := os.Remove("./assets/static/answer.js")

  if err != nil {
    logger.ErrorLogger.Fatal(err)
  }
}

func RemoveAudio() {
  err := os.RemoveAll("./assets/audio")

  if err != nil {
    logger.ErrorLogger.Fatal(err)
  }
}

func AddAnswer(src string, dest string) {
  b, err := ioutil.ReadFile(src)

  if err != nil {
    logger.ErrorLogger.Fatal(err)
  }

  err = ioutil.WriteFile(dest, b, 0644)

  if err != nil {
    logger.ErrorLogger.Fatal(err)
  }
}

func AddAudio(files []string, destination []string) {
  for i, file := range files {
    b, err := ioutil.ReadFile(file)

    if err != nil {
      logger.ErrorLogger.Fatal(err)
    }

    err = ioutil.WriteFile(destination[i], b, 0644)

    if err != nil {
      logger.ErrorLogger.Fatal(err)
    }
  }
}
