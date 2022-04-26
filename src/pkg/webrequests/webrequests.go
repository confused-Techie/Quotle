package webrequests

import (
  "html/template"
  "net/http"
  "fmt"
  "encoding/json"
  "os"
  "io/ioutil"
  "strings"
  models "github.com/confused-Techie/Quotle/src/pkg/models"
  search "github.com/confused-Techie/Quotle/src/pkg/search"
)

func returnAgnosticStrings(langCode string) map[string]string {
  file, err := os.OpenFile("./assets/lang/strings."+langCode+".json", os.O_RDWR|os.O_APPEND, 0666)
  if err != nil {
    fmt.Println(err)
  }
  b, err := ioutil.ReadAll(file)
  if err != nil {
    fmt.Println(err)
  }
  var objmap map[string]string
  err = json.Unmarshal(b, &objmap)
  if err != nil {
    fmt.Println(err)
  }
  return objmap
}

func returnDefaultStrings() map[string]string {
  return returnAgnosticStrings("en-US")
}

var tmpl = make(map[string]*template.Template)

func HomeHandler(w http.ResponseWriter, r *http.Request) {

  data := models.PageTemplate{
    Title: "Quotle",
    CSS: []string{"/css/home.css"},
    JS: []string{"/js/home.js", "/static/answer.js"},
    DefaultStrings: returnDefaultStrings(),
    TargetStrings: returnAgnosticStrings(strings.Split(r.Header.Get("Accept-Language"), ",")[0]),
    TargetLanguage: strings.Split(r.Header.Get("Accept-Language"), ",")[0],
  }

  // While tradditionally I would include a Template Array here, since this will be a SPA thats not a concern.
  tmpl["homePage.html"] = template.Must(template.ParseFiles("./assets/template/home.gohtml"))

  templateError := tmpl["homePage.html"].Execute(w, data)

  errorPage(templateError, w, r)
}

func errorPage(err error, w http.ResponseWriter, r *http.Request) {
  if err != nil {

    data := models.PageTemplate{
      Title: "Something went wrong.",
      Data: err,
    }

    tmpl["errorPage.html"] = template.Must(template.ParseFiles("./assets/template/error.gohtml"))
    templateError := tmpl["errorPage.html"].Execute(w, data)
    if templateError != nil {
      fmt.Println(templateError)
    }

  }
}

func SearchHandler(w http.ResponseWriter, r *http.Request) {
  // First lets get the values we care about
  value := r.URL.Query().Get("value")

  json.NewEncoder(w).Encode(search.SearchIndex(value))
}

func MovieMatchHandler(w http.ResponseWriter, r *http.Request) {
  value := r.URL.Query().Get("value")

  json.NewEncoder(w).Encode(search.FindInIndex(value))
}
