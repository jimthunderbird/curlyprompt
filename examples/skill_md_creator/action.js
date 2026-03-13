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
        if (line.startsWith('description:')) frontmatter.description = line.substring(12).trim().replace(/"/g, '');
        if (line.startsWith('license:')) frontmatter.license = line.substring(8).trim().replace(/"/g, '');
        if (line.startsWith('version:')) frontmatter.version = line.substring(8).trim().replace(/"/g, '');

        if (line.startsWith('content {') || line === 'content {') {
          in_content = true;
          continue;
        }
      } else {
        content_lines.push(line);
        let brace_depth = 1;
        i++;
        while (i < lines.length) {
          let next_line = lines[i].trim();
          if (next_line.includes('{')) {
            brace_depth += (next_line.match(/{/g) || []).length;
          }
          if (next_line.includes('}')) {
            brace_depth -= (next_line.match(/}/g) || []).length;
          }
          content_lines.push(next_line);
          if (brace_depth === 0) break;
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
    return text.replace(/strong:([\w-]+)/g, '**$1**');
  }

  static processContentLines(lines, output) {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (line === '' || line === '}') continue;

      let header_match = line.match(/^(h[1-3]):(.*)/);
      if (header_match) {
        let level = parseInt(header_match[1][1]);
        let text = header_match[2].trim();
        if (text.endsWith('{')) {
          text = text.slice(0, -1).trim();
        }
        let prefix = '#'.repeat(level);
        output.push(`${prefix} ${this.processStrong(text)}`);
        output.push('');
        continue;
      }

      if (line.startsWith('p:')) {
        let text = line.substring(2).trim();
        output.push(this.processStrong(text));
        output.push('');
        continue;
      }

      if (line === 'ul {' || line.startsWith('ul {')) {
        i++;
        while (i < lines.length) {
          let next_line = lines[i].trim();
          if (next_line === '}') break;
          if (next_line.startsWith('li:')) {
            let text = next_line.substring(3).trim();
            output.push(`- ${this.processStrong(text)}`);
          }
          i++;
        }
        output.push('');
        continue;
      }

      if (line.startsWith('li:')) {
        let text = line.substring(3).trim();
        output.push(`- ${this.processStrong(text)}`);
        continue;
      }
    }
  }
}

class App {
  init() {
    let source_prompt_file = process.argv[2];
    let target_md_file = process.argv[3];

    if (!source_prompt_file || !target_md_file) {
      console.error('Usage: node action.js <source_prompt_file> <target_md_file>');
      process.exit(1);
    }

    if (!fs.existsSync(source_prompt_file)) {
      console.error(`Source file does not exist: ${source_prompt_file}`);
      process.exit(1);
    }

    Converter.convertCurlyPromptToSKILL(source_prompt_file, target_md_file);
  }
}

new App().init();

