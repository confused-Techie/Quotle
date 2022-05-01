package tmdbsearch

import (
	"encoding/json"
	logger "github.com/confused-Techie/Quotle/src/pkg/logger"
	models "github.com/confused-Techie/Quotle/src/pkg/models"
  "github.com/spf13/viper"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

// TMDB_API_KEY is the API call to tmdb, which should be stored in the app.yaml file.
var TMDB_API_KEY string

// FindAPIKey is called during startup to discover what the API key is.
func FindAPIKey() {
	tmpAPI := os.Getenv("TMDB_API_KEY")

	if tmpAPI == "" {
    if viper.GetBool("app.production") {
      logger.ErrorLogger.Fatal("Could not find API Key for TMDB")
    }
		logger.ErrorLogger.Println("COuld not find API Key for TMDB. Setting empty")
    TMDB_API_KEY = ""
	}

	TMDB_API_KEY = tmpAPI
}

// SearchQuery takes a search string, and returns the api results as an array.
func SearchQuery(search string) []string {
	url := "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY + "&query=" + url.QueryEscape(search) + "&page=1"
	logger.InfoLogger.Println(url)
	resp, err := http.Get(url)

	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	// now to read the body of this search response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	// now time to convert this data into a struct.
	var res models.APISearchResultCollection
	json.Unmarshal(body, &res)
	resp.Body.Close()

	var toRes []string

	for _, itm := range res.Results {
		toRes = append(toRes, itm.Title)
	}
	return toRes
}

// DetailQuery takes a search qury, assuming it is exact and will be the front page of a search, and retrieves all needed details.
func DetailQuery(search string) models.SearchResultItem {
	matchURL := "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY + "&query=" + url.QueryEscape(search) + "&page=1"
	resp, err := http.Get(matchURL)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	var matchRes models.APISearchResultCollection
	json.Unmarshal(body, &matchRes)
	resp.Body.Close()

	// we will assume that once a match is put in we can use the first result of this search, as it should be exact, returning 1 value

	var matchDetail models.SearchResultItem
	matchDetail.Name = matchRes.Results[0].Title

	// then we need to get the director, and genre
	detailURL := "https://api.themoviedb.org/3/movie/" + strconv.Itoa(matchRes.Results[0].ID) + "?api_key=" + TMDB_API_KEY + "&append_to_response=credits"
	detailResp, err := http.Get(detailURL)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	detailBody, err := ioutil.ReadAll(detailResp.Body)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	var matchDetailRes models.APIDetailItem
	json.Unmarshal(detailBody, &matchDetailRes)
	detailResp.Body.Close()

	logger.InfoLogger.Println(matchDetailRes.Title)

	for _, itm := range matchDetailRes.Credits.Crew {
		if itm.Job == "Director" {
			matchDetail.Director = itm.Name
		}
	}

	for _, itm := range matchDetailRes.Genres {
		matchDetail.Genre = append(matchDetail.Genre, itm.Name)
	}

	return matchDetail
}
