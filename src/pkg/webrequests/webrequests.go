package webrequests

import (
  "html/template"
  "net/http"
  "fmt"
  models "github.com/confused-Techie/Quotle/src/pkg/models"
)

var tmpl = make(map[string]*template.Template)

func HomeHandler(w http.ResponseWriter, r *http.Request) {

  data := models.PageTemplate{
    Title: "Quotle",
    CSS: []string{"/css/home.css"},
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
