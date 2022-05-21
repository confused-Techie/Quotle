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
)

// TmdbAPIKey is the API call to tmdb, which should be stored in the app.yaml file.
var TmdbAPIKey string

func errCheck(err error) {
	if err != nil {
		logger.ErrorLogger.Println(err)
	}
}

// FindAPIKey is called during startup to discover what the API key is.
func FindAPIKey() {
	tmpAPI := os.Getenv("TMDB_API_KEY")

	if tmpAPI == "" {
		logger.ErrorLogger.Printf("Could not find API Key for TMDB via Env Var")
		TmdbAPIKey = viper.GetString("env_variables.TMDB_API_KEY")
	} else {
		TmdbAPIKey = tmpAPI
	}
}

// DetailQueryByID is a Gen2 Rewrite of the matching model, instead taking only an ID to return EXACT movie details.
func DetailQueryByID(id string) models.SearchResultItem {
	matchURL := "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + TmdbAPIKey + "&append_to_response=credits"
	logger.InfoLogger.Println(matchURL)
	resp, err := http.Get(matchURL)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}

	var res models.APIDetailItem
	json.Unmarshal(body, &res)
	resp.Body.Close()

	var matchDetail models.SearchResultItem

	for _, itmIn := range res.Credits.Crew {
		if itmIn.Job == "Director" {
			matchDetail.Director = itmIn.Name
		}
	}
	for _, itmIn := range res.Genres {
		matchDetail.Genre = append(matchDetail.Genre, itmIn.Name)
	}
	return matchDetail
}

// SearchQueryV2 takes a search string and now returns an APISearchResultCollection
func SearchQueryV2(search string) models.APISearchResultCollection {
	url := "https://api.themoviedb.org/3/search/movie?api_key=" + TmdbAPIKey + "&query=" + url.QueryEscape(search) + "&page=1"
	logger.InfoLogger.Println("SearchQueryV2: " + url)
	resp, err := http.Get(url)
	errCheck(err)
	body, err := ioutil.ReadAll(resp.Body)
	errCheck(err)
	var res models.APISearchResultCollection
	json.Unmarshal(body, &res)
	resp.Body.Close()

	return res
}
