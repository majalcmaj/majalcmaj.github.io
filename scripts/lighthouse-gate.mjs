import { spawn } from 'node:child_process';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright-core';

const PAGES = ['index.html', 'godziny.html', 'oferta.html', 'galeria.html', 'kontakt.html'];
const BASE_URL = 'http://localhost:4173';
const MIN_SCORE = 0.95;

async function isUp() {
  try {
    await fetch(BASE_URL, { signal: AbortSignal.timeout(500) });
    return true;
  } catch {
    return false;
  }
}

// Mirrors playwright.config.js's reuseExistingServer convention: reuse a
// server already on :4173 if one is up, otherwise start (and later stop) one.
async function ensureServer() {
  if (await isUp()) return null;

  const proc = spawn('npx', ['serve', '-l', '4173', '.'], { stdio: 'ignore' });
  for (let i = 0; i < 30; i++) {
    if (await isUp()) return proc;
    await new Promise((r) => setTimeout(r, 300));
  }
  proc.kill();
  throw new Error('server did not start in time');
}

// Lighthouse's automated SEO category audits "canonical" and "robots-txt" as
// notApplicable (not a fail) when absent, and never check Open Graph/JSON-LD
// at all — so the score alone can't gate the essentials this phase requires.
// Assert their presence directly against the served HTML/files instead.
async function checkPageEssentials(page) {
  const res = await fetch(`${BASE_URL}/${page}`);
  const html = await res.text();
  const problems = [];

  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) problems.push('missing <link rel="canonical">');
  if (!/<meta[^>]+property=["']og:title["']/i.test(html)) problems.push('missing og:title');
  if (!/<meta[^>]+property=["']og:description["']/i.test(html)) problems.push('missing og:description');
  if (!/<meta[^>]+property=["']og:type["']/i.test(html)) problems.push('missing og:type');
  if (!/<meta[^>]+property=["']og:image["']/i.test(html)) problems.push('missing og:image');
  if (!/<meta[^>]+name=["']robots["'][^>]+content=["']index,\s*follow["']/i.test(html)) {
    problems.push('missing <meta name="robots" content="index,follow">');
  }

  return problems;
}

async function checkStructuredData() {
  const res = await fetch(`${BASE_URL}/index.html`);
  const html = await res.text();
  const match = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return ['index.html missing application/ld+json script'];
  try {
    const data = JSON.parse(match[1]);
    const type = data['@type'];
    if (type !== 'Dentist' && type !== 'LocalBusiness') {
      return [`structured data @type is "${type}", expected Dentist or LocalBusiness`];
    }
  } catch (e) {
    return [`structured data is not valid JSON: ${e.message}`];
  }
  return [];
}

async function checkCrawlerFiles() {
  const problems = [];
  for (const file of ['robots.txt', 'sitemap.xml']) {
    const res = await fetch(`${BASE_URL}/${file}`);
    if (!res.ok) problems.push(`${file} returned ${res.status}`);
  }
  return problems;
}

async function runLighthouseScores() {
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox'],
  });

  const failures = [];
  try {
    for (const page of PAGES) {
      const url = `${BASE_URL}/${page}`;
      const result = await lighthouse(url, {
        port: chrome.port,
        onlyCategories: ['seo'],
        output: 'json',
      });
      const { score } = result.lhr.categories.seo;
      const pct = Math.round(score * 100);
      const pass = score >= MIN_SCORE;
      console.log(`${pass ? 'PASS' : 'FAIL'} ${page}: Lighthouse SEO ${pct}`);
      if (!pass) failures.push(`${page}: Lighthouse SEO score ${pct} < 95`);
    }
  } finally {
    await chrome.kill();
  }
  return failures;
}

async function main() {
  const server = await ensureServer();
  try {
    const failures = [...(await runLighthouseScores())];

    for (const page of PAGES) {
      const problems = await checkPageEssentials(page);
      const pass = problems.length === 0;
      console.log(`${pass ? 'PASS' : 'FAIL'} ${page}: canonical/OG/robots-meta`);
      for (const p of problems) console.log(`  - ${p}`);
      failures.push(...problems.map((p) => `${page}: ${p}`));
    }

    const structuredDataProblems = await checkStructuredData();
    console.log(`${structuredDataProblems.length === 0 ? 'PASS' : 'FAIL'} structured data`);
    for (const p of structuredDataProblems) console.log(`  - ${p}`);
    failures.push(...structuredDataProblems);

    const crawlerFileProblems = await checkCrawlerFiles();
    console.log(`${crawlerFileProblems.length === 0 ? 'PASS' : 'FAIL'} robots.txt/sitemap.xml`);
    for (const p of crawlerFileProblems) console.log(`  - ${p}`);
    failures.push(...crawlerFileProblems);

    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    if (server) server.kill();
  }
}

main();
