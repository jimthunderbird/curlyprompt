const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');

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
  static getProjectGutenbergNewReleasesInfo() {
    const url = "https://www.gutenberg.org/";
    const html = Browser.load(url);
    html.then(htmlContent => {
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      const links = document.querySelectorAll('div.lib.latest.no-select a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const match = href.match(/ebooks\/(\d+)/);
        if (match) {
          const bookID = match[1];
          if (parseInt(bookID) % 2 === 1) {
            const book_url = `https://www.gutenberg.org/cache/epub/${bookID}/pg${bookID}.txt`;
            fetch(book_url)
              .then(response => response.text())
              .then(bookContent => {
                const firstChunk = bookContent.split(/\s+/).slice(0, 120).join(' ');
                const prompt = `please extract the title and author of the book based on <content>${firstChunk}</content>, no explanation, no extra words`;
                LocalLLM.sendPrompt(prompt).then(result => {
                  result = result.replace(/\*/g, '');
                  const presentation = `
---------------------------
URL: ${book_url} 
${result}
---------------------------
`;
                  console.log(presentation);
                });
              });
          }
        }
      });
    });
  }
}

Tool.getProjectGutenbergNewReleasesInfo();

