const fs = require('fs');
const path = require('path');

const map = {
  'a': 'ⴰ', 'b': 'ⴱ', 'c': 'ⵛ', 'd': 'ⴷ', 'ḍ': 'ⴹ',
  'e': 'ⴻ', 'f': 'ⴼ', 'g': 'ⴳ', 'h': 'ⵀ', 'ḥ': 'ⵃ',
  'i': 'ⵉ', 'j': 'ⵊ', 'k': 'ⴽ', 'l': 'ⵍ', 'm': 'ⵎ',
  'n': 'ⵏ', 'q': 'ⵇ', 'o': 'ⵓ', 'p': 'ⵒ', 'r': 'ⵔ',
  'ṛ': 'ⵕ', 's': 'ⵙ', 'ṣ': 'ⵚ', 't': 'ⵜ', 'ṭ': 'ⵟ',
  'u': 'ⵓ', 'w': 'ⵡ', 'x': 'ⵅ', 'y': 'ⵢ', 'z': 'ⵣ',
  'ẓ': 'ⵥ', 'ɣ': 'ⵖ', 'ɛ': 'ⵄ', 'ʷ': 'ⵯ',
  'A': 'ⴰ', 'B': 'ⴱ', 'C': 'ⵛ', 'D': 'ⴷ', 'Ḍ': 'ⴹ',
  'E': 'ⴻ', 'F': 'ⴼ', 'G': 'ⴳ', 'H': 'ⵀ', 'Ḥ': 'ⵃ',
  'I': 'ⵉ', 'J': 'ⵊ', 'K': 'ⴽ', 'L': 'ⵍ', 'M': 'ⵎ',
  'N': 'ⵏ', 'Q': 'ⵇ', 'O': 'ⵓ', 'P': 'ⵒ', 'R': 'ⵔ',
  'Ṛ': 'ⵕ', 'S': 'ⵙ', 'Ṣ': 'ⵚ', 'T': 'ⵜ', 'Ṭ': 'ⵟ',
  'U': 'ⵓ', 'W': 'ⵡ', 'X': 'ⵅ', 'Y': 'ⵢ', 'Z': 'ⵣ',
  'Ẓ': 'ⵥ', 'Ɣ': 'ⵖ', 'Ɛ': 'ⵄ'
};

function transliterate(text) {
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    res += map[char] || char;
  }
  return res;
}

const filesToProcess = [
  path.join(__dirname, 'js', 'i18n', 'zgh.js'),
  path.join(__dirname, 'js', 'seed_new_data.js'),
  path.join(__dirname, 'seed_pc_words.html')
];

filesToProcess.forEach(filepath => {
  if (!fs.existsSync(filepath)) return;
  console.log(`Processing ${filepath}...`);
  let content = fs.readFileSync(filepath, 'utf8');

  // Regex for i18n files: 'key': 'value'
  if (filepath.endsWith('zgh.js')) {
    content = content.replace(/'([^']+)'\s*:\s*'([^']+)'/g, (match, key, val) => {
      if (key.includes('cat.')) return match; // Keep category keys as is
      return `'${key}': '${transliterate(val)}'`;
    });
  } else {
    // For seed data: look for zgh: { word: '...', definition: '...' }
    content = content.replace(/zgh\s*:\s*{\s*word\s*:\s*'([^']+)',\s*definition\s*:\s*'([^']+)'\s*}/g, (match, word, def) => {
      return `zgh: { word: '${transliterate(word)}', definition: '${transliterate(def)}' }`;
    });
    // Also handle slightly different formatting if any
    content = content.replace(/zgh\s*:\s*{\s*word\s*:\s*"([^"]+)",\s*definition\s*:\s*"([^"]+)"\s*}/g, (match, word, def) => {
      return `zgh: { word: "${transliterate(word)}", definition: "${transliterate(def)}" }`;
    });
  }

  fs.writeFileSync(filepath, content, 'utf8');
});

console.log('✅ All Amazigh text has been transliterated to Tifinagh.');

