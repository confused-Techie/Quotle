package cloudfeatures

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/spf13/viper"
	"io/ioutil"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

// IncrementGlobalGameData can be called to add 1 to the game id stored within the cloud.
func IncrementGlobalGameData() error {
	curData, curErr := GetGlobalGameData()

	if curErr != nil {
		return curErr
	}
	// curData is now equal to the full file. Which needs to be parsed.
	var ggd GlobalGames
	json.Unmarshal([]byte(curData), &ggd)

	newDataRes, newDataErr := SetGlobalGameData(ggd.Gameid + 1)

	if newDataErr != nil {
		return newDataErr
	}

	if newDataRes == "success" {
		return nil
	}

	return fmt.Errorf("Something went wrong: %v", newDataRes)
}

// GetGlobalGameID returns an int of the global game id in the cloud
func GetGlobalGameID() (int, error) {
	data, dataErr := GetGlobalGameData()

	if dataErr != nil {
		return 0, dataErr
	}

	var ggd GlobalGames
	json.Unmarshal([]byte(data), &ggd)

	return ggd.Gameid, nil
}

// GetGlobalGameData returns the raw string of the global game data in the cloud
func GetGlobalGameData() (string, error) {
	bucket := "stateful-data"
	object := "global-game.json"
	timeout := time.Second * 50
	authFile, authErr := GetAuthFile()

	if authErr != nil {
		return "", authErr
	}

	if viper.GetBool("app.production") {
		bData, err := ReadDataAuth(bucket, object, authFile, timeout)
		if err != nil {
			return "", err
		}
		return string(bData), nil
	}

	bData, err := ReadDataNoAuth(bucket, object)

	if err != nil {
		return "", err
	}
	return string(bData), nil
}

// GlobalGames is used to marshal the data from the cloud.
type GlobalGames struct {
	Gameid int `string:"gameid"`
}

// SetGlobalGameData is used to modify the data in the cloud.
func SetGlobalGameData(newValue int) (string, error) {
	bucket := "stateful-data"
	object := "global-game.json"
	authFile, authErr := GetAuthFile()
	gameFile, gameErr := ConstructGlobalGameFile(newValue)

	if gameErr != nil {
		return "", gameErr
	}

	if authErr != nil {
		return "", authErr
	}

	if viper.GetBool("app.production") {
		// the WriteAuth expects the data to write, as well as all standard variables for get.
		writeErr := WriteDataAuth(bucket, object, authFile, gameFile)
		if writeErr != nil {
			return "", writeErr
		}
		return "success", nil
	}

	return "", fmt.Errorf("Write Global Data not built for development")
}

// GetAuthFile returns the bytes of the auth file for accessing the cloud.
func GetAuthFile() ([]byte, error) {
	authFile, err := os.Open("./quotle-348800-5a828989750d.json")
	if err != nil {
		return nil, fmt.Errorf("Open Auth JSON: %v", err)
	}
	authb, err := ioutil.ReadAll(authFile)
	if err != nil {
		return nil, fmt.Errorf("Read Auth JSON: %v", err)
	}
	return authb, nil
}

// ConstructGlobalGameFile marshals the global game data raw file.
func ConstructGlobalGameFile(value int) ([]byte, error) {
	data := GlobalGames{
		Gameid: value,
	}

	file, err := json.MarshalIndent(data, "", " ")
	if err != nil {
		return nil, fmt.Errorf("json.MarshalIndent: %v", err)
	}
	return []byte(file), nil
}

// ReadDataNoAuth is a fallback during development to test the basic functionality.
func ReadDataNoAuth(bucket string, object string) ([]byte, error) {
	ctx := context.Background()
	client, err := storage.NewClient(ctx, option.WithoutAuthentication())
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()

	rc, err := client.Bucket(bucket).Object(object).NewReader(ctx)
	if err != nil {
		return nil, fmt.Errorf("Object(%q).NewReader: %v", object, err)
	}

	defer rc.Close()

	data, err := ioutil.ReadAll(rc)
	if err != nil {
		return nil, fmt.Errorf("ioutil.ReadAll: %v", err)
	}
	return data, nil
}

// ReadDataAuth reads the data from the cloud.
func ReadDataAuth(bucket string, object string, auth_file []byte, timeout time.Duration) ([]byte, error) {
	ctx := context.Background()
	client, err := storage.NewClient(ctx, option.WithCredentialsJSON(auth_file))
	if err != nil {
		return nil, fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	rc, err := client.Bucket(bucket).Object(object).NewReader(ctx)
	if err != nil {
		return nil, fmt.Errorf("Object(%q).NewReader: %v", object, err)
	}

	defer rc.Close()

	data, err := ioutil.ReadAll(rc)
	if err != nil {
		return nil, fmt.Errorf("ioutil.ReadAll: %v", err)
	}
	return data, nil
}

// WriteDataAuth writes the data to the ccloud.
func WriteDataAuth(bucket string, object string, authFile []byte, file []byte) error {
	ctx := context.Background()
	client, err := storage.NewClient(ctx, option.WithCredentialsJSON(authFile))
	if err != nil {
		return fmt.Errorf("storage.NewClient: %v", err)
	}
	defer client.Close()

	wc := client.Bucket(bucket).Object(object).NewWriter(ctx)

	wc.Write(file)

	err = wc.Close()
	if err != nil {
		return fmt.Errorf("io.WriteFile: %v", err)
	}
	return nil
}
