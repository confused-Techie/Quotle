# Troubleshooting

If Quotle is giving you a problem, it can be helpful to gather additional data before submitting an issue or here or sending an email.

To open the built in tool to help you gather this data you'll need to open the console in your browsers developer tools, or Inspect Element tool.

Once open type the following and hit enter:
````
UTILS_COLLECTION.Trouble();
````

This dialog will print the commands for several options to help troubleshooting.

## Print Media Features:

This can be used if a Media Feature isn't working as expected. Or will help determine if some experience is expected.

* Alerts: This are the notifications that appear on the bottom of the page, to warn of a loud audio clip or an audio clip containing violence.
* Rating: Allows the rating of the film to appear below the play Icon of Quotle.

## Debug

This will print all previous logs that are available.

Before running they must be enabled, since its disabled by default.

To enable the generic logs run:
````
game_debug = true;
````

To enable the Guess Check logs run:
````
debug_spoiler = true;
````

Keep in mind that if you enable `debug_spoiler` this will spoil the game showing the checks against the answer to the guess.

After enabling you needed logs run the following to print them to the console:
````
LOG.Debug();
````

After you get your logs, then you can copy all the text that appears and submit it with the issue unedited.
