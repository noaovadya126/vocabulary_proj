import fs from 'fs';
import https from 'https';

const CHUNK_URL = 'https://hard-korean-app.vercel.app/_next/static/chunks/0tw6x~lq-h80r.js';
const OUT_JSON = 'scripts/hard-korean-vocab.json';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractJsonParseBlocks(source) {
  const blocks = [];
  const marker = 'JSON.parse(';
  let i = 0;
  while (true) {
    const start = source.indexOf(marker, i);
    if (start === -1) break;
    let p = start + marker.length;
    const quote = source[p];
    if (quote !== "'" && quote !== '"') {
      i = start + 1;
      continue;
    }
    p += 1;
    let escaped = false;
    let buf = '';
    while (p < source.length) {
      const ch = source[p];
      if (escaped) {
        buf += ch;
        escaped = false;
      } else if (ch === '\\') {
        buf += ch;
        escaped = true;
      } else if (ch === quote) {
        p += 1;
        break;
      } else {
        buf += ch;
      }
      p += 1;
    }
    try {
      const parsed = JSON.parse(buf.replace(/\\'/g, "'"));
      blocks.push(parsed);
    } catch {
      // skip invalid
    }
    i = p;
  }
  return blocks;
}

const localPath = process.env.HK_CHUNK || `${process.env.TEMP || '/tmp'}/hk-chunk.js`;
let source;
if (fs.existsSync(localPath)) {
  source = fs.readFileSync(localPath, 'utf8');
  console.log('Using cached chunk:', localPath, source.length);
} else {
  console.log('Downloading chunk...');
  source = await fetch(CHUNK_URL);
  fs.writeFileSync(localPath, source);
}

const blocks = extractJsonParseBlocks(source);
console.log('JSON.parse blocks found:', blocks.length);

const vocab = blocks.find(
  (b) => Array.isArray(b) && b.length > 100 && b[0]?.word && b[0]?.meaning
);
if (!vocab) {
  for (const b of blocks) {
    if (Array.isArray(b) && b.length > 50) {
      console.log('Array sample keys:', Object.keys(b[0] || {}), 'len', b.length);
    }
  }
  throw new Error('Vocabulary array not found in chunk');
}

fs.writeFileSync(OUT_JSON, JSON.stringify(vocab, null, 2));
console.log('Saved', vocab.length, 'words to', OUT_JSON);
console.log('Sample:', vocab[0]);
