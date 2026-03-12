const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
    const source_prompt_content = fs.readFileSync(source_prompt_file, 'utf8');
    let lines = source_prompt_content.split('\n');
    
    let frontmatter = {};
    let contentLines = [];
    let braceDepth = 0;
    let inContentBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
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
            let key = line.split(':')[0].trim();
            let value = line.substring(line.indexOf(':') + 1).trim().replaceAll('"', '');
            frontmatter[key] = value;
          }
        }
      }
    }
    
    let markdownContent = '';
    if (Object.keys(frontmatter).length > 0) {
      markdownContent += '---\n';
      for (let key in frontmatter) {
        markdownContent += `${key}: ${frontmatter[key]}\n`;
      }
      markdownContent += '---\n\n';
    }
    
    let inList = false;
    for (let i = 0; i < contentLines.length; i++) {
      let line = contentLines[i].trim();
      
      if (line.match(/^h[123]:/)) {
        let level = parseInt(line.charAt(1));
        let text = line.substring(3).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        
        if (text.endsWith('{')) {
          text = text.slice(0, -1).trim();
        }
        if (text.endsWith(' {')) {
          text = text.slice(0, -2).trim();
        }
        
        markdownContent += '#'.repeat(level) + ' ' + text + '\n\n';
      } else if (line.startsWith('p:')) {
        let text = line.substring(2).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        markdownContent += text + '\n\n';
      } else if (line === 'ul {') {
        inList = true;
      } else if (inList && line.startsWith('li:')) {
        let text = line.substring(3).trim();
        text = text.replace(/strong:(\w+)/g, '**$1**');
        markdownContent += '- ' + text + '\n';
      } else if (line === '}') {
        if (inList) {
          markdownContent += '\n';
          inList = false;
        }
      }
    }
    
    if (markdownContent && !markdownContent.endsWith('\n\n')) {
      markdownContent += '\n';
    }
    
    fs.writeFileSync(target_md_file, markdownContent);
  }
}

class App {
  init() {
    let source_prompt_file = process.argv[2];
    let target_md_file = process.argv[3];
    Converter.convertCurlyPromptToSKILL(source_prompt_file, target_md_file);
  }
}

new App().init();

