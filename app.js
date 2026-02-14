import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const languages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'languages.json'), 'utf-8')
);

app.get('/', (req, res) => {
  res.render('home', { title: 'Language Translator', languages });
});

app.post('/translate', async (req, res) => {
  const { text, fromLang, toLang } = req.body;

  try {
    const result = await translate(text, {
      from: fromLang === 'auto' ? 'auto' : fromLang,
      to: toLang
    });

    res.json({ translation: result.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
