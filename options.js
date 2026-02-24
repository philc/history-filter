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

async function clearMatchingHistory(patterns) {
  const items = await chrome.history.search({ text: "", maxResults: 1000000, startTime: 0 });
  const toDelete = items.filter((item) =>
    patterns.some((pattern) => item.url.includes(pattern))
  );
  await Promise.all(toDelete.map((item) => chrome.history.deleteUrl({ url: item.url })));
  return toDelete.length;
}

async function save() {
  const value = document.getElementById("patterns").value;
  const patterns = parsePatterns(value);
  await chrome.storage.sync.set({ patterns: value });
  if (patterns.length === 0) {
    showStatus("Saved.");
    return;
  }
  const count = await clearMatchingHistory(patterns);
  showStatus(
    count > 0
      ? `Saved. Cleared ${count} matching history entr${count === 1 ? "y" : "ies"}.`
      : "Saved.",
  );
}

async function init() {
  const data = await chrome.storage.sync.get("patterns");
  document.getElementById("patterns").value = data.patterns || "";

  document.getElementById("save").addEventListener("click", save);

  document.getElementById("patterns").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      save();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
