# Private History Filter

A browser extension which automatically removes a configurable set of URLs -- like ChatGPT requests
and Google searches -- to prevent them from showing up as suggestions in the URL bar.

I created this extension to avoid showing those sensitive URLs and page titles when presenting my
screen or when using my computer with another person.

## Installation

* Chrome:
  [Chrome Web Store](https://chromewebstore.google.com/detail/private-history-filter/jadcbfkcjohdeliffaigmgfkpnkmgfag)
* Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/private-history-filter/)

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

Saving your patterns also searches your entire existing history and deletes any entries that match.
This is useful when you first set up the extension and want to retroactively remove URLs that were
recorded before it was installed.
