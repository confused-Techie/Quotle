package main

import (
	"compress/gzip"
	cycledata "github.com/confused-Techie/Quotle/src/pkg/cycledata"
	logger "github.com/confused-Techie/Quotle/src/pkg/logger"
	tmdbsearch "github.com/confused-Techie/Quotle/src/pkg/tmdbsearch"
	webrequests "github.com/confused-Techie/Quotle/src/pkg/webrequests"
	"github.com/robfig/cron/v3"
	"github.com/spf13/viper"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"time"
	"os/signal"
	"strings"
	"sync"
	"syscall"
)

func main() {

	// setup viper
	viper.SetConfigName("app")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.ReadInConfig()

	logger.InfoLogger.Println("Setup app.yaml arguments...")

	logger.InfoLogger.Println("Quotle Starting...")

	// listen to SIGINT calls
	captureExit := make(chan os.Signal)
	signal.Notify(captureExit, os.Interrupt, syscall.SIGTERM, syscall.SIGTERM)
	go func() {
		<-captureExit
		logger.InfoLogger.Println("SIGINT/SIGTERM Signal Captured. Exiting...")
		logger.InfoLogger.Println("====================================")
		logger.InfoLogger.Println("====================================")
		os.Exit(1)
	}()

	logger.InfoLogger.Println("Listening for SIGINT...")

	tmdbsearch.FindAPIKey()

	//setup the cron job
	cronHandler := cron.New(
		cron.WithLogger(
			cron.VerbosePrintfLogger(logger.CronLogger)))

	cronHandler.AddFunc("CRON_TZ=America/Los_Angeles 00 00 * * *", cycledata.UpdateData)

	cronHandler.Start()

	// now that we can detect if we are in a productin environment by seeing if env variables are set at all
	production := os.Getenv("PRODUCTION")

	if production != "" {
		cycledata.InitData()
	}

	logger.InfoLogger.Printf("Quotle Version: %v", viper.GetString("env_variables.VERSION"))
	if production != "" {
		logger.InfoLogger.Printf("Running in Production Environment")
	} else {
		logger.InfoLogger.Printf("Running in Development Environment")
	}
	logger.InfoLogger.Printf("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+")
	logger.InfoLogger.Printf("Logs: %v; Assets: %v", viper.GetString("env_variables.DIR_LOGS"), viper.GetString("env_variables.DIR_ASSETS"))

	mux := http.NewServeMux()

	// =========== Standard Page Endpoints ==========
	mux.Handle("/", http.HandlerFunc(webrequests.HomeHandler))

	// ========== Asset Endpoints ==================
	mux.Handle("/css/", http.StripPrefix("/css/", gzipHandler(http.FileServer(http.Dir(viper.GetString("env_variables.DIR_ASSETS")+"/css")))))
	mux.Handle("/js/", http.StripPrefix("/js/", gzipHandler(http.FileServer(http.Dir(viper.GetString("env_variables.DIR_ASSETS")+"/js")))))
	mux.Handle("/images/", http.StripPrefix("/images/", cacheControl(http.FileServer(http.Dir(viper.GetString("env_variables.DIR_ASSETS")+"/images")))))
	mux.Handle("/static/", http.StripPrefix("/static/", gzipHandler(http.FileServer(http.Dir(viper.GetString("env_variables.DIR_ASSETS")+"/static")))))
	mux.Handle("/manifest.json", http.HandlerFunc(webrequests.ManifestHandler))
	mux.Handle("/robots.txt", http.HandlerFunc(webrequests.RobotsHandler))
	mux.Handle("/sitemap.xml", http.HandlerFunc(webrequests.SitemapHandler))
	mux.Handle("/favicon.png", http.HandlerFunc(webrequests.FaviconHandler))

	// ========== API Endpoints ====================
	mux.Handle("/api/search", http.HandlerFunc(webrequests.SearchHandler))
	mux.Handle("/api/movie_match", http.HandlerFunc(webrequests.MovieMatchHandler))

	port := os.Getenv("PORT")
	if port == "" {
		port = viper.GetString("env_variables.PORT")
		logger.WarningLogger.Println("Port not available via Environment Variables. Falling back to Config File...")
	}

	logger.InfoLogger.Printf("Listening on %v...", port)
	// Since http.ListenAndServe only returns an error, we can safely wrap in fatal, ensuring a proper crash.
	logger.ErrorLogger.Fatal(http.ListenAndServe(":"+port, mux))
}

func cacheControl(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		modtime := lastModifiedTime(r.URL.String())

		w.Header().Set("Cache-Control", "max-age=2592000") // 30 Days
		w.Header().Set("Last-Modified", modtime)

		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}

func lastModifiedTime(filename string) string {
	// since the string passed will be relative we can just append .
	fileLoc := "./assets/images/" + filename
	file, err := os.Stat(fileLoc)

	if err != nil {
		logger.ErrorLogger.Println(err)
		return time.Now().UTC().Format(time.RFC1123)
	}
	modifiedtime := file.ModTime()
	formatedTime := modifiedtime.UTC().Format(time.RFC1123)
	return formatedTime
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

var gzPool = sync.Pool{
	New: func() interface{} {
		w := gzip.NewWriter(ioutil.Discard)
		gzip.NewWriterLevel(w, gzip.BestCompression)
		return w
	},
}

// WriteHeader is used by the gzipResponseWriter to modify headers
func (w *gzipResponseWriter) WriteHeader(status int) {
	w.Header().Del("Content-Length")
	w.ResponseWriter.WriteHeader(status)
}

// Write is used by gzipResponseWriter to modify the returned value.
func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func gzipHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			// cannot accept, return serving
			h.ServeHTTP(w, r)
			return
		}
		// can accept, set http headers
		w.Header().Set("Content-Encoding", "gzip")
		gz := gzPool.Get().(*gzip.Writer)
		defer gzPool.Put(gz)

		gz.Reset(w)
		defer gz.Close()

		h.ServeHTTP(&gzipResponseWriter{ResponseWriter: w, Writer: gz}, r)
	})
}
