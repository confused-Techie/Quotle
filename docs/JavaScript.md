## Objects

<dl>
<dt><a href="#DOM_MANAGER">DOM_MANAGER</a> : <code>object</code></dt>
<dd><p>Namespace to access features specific to the DOM of the page.</p>
</dd>
<dt><a href="#UTILS_COLLECTION">UTILS_COLLECTION</a> : <code>object</code></dt>
<dd><p>Namespace to access features that dont fit anywhere else.</p>
</dd>
<dt><a href="#BTN_COLLECTION">BTN_COLLECTION</a> : <code>object</code></dt>
<dd><p>Namespace to access features related to button clicks, or other events.</p>
</dd>
<dt><a href="#AUDIO_MANAGER">AUDIO_MANAGER</a> : <code>object</code></dt>
<dd><p>Namespace to access features related to audio playback.</p>
</dd>
<dt><a href="#GAME_CONTROLLER">GAME_CONTROLLER</a> : <code>object</code></dt>
<dd><p>Namespace to access features related to the game board.</p>
</dd>
<dt><a href="#STORAGE_HANDLER">STORAGE_HANDLER</a> : <code>object</code></dt>
<dd><p>Namespace to access features related to storage.</p>
</dd>
<dt><a href="#LOG">LOG</a> : <code>object</code></dt>
<dd><p>Namespace to access better logging controls.</p>
</dd>
</dl>

<a name="DOM_MANAGER"></a>

## DOM\_MANAGER : <code>object</code>
Namespace to access features specific to the DOM of the page.

**Kind**: global namespace  

* [DOM_MANAGER](#DOM_MANAGER) : <code>object</code>
    * [.WinnerModal()](#DOM_MANAGER.WinnerModal)
    * [.LoserModal()](#DOM_MANAGER.LoserModal)
    * [.UpdateGuessesLeft()](#DOM_MANAGER.UpdateGuessesLeft)
    * [.GlobalEventListeners()](#DOM_MANAGER.GlobalEventListeners)
    * [.EnableTheme(requested_theme)](#DOM_MANAGER.EnableTheme)
    * [.ThemeCheck()](#DOM_MANAGER.ThemeCheck)
    * [.ClearSearchResults()](#DOM_MANAGER.ClearSearchResults)
    * [.DisplayGuessAnswer(eleID, guessText, classArray)](#DOM_MANAGER.DisplayGuessAnswer)
    * [.Snackbar(msg)](#DOM_MANAGER.Snackbar)
    * [.InsertRating()](#DOM_MANAGER.InsertRating)

<a name="DOM_MANAGER.WinnerModal"></a>

### DOM_MANAGER.WinnerModal()
Make the winner modal visible on the page, as well as disables the input methods for guesses. Additionally creating
confetti on the page.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="DOM_MANAGER.LoserModal"></a>

### DOM_MANAGER.LoserModal()
Allows the loser modal to viewable on the page. Additionally disabling input methods, and injecting the correct answer
into the loser modal text box.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="DOM_MANAGER.UpdateGuessesLeft"></a>

### DOM_MANAGER.UpdateGuessesLeft()
Updates the text on the page of the amount of guesses left.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="DOM_MANAGER.GlobalEventListeners"></a>

### DOM_MANAGER.GlobalEventListeners()
Initializes all global event listeners and defines the functions they call.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="DOM_MANAGER.EnableTheme"></a>

### DOM_MANAGER.EnableTheme(requested_theme)
Enables the theme requested. By adding the class to the body and changing images.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  

| Param | Type | Description |
| --- | --- | --- |
| requested_theme | <code>string</code> | The theme wanted. 'dark' or 'light' |

<a name="DOM_MANAGER.ThemeCheck"></a>

### DOM_MANAGER.ThemeCheck()
Checks if a theme is enabled via cookies or using media queries. Prioritizing media queries.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="DOM_MANAGER.ClearSearchResults"></a>

### DOM_MANAGER.ClearSearchResults()
Clears the search results that are appearing on the page.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="DOM_MANAGER.DisplayGuessAnswer"></a>

### DOM_MANAGER.DisplayGuessAnswer(eleID, guessText, classArray)
Displays a guess on the page, attaching any requested classes to the element.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  

| Param | Type | Description |
| --- | --- | --- |
| eleID | <code>string</code> | is the Element ID of which guess to modify. |
| guessText | <code>string</code> | is the raw text of the users guess. |
| classArray | <code>Array.&lt;string&gt;</code> | Array of which classes to include made up of strings. |

<a name="DOM_MANAGER.Snackbar"></a>

### DOM_MANAGER.Snackbar(msg)
Creates a snackbar alert with text specified.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>string</code> | Is the text to show. |

<a name="DOM_MANAGER.InsertRating"></a>

### DOM_MANAGER.InsertRating()
Inserts the rating from the answer onto the page.

**Kind**: static method of [<code>DOM\_MANAGER</code>](#DOM_MANAGER)  
<a name="UTILS_COLLECTION"></a>

## UTILS\_COLLECTION : <code>object</code>
Namespace to access features that dont fit anywhere else.

**Kind**: global namespace  

* [UTILS_COLLECTION](#UTILS_COLLECTION) : <code>object</code>
    * [.UnicornComposite(arg0, argN)](#UTILS_COLLECTION.UnicornComposite) ⇒ <code>string</code>
    * [.GameLoad()](#UTILS_COLLECTION.GameLoad)
    * [.PageLoad()](#UTILS_COLLECTION.PageLoad)
    * [.SearchResults(results)](#UTILS_COLLECTION.SearchResults)
    * [.FirstTimeVisitor()](#UTILS_COLLECTION.FirstTimeVisitor)
    * [.FindPlatformViaNavigator()](#UTILS_COLLECTION.FindPlatformViaNavigator) ⇒ <code>string</code>
    * [.CleanGuessInput(guess)](#UTILS_COLLECTION.CleanGuessInput) ⇒ <code>string</code>
    * [.CraftShareText()](#UTILS_COLLECTION.CraftShareText) ⇒ <code>string</code>
    * [.CopyShareText()](#UTILS_COLLECTION.CopyShareText)
    * [.Trouble()](#UTILS_COLLECTION.Trouble)

<a name="UTILS_COLLECTION.UnicornComposite"></a>

### UTILS_COLLECTION.UnicornComposite(arg0, argN) ⇒ <code>string</code>
UnicornComposite is a carry-over function created in GoPage.
It is used to mimic C# Composite formatting.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Summary**: Implementation of Composite Formatting from C#, originating from confused-Techie/GoPage  
**Returns**: <code>string</code> - Composited String.  
**See**: [GoPage](https://github.com/confused-Techie/GoPage/blob/main/docs/devDocs/JavaScript.md#LangHandlerJS)  

| Param | Type | Description |
| --- | --- | --- |
| arg0 | <code>string</code> | The String to preform the method on. |
| argN | <code>string</code> | All other arguments afterwards can be keys, with as many as needed to fill the string. Not enough or to many causing zero errors. |

**Example**  
```js
UTILS_COLLECTION.UnicornComposite("How is this for a {0}, I hope it {1}", "Test", "Works");
// Outputs: "How is this for a Test, I hope it Works."
```
<a name="UTILS_COLLECTION.GameLoad"></a>

### UTILS_COLLECTION.GameLoad()
Triggers all functions related to startup and initialization of the game.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Implements**: [<code>AnswerCheck</code>](#GAME_CONTROLLER.AnswerCheck), [<code>GameStatusCheck</code>](#GAME_CONTROLLER.GameStatusCheck), [<code>MediaFeatures</code>](#GAME_CONTROLLER.MediaFeatures), [<code>InsertRating</code>](#DOM_MANAGER.InsertRating), [<code>SetAudioSrc</code>](#AUDIO_MANAGER.SetAudioSrc), [<code>AudioController</code>](#AUDIO_MANAGER.AudioController)  
<a name="UTILS_COLLECTION.PageLoad"></a>

### UTILS_COLLECTION.PageLoad()
Triggers all functions related to startup and initialization of the DOM or Page.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Implements**: [<code>ThemeCheck</code>](#DOM_MANAGER.ThemeCheck), [<code>UpdateGuessesLeft</code>](#DOM_MANAGER.UpdateGuessesLeft), [<code>GlobalEventListeners</code>](#DOM_MANAGER.GlobalEventListeners), [<code>FirstTimeVisitor</code>](#UTILS_COLLECTION.FirstTimeVisitor)  
<a name="UTILS_COLLECTION.SearchResults"></a>

### UTILS_COLLECTION.SearchResults(results)
Will craft and append search results to the page.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Implements**: [<code>ClearSearchResults</code>](#DOM_MANAGER.ClearSearchResults), [<code>LOG</code>](#LOG)  

| Param | Type | Description |
| --- | --- | --- |
| results | <code>Array.&lt;string&gt;</code> | Array of strings, representing the search results. |

<a name="UTILS_COLLECTION.FirstTimeVisitor"></a>

### UTILS_COLLECTION.FirstTimeVisitor()
Will attempt to detect if this user has visited before. To choose weather or not they need to see instructions on launch.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Implements**: [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable), [<code>LOG</code>](#LOG), [<code>AboutBtn</code>](#BTN_COLLECTION.AboutBtn)  
<a name="UTILS_COLLECTION.FindPlatformViaNavigator"></a>

### UTILS_COLLECTION.FindPlatformViaNavigator() ⇒ <code>string</code>
Will attempt to determine what platform the user is on.
This only exists to fix and edge case bug occuring on iOS where the audio would fail to load properly.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Implements**: [<code>LOG</code>](#LOG)  
**Returns**: <code>string</code> - An Identifier of the platform the user is on. Currently possible returns: iOS, unkown  
<a name="UTILS_COLLECTION.CleanGuessInput"></a>

### UTILS_COLLECTION.CleanGuessInput(guess) ⇒ <code>string</code>
Cleans the users guess from search results. Since the search results contain extra data such as the year a movie was made
but the guess value does not, it was required to strip that data.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Returns**: <code>string</code> - The same value with the year data stripped.
  }  

| Param | Type | Description |
| --- | --- | --- |
| guess | <code>string</code> | The raw guess value, taken in from the search results. |

<a name="UTILS_COLLECTION.CraftShareText"></a>

### UTILS_COLLECTION.CraftShareText() ⇒ <code>string</code>
Creates text that can be shared to share the progress of your game board.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Returns**: <code>string</code> - The proper game board represented as emojis to be shared.  
<a name="UTILS_COLLECTION.CopyShareText"></a>

### UTILS_COLLECTION.CopyShareText()
A function that when called will copy the ShareText to the users clipboard and create a notification alerting of this action.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
**Implements**: [<code>LOG</code>](#LOG), [<code>Snackbar</code>](#DOM_MANAGER.Snackbar)  
<a name="UTILS_COLLECTION.Trouble"></a>

### UTILS_COLLECTION.Trouble()
Existed purely to allow a user to call it and receive troubleshooting data in the cli of browser dev tools.

**Kind**: static method of [<code>UTILS\_COLLECTION</code>](#UTILS_COLLECTION)  
<a name="BTN_COLLECTION"></a>

## BTN\_COLLECTION : <code>object</code>
Namespace to access features related to button clicks, or other events.

**Kind**: global namespace  

* [BTN_COLLECTION](#BTN_COLLECTION) : <code>object</code>
    * [.AboutBtn()](#BTN_COLLECTION.AboutBtn)
    * [.SettingsBtn()](#BTN_COLLECTION.SettingsBtn)
    * [.CheckAnswerViaBtn()](#BTN_COLLECTION.CheckAnswerViaBtn)
    * [.MediaSearchBtn()](#BTN_COLLECTION.MediaSearchBtn)
    * [.EnterTextEvent()](#BTN_COLLECTION.EnterTextEvent)
    * [.StatsBtn()](#BTN_COLLECTION.StatsBtn)

<a name="BTN_COLLECTION.AboutBtn"></a>

### BTN_COLLECTION.AboutBtn()
Exists to respond to the GlobalEventListener for the About Button.
Enabling the about_modal when called.

**Kind**: static method of [<code>BTN\_COLLECTION</code>](#BTN_COLLECTION)  
<a name="BTN_COLLECTION.SettingsBtn"></a>

### BTN_COLLECTION.SettingsBtn()
Exists to respond to the GlobalEventListener for the Settings Button.
Enabling the settings_modal when called.

**Kind**: static method of [<code>BTN\_COLLECTION</code>](#BTN_COLLECTION)  
<a name="BTN_COLLECTION.CheckAnswerViaBtn"></a>

### BTN_COLLECTION.CheckAnswerViaBtn()
Responds to the submit button on the game board.
When clicked will take the value in the user guess text box and pass it to the Game Controller Pass Answer
After linting it in the Utils Collection Clean Guess Input.

**Kind**: static method of [<code>BTN\_COLLECTION</code>](#BTN_COLLECTION)  
**Implements**: [<code>PassAnswer</code>](#GAME_CONTROLLER.PassAnswer), [<code>CleanGuessInput</code>](#UTILS_COLLECTION.CleanGuessInput)  
<a name="BTN_COLLECTION.MediaSearchBtn"></a>

### BTN_COLLECTION.MediaSearchBtn()
Is called during clicks or key presses into the user guess search text box.
Passing this information to the Quotle API /search along with the users value.
Afterwards then passing the results from the API to the search results builder.

**Kind**: static method of [<code>BTN\_COLLECTION</code>](#BTN_COLLECTION)  
**Implements**: [<code>SearchResults</code>](#UTILS_COLLECTION.SearchResults), [<code>LOG</code>](#LOG)  
<a name="BTN_COLLECTION.EnterTextEvent"></a>

### BTN_COLLECTION.EnterTextEvent()
Exists to respond to the user clicking on one of the search results. After an element is clicked, the search results
are cleared, since on mobile the submit button becomes covered by the search results.

**Kind**: static method of [<code>BTN\_COLLECTION</code>](#BTN_COLLECTION)  
**Implements**: [<code>CleanGuessInput</code>](#UTILS_COLLECTION.CleanGuessInput), [<code>ClearSearchResults</code>](#DOM_MANAGER.ClearSearchResults)  
<a name="BTN_COLLECTION.StatsBtn"></a>

### BTN_COLLECTION.StatsBtn()
Responds to the stats button being clicked. Once called it will access local storage to start building text to appear
in the stats modal. And then enabling the modal.

**Kind**: static method of [<code>BTN\_COLLECTION</code>](#BTN_COLLECTION)  
**Implements**: [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable)  
<a name="AUDIO_MANAGER"></a>

## AUDIO\_MANAGER : <code>object</code>
Namespace to access features related to audio playback.

**Kind**: global namespace  

* [AUDIO_MANAGER](#AUDIO_MANAGER) : <code>object</code>
    * [.SetAudioSrc()](#AUDIO_MANAGER.SetAudioSrc)
    * [.SetSpecificAudioSrc(event, req)](#AUDIO_MANAGER.SetSpecificAudioSrc)
    * [.SetSpecificAudioSrcNoClick(req)](#AUDIO_MANAGER.SetSpecificAudioSrcNoClick)
    * [.EnableRemainingAudio()](#AUDIO_MANAGER.EnableRemainingAudio)
    * [.AudioController()](#AUDIO_MANAGER.AudioController)

<a name="AUDIO_MANAGER.SetAudioSrc"></a>

### AUDIO_MANAGER.SetAudioSrc()
This will set the audio source of the play button depending on the global currentGuessNumber.

**Kind**: static method of [<code>AUDIO\_MANAGER</code>](#AUDIO_MANAGER)  
**Implements**: [<code>LOG</code>](#LOG)  
<a name="AUDIO_MANAGER.SetSpecificAudioSrc"></a>

### AUDIO_MANAGER.SetSpecificAudioSrc(event, req)
Will set the play button to a requested audio source.

**Kind**: static method of [<code>AUDIO\_MANAGER</code>](#AUDIO_MANAGER)  
**Implements**: [<code>LOG</code>](#LOG), [<code>AudioAlerts</code>](#GAME_CONTROLLER.AudioAlerts)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | An Event() Object, to allow us to check if the requested audio is coming from an on page audio index click, and if that requested audio is disabled. |
| req | <code>float</code> | The Index of the requested audio source from a 1 up count. |

<a name="AUDIO_MANAGER.SetSpecificAudioSrcNoClick"></a>

### AUDIO_MANAGER.SetSpecificAudioSrcNoClick(req)
Very closely mimics the functionality of AUDIO_MANAGER.SetSpecificAudioSrc but does without a click. And can be used to change
the audio source programaticly.

**Kind**: static method of [<code>AUDIO\_MANAGER</code>](#AUDIO_MANAGER)  
**Implements**: [<code>LOG</code>](#LOG)  

| Param | Type | Description |
| --- | --- | --- |
| req | <code>float</code> | The Index of the audio source, frrom a 1 up count. |

<a name="AUDIO_MANAGER.EnableRemainingAudio"></a>

### AUDIO_MANAGER.EnableRemainingAudio()
Enables all audio left in the game, starting at whatever the global currentGuessNumber is.

**Kind**: static method of [<code>AUDIO\_MANAGER</code>](#AUDIO_MANAGER)  
**Implements**: [<code>LOG</code>](#LOG)  
<a name="AUDIO_MANAGER.AudioController"></a>

### AUDIO_MANAGER.AudioController()
Starts the major audio controller. Responding to load events, and button clicks on the play button itself.

**Kind**: static method of [<code>AUDIO\_MANAGER</code>](#AUDIO_MANAGER)  
**Implements**: [<code>FindPlatformViaNavigator</code>](#UTILS_COLLECTION.FindPlatformViaNavigator), [<code>LOG</code>](#LOG)  
<a name="GAME_CONTROLLER"></a>

## GAME\_CONTROLLER : <code>object</code>
Namespace to access features related to the game board.

**Kind**: global namespace  

* [GAME_CONTROLLER](#GAME_CONTROLLER) : <code>object</code>
    * [.PassAnswer(guess)](#GAME_CONTROLLER.PassAnswer)
    * [.ValidateAnswer(guess, eleID)](#GAME_CONTROLLER.ValidateAnswer)
    * [.NextGuess()](#GAME_CONTROLLER.NextGuess)
    * [.AudioAlerts(num)](#GAME_CONTROLLER.AudioAlerts)
    * [.AddGuessToString(guess)](#GAME_CONTROLLER.AddGuessToString)
    * [.AnswerCheck()](#GAME_CONTROLLER.AnswerCheck)
    * [.RandomPlay()](#GAME_CONTROLLER.RandomPlay)
    * [.GenreCheck(guess, correct)](#GAME_CONTROLLER.GenreCheck) ⇒ <code>bool</code>
    * [.GameStatusCheck()](#GAME_CONTROLLER.GameStatusCheck)
    * [.MediaFeatures()](#GAME_CONTROLLER.MediaFeatures)

<a name="GAME_CONTROLLER.PassAnswer"></a>

### GAME_CONTROLLER.PassAnswer(guess)
Pass Answer handles taking a user guess, adding it to the guess history, clearing user guess text box, clearing search results.
then finally calling GAME_CONTROLLER.ValidateAnswer with the proper Element ID to then append the guess too.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>ClearSearchResults</code>](#DOM_MANAGER.ClearSearchResults), <code>GAME\_CONTROLLER.ClearSearchResults</code>, [<code>ValidateAnswer</code>](#GAME_CONTROLLER.ValidateAnswer), [<code>LOG</code>](#LOG)  

| Param | Type | Description |
| --- | --- | --- |
| guess | <code>string</code> | Raw text of the users guess. |

<a name="GAME_CONTROLLER.ValidateAnswer"></a>

### GAME_CONTROLLER.ValidateAnswer(guess, eleID)
Is the bulk of the Game Controller, using Quotle API's (/movie_match) to check the users guess data against the correct answer data.
Checking if they won, if they lost, got the director, genre, or both right. And calling required functions to make those changes, both in the
backend and frontend.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>LOG</code>](#LOG), [<code>DisplayGuessAnswer</code>](#DOM_MANAGER.DisplayGuessAnswer), [<code>SetWinnerData</code>](#STORAGE_HANDLER.SetWinnerData), [<code>SetLoserData</code>](#STORAGE_HANDLER.SetLoserData), [<code>SetProgressData</code>](#STORAGE_HANDLER.SetProgressData), [<code>NextGuess</code>](#GAME_CONTROLLER.NextGuess), [<code>EnableRemainingAudio</code>](#AUDIO_MANAGER.EnableRemainingAudio), [<code>WinnerModal</code>](#DOM_MANAGER.WinnerModal), [<code>LoserModal</code>](#DOM_MANAGER.LoserModal), [<code>Snackbar</code>](#DOM_MANAGER.Snackbar)  

| Param | Type | Description |
| --- | --- | --- |
| guess | <code>string</code> | Is the users raw guess text. |
| eleID | <code>string</code> | Is the element ID to make any modifications to, depending on this guess. |

<a name="GAME_CONTROLLER.NextGuess"></a>

### GAME_CONTROLLER.NextGuess()
Calls all functions needed to move to the next guess. After incremening the global currentGuessNumber

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>UpdateGuessesLeft</code>](#DOM_MANAGER.UpdateGuessesLeft), [<code>SetAudioSrc</code>](#AUDIO_MANAGER.SetAudioSrc), [<code>AudioAlerts</code>](#GAME_CONTROLLER.AudioAlerts)  
<a name="GAME_CONTROLLER.AudioAlerts"></a>

### GAME_CONTROLLER.AudioAlerts(num)
Handles the loading and checking for any Audio Alerts for the current audio source.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>Snackbar</code>](#DOM_MANAGER.Snackbar)  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>float</code> | Is the audio item to check for. Coutning 1+ |

<a name="GAME_CONTROLLER.AddGuessToString"></a>

### GAME_CONTROLLER.AddGuessToString(guess)
Super simplistic way of adding a guess to the global guessesStrings array.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  

| Param | Type | Description |
| --- | --- | --- |
| guess | <code>string</code> | The raw text of the users guess. |

<a name="GAME_CONTROLLER.AnswerCheck"></a>

### GAME_CONTROLLER.AnswerCheck()
Will check if a valid answer.js was served alongside this. And if it is invalid, its safe to assume it was inacccessible or more likely
doesn't exist, meaning the game for this gameID was never created. And so we will fallback to loading a random one, and notify the user of such.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>LOG</code>](#LOG), [<code>GameLoad</code>](#UTILS_COLLECTION.GameLoad), [<code>Snackbar</code>](#DOM_MANAGER.Snackbar)  
<a name="GAME_CONTROLLER.RandomPlay"></a>

### GAME_CONTROLLER.RandomPlay()
Used to initiate a random game load. Picking a random number from 1 - totalGameCount. And calling the Utils GameLoad functions.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>LOG</code>](#LOG), [<code>GameLoad</code>](#UTILS_COLLECTION.GameLoad), [<code>Snackbar</code>](#DOM_MANAGER.Snackbar)  
<a name="GAME_CONTROLLER.GenreCheck"></a>

### GAME_CONTROLLER.GenreCheck(guess, correct) ⇒ <code>bool</code>
Used to check if two arrays of genres, have ANY matches. Returning true if so, false otherwise.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  

| Param | Type | Description |
| --- | --- | --- |
| guess | <code>Object</code> | The Users guess Genre Array. |
| correct | <code>Object</code> | The Correct Answer Genre Array. |

<a name="GAME_CONTROLLER.GameStatusCheck"></a>

### GAME_CONTROLLER.GameStatusCheck()
Checks the status of the game. Useful to be called to recreate the game board, if a user left halfway through
and only has the progress local storage to go off of. Also is used to recreate after a return to a finished game.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>FindCurrentGame</code>](#STORAGE_HANDLER.FindCurrentGame), [<code>DisplayGuessAnswer</code>](#DOM_MANAGER.DisplayGuessAnswer), [<code>SetSpecificAudioSrcNoClick</code>](#AUDIO_MANAGER.SetSpecificAudioSrcNoClick), [<code>WinnerModal</code>](#DOM_MANAGER.WinnerModal), [<code>LoserModal</code>](#DOM_MANAGER.LoserModal), <code>DOM\_MANAGER.EnableRemainingAudio</code>  
<a name="GAME_CONTROLLER.MediaFeatures"></a>

### GAME_CONTROLLER.MediaFeatures()
Will log the available Media Features compatible for the current game.

**Kind**: static method of [<code>GAME\_CONTROLLER</code>](#GAME_CONTROLLER)  
**Implements**: [<code>LOG</code>](#LOG)  
<a name="STORAGE_HANDLER"></a>

## STORAGE\_HANDLER : <code>object</code>
Namespace to access features related to storage.

**Kind**: global namespace  

* [STORAGE_HANDLER](#STORAGE_HANDLER) : <code>object</code>
    * [.StorageAvailable()](#STORAGE_HANDLER.StorageAvailable)
    * [.GetItem(key)](#STORAGE_HANDLER.GetItem)
    * [.SetItem(key, value)](#STORAGE_HANDLER.SetItem)
    * [.GetTheme()](#STORAGE_HANDLER.GetTheme)
    * [.FindCurrentGame()](#STORAGE_HANDLER.FindCurrentGame) ⇒ <code>Object</code>
    * [.SetWinnerData()](#STORAGE_HANDLER.SetWinnerData)
    * [.SetLoserData()](#STORAGE_HANDLER.SetLoserData)
    * [.SetProgressData()](#STORAGE_HANDLER.SetProgressData)
    * [.UpdateStatsData()](#STORAGE_HANDLER.UpdateStatsData)
    * [.CleanLastGameData()](#STORAGE_HANDLER.CleanLastGameData)

<a name="STORAGE_HANDLER.StorageAvailable"></a>

### STORAGE_HANDLER.StorageAvailable()
Tests and checks if local storage is available. Returning true if so. False otherwise.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
<a name="STORAGE_HANDLER.GetItem"></a>

### STORAGE_HANDLER.GetItem(key)
Will get the item from local storage, after testing to ensure local storage is available.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the Local Storage Item to get. |

<a name="STORAGE_HANDLER.SetItem"></a>

### STORAGE_HANDLER.SetItem(key, value)
Will set the item to local storage after ensuring it is available.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>LOG</code>](#LOG)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The Key to set. |
| value | <code>Object</code> | The value to set as. Could be an Object, Array, String, etc. |

<a name="STORAGE_HANDLER.GetTheme"></a>

### STORAGE_HANDLER.GetTheme()
A simplified way of grabbing an item from local storage, where it grabs only the theme data. Then returning its value, or emtpy.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
<a name="STORAGE_HANDLER.FindCurrentGame"></a>

### STORAGE_HANDLER.FindCurrentGame() ⇒ <code>Object</code>
Will attempt to find if and the value of any cookies related to the current game being played.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>LOG</code>](#LOG), [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable)  
**Returns**: <code>Object</code> - Either the value of the key, unparsed. Or false if it fails or doesn't exist.  
<a name="STORAGE_HANDLER.SetWinnerData"></a>

### STORAGE_HANDLER.SetWinnerData()
Made to set the Winner data into local storage. This will take all needed game elements and put them into an object in local storage.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>UpdateStatsData</code>](#STORAGE_HANDLER.UpdateStatsData), [<code>CleanLastGameData</code>](#STORAGE_HANDLER.CleanLastGameData), [<code>LOG</code>](#LOG)  
<a name="STORAGE_HANDLER.SetLoserData"></a>

### STORAGE_HANDLER.SetLoserData()
Will set the Loser game data into local storage. Similar to Winner data.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>UpdateStatsData</code>](#STORAGE_HANDLER.UpdateStatsData), [<code>CleanLastGameData</code>](#STORAGE_HANDLER.CleanLastGameData), [<code>LOG</code>](#LOG)  
<a name="STORAGE_HANDLER.SetProgressData"></a>

### STORAGE_HANDLER.SetProgressData()
Will set the games progress into local storage.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable), [<code>LOG</code>](#LOG)  
<a name="STORAGE_HANDLER.UpdateStatsData"></a>

### STORAGE_HANDLER.UpdateStatsData()
Will update the last created or create a new Stats Local Storage Object, updating the data inside.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>LOG</code>](#LOG), [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable)  
<a name="STORAGE_HANDLER.CleanLastGameData"></a>

### STORAGE_HANDLER.CleanLastGameData()
Will remove any old games local storage data that exists, to avoid uneeded data sticking around.

**Kind**: static method of [<code>STORAGE\_HANDLER</code>](#STORAGE_HANDLER)  
**Implements**: [<code>StorageAvailable</code>](#STORAGE_HANDLER.StorageAvailable), [<code>LOG</code>](#LOG)  
<a name="LOG"></a>

## LOG : <code>object</code>
Namespace to access better logging controls.

**Kind**: global namespace  

* [LOG](#LOG) : <code>object</code>
    * [.DetermineKind(kind)](#LOG.DetermineKind) ⇒ <code>string</code>
    * [.Enabled()](#LOG.Enabled) ⇒ <code>bool</code>
    * [.Spoil()](#LOG.Spoil) ⇒ <code>bool</code>
    * [.Info(text, [kind])](#LOG.Info)
    * [.Warn(text, [kind])](#LOG.Warn)
    * [.Error(text, [kind])](#LOG.Error)
    * [.InfoSpoiler([kind], base, reps)](#LOG.InfoSpoiler)
    * [.Debug()](#LOG.Debug)

<a name="LOG.DetermineKind"></a>

### LOG.DetermineKind(kind) ⇒ <code>string</code>
Determines the kind of logs to append into the log text based on predefined values.

**Kind**: static method of [<code>LOG</code>](#LOG)  
**Returns**: <code>string</code> - Formatted string to append into the beggining of logs.  

| Param | Type | Description |
| --- | --- | --- |
| kind | <code>string</code> | Is the type of logs to find the right text for. Valid Values: audio, game, dom, store, or empty. Otherwise ignored. |

<a name="LOG.Enabled"></a>

### LOG.Enabled() ⇒ <code>bool</code>
Will check if the generic logs are enabled.

**Kind**: static method of [<code>LOG</code>](#LOG)  
**Returns**: <code>bool</code> - True if logging is enabled. False otherwise.  
<a name="LOG.Spoil"></a>

### LOG.Spoil() ⇒ <code>bool</code>
Determines if Spoiler Debug Logs are enabled.

**Kind**: static method of [<code>LOG</code>](#LOG)  
**Returns**: <code>bool</code> - True if they are, false otherwise.  
<a name="LOG.Info"></a>

### LOG.Info(text, [kind])
Info level logs.

**Kind**: static method of [<code>LOG</code>](#LOG)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | Is the raw text to log. |
| [kind] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Is the id of the caller. |

<a name="LOG.Warn"></a>

### LOG.Warn(text, [kind])
Warn Level Logs.

**Kind**: static method of [<code>LOG</code>](#LOG)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | Is the raw text to log. |
| [kind] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Is the id of the caller. |

<a name="LOG.Error"></a>

### LOG.Error(text, [kind])
Error Level Logs.

**Kind**: static method of [<code>LOG</code>](#LOG)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | Is the raw text to log. |
| [kind] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Is the id of the caller. |

<a name="LOG.InfoSpoiler"></a>

### LOG.InfoSpoiler([kind], base, reps)
This is able to take pseudo variadic rest parameters as Composite Format Item Replacements. And will pass
them along to UTILS_COLLECTION.UnicornComposite

**Kind**: static method of [<code>LOG</code>](#LOG)  
**Summary**: Info Level Logs, supporting spoiler protection.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [kind] | <code>string</code> | <code>&quot;\&quot;\&quot;&quot;</code> | Is the id of the caller. |
| base | <code>string</code> |  | The base string, with C# Composite String syntax. |
| reps | <code>Array.&lt;string&gt;</code> |  | Array of strings that will preform the replacements within the text. |

<a name="LOG.Debug"></a>

### LOG.Debug()
Made to help end users grab logs more easily. This will print any stored logs out to the console on call.

**Kind**: static method of [<code>LOG</code>](#LOG)  
