const puppeteer = require('puppeteer');

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
    let url = 'https://www.gutenberg.org/';
    let html = await Browser.load(url);
    const slogan = html.match(/id="slogan".*?>(.*?)</s);
    if (slogan && slogan[1]) {
      console.log(slogan[1].trim());
    }
  }
}

App.init();

