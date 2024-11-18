import arg from "arg";
import * as fs from "node:fs";
import * as path from "node:path";
import puppeteer, { PaperFormat } from "puppeteer";
import pjson from "./package.json";

const VERSION = pjson.version;

const args = arg(
  {
    "--help": Boolean,
    "--version": Boolean,

    "--head": Boolean,
    "--paper": String,
    "--url": [String],
    "--wait": Number,
    "--output": String,
  },
  { permissive: false, argv: process.argv.slice(2) },
);

function printUsage() {
  console.log(`Usage: npm run start -- --url <page>`);
  console.log(`  --head     Run in head mode instead of headless`);
  console.log(`  --help     Show this help`);
  console.log(`  --output   The output directory to save the PDF`);
  console.log(`  --paper    The paper format to use, for example A4`);
  console.log(`  --url      The URL to open`);
  console.log(`  --version  Show version`);
  console.log(`  --wait     The seconds before taking the screenshot`);
}

if (args["--help"]) {
  printUsage();
  process.exit(0);
}

if (args["--version"]) {
  console.log(VERSION);
  process.exit(0);
}

const urls = args["--url"] || [];

if (urls.length === 0) {
  console.error("URL is required");
  printUsage();
  process.exit(1);
}

const wait = args["--wait"] || 3;
const output = args["--output"] || "output";

// use `npx puppeteer browsers install` to install the default  browser
export const browser = await puppeteer.launch({
  timeout: 0,
  headless: !args["--head"],
});

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  await new Promise((r) => setTimeout(r, wait * 1000));

  await page.emulateMediaType("screen");
  const data = await page.pdf({
    format: (args["--paper"] || "A4") as PaperFormat,
  });

  const filename = path.join(output, `${urls.indexOf(url) + 1}.pdf`);

  fs.writeFileSync(filename, data);

  console.log(`Saved ${filename} from ${url}`);

  await page.close({ runBeforeUnload: false });
}

await browser.close();
