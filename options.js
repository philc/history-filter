function parsePatterns(text) {
  return (text || "").split("\n").map((p) => p.trim()).filter((p) => p.length > 0);
}

function showStatus(message, duration = 2500) {
  const status = document.getElementById("status");
  status.textContent = message;
  setTimeout(() => {
    status.textContent = "";
  }, duration);
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("patterns", (data) => {
    document.getElementById("patterns").value = data.patterns || "";
  });

  function clearMatchingHistory(patterns, onDone) {
    chrome.history.search({ text: "", maxResults: 1000000, startTime: 0 }, (items) => {
      const toDelete = items.filter((item) =>
        patterns.some((pattern) => item.url.includes(pattern))
      );
      if (toDelete.length === 0) {
        onDone(0);
        return;
      }
      let remaining = toDelete.length;
      toDelete.forEach((item) => {
        chrome.history.deleteUrl({ url: item.url }, () => {
          remaining--;
          if (remaining === 0) onDone(toDelete.length);
        });
      });
    });
  }

  function save() {
    const value = document.getElementById("patterns").value;
    const patterns = parsePatterns(value);
    chrome.storage.sync.set({ patterns: value }, () => {
      if (patterns.length === 0) {
        showStatus("Saved.");
        return;
      }
      clearMatchingHistory(patterns, (count) => {
        showStatus(
          count > 0
            ? `Saved. Cleared ${count} matching history entr${count === 1 ? "y" : "ies"}.`
            : "Saved.",
        );
      });
    });
  }

  document.getElementById("save").addEventListener("click", save);

  document.getElementById("patterns").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      save();
    }
  });
});
