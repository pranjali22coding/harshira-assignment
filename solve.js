// solve.js
// Hashira Assignment – Node.js solution
// Supports three input modes: (1) file path arg, (2) stdin, (3) built-in sample.

const fs = require('fs');

// Built‑in sample used only if no input is provided.
const SAMPLE = JSON.stringify({
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4",  "value": "213" }
}, null, 2);

// Read input in this order: file path argument -> stdin (if any) -> SAMPLE
function readInput() {
  const argPath = process.argv[18];
  if (argPath) {
    return fs.readFileSync(argPath, 'utf8'); // file path mode
  }
  // If data was piped into stdin, read it; otherwise return empty string.
  try {
    // Check if there is data available on stdin without blocking forever
    const stat = fs.fstatSync(0);
    if (stat.size > 0) {
      return fs.readFileSync(0, 'utf8'); // stdin mode
    }
  } catch (e) {
  }
  return SAMPLE; 
}

// Parse and validate the JSON
function parseCase(text) {
  let data;
  try { data = JSON.parse(text); }
  catch {
    console.error("Input is not valid JSON."); process.exit(1);
  }
  if (!data.keys || typeof data.keys.n !== 'number' || typeof data.keys.k !== 'number') {
    console.error("JSON must contain keys: { n, k }."); process.exit(1);
  }
  return data;
}


function toDec(baseStr, valueStr) {
  const base = parseInt(String(baseStr), 10);
  const out = parseInt(String(valueStr), base);
  if (!Number.isFinite(out) || Number.isNaN(out)) {
    throw new Error(`Invalid value "${valueStr}" for base ${base}`);
  }
  return out;
}

function extractRoots(obj) {
  const roots = [];
  for (const k of Object.keys(obj)) {
    if (k === 'keys') continue;
    const r = obj[k];
    if (r && typeof r === 'object' && 'base' in r && 'value' in r) {
      roots.push(toDec(r.base, r.value)); // explicit radix
    }
  }
  return roots;
}

function coefficientsFromRoots(roots) {
  // Work in ascending order for convolution, then reverse
  let poly = [1]; // P(x) = 1
  for (const r of roots) {
    const term = [-r, 1]; // (x - r), ascending
    const next = new Array(poly.length + term.length - 1).fill(0);
    for (let i = 0; i < poly.length; i++) {
      for (let j = 0; j < term.length; j++) {
        next[i + j] += poly[i] * term[j];
      }
    }
    poly = next;
  }
  return poly.slice().reverse();
}

// Main
(function main() {
  const raw = readInput();
  const data = parseCase(raw);
  const roots = extractRoots(data);

  const n = data.keys.n;
  const k = data.keys.k;
  const enough = roots.length >= k;

  const output = {
    parsed_roots_decimal: roots,
    n,
    k,
    enough_roots: enough,
    coefficients_desc: enough ? coefficientsFromRoots(roots) : null
  };

  console.log(JSON.stringify(output, null, 2));
})();