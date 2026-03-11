const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

class App {
  static init() {
    Tool.getProjectGutenbergNewReleasesInfo();
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
    return html;
  }
}

class Tool {
  static async getProjectGutenbergNewReleasesInfo() {
    let url = "https://www.gutenberg.org/";
    let html = await Browser.load(url);
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const links = document.querySelectorAll('div.lib.latest.no-select a');

    for (let link of links) {
      let href = link.href;
      let bookIDMatch = href.match(/ebooks\/(\d+)/);
      if (!bookIDMatch) continue;
      let bookID = bookIDMatch[1];
      let book_url = `https://www.gutenberg.org/cache/epub/${bookID}/pg${bookID}.txt`;

      try {
        const response = await fetch(book_url);
        let bookContent = await response.text();
        let firstChunk = bookContent.split(/\s+/).slice(0, 120).join(' ');

        const titleMatch = bookContent.match(/Title:\s*(.+)/i);
        const authorMatch = bookContent.match(/Author:\s*(.+)/i);

        let title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';
        let author = authorMatch ? authorMatch[1].trim() : 'Unknown Author';

        console.log(JSON.stringify({
          id: bookID,
          title: title,
          author: author
        }));
      } catch (error) {
        console.error(`Failed to fetch book ${bookID}:`, error.message);
      }
    }
  }
}

App.init();

