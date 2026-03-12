const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(promptContent) {
    const lines = promptContent.split('\n');
    const skill = {};
    let contentStack = [];
    let currentSection = null;
    let currentContent = null;

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith('skill {')) {
        return;
      }

      if (line.startsWith('}')) {
        if (contentStack.length > 0) {
          contentStack.pop();
        }
        return;
      }

      if (line.startsWith('name:')) {
        skill.name = line.split(':').slice(1).join(':').trim();
        return;
      }

      if (line.startsWith('description:')) {
        skill.description = line.split(':').slice(1).join(':').trim();
        return;
      }

      if (line.startsWith('license:')) {
        skill.license = line.split(':').slice(1).join(':').trim();
        return;
      }

      if (line.startsWith('version:')) {
        skill.version = line.split(':').slice(1).join(':').trim();
        return;
      }

      if (line.startsWith('compatibility:')) {
        skill.compatibility = line.split(':').slice(1).join(':').trim();
        return;
      }

      if (line.startsWith('allowed-tools:')) {
        skill['allowed-tools'] = line.split(':').slice(1).join(':').trim();
        return;
      }

      if (line.includes(':')) {
        const [key, value] = line.split(':', 2);
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();

        if (trimmedKey === 'content') {
          if (trimmedValue.includes('{')) {
            const sectionName = trimmedValue.split('{')[0].trim();
            contentStack.push(sectionName);
            if (!skill.content) skill.content = {};
            currentSection = skill.content;
            for (let i = 0; i < contentStack.length - 1; i++) {
              if (!currentSection[contentStack[i]]) {
                currentSection[contentStack[i]] = {};
              }
              currentSection = currentSection[contentStack[i]];
            }
            currentSection[sectionName] = {};
            currentContent = currentSection[sectionName];
          }
        } else {
          if (currentContent) {
            currentContent[trimmedKey] = trimmedValue;
          }
        }
      }
    });

    const frontmatter = [
      '---',
      `name: ${skill.name}`,
      `description: ${skill.description}`,
      `license: ${skill.license}`,
      `version: ${skill.version}`,
      `compatibility: ${skill.compatibility}`,
      `"allowed-tools": ${skill['allowed-tools']}`,
      '---'
    ].join('\n');

    const processContent = (content, level = 0) => {
      let md = '';
      for (const key in content) {
        if (key === 'p') {
          const text = content[key];
          const strongRegex = /strong:(\w+)/g;
          const processedText = text.replace(strongRegex, '**$1**');
          md += `${processedText}\n\n`;
        } else if (key === 'ul') {
          const listItems = content[key];
          md += listItems.map(item => `- ${item}`).join('\n') + '\n\n';
        } else if (key === 'li') {
          md += `- ${content[key]}\n`;
        } else {
          const tag = '#'.repeat(level + 1);
          md += `${tag} ${content[key]}\n\n`;
        }
      }
      return md;
    };

    const buildMarkdownContent = (obj, prefix = '') => {
      let md = '';
      for (const key in obj) {
        if (key === 'content') {
          md += buildMarkdownContent(obj[key], prefix);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const tag = prefix ? prefix : key;
          const tagLevel = tag === 'h1' ? 1 : tag === 'h2' ? 2 : tag === 'h3' ? 3 : 0;
          const tagSymbol = '#'.repeat(tagLevel);
          if (obj[key].text) {
            md += `${tagSymbol} ${obj[key].text}\n\n`;
          } else {
            md += buildMarkdownContent(obj[key], tag);
          }
        } else {
          const tag = prefix ? prefix : key;
          const tagLevel = tag === 'h1' ? 1 : tag === 'h2' ? 2 : tag === 'h3' ? 3 : 0;
          const tagSymbol = '#'.repeat(tagLevel);
          md += `${tagSymbol} ${obj[key]}\n\n`;
        }
      }
      return md;
    };

    const content = buildMarkdownContent(skill);
    const markdownContent = frontmatter + content;
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

