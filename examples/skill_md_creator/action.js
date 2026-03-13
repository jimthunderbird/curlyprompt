const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
    let source_prompt_content = fs.readFileSync(source_prompt_file, 'utf8');
    let lines = source_prompt_content.split('\n');
    let output_lines = [];
    let frontmatter = {};
    let content_lines = [];
    let in_skill = false;
    let in_content = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!in_skill && (line.startsWith('skill {') || line === 'skill {')) {
        in_skill = true;
        continue;
      }

      if (!in_skill) continue;

      if (!in_content) {
        if (line.startsWith('name:')) frontmatter.name = line.substring(5).trim().replace(/"/g, '');
        else if (line.startsWith('description:')) frontmatter.description = line.substring(12).trim().replace(/"/g, '');
        else if (line.startsWith('license:')) frontmatter.license = line.substring(8).trim().replace(/"/g, '');
        else if (line.startsWith('version:')) frontmatter.version = line.substring(8).trim().replace(/"/g, '');

        if (line.startsWith('content {') || line === 'content {') {
          in_content = true;
          continue;
        }
      } else {
        let brace_depth = 1;
        content_lines.push(line);
        i++;
        while (i < lines.length) {
          let nextLine = lines[i].trim();
          let openBraces = (nextLine.match(/{/g) || []).length;
          let closeBraces = (nextLine.match(/}/g) || []).length;
          brace_depth += openBraces - closeBraces;
          if (brace_depth === 0) break;
          content_lines.push(nextLine);
          i++;
        }
      }
    }

    output_lines.push('---');
    for (let key in frontmatter) {
      output_lines.push(`${key}: ${frontmatter[key]}`);
    }
    output_lines.push('---');
    output_lines.push('');

    this.processContentLines(content_lines, output_lines);

    let target_md_content = output_lines.join('\n') + '\n';
    fs.writeFileSync(target_md_file, target_md_content);
  }

  static processStrong(text) {
    return text.replace(/strong:(\w+)/g, '**$1**');
  }

  static processContentLines(lines, output) {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line === '}') continue;

      let headerMatch = line.match(/^(h[1-3]):(.*)/);
      if (headerMatch) {
        let level = parseInt(headerMatch[1][1]);
        let text = headerMatch[2].trim();
        if (text.endsWith('{')) {
          text = text.slice(0, -1).trim();
        }
        let prefix = '#'.repeat(level);
        let formattedText = this.processStrong(text);
        output.push(`${prefix} ${formattedText}`);
        output.push('');
        continue;
      }

      if (line.startsWith('p:')) {
        let text = line.substring(2).trim();
        let formattedText = this.processStrong(text);
        output.push(formattedText);
        output.push('');
        continue;
      }

      if (line === 'ul {' || line.startsWith('ul {')) {
        i++;
        while (i < lines.length) {
          let nextLine = lines[i].trim();
          if (nextLine === '}') break;
          if (nextLine.startsWith('li:')) {
            let text = nextLine.substring(3).trim();
            let formattedText = this.processStrong(text);
            output.push(`- ${formattedText}`);
          }
          i++;
        }
        output.push('');
        continue;
      }

      if (line.startsWith('li:')) {
        let text = line.substring(3).trim();
        let formattedText = this.processStrong(text);
        output.push(`- ${formattedText}`);
      }
    }
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

    try {
      fs.accessSync(source_prompt_file, fs.constants.F_OK);
    } catch (err) {
      console.error(`Error: Source file ${source_prompt_file} does not exist`);
      process.exit(1);
    }

    Converter.convertCurlyPromptToSKILL(source_prompt_file, target_md_file);
  }
}

new App().init();

