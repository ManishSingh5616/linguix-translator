import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load languages from JSON
const languages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'languages.json'), 'utf-8')
);

// Home route
app.get('/', (req, res) => {
  res.render('home', { title: 'Language Translator', languages });
});

// Translate route using LibreTranslate
// Translate route using Lingva API
app.post('/translate', async (req, res) => {
  const { text, fromLang, toLang } = req.body;

  const encodedText = encodeURIComponent(text);
  const apiUrl = `https://lingva.ml/api/v1/${fromLang}/${toLang}/${encodedText}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    res.json({ translation: data.translation });
  } catch (err) {
    console.error('Error translating:', err.message);
    res.status(500).json({ error: 'Translation failed.' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
