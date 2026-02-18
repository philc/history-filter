let blockedPatterns = [];

function parsePatterns(text) {
  return (text || "").split("\n").map((p) => p.trim()).filter((p) => p.length > 0);
}

function isBlocked(url) {
  return blockedPatterns.some((pattern) => url.includes(pattern));
}

chrome.storage.sync.get("patterns", (data) => {
  blockedPatterns = parsePatterns(data.patterns);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.patterns) {
    blockedPatterns = parsePatterns(changes.patterns.newValue);
  }
});

chrome.history.onVisited.addListener((historyItem) => {
  if (isBlocked(historyItem.url)) {
    chrome.history.deleteUrl({ url: historyItem.url });
  }
});
