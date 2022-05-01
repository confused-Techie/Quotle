package models

import (
	"encoding/json"
	logger "github.com/confused-Techie/Quotle/src/pkg/logger"
	"github.com/spf13/viper"
	"io/ioutil"
	"os"
)

// PageTemplate is confused-Techie's modified page template for httpHandlers
type PageTemplate struct {
	Title          string
	Data           interface{}
	CSS            []string
	JS             []string
	TargetStrings  map[string]string
	DefaultStrings map[string]string
	TargetLanguage string
}

// MediaDB is an enrty in the media db JSON file.
type MediaDB struct {
	Name     string   `json:"name"`
	Director string   `json:"director"`
	Genre    []string `json:"genre"`
}

// MediaDBCollection is the collection of MediaDB Entries
type MediaDBCollection struct {
	Media []*MediaDB
}

// GetMediaDB function reads and returns the unmarshaled media database json file.
func GetMediaDB() (au *MediaDBCollection) {

	data, dataErr := cloudfeatures.GetMediaDB()

	if dataErr != nil {
		logger.ErrorLogger.Fatal(dataErr)
	}


	var mdia MediaDBCollection
	json.Unmarshal(data, &mdia.Media)
	return &mdia
}

// SearchItem holds the data for the search index entry of the media database.
type SearchItem struct {
	Value    []string
	Original string
	Director string
	Genre    []string
}

// SearchList a collection wrapper of SearchItem entries.
type SearchList struct {
	Values []*SearchItem
}

// SearchResultItem holds the returned search result entry
type SearchResultItem struct {
	Name     string
	Director string
	Genre    []string
}

// SearchResultCollection a collection wrapper of SearchResultItem entries.
type SearchResultCollection struct {
	Results []*SearchResultItem
}
