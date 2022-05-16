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

	langStrings := returnPrefferedStrings(strings.Split(r.Header.Get("Accept-Language"), ",")[0])

	data := models.PageTemplate{
		Title:          "Quotle",
		CSS:            []string{"/css/home.css?cache_buster=" + viper.GetString("env_variables.CSS_VERSION")},
		JS:             []string{"/js/home.min.js?cache_buster=" + viper.GetString("env_variables.JS_VERSION"), "https://storage.googleapis.com/quotle-games/" + strconv.Itoa(cycledata.GlobalGameID) + "/answer.js"},
		DefaultStrings: returnDefaultStrings(),
		//TargetStrings:  returnPrefferedStrings(strings.Split(r.Header.Get("Accept-Language"), ",")[0]),
		//TargetLanguage: strings.Split(r.Header.Get("Accept-Language"), ",")[0],
		TargetStrings:  langStrings.Strings,
		TargetLanguage: langStrings.Lang,
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

// AppleTouchHandler serves the apple touch icon.
func AppleTouchHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, viper.GetString("env_variables.DIR_ASSETS")+"/static/apple-touch.png")
}
