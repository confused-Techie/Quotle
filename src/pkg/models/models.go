package models

import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "os"
  "log"
)

type PageTemplate struct {
  Title string
  Data interface{}
  CSS []string
  JS []string
  TargetStrings map[string]string
  DefaultStrings map[string]string
  TargetLanguage string
}

type MediaDB struct {
  Name string `json:"name"`
  Director string `json:"director"`
  Genre []string `json:"genre"`
}

type MediaDBCollection struct {
  Media []*MediaDB
}

func GetMediaDB() (au *MediaDBCollection) {
  file, err := os.OpenFile("./assets/static/media.json", os.O_RDWR|os.O_APPEND, 0666)
  if err != nil {
    fmt.Println("Unable to build search Index")
    log.Fatal(err)
  }

  b, err := ioutil.ReadAll(file)
  if err != nil {
    fmt.Println("Unable to build search Index")
    log.Fatal(err)
  }

  var mdia MediaDBCollection
  json.Unmarshal(b, &mdia.Media)
  return &mdia
}

type SearchItem struct {
  Value []string
  Original string
  Director string
  Genre []string
}

type SearchList struct {
  Values []*SearchItem
}

type SearchResultItem struct {
  Name string
  Director string
  Genre []string
}

type SearchResultCollection struct {
  Results []*SearchResultItem
}
