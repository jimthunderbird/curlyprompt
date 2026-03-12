const fs = require('fs');
const path = require('path');

class Converter {
  static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
    const source_prompt_content = fs.readFileSync(source_prompt_file, 'utf8');
    
    let frontmatter = {};
    let contentLines = [];
    let inContentBlock = false;
    let braceDepth = 0;
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
          if (line.includes('{')) {
            braceDepth += (line.match(/{/g) || []).length;
          }
          
          if (line.includes('}')) {
            braceDepth -= (line.match(/}/g) || []).length;
          }
          
          if (braceDepth === 0) {
            break;
          }
          
          contentLines.push(line);
        } else {
          if (line.startsWith('name:') || line.startsWith('description:') || 
              line.startsWith('license:') || line.startsWith('version:')) {
            const key = line.split(':')[0].trim();
            const value = line.substring(line.indexOf(':') + 1).trim().replaceAll('"', '');
            frontmatter[key] = value;
          }
        }
      }
    }
    
    let output = '';
    output += '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      output += `${key}: ${value}\n`;
    }
    output += '---\n\n';
    
    let inList = false;
    let level = 0;
    let currentHeading = '';
    
    for (let i = 0; i < contentLines.length; i++) {
      let line = contentLines[i].trim();
      
      if (line === '') continue;
      
      if (line.startsWith('h1:') || line.startsWith('h2:') || line.startsWith('h3:')) {
        const match = line.match(/^(h[123]):(.*)/);
        if (match) {
          level = parseInt(match[1][1]);
          let text = match[2].trim();
          
          if (text.endsWith('{')) {
            text = text.slice(0, -1).trim();
          }
          
          text = text.replace(/strong:(\w+)/g, '**$1**');
          output += '#'.repeat(level) + ' ' + text + '\n\n';
        }
      } else if (line.startsWith('p:')) {
        let text = line.substring(2).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        output += text + '\n\n';
      } else if (line === 'ul {') {
        inList = true;
      } else if (inList && line.startsWith('li:')) {
        let text = line.substring(3).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        output += '- ' + text + '\n';
      } else if (line === '}') {
        if (inList) {
          output += '\n';
          inList = false;
        }
      }
    }
    
    if (output.endsWith('\n')) {
      output = output.slice(0, -1);
    }
    
    fs.writeFileSync(target_md_file, output + '\n');
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
    
    if (!fs.existsSync(source_prompt_file)) {
      console.error(`Source file does not exist: ${source_prompt_file}`);
      process.exit(1);
    }
    
    Converter.convertCurlyPromptToSKILL(source_prompt_file, target_md_file);
  }
}

new App().init();

