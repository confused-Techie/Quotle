package cycledata

import (
	cloudfeatures "github.com/confused-Techie/Quotle/src/pkg/cloudfeatures"
	logger "github.com/confused-Techie/Quotle/src/pkg/logger"
)

// GlobalGameID is used to access the local copy of the global game id
var GlobalGameID int

// UpdateData should be called to update the GameID, and start the function to move data as needed.
func UpdateData() {
	logger.CronLogger.Println("cycledata.UpdateData has been called.")

	// then we want to save this new change.
	incrmtErr := cloudfeatures.IncrementGlobalGameData()
	if incrmtErr != nil {
		logger.ErrorLogger.Fatal(incrmtErr)
	}

	InitData()
}

// InitData is used to assign the current game id to the local global variable game id
func InitData() {
	logger.InfoLogger.Println("cycledata.InitData has been called.")
	var GAMEID, gameidErr = cloudfeatures.GetGlobalGameID()

	if gameidErr != nil {
		logger.ErrorLogger.Fatal(gameidErr)
	}

	GlobalGameID = GAMEID
	logger.InfoLogger.Printf("Game ID: %v", GlobalGameID)
}
