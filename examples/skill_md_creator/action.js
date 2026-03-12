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
      
      if (line.startsWith('skill {')) {
        continue;
      }
      
      if (line === 'content {') {
        inContentBlock = true;
        braceDepth = 1;
        continue;
      }
      
      if (inContentBlock) {
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
        if (line.includes(':') && !line.startsWith('content {')) {
          let key = line.substring(0, line.indexOf(':')).trim();
          let value = line.substring(line.indexOf(':') + 1).trim().replaceAll('"', '');
          frontmatter[key] = value;
        }
      }
    }
    
    let markdownOutput = '';
    
    if (Object.keys(frontmatter).length > 0) {
      markdownOutput += '---\n';
      for (let key in frontmatter) {
        markdownOutput += `${key}: ${frontmatter[key]}\n`;
      }
      markdownOutput += '---\n\n';
    }
    
    let inList = false;
    let currentHeadingLevel = 0;
    let headingText = '';
    
    for (let i = 0; i < contentLines.length; i++) {
      let line = contentLines[i].trim();
      
      if (line.startsWith('h1:') || line.startsWith('h2:') || line.startsWith('h3:')) {
        let level = parseInt(line.charAt(1));
        headingText = line.substring(3).trim();
        
        if (headingText.endsWith('{')) {
          headingText = headingText.slice(0, -1).trim();
        }
        
        markdownOutput += '#'.repeat(level) + ' ' + headingText.replace(/strong:/g, '**') + '\n\n';
      } else if (line === 'ul {') {
        inList = true;
      } else if (inList && line.startsWith('li:')) {
        let itemText = line.substring(3).trim();
        markdownOutput += '- ' + itemText.replace(/strong:/g, '**') + '\n';
      } else if (line === '}') {
        if (inList) {
          markdownOutput += '\n';
          inList = false;
        }
      } else if (line.startsWith('p:')) {
        let paragraphText = line.substring(2).trim();
        markdownOutput += paragraphText.replace(/strong:/g, '**') + '\n\n';
      }
    }
    
    if (markdownOutput && !markdownOutput.endsWith('\n')) {
      markdownOutput += '\n';
    }
    
    fs.writeFileSync(target_md_file, markdownOutput);
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

