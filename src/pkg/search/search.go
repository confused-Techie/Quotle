package search

import (
	logger "github.com/confused-Techie/Quotle/src/pkg/logger"
	models "github.com/confused-Techie/Quotle/src/pkg/models"
	"strings"
	"time"
	"unicode"
)

var searchList models.SearchList

// BuildIndex must be called to construct the search tools internal index.
func BuildIndex() {
	start := time.Now()

	loadItems()

	duration := time.Since(start)
	logger.InfoLogger.Println("Done Building Search Index in:", duration, "-", duration.Nanoseconds(), "ns")
}

// SearchIndex takes a string search argument to return a collection of matching results
func SearchIndex(search string) models.SearchResultCollection {
	tokenSearch := lowercaseFilter(tokenize(search))

	var res models.SearchResultCollection

	for _, itm := range searchList.Values {
		for _, char := range tokenSearch {
			for _, token := range itm.Value {
				if strings.Contains(token, char) {
					var tmpRes models.SearchResultItem
					tmpRes.Name = itm.Original
					tmpRes.Director = itm.Director
					tmpRes.Genre = itm.Genre
					res.Results = append(res.Results, &tmpRes)
				}
			}
		}
	}

	return res
}

// FindInIndex looks for an exact match within the search index.
func FindInIndex(search string) models.SearchResultItem {
	var res models.SearchResultItem

	for _, itm := range searchList.Values {
		if search == itm.Original {
			res.Name = itm.Original
			res.Director = itm.Director
			res.Genre = itm.Genre
			return res
		}
	}

	return models.SearchResultItem{Name: "", Director: "", Genre: []string{""}}
}

func loadItems() {
	au := models.GetMediaDB()

	for _, itm := range au.Media {
		var tmpItem models.SearchItem
		tmpItem.Original = itm.Name
		tmpItem.Value = lowercaseFilter(tokenize(itm.Name))
		tmpItem.Director = itm.Director
		tmpItem.Genre = itm.Genre
		searchList.Values = append(searchList.Values, &tmpItem)
	}
	return
}

func tokenize(text string) []string {
	return strings.FieldsFunc(text, func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsNumber(r)
	})
}
func lowercaseFilter(tokens []string) []string {
	r := make([]string, len(tokens))
	for i, token := range tokens {
		r[i] = strings.ToLower(token)
	}
	return r
}

func stopwordFilter(tokens []string) []string {
	var stopwords = map[string]struct{}{
		"the": {}, "(": {}, ")": {},
	}

	res := make([]string, 0, len(tokens))
	for _, token := range tokens {
		if _, ok := stopwords[token]; !ok {
			res = append(res, token)
		}
	}
	return res
}
