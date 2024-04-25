const crypto = require('crypto');
const fs = require('fs');
const { execSync } = require('child_process');
const { chromium } = require('playwright');

/**
 * @returns {void}
 */
function printHelp() {
  console.log('Usage: node index.js [filename] [URL 1] [URL 2] ...');
}

/**
 * @param {string} text
 * @returns {string}
 */
function shasum256(text) {
  const hash = crypto.createHash('sha256');
  hash.update(text);
  return hash.digest('hex');
}

const outputFilename = process.argv[2];

let delay = 1000;
let args = process.argv.slice(3);
let URLs = [];

// extract args
for (const arg of args) {
  if (arg.startsWith('--delay=')) {
    delay = parseInt(arg.split('=')[1]) || delay;
    continue;
  }
  URLs.push(arg);
}

if (!outputFilename || !URLs.length) {
  printHelp();
  process.exit(1);
}

console.log('Output filename:', outputFilename);
console.log('Rendering delay:', delay, 'ms');
console.log('URLs:', URLs);

(async () => {
  const finalFilename = outputFilename.replace(/"/g, '');
  const files = [];

  const browser = await chromium.launch();
  const context = await browser.newContext();
  try {
    for (const URL of URLs) {
      const pageFilename = `output/${shasum256(URL)}.pdf`;
      files.push(pageFilename);

      const page = await context.newPage();
      await new Promise(r => {
        page.goto(URL);
        page.once('load', async () => {
          await new Promise(res => setTimeout(res, delay));
          await page.emulateMedia({ media: 'screen' });
          await page.pdf({ path: pageFilename, format: 'A4', printBackground: true });
          console.log('Writing', URL, 'into', pageFilename);
          await page.close();
          r();
        });
      });
    }
    await browser.close();

    if (files.length > 1) {
      execSync(`pdfunite ${[...files, finalFilename].map(i => `"${i}"`).join(' ')}`);
    } else {
      fs.copyFileSync(files[0], finalFilename);
    }
  } finally {
    files.forEach(file => fs.unlinkSync(file));
  }
})();
