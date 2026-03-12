const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(promptContent) {
    const lines = promptContent.split('\n');
    const skill = {};
    let contentStack = [];
    let currentSection = null;
    let currentContent = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.startsWith('skill {')) {
        continue;
      } else if (line.startsWith('}')) {
        if (contentStack.length > 0) {
          contentStack.pop();
        }
        continue;
      } else if (line.includes(':')) {
        const [key, value] = line.split(':', 2);
        const k = key.trim();
        const v = value.trim().replace(/^{/, '').replace(/}$/, '').trim();

        if (k === 'content') {
          currentSection = 'content';
          skill[k] = {};
          contentStack.push(skill[k]);
        } else if (k === 'h1' || k === 'h2' || k === 'h3') {
          const section = contentStack[contentStack.length - 1];
          if (section) {
            section[k] = { text: v };
            currentContent = section[k];
          }
        } else if (k === 'p') {
          if (currentContent) {
            currentContent.p = v;
          }
        } else if (k === 'ul') {
          if (currentContent) {
            currentContent.ul = [];
          }
        } else if (k === 'li') {
          if (currentContent && currentContent.ul) {
            currentContent.ul.push(v);
          }
        } else {
          skill[k] = v;
        }
      } else {
        if (currentContent && line.startsWith('- ')) {
          const item = line.substring(2).trim();
          if (currentContent.ul) {
            currentContent.ul.push(item);
          }
        }
      }
    }

    const frontmatter = [
      '---',
      `name: ${skill.name}`,
      `description: ${skill.description}`,
      `license: ${skill.license}`,
      `version: ${skill.version}`,
      `compatibility: ${skill.compatibility}`,
      `"allowed-tools": ${skill["allowed-tools"]}`,
      '---'
    ].join('\n');

    let content = '';
    if (skill.content && skill.content.h1) {
      content += `\n\n# ${skill.content.h1.text}`;
      if (skill.content.h1.p) {
        content += `\n\n${skill.content.h1.p}`;
      }
      if (skill.content.h1.ul && skill.content.h1.ul.length > 0) {
        content += `\n`;
        for (let item of skill.content.h1.ul) {
          content += `- ${item}\n`;
        }
      }
    }

    const markdownContent = frontmatter.replaceAll('"', '') + content.replaceAll('"', '') + "\n";
    return markdownContent;
  }
}

class App {
  init() {
    let skillStr = fs.readFileSync('./skill.txt', 'utf8');
    console.log(Converter.convertCurlyPromptToSKILL(skillStr));
  }
}

if (typeof App !== 'undefined') {
  new App().init();
}

