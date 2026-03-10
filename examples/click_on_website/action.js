const puppeteer = require('puppeteer');

class App {
  static init() {
    let url = "https://api-platform.com";
    Browser.load(url);
  }
}

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
    
    // Extract text from p elements with class "text-text-secondary"
    const extractedText = html.match(/<p[^>]*class="[^"]*text-text-secondary[^"]*"[^>]*>(.*?)<\/p>/gi);
    if (extractedText && extractedText.length > 0) {
      console.log(extractedText[0].replace(/<[^>]*>/g, ''));
    }
  }
}

App.init();

