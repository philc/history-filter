# History Filter

A Chrome extension that automatically removes matching URLs from the browser history as pages are
visited.

## What it does

When navigating to a URL, if it matches one of the configured patterns, the extension deletes it
from the browser history.

I created this so that Chrome's Omnibox UI doesn't leak/expose sensitive prompts, e.g. past searches
given to chatGPT or Google Search.

## Installation

1. [Download or clone this repository](https://github.com/your-username/history-filter/archive/refs/heads/main.zip)
   and unzip it
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** using the toggle in the top-right corner
4. Click **Load unpacked** and select the folder containing the extension files
5. History Filter is now active

To update after pulling new changes, go back to `chrome://extensions` and click the refresh icon on
the extension card.

## Configuration

Open the settings page by right-clicking the extension icon and choosing **Options**, or by going to
`chrome://extensions`, clicking **Details** on History Filter, and selecting **Extension options**.

Enter one URL pattern per line. A pattern matches any URL that contains it as a substring. E.g.:

```
chatgpt.com/?q=
google.com/search
```

### Clear past history

The **Clear all matching history** button searches your entire existing history and deletes any
entries that match your current patterns. This is useful when you first set up the extension and
want to retroactively remove URLs that were recorded before it was installed.
