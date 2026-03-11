const { JSDOM } = require('jsdom');
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

class LocalLLM {
  static config = {
    api_endpoint: "http://127.0.0.1:11434",
    model: "gemma3:latest",
    thinking_mode: false
  };

  static async sendPrompt(prompt) {
    const response = await fetch(`${this.config.api_endpoint}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: prompt,
        stream: false
      })
    });
    const data = await response.json();
    return data.response;
  }
}

class Tool {
  static async getProjectGutenbergNewReleasesInfo() {
    const url = "https://www.gutenberg.org/";
    const html = await Browser.load(url);
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const links = document.querySelectorAll('div.lib.latest.no-select a');
    let urls = [];

    for (const link of links) {
      const href = link.getAttribute('href');
      if (href) {
        const bookIDMatch = href.match(/ebooks\/(\d+)/);
        if (bookIDMatch) {
          const bookID = parseInt(bookIDMatch[1]);
          const book_url = `https://www.gutenberg.org/cache/epub/${bookID}/pg${bookID}.txt`;
          urls.push(book_url);
        }
      }
    }

    const even_urls = urls.filter(url => {
      const match = url.match(/pg(\d+)\.txt/);
      if (match) {
        const bookID = parseInt(match[1]);
        return bookID % 2 === 0;
      }
      return false;
    });

    console.log(even_urls);
  }
}

Tool.getProjectGutenbergNewReleasesInfo();

