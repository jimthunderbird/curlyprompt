const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
    const source_prompt_content = fs.readFileSync(source_prompt_file, 'utf8');
    
    let frontmatter = {};
    let contentLines = [];
    let braceDepth = 0;
    let inContentBlock = false;
    let lines = source_prompt_content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!inContentBlock && line.startsWith('skill {')) {
        inContentBlock = true;
        continue;
      }
      
      if (inContentBlock) {
        if (line === 'content {') {
          braceDepth = 1;
          continue;
        }
        
        if (braceDepth > 0) {
          if (line.includes('{')) braceDepth += (line.match(/{/g) || []).length;
          if (line.includes('}')) braceDepth -= (line.match(/}/g) || []).length;
          
          if (braceDepth === 0) {
            break;
          }
          
          contentLines.push(line);
        } else {
          if (!line.startsWith('content {') && !line.startsWith('skill {')) {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
              const key = line.substring(0, colonIndex).trim();
              let value = line.substring(colonIndex + 1).trim();
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }
              frontmatter[key] = value;
            }
          }
        }
      }
    }

    let markdown = '';
    
    markdown += '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      markdown += `${key}: ${value}\n`;
    }
    markdown += '---\n\n';

    let inList = false;
    let currentHeadingLevel = 0;
    let headingText = '';
    
    for (let i = 0; i < contentLines.length; i++) {
      let line = contentLines[i].trim();
      
      if (line === '') continue;
      
      if (line.startsWith('h1:') || line.startsWith('h2:') || line.startsWith('h3:')) {
        const level = parseInt(line.charAt(1));
        headingText = line.substring(3).trim();
        if (headingText.endsWith('{')) headingText = headingText.slice(0, -1).trim();
        
        markdown += '#'.repeat(level) + ' ' + headingText.replace(/strong:(\w+)/g, '**$1**') + '\n\n';
      } else if (line.startsWith('p:')) {
        const text = line.substring(2).trim();
        markdown += text.replace(/strong:(\w+)/g, '**$1**') + '\n\n';
      } else if (line === 'ul {') {
        inList = true;
      } else if (inList && line.startsWith('li:')) {
        const text = line.substring(3).trim();
        markdown += '- ' + text.replace(/strong:(\w+)/g, '**$1**') + '\n';
      } else if (line === '}') {
        if (inList) {
          markdown += '\n';
          inList = false;
        }
      }
    }

    if (markdown.endsWith('\n')) {
      markdown = markdown.slice(0, -1);
    }
    
    fs.writeFileSync(target_md_file, markdown + '\n');
  }
}

class App {
  init() {
    const source_prompt_file = process.argv[2];
    const target_md_file = process.argv[3];
    if (!source_prompt_file || !target_md_file) {
      console.error('Usage: node action.js <source_prompt_file> <target_md_file>');
      process.exit(1);
    }
    Converter.convertCurlyPromptToSKILL(source_prompt_file, target_md_file);
  }
}

new App().init();

