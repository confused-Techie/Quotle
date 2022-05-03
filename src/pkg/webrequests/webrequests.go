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
	"net/http"
	"os"
	"strconv"
	"strings"
)

func returnAgnosticStrings(langCode string) map[string]string {
	file, err := os.Open(viper.GetString("env_variables.DIR_ASSETS")+"/lang/strings."+langCode+".json")
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

func returnPrefferedStrings(langCode string) map[string]string {
	// check for file existance
	if _, err := os.Stat(viper.GetString("env_variables.DIR_ASSETS") + "/lang/strings." + langCode + ".json"); err == nil {
		// file exists
		return returnAgnosticStrings(langCode)
	} else if errors.Is(err, os.ErrNotExist) {
		// file doesn't exist.
		// since this language doesn't exist. Return default
		logger.LangLogger.Println("Requested Language doesn't exist: %v", langCode)
		return returnAgnosticStrings("en-US")
	} else {
		// error occured. Reguardless
		logger.WarningLogger.Println("Schrodinger's Language File Access.")
		logger.WarningLogger.Println(err)
		return returnAgnosticStrings("en-US")
	}
}
func returnDefaultStrings() map[string]string {
	return returnAgnosticStrings("en-US")
}

var tmpl = make(map[string]*template.Template)

// HomeHandler is the http handler for the home page of Quotle.
func HomeHandler(w http.ResponseWriter, r *http.Request) {

	data := models.PageTemplate{
		Title:          "Quotle",
		CSS:            []string{"/css/home.css"},
		JS:             []string{"/js/home.js", "https://storage.googleapis.com/quotle-games/" + strconv.Itoa(cycledata.GlobalGameID) + "/answer.js"},
		DefaultStrings: returnDefaultStrings(),
		TargetStrings:  returnPrefferedStrings(strings.Split(r.Header.Get("Accept-Language"), ",")[0]),
		TargetLanguage: strings.Split(r.Header.Get("Accept-Language"), ",")[0],
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

// SearchHandler is the generic search api endpoint handler.
func SearchHandler(w http.ResponseWriter, r *http.Request) {
	// First lets get the values we care about
	value := r.URL.Query().Get("value")

	//json.NewEncoder(w).Encode(search.SearchIndex(value))
	json.NewEncoder(w).Encode(tmdbsearch.SearchQuery(value))
}

// MovieMatchHandler invokes search.FindInIndex to find an exact match within the movie db.
func MovieMatchHandler(w http.ResponseWriter, r *http.Request) {
	value := r.URL.Query().Get("value")

	json.NewEncoder(w).Encode(tmdbsearch.DetailQuery(value))
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
