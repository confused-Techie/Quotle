package tmdbsearch

import (

)

var TMDB_API_KEY string

func FindAPIKey() {
  tmpAPI := os.Getenv("TMDB_API_KEY")

  if tmpAPI == "" {
    logger.ErrorLogger.Fatal("Could not find API Key for TMDB")
  }

  TMDB_API_KEY = tmpAPI
}
