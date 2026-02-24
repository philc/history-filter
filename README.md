# Private History Filter

A Chrome extension that automatically removes a configurable set of URLs from the browser's history
as pages are visited.

## What it does

When navigating to a URL, if it matches one of the configured patterns, the extension deletes it
from the browser's history.

I created this so that Chrome's Omnibox (the URL bar) doesn't show suggestions which reveal past
searches or chatGPT session prompts.

## Installation

1. [Download or clone this repository](https://github.com/philc/private-history-filter/archive/refs/heads/main.zip)
   and unzip it
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** using the toggle in the top-right corner
4. Click **Load unpacked** and select the folder containing the extension files
5. Private History Filter is now active

To update after pulling new changes, go back to `chrome://extensions` and click the refresh icon on
the extension card.

## Configuration

Open the settings page by right-clicking the extension icon and choosing **Options**, or by going to
`chrome://extensions`, clicking **Details** on Private History Filter, and selecting **Extension options**.

Enter one URL pattern per line. A pattern matches any URL that contains it as a substring. E.g.:

```
chatgpt.com/?q=
google.com/search
```

![Screenshot](https://github.com/user-attachments/assets/60bb21dc-1991-4405-97ef-087d81e6b45b)

### Clear past history

The **Clear all matching history** button searches your entire existing history and deletes any
entries that match your current patterns. This is useful when you first set up the extension and
want to retroactively remove URLs that were recorded before it was installed.
