const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(promptContent) {
    const lines = promptContent.trim().split('\n');
    const skill = {};
    let currentSection = null;
    let currentContent = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('skill {')) {
        continue;
      } else if (line === '}') {
        continue;
      } else if (line.startsWith('name:')) {
        skill.name = line.substring(5).trim();
      } else if (line.startsWith('description:')) {
        skill.description = line.substring(12).trim();
      } else if (line.startsWith('license:')) {
        skill.license = line.substring(8).trim();
      } else if (line.startsWith('version:')) {
        skill.version = line.substring(8).trim();
      } else if (line.startsWith('content {')) {
        continue;
      } else if (line.startsWith('h1:')) {
        const text = line.substring(3).trim();
        if (!skill.content) skill.content = {};
        skill.content.h1 = { text };
        currentSection = 'h1';
        currentContent = skill.content.h1;
      } else if (line.startsWith('p:')) {
        const text = line.substring(2).trim();
        if (!currentContent) continue;
        if (!currentContent.p) currentContent.p = [];
        currentContent.p.push(text);
      } else if (line.startsWith('ul {')) {
        if (!currentContent) continue;
        if (!currentContent.ul) currentContent.ul = [];
      } else if (line.startsWith('li:')) {
        const text = line.substring(3).trim();
        if (currentContent && currentContent.ul) {
          currentContent.ul.push(text);
        }
      } else if (line.startsWith('allowed-tools:')) {
        skill["allowed-tools"] = line.substring(14).trim();
      }
    }

    const frontmatter = [
      '---',
      `name: ${skill.name}`,
      `description: ${skill.description}`,
      `license: ${skill.license}`,
      `version: ${skill.version}`,
      `compatibility: Yes`,
      `"allowed-tools": ${skill["allowed-tools"]}`,
      '---'
    ].join('\n');

    let content = '\n\n';

    if (skill.content && skill.content.h1) {
      content += `# ${skill.content.h1.text}\n\n`;

      if (skill.content.h1.p) {
        content += skill.content.h1.p.map(p => p.replace(/strong:(\w+)/g, '**$1**')).join('\n') + '\n\n';
      }

      if (skill.content.h1.ul) {
        content += skill.content.h1.ul.map(li => `- ${li}`).join('\n') + '\n';
      }
    }

    return frontmatter + content;
  }
}

class App {
  init() {
    let skillStr = fs.readFileSync('./skill.txt', 'utf8');
    console.log(Converter.convertCurlyPromptToSKILL(skillStr));
  }
}

new App().init();

