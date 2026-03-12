const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
    const source_prompt_content = fs.readFileSync(source_prompt_file, 'utf8');
    
    let frontmatter = {};
    let contentLines = [];
    let braceDepth = 0;
    let inContentBlock = false;
    
    const lines = source_prompt_content.split('\n');
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (!inContentBlock && line.startsWith('skill {')) {
        inContentBlock = true;
        i++;
        continue;
      }
      
      if (inContentBlock && line === 'content {') {
        braceDepth = 1;
        i++;
        continue;
      }
      
      if (inContentBlock && braceDepth > 0) {
        if (line.includes('{')) braceDepth += (line.match(/{/g) || []).length;
        if (line.includes('}')) braceDepth -= (line.match(/}/g) || []).length;
        
        if (braceDepth === 0) {
          i++;
          break;
        }
        
        contentLines.push(line);
        i++;
        continue;
      }
      
      if (inContentBlock && !line.startsWith('content {') && !line.startsWith('skill {')) {
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
      
      i++;
    }
    
    let markdown = '';
    markdown += '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      markdown += `${key}: ${value}\n`;
    }
    markdown += '---\n\n';
    
    let inList = false;
    let listItems = [];
    
    for (let j = 0; j < contentLines.length; j++) {
      let line = contentLines[j].trim();
      
      if (line === '}') {
        if (inList) {
          markdown += '\n';
          inList = false;
        }
        continue;
      }
      
      if (line === 'ul {') {
        inList = true;
        continue;
      }
      
      if (inList && line.startsWith('li:')) {
        let text = line.substring(3).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        markdown += `- ${text}\n`;
        continue;
      }
      
      if (/^h[123]:/.test(line)) {
        const level = parseInt(line.charAt(1));
        let text = line.substring(3).trim();
        if (text.endsWith('{')) text = text.slice(0, -1).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        markdown += '#'.repeat(level) + ' ' + text + '\n\n';
        continue;
      }
      
      if (line.startsWith('p:')) {
        let text = line.substring(2).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        markdown += text + '\n\n';
        continue;
      }
    }
    
    if (markdown && !markdown.endsWith('\n')) {
      markdown += '\n';
    }
    
    fs.writeFileSync(target_md_file, markdown);
  }
}

class App {
  init() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
      console.error('Usage: node action.js <source_prompt_file> <target_md_file>');
      process.exit(1);
    }
    
    const source_prompt_file = args[0];
    const target_md_file = args[1];
    
    Converter.convertCurlyPromptToSKILL(source_prompt_file, target_md_file);
  }
}

new App().init();

