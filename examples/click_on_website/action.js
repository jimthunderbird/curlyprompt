const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class Browser {
  static async load(url) {
    const browser = await puppeteer.launch({
      channel: 'chrome', 
      headless: true
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const html = await page.content();
    await browser.close();
    return html;
  }
}

class App {
  static async init() {
    let url = "https://www.gutenberg.org/";
    let html = await Browser.load(url);
    let dom = new JSDOM(html);
    let document = dom.window.document;
    let links = document.querySelectorAll('div.lib.latest.no-select a');
    links.forEach(link => {
      console.log(link.href);
    });
  }
}

App.init();

