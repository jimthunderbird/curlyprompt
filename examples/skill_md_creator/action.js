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

    // Step 1: Parse the source file line by line
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!in_skill && /^skill\s*\{/.test(line)) {
        in_skill = true;
        continue;
      }

      if (!in_skill) continue;

      if (!in_content) {
        // Handle header { } block - contains frontmatter key-value pairs
        if (/^(?:header|head)\s*\{/.test(line)) {
          i++;
          while (i < lines.length) {
            let headerLine = lines[i].trim();
            if (headerLine === '}') break;
            this.parseFrontmatterLine(headerLine, frontmatter, lines, i, (newI) => { i = newI; });
            i++;
          }
          continue;
        }

        // Parse frontmatter key-value pairs (flat structure, no header block)
        this.parseFrontmatterLine(line, frontmatter, lines, i, (newI) => { i = newI; });

        if (/^(?:content|body)\s*\{/.test(line)) {
          in_content = true;
          continue;
        }
      } else {
        // Collect all lines inside the content block into content_lines array
        // Store RAW (untrimmed) lines for code block indentation preservation
        let brace_depth = 1;
        let j = i;
        while (j < lines.length) {
          let inner_line_raw = lines[j];
          let inner_line = inner_line_raw.trim();
          if (inner_line === '}') {
            brace_depth--;
            if (brace_depth === 0) break;
          } else {
            brace_depth += (inner_line.match(/{/g) || []).length;
            brace_depth -= (inner_line.match(/}/g) || []).length;
          }
          content_lines.push(inner_line_raw);
          j++;
        }
        i = j;
      }
    }

    // Step 2: Build the frontmatter section
    output_lines.push('---');
    for (let key in frontmatter) {
      if (key === 'meta') {
        output_lines.push('meta:');
        for (let attr_key in frontmatter.meta) {
          output_lines.push('  ' + attr_key + ': ' + frontmatter.meta[attr_key]);
        }
      } else {
        output_lines.push(key + ': ' + frontmatter[key]);
      }
    }
    output_lines.push('---');
    output_lines.push('');

    // Step 3: Process content_lines to generate markdown
    this.processContentLines(content_lines, output_lines);

    // Step 4: Join output_lines with newline and add trailing newline
    let target_md_content = output_lines.join('\n') + '\n';
    fs.writeFileSync(target_md_file, target_md_content);
  }

  static parseFrontmatterLine(line, frontmatter, lines, i, setI) {
    if (line.startsWith('name:')) {
      frontmatter.name = line.substring(5).trim().replace(/"/g, '');
    } else if (line.startsWith('description:')) {
      frontmatter.description = line.substring(12).trim().replace(/"/g, '');
    } else if (line.startsWith('license:')) {
      frontmatter.license = line.substring(8).trim().replace(/"/g, '');
    } else if (line.startsWith('version:')) {
      frontmatter.version = line.substring(8).trim().replace(/"/g, '');
    } else if (line.startsWith('include:')) {
      frontmatter.include = line.substring(8).trim().replace(/"/g, '');
    } else if (/^meta\s*\{/.test(line)) {
      frontmatter.meta = {};
      let j = i + 1;
      while (j < lines.length) {
        let metaLine = lines[j].trim();
        if (metaLine === '}') break;
        let colonIdx = metaLine.indexOf(':');
        if (colonIdx !== -1) {
          let key = metaLine.substring(0, colonIdx).trim();
          let value = metaLine.substring(colonIdx + 1).trim().replace(/"/g, '');
          frontmatter.meta[key] = value;
        }
        j++;
      }
      setI(j);
    }
  }

  static processFormatting(text) {
    // Process links: link{display:"..." url:"..."} (brace syntax with flexible spacing)
    text = text.replace(/link\s*\{([^}]+)\}/g, (match, inner) => {
      let display = '';
      let url = '';
      let displayMatch = inner.match(/display:"([^"]+)"/);
      let urlMatch = inner.match(/url:"([^"]+)"/);
      if (displayMatch) display = displayMatch[1];
      if (urlMatch) url = urlMatch[1];
      return '[' + display + '](' + url + ')';
    });

    // Process links: link:display text:url
    text = text.replace(/link:(.+?):(https?:\/\/\S+)/g, '[$1]($2)');

    // Process same-line open/close: strong{...}/bold{...}/b{...}, italic{...}/i{...}, code{...}
    text = text.replace(/(?:strong|bold|b)\s*\{([^}]+)\}/g, '**$1**');
    text = text.replace(/(?:italic|it|i)\s*\{([^}]+)\}/g, '*$1*');
    text = text.replace(/code\s*\{([^}]+)\}/g, '`$1`');

    // Process strong/bold/b: captures to end of line
    text = text.replace(/(?:strong|bold|b):(.+)$/, '**$1**');

    // Process italic/i: captures to end of line
    text = text.replace(/(?:italic|it|i):(.+)$/, '*$1*');

    // Process inline code: captures to end of line
    text = text.replace(/code:\s*(.+)$/, '`$1`');

    return text;
  }

  static processContentLines(lines, output) {
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (line === '' || line === '}') continue;

      // Handle headers
      let headerMatch = line.match(/^(h[1-6]):(.*)/);
      if (headerMatch) {
        let level = parseInt(headerMatch[1].substring(1));
        let text = headerMatch[2].trim();
        if (text.endsWith('{')) {
          text = text.slice(0, -1).trim();
        }
        text = this.processFormatting(text);
        output.push('#'.repeat(level) + ' ' + text);
        output.push('');
        continue;
      }

      // Handle paragraphs (same-line form: p{...})
      let pInlineMatch = line.match(/^p\s*\{(.+)\}$/);
      if (pInlineMatch) {
        let text = this.processFormatting(pInlineMatch[1]);
        output.push(text);
        output.push('');
        continue;
      }

      // Handle paragraphs (block form: p { ... })
      if (/^p\s*\{/.test(line)) {
        i++;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') break;
          if (inner === 'br' || inner === 'br:') {
            output.push('<br>');
          } else if (inner !== '') {
            let text = this.processFormatting(inner);
            output.push(text);
          }
          i++;
        }
        output.push('');
        continue;
      }

      // Handle paragraphs (inline form: p:TEXT)
      if (line.startsWith('p:')) {
        let text = line.substring(2).trim();
        text = this.processFormatting(text);
        output.push(text);
        output.push('');
        continue;
      }

      // Handle unordered lists
      if (/^ul\s*\{/.test(line)) {
        i++;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') break;
          if (inner.startsWith('li:')) {
            let text = inner.substring(3).trim();
            text = this.processFormatting(text);
            output.push('- ' + text);
          }
          i++;
        }
        output.push('');
        continue;
      }

      // Handle ordered lists
      if (/^ol\s*\{/.test(line)) {
        i++;
        let num = 1;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') break;
          if (inner.startsWith('li:')) {
            let text = inner.substring(3).trim();
            text = this.processFormatting(text);
            output.push(num + '. ' + text);
            num++;
          }
          i++;
        }
        output.push('');
        continue;
      }

      // Handle code blocks
      if (/^code\s*\{/.test(line)) {
        i++;
        let codeLines = [];
        let depth = 1;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') {
            depth--;
            if (depth === 0) break;
            codeLines.push(lines[i]);
          } else {
            if (inner !== '') {
              depth += (inner.match(/{/g) || []).length;
              depth -= (inner.match(/}/g) || []).length;
            }
            codeLines.push(lines[i]);
          }
          i++;
        }
        // Strip common indentation
        let minIndent = Infinity;
        for (let cl of codeLines) {
          if (cl.trim() === '') continue;
          let indent = cl.match(/^(\s*)/)[1].length;
          if (indent < minIndent) minIndent = indent;
        }
        if (minIndent === Infinity) minIndent = 0;
        output.push('```');
        for (let cl of codeLines) {
          output.push(cl.substring(minIndent));
        }
        output.push('```');
        output.push('');
        continue;
      }

      // Handle multi-line blockquotes (blockquote { } or bq { })
      if (/^(?:blockquote|bq)\s*\{/.test(line)) {
        i++;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') break;
          if (inner !== '') {
            let text = this.processFormatting(inner);
            output.push('> ' + text);
          }
          i++;
        }
        output.push('');
        continue;
      }

      // Handle blockquotes (blockquote: or bq:)
      if (line.startsWith('blockquote:') || line.startsWith('bq:')) {
        let prefix = line.startsWith('blockquote:') ? 'blockquote:' : 'bq:';
        let text = line.substring(prefix.length).trim();
        text = this.processFormatting(text);
        output.push('> ' + text);
        output.push('');
        continue;
      }

      // Handle line breaks
      if (line === 'br' || line === 'br:') {
        output.push('<br>');
        output.push('');
        continue;
      }

      // Handle horizontal rules
      if (line === 'hr') {
        output.push('---');
        output.push('');
        continue;
      }

      // Handle images (brace syntax)
      let imgBraceMatch = line.match(/^img\s*\{(.+)\}$/);
      if (imgBraceMatch) {
        let inner = imgBraceMatch[1];
        let src = '';
        let alt = '';
        let srcMatch = inner.match(/src:"([^"]+)"/);
        let altMatch = inner.match(/alt:"([^"]+)"/);
        if (srcMatch) src = srcMatch[1];
        if (altMatch) alt = altMatch[1];
        output.push('![' + alt + '](' + src + ')');
        output.push('');
        continue;
      }
      if (line.startsWith('img:')) {
        let rest = line.substring(4);
        let colonIdx = rest.indexOf(':');
        let alt = rest.substring(0, colonIdx);
        let path = rest.substring(colonIdx + 1);
        output.push('![' + alt + '](' + path + ')');
        output.push('');
        continue;
      }

      // Handle tables
      if (/^table\s*\{/.test(line)) {
        let rows = [];
        let hasHeader = false;
        i++;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') break;
          if (/^tr\s*\{/.test(inner)) {
            let cells = [];
            let isHeaderRow = false;
            i++;
            while (i < lines.length) {
              let cellLine = lines[i].trim();
              if (cellLine === '}') break;
              if (cellLine.startsWith('th:')) {
                isHeaderRow = true;
                let text = cellLine.substring(3).trim();
                text = this.processFormatting(text);
                cells.push(text);
              } else if (cellLine.startsWith('td:')) {
                let text = cellLine.substring(3).trim();
                text = this.processFormatting(text);
                cells.push(text);
              }
              i++;
            }
            rows.push({ cells, isHeader: isHeaderRow });
            if (isHeaderRow) hasHeader = true;
          }
          i++;
        }
        if (rows.length > 0) {
          let firstRow = rows[0];
          let colCount = firstRow.cells.length;
          // Emit header row
          output.push('| ' + firstRow.cells.join(' | ') + ' |');
          // Emit separator
          output.push('| ' + Array(colCount).fill('---').join(' | ') + ' |');
          // Emit data rows (skip first row since it's used as header)
          let startIdx = 1;
          for (let r = startIdx; r < rows.length; r++) {
            output.push('| ' + rows[r].cells.join(' | ') + ' |');
          }
          output.push('');
        }
        continue;
      }

      // Handle checklists (checklist or cl)
      if (/^(?:checklist|cl)\s*\{/.test(line)) {
        i++;
        while (i < lines.length) {
          let inner = lines[i].trim();
          if (inner === '}') break;
          // item.checked / itm.c
          if (/^(?:item\.checked|itm\.c):/.test(inner)) {
            let prefix = inner.match(/^(?:item\.checked|itm\.c):/)[0];
            let text = inner.substring(prefix.length).trim();
            text = this.processFormatting(text);
            output.push('- [x] ' + text);
          }
          // item.unchecked / itm.u / item (plain)
          else if (/^(?:item\.unchecked|itm\.u|item):/.test(inner)) {
            let prefix = inner.match(/^(?:item\.unchecked|itm\.u|item):/)[0];
            let text = inner.substring(prefix.length).trim();
            text = this.processFormatting(text);
            output.push('- [ ] ' + text);
          }
          i++;
        }
        output.push('');
        continue;
      }

      // Handle standalone list items
      if (line.startsWith('li:')) {
        let text = line.substring(3).trim();
        text = this.processFormatting(text);
        output.push('- ' + text);
        continue;
      }

      // Handle standalone code: lines (inline code as paragraph)
      if (line.startsWith('code:')) {
        let text = line.substring(5).trim();
        output.push('`' + text + '`');
        output.push('');
        continue;
      }
    }
  }
}

// CLI entry point
if (process.argv.length >= 4) {
  Converter.convertCurlyPromptToSKILL(process.argv[2], process.argv[3]);
}
