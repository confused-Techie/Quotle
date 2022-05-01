package cloudfeatures

import (
  "context"
  "fmt"
  "io/ioutil"
  "time"
  "os"
  "github.com/spf13/viper"
  "encoding/json"

  "cloud.google.com/go/storage"
  "google.golang.org/api/option"
)

func IncrementGlobalGameData() (error){
  curData, curErr := GetGlobalGameData()

  if curErr != nil {
    return curErr
  }
  // curData is now equal to the full file. Which needs to be parsed.
  var ggd GlobalGames
  json.Unmarshal([]byte(curData), &ggd)

  newDataRes, newDataErr := SetGlobalGameData(ggd.Gameid +1)

  if newDataErr != nil {
    return newDataErr
  }

  if newDataRes == "success" {
    return nil
  }

  return fmt.Errorf("Something went wrong: %v", newDataRes)
}

func GetGlobalGameID() (int, error) {
  data, dataErr := GetGlobalGameData()

  if dataErr != nil {
    return 0, dataErr
  }

  var ggd GlobalGames
  json.Unmarshal([]byte(data), &ggd)

  return ggd.Gameid, nil
}

func GetGlobalGameData() (string, error) {
  bucket := "stateful-data"
  object := "global-game.json"
  timeout := time.Second*50
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

func GetMediaDB() (string, error) {
  bucket := "stateful-data"
  object := "media.json"
  timeout := time.Second*50
  authFile, authErr := GetAuthFile()

  if authErr != nil {
    return "", authErr
  }

  bData, err := ReadDataAuth(bucket, object, authFile, timeout)
  if err != nil {
    return "", err
  }
  return bData, nil 
}

type GlobalGames struct {
  Gameid int `string:"gameid"`
}

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

func GetAuthFile() ([]byte, error) {
  authFile, err := os.OpenFile("./quotle-348800-5a828989750d.json", os.O_RDWR|os.O_APPEND, 0666)
  if err != nil {
    return nil, fmt.Errorf("Open Auth JSON: %v", err)
  }
  authb, err := ioutil.ReadAll(authFile)
  if err != nil {
    return nil, fmt.Errorf("Read Auth JSON: %v", err)
  }
  return authb, nil
}

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

func WriteDataAuth(bucket string, object string, authFile []byte, file []byte) (error) {
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
