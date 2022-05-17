## Workflow to create Quotes

The following describes the process for creating each game.

1. Choose a film to use.
2. With the file chosen download a subtitle file from any source, I use [opensubtitles.org](https://www.opensubtitles.org/en/search/subs).
3. From here search online for the most memorable quotes from the film, and choose your 6 quotes, organizing them from the hardest to place to easiest to place.
4. Finally its time to extract the quotes.

To extract the quotes you'll need to setup your environment. For this I have a few things, (keep in mind this is on Linux and may need to be changed for your needs.)

- ffmpeg Installed on the system.
- A local copy of the film you have chosen.
- Having already completed the above steps.
- Have the two scripts used from here on out.
  * [quotle.sh](https://github.com/confused-Techie/Quotle/blob/main/docs/quotle.sh)
  * [cleanup.sh](https://github.com/confused-Techie/Quotle/blob/main/docs/cleanup.sh)

With everything setup I then Control-F the Subtitles (.srt) file for the quotes I want to find. This can tell you roughly where your quote is.

For example:
````
1
00:01:35,245 --> 00:01:37,163
Time to get up, man.
````

Here we can then scroll to 1 minute and 35 seconds of our movie and watch for the quote we are looking for. Its common for subtitles to not appear at the exact moment the audio plays, so you will need to account for this.
Then grab the time before the quote starts. I usually choose 1 second before the audio begins.

So keeping with the previous example, lets say a second before the audio begins is:
`00:01:32`

I then will watch through the clip until the audio quote is completed. Again likely will not match the original SRT file. From here take the amount of time in seconds between the start point and end point, lets say `12` seconds.

We can then plug this into the script used to create the files as the appropriate quote.

````
TIME_STAMP[0]="00:01:32"
TIME_STOP[0]="12"
````

We have now completed the first quote. And we will need to go through the rest of the quotes we have until this is done.

Finally change the `SOURCE_DIR` and `SOURCE_FILE` to match where your film's local copy is stored.

And run the script with `./quotle.sh`

In the same directory as `quotle.sh` will leave you with every audio file, and the meta.txt file created. From here the answer.js file will need to be created by hand, but you have no completed a game.

After the game is uploaded, you can run `./cleanup.sh` to remove all files or they can be saved somewhere if needed.
