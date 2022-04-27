package cycledata

import (
  "os"
  "io/ioutil"
  logger "github.com/confused-Techie/Quotle/src/pkg/logger"
  "github.com/spf13/viper"
)

// UpdateData should be called to update the GameID, and start the function to move data as needed.
func UpdateData() {

  // then we want to save this new change.
  viper.Set("app.gameid", viper.GetInt("app.gameid")+1)
  viper.WriteConfig()
  ManageData(false)
}

func ManageData(firstCall bool) {
  // first remove the data that currently is in each folder.

  if !firstCall {
    RemoveAnswer()
    RemoveAudio()
  }

  var GAMEID = viper.GetString("app.gameid")
  var GAMESRC = viper.GetString("app.dir.games")
  var GAMEDEST = viper.GetString("app.dir.assets")
  var AUDIODEST = viper.GetString("app.dir.assets")+"/audio"

  AddAnswer(GAMESRC+"/"+GAMEID+"/answer.js", GAMEDEST+"/static/answer.js")
  AddAudio(
    []string{GAMESRC+"/"+GAMEID+"/audio1.mp3", GAMESRC+"/"+GAMEID+"/audio2.mp3", GAMESRC+"/"+GAMEID+"/audio3.mp3", GAMESRC+"/"+GAMEID+"/audio4.mp3", GAMESRC+"/"+GAMEID+"/audio5.mp3", GAMESRC+"/"+GAMEID+"/audio6.mp3"},
    []string{AUDIODEST+"/audio1.mp3", AUDIODEST+"/audio2.mp3", AUDIODEST+"/audio3.mp3", AUDIODEST+"/audio4.mp3", AUDIODEST+"/audio5.mp3", AUDIODEST+"/audio6.mp3"})
}

func RemoveAnswer() {
  err := os.Remove(viper.GetString("app.dir.assets")+"/static/answer.js")

  if err != nil {
    logger.ErrorLogger.Fatal(err)
  }
}

func RemoveAudio() {
  err := os.RemoveAll(viper.GetString("app.dir.assets")+"/audio")

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
