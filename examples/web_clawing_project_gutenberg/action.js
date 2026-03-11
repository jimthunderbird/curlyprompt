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

    const evenUrls = [];

    for (const link of links) {
      const href = link.href;
      const match = href.match(/ebooks\/(\d+)/);
      if (match) {
        const bookID = parseInt(match[1]);
        if (bookID % 2 === 0) {
          const bookUrl = `https://www.gutenberg.org/cache/epub/${bookID}/pg${bookID}.txt`;
          evenUrls.push(bookUrl);

          const bookContentResponse = await fetch(bookUrl);
          const bookContent = await bookContentResponse.text();
          const words = bookContent.split(/\s+/).slice(0, 120).join(' ');
          const prompt = `please extract the title and author of the book based on <content>${words}</content>, no explanation, no extra words`;
          let result = await LocalLLM.sendPrompt(prompt);
          result = result.replace(/\*/g, '');
          const presentation = `
---------------------------
URL: ${bookUrl} 
${result}
---------------------------
`;
          console.log(presentation);
        }
      }
    }

    console.log('Even URLs:', evenUrls);
  }
}

Tool.getProjectGutenbergNewReleasesInfo();

