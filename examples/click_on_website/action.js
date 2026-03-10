const puppeteer = require('puppeteer');

class App {
  static init() {
    let url = "https://api-platform.com";
    Browser.load(url);
  }
}

class Browser {
  static async load(url) {
    // Launch the browser and open a new blank page.
    const browser = await puppeteer.launch({
      // Use 'chrome' or 'msedge' (on Windows) to find your local install automatically
      channel: 'chrome', 
      headless: true
    });
    const page = await browser.newPage();
    // Navigate the page to a URL.
    await page.goto(url, { waitUntil: 'networkidle0' });
    const html = await page.content();
    await browser.close();
    console.log(html);
  }
}

App.init();

