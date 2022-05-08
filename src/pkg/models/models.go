package models

// PageTemplate is confused-Techie's modified page template for httpHandlers
type PageTemplate struct {
	Title          string
	Data           interface{}
	CSS            []string
	JS             []string
	TargetStrings  map[string]string
	DefaultStrings map[string]string
	TargetLanguage string
}

// PrefferedStringsV2 is the object to contain string data as well as the locale
type PrefferedStringsV2 struct {
	Strings map[string]string
	Lang string
}

// StringsSupported holds the struct for a strings.supported.json file 
type StringsSupported struct {
	Langs []string `json:"langs"`
}

// MediaDB is an enrty in the media db JSON file.
type MediaDB struct {
	Name     string   `json:"name"`
	Director string   `json:"director"`
	Genre    []string `json:"genre"`
}

// MediaDBCollection is the collection of MediaDB Entries
type MediaDBCollection struct {
	Media []*MediaDB
}

// SearchItem holds the data for the search index entry of the media database.
type SearchItem struct {
	Value    []string
	Original string
	Director string
	Genre    []string
}

// SearchList a collection wrapper of SearchItem entries.
type SearchList struct {
	Values []*SearchItem
}

// SearchResultItem holds the returned search result entry
type SearchResultItem struct {
	Name     string
	Director string
	Genre    []string
}

// SearchResultCollection a collection wrapper of SearchResultItem entries.
type SearchResultCollection struct {
	Results []*SearchResultItem
}

// APISearchResultItem is for the API call to tmdb.
type APISearchResultItem struct {
	GenreIDs []int  `json:"genre_ids"`
	ID       int    `json:"id"`
	Title    string `json:"title"`
}

// APISearchResultCollection Collection of APISearchResultItem
type APISearchResultCollection struct {
	Page    string                 `json:"page"`
	Results []*APISearchResultItem `json:"results"`
}

// APIDetailItemCrew contains crew data for movie details.
type APIDetailItemCrew struct {
	Name string `json:"name"`
	Job  string `json:"job"`
}

// APIDetailItemCredits contains the Crew Details.
type APIDetailItemCredits struct {
	Crew []*APIDetailItemCrew `json:"crew"`
}

// APIDetailItemGenre is for the genre data during detail calls.
type APIDetailItemGenre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// APIDetailItem contains all other Detail structs
type APIDetailItem struct {
	Genres  []*APIDetailItemGenre `json:"genres"`
	Title   string                `json:"title"`
	Credits APIDetailItemCredits  `json:"credits"`
}
