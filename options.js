function parsePatterns(text) {
  return (text || '').split('\n').map((p) => p.trim()).filter((p) => p.length > 0);
}

function showStatus(message, duration = 2500) {
  const status = document.getElementById('status');
  status.textContent = message;
  setTimeout(() => { status.textContent = ''; }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('patterns', (data) => {
    document.getElementById('patterns').value = data.patterns || '';
  });

  function save() {
    const value = document.getElementById('patterns').value;
    chrome.storage.sync.set({ patterns: value }, () => {
      showStatus('Saved.');
    });
  }

  document.getElementById('save').addEventListener('click', save);

  document.getElementById('patterns').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      save();
    }
  });

  document.getElementById('clearHistory').addEventListener('click', () => {
    const patterns = parsePatterns(document.getElementById('patterns').value);
    if (patterns.length === 0) {
      showStatus('No patterns to match against.');
      return;
    }

    chrome.history.search({ text: '', maxResults: 1000000, startTime: 0 }, (items) => {
      const toDelete = items.filter((item) =>
        patterns.some((pattern) => item.url.includes(pattern))
      );

      if (toDelete.length === 0) {
        showStatus('No matching history entries found.');
        return;
      }

      let remaining = toDelete.length;
      toDelete.forEach((item) => {
        chrome.history.deleteUrl({ url: item.url }, () => {
          remaining--;
          if (remaining === 0) {
            showStatus(`Cleared ${toDelete.length} matching history entr${toDelete.length === 1 ? 'y' : 'ies'}.`);
          }
        });
      });
    });
  });
});
