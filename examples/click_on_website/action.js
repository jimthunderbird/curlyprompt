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
    let url = "https://api-platform.com";
    let html = await Browser.load(url);
    
    // Extract the value of {html}.p.class:"text-text-secondary"
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html);
    
    const extractedValue = await page.evaluate(() => {
      const elements = document.querySelectorAll('p.text-text-secondary');
      return Array.from(elements).map(el => el.textContent.trim());
    });
    
    await browser.close();
    return extractedValue;
  }
}

App.init().then(result => console.log(result));

