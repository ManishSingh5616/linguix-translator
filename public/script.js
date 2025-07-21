// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

function swapLanguages() {
  const from = document.getElementById('fromLang');
  const to = document.getElementById('toLang');
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
}

async function copyText() {
  const output = document.getElementById('outputText');
  try {
    await navigator.clipboard.writeText(output.value);
    alert('Copied to clipboard!');
  } catch (err) {
    alert('Failed to copy text.');
  }
}

document.getElementById('translateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('inputText').value.trim();
  const fromLang = document.getElementById('fromLang').value;
  const toLang = document.getElementById('toLang').value;

  if (!text) {
    alert("Please enter some text to translate.");
    return;
  }

  const response = await fetch('/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, fromLang, toLang }),
  });

  const data = await response.json();
  document.getElementById('outputText').value = data.translation || 'Translation failed.';
});

// Speech to text
function startVoiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = document.getElementById('fromLang').value || 'en';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onstart = () => {
    console.log("Voice recognition started...");
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
  };

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    document.getElementById('inputText').value = spokenText;
  };
}
