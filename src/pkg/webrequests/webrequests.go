package webrequests

import (
	"encoding/json"
	"errors"
	cycledata "github.com/confused-Techie/Quotle/src/pkg/cycledata"
	logger "github.com/confused-Techie/Quotle/src/pkg/logger"
	models "github.com/confused-Techie/Quotle/src/pkg/models"
	tmdbsearch "github.com/confused-Techie/Quotle/src/pkg/tmdbsearch"
	"github.com/spf13/viper"
	"html/template"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

func returnAgnosticStrings(langCode string) map[string]string {
	file, err := os.Open(viper.GetString("env_variables.DIR_ASSETS") + "/lang/strings." + langCode + ".json")
	if err != nil {
		logger.WarningLogger.Println(err)
	}
	b, err := ioutil.ReadAll(file)
	if err != nil {
		logger.WarningLogger.Println(err)
	}
	var objmap map[string]string
	err = json.Unmarshal(b, &objmap)
	if err != nil {
		logger.WarningLogger.Println(err)
	}
	return objmap
}

func returnPrefferedStrings(langCode string) models.PrefferedStringsV2 {
	if langCode == "" {
		// The langCode has no appropriate header. Or is otherwise blank.
		return models.PrefferedStringsV2{
			Strings: returnAgnosticStrings("en-US"),
			Lang:    "en-US",
		}

	}
	// the lang code is something. Lets see if we have it
	if _, err := os.Stat(viper.GetString("env_variables.DIR_ASSETS") + "/lang/strings." + langCode + ".json"); err == nil {
		// The file exists, lets return it.
		return models.PrefferedStringsV2{
			Strings: returnAgnosticStrings(langCode),
			Lang:    langCode,
		}
	} else if errors.Is(err, os.ErrNotExist) {
		// file doesn't exist.

		// but even without it existing, lets see if we have a close match.
		supportedFile, err := os.Open(viper.GetString("env_variables.DIR_ASSETS") + "/lang/strings.supported.json")
		if err != nil {
			logger.WarningLogger.Println(err)
		}
		supportedB, err := ioutil.ReadAll(supportedFile)
		if err != nil {
			logger.WarningLogger.Println(err)
		}
		var sptStrng models.StringsSupported
		err = json.Unmarshal(supportedB, &sptStrng)
		if err != nil {
			logger.WarningLogger.Println(err)
		}

		langRoot := strings.Split(langCode, "-")[0]
		for _, itm := range sptStrng.Langs {
			if strings.HasPrefix(itm, langRoot) {
				logger.LangLogger.Printf("Request Language doesn't exist - Able to find neighbor: %s : %s", itm, langCode)

				return models.PrefferedStringsV2{
					Strings: returnAgnosticStrings(itm),
					Lang:    itm,
				}

			}
		}
		// since this language doesn't exist, return default.
		logger.LangLogger.Printf("Requested Language doesn't exist - Unable to find neighbor: %s", langCode)

		return models.PrefferedStringsV2{
			Strings: returnAgnosticStrings("en-US"),
			Lang:    "en-US",
		}

	} else {
		// some sort of error occured.
		logger.WarningLogger.Println("Schrodinger's Language File access.")
		logger.WarningLogger.Println(err)

		return models.PrefferedStringsV2{
			Strings: returnAgnosticStrings("en-US"),
			Lang:    "en-US",
		}

	}
}

func returnDefaultStrings() map[string]string {
	return returnAgnosticStrings("en-US")
}

var tmpl = make(map[string]*template.Template)

// HomeHandler is the http handler for the home page of Quotle.
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	gameIDToUse := cycledata.GlobalGameID
	replayValue := false

	requested_id := r.URL.Query().Get("requested_game")
	if requested_id != "" {
		gameIDToUse, _ = strconv.Atoi(requested_id)
		replayValue = true
	}
	if gameIDToUse == 0 {
		// here pick a random one. and somehow tell the browser
		gameIDToUse = randomGameID()
		replayValue = true
	}

	langStrings := returnPrefferedStrings(strings.Split(r.Header.Get("Accept-Language"), ",")[0])

	data := models.PageTemplate{
		Title:          "Quotle",
		CSS:            []string{"/css/home.min.css?cache_buster=" + viper.GetString("env_variables.CSS_VERSION")},
		JS:             []string{"/js/home.min.js?cache_buster=" + viper.GetString("env_variables.JS_VERSION")},
		DefaultStrings: returnDefaultStrings(),
		TargetStrings:  langStrings.Strings,
		TargetLanguage: langStrings.Lang,
		Data:           getPageGameAnswer(strconv.Itoa(gameIDToUse)),
		Replay:         replayValue,
	}

	// While tradditionally I would include a Template Array here, since this will be a SPA thats not a concern.
	tmpl["homePage.html"] = template.Must(template.ParseFiles(viper.GetString("env_variables.DIR_ASSETS") + "/template/home.gohtml"))

	templateError := tmpl["homePage.html"].Execute(w, data)

	errorPage(templateError, w, r)
}

func errorPage(err error, w http.ResponseWriter, r *http.Request) {
	if err != nil {

		data := models.PageTemplate{
			Title: "Something went wrong.",
			Data:  err,
		}

		tmpl["errorPage.html"] = template.Must(template.ParseFiles(viper.GetString("env_variables.DIR_ASSETS") + "/template/error.gohtml"))
		templateError := tmpl["errorPage.html"].Execute(w, data)
		if templateError != nil {
			logger.WarningLogger.Println(templateError)
		}

	}
}

// SearchHandlerV2 is the new improved search handler. Using V2 SearchQuery from tmdbsearch.go
func SearchHandlerV2(w http.ResponseWriter, r *http.Request) {
	value := r.URL.Query().Get("value")
	json.NewEncoder(w).Encode(tmdbsearch.SearchQueryV2(value))
}

// ValidateAnswerV2 is the new validation. Checking game answers server side.
func ValidateAnswerV2(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	gameID := r.URL.Query().Get("gameID")
	// get the guess movie details.
	tmdbRes := tmdbsearch.DetailQueryByID(id)
	// get the correct movie details.
	answer := getGameAnswer(gameID)

	genreCorrect := checkGenre(answer.Genre, tmdbRes.Genre)

	var pageAnswer models.PageAnswerResponse
	pageAnswer.Result = "none"

	logger.InfoLogger.Println("Provided Movie ID: " + id)
	logger.InfoLogger.Println("Provided Game ID: " + gameID)
	logger.InfoLogger.Println("Detail Query Name: " + tmdbRes.Name)
	logger.InfoLogger.Println("Answer Name: " + answer.Name)

	// in the future the games should list the ID, and we will check that first.
	if answer.ID != "" {
		if answer.ID == id {
			pageAnswer.Result = "win"
			json.NewEncoder(w).Encode(pageAnswer)
			return
			// Added a return here to avoid a double encoding, with details of the director or genre right.
		}
	}
	// but for previous games that don't have it. Or the ID is not an exact match.
	if answer.Director == tmdbRes.Director && !genreCorrect {
		pageAnswer.Result = "director"
	}
	if answer.Director != tmdbRes.Director && genreCorrect {
		pageAnswer.Result = "genre"
	}
	if answer.Director == tmdbRes.Director && genreCorrect {
		pageAnswer.Result = "both"
	}
	json.NewEncoder(w).Encode(pageAnswer)
}

func checkGenre(an []string, gu []string) bool {
	for _, v := range gu {
		if contains(an, v) {
			return true
		}
	}
	return false
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}

func randomGameID() int {
	min := 1
	max := 19
	// to prevent an instance of Quotle always producing the same value,
	rand.Seed(time.Now().UnixNano())
	num := rand.Intn(max-min) + min
	logger.InfoLogger.Println("Random Game ID Generated Below:")
	logger.InfoLogger.Println(num)
	return num
}

func getPageGameAnswer(id string) models.GameAnswer {
	fullAnswer := getGameAnswer(id)
	fullAnswer.Name = ""
	fullAnswer.Director = ""
	fullAnswer.Genre = make([]string, 0)
	fullAnswer.ID = ""
	return fullAnswer
}

func getGameAnswer(id string) models.GameAnswer {
	url := "https://storage.googleapis.com/quotle-games/" + id + "/answer.json"
	logger.InfoLogger.Println("getGameAnswer URL: " + url)
	resp, err := http.Get(url)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		logger.ErrorLogger.Println(err)
	}
	var res models.GameAnswer
	json.Unmarshal(body, &res)
	resp.Body.Close()
	logger.InfoLogger.Println("Ready to return Game Answer: " + res.Name)
	return res
}

// ManifestHandler serves the manifest file.
func ManifestHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("env_variables.DIR_ASSETS")+"/static/manifest.json")
}

// RobotsHandler serves the robots file.
func RobotsHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("env_variables.DIR_ASSETS")+"/static/robots.txt")
}

// SitemapHandler serves the sitemap file.
func SitemapHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("env_variables.DIR_ASSETS")+"/static/sitemap.xml")
}

// FaviconHandler serves the favicon file.
func FaviconHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("env_variables.DIR_ASSETS")+"/static/favicon.png")
}

// AppleTouchHandler serves the apple touch icon.
func AppleTouchHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("env_variables.DIR_ASSETS")+"/static/apple-touch.png")
}
