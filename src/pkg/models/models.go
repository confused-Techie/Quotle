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
	Replay         bool
}

// PrefferedStringsV2 is the object to contain string data as well as the locale
type PrefferedStringsV2 struct {
	Strings map[string]string
	Lang    string
}

// StringsSupported holds the struct for a strings.supported.json file
type StringsSupported struct {
	Langs []string `json:"langs"`
}

// APISearchResultItem is for the API call to tmdb.
type APISearchResultItem struct {
	GenreIDs    []int  `json:"genre_ids"`
	ID          int    `json:"id"`
	Title       string `json:"title"`
	ReleaseDate string `json:"release_date"`
}

// APISearchResultCollection Collection of APISearchResultItem
type APISearchResultCollection struct {
	Page    string                 `json:"page"`
	Results []*APISearchResultItem `json:"results"`
}

type GameAnswerAlertItems struct {
	Type   string `json:"type"`
	Reason string `json:"reason"`
}

type GameAnswerAlerts struct {
	Audio1 GameAnswerAlertItems `json:"audio1"`
	Audio2 GameAnswerAlertItems `json:"audio2"`
	Audio3 GameAnswerAlertItems `json:"audio3"`
	Audio4 GameAnswerAlertItems `json:"audio4"`
	Audio5 GameAnswerAlertItems `json:"audio5"`
	Audio6 GameAnswerAlertItems `json:"audio6"`
}

type GameAnswer struct {
	Name     string              `json:"name"`
	Director string              `json:"director"`
	Genre    []string            `json:"genre"`
	Rating   string              `json:"rating"`
	GameID   int                 `json:"gameID"`
	ID       string              `json:"movieID"`
	AudioSrc []string            `json:"audioSrc"`
	Alerts   []*GameAnswerAlerts `json:"alerts"`
}

type PageAnswerResponse struct {
	Result string
}

// SearchResultItem holds the returned search result entry
type SearchResultItem struct {
	Name     string
	Director string
	Genre    []string
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
