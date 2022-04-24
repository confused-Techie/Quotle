package main

import (
  "net/http"
  "log"
  "compress/gzip"
  "io/ioutil"
  "io"
  "sync"
  "strings"
  webrequests "github.com/confused-Techie/Quotle/src/pkg/webrequests"
)

func main() {
  mux := http.NewServeMux()

  // =========== Standard Page Endpoints ==========
  mux.Handle("/", http.HandlerFunc(webrequests.HomeHandler))

  // ========== Asset Endpoints ==================
  mux.Handle("/css/", http.StripPrefix("/css/", gzipHandler(http.FileServer(http.Dir("./assets/css")))))
  mux.Handle("/js/", http.StripPrefix("/js/", gzipHandler(http.FileServer(http.Dir("./assets/js")))))
  mux.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./assets/images"))))
  mux.Handle("/static/", http.StripPrefix("/static/", gzipHandler(http.FileServer(http.Dir("./assets/static")))))

  // Since http.ListenAndServe only returns an error, we can safely wrap in fatal, ensuring a proper crash.
  log.Fatal(http.ListenAndServe(":8080", mux))
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

func (w *gzipResponseWriter) WriteHeader(status int) {
  w.Header().Del("Content-Length")
  w.ResponseWriter.WriteHeader(status)
}

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
