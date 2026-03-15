const fs = require('fs');

class Converter {
  static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
    const input = fs.readFileSync(source_prompt_file, 'utf8');
    const skillMatch = input.match(/skill\s*\{([\s\S]*)\}/);
    if (!skillMatch) return;

    const skillContent = skillMatch[1];
    let frontmatter = {};
    let meta = {};
    let bodyRaw = "";

    // Separate Frontmatter/Header and Body
    const bodyMatch = skillContent.match(/(?:content|body)\s*\{([\s\S]*)\}\s*$/);
    let preBody = skillContent;
    if (bodyMatch) {
      bodyRaw = bodyMatch[1];
      preBody = skillContent.substring(0, skillContent.lastIndexOf(bodyMatch[0]));
    }

    // Parse Frontmatter & Meta
    const lines = preBody.split('\n');
    let inHeader = false;
    let inMeta = false;
    let headerDepth = 0;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (/^(?:header|head)\s*\{/.test(trimmed)) {
        inHeader = true;
        headerDepth++;
        continue;
      }
      if (trimmed === '}' && inHeader) {
        headerDepth--;
        if (headerDepth === 0) inHeader = false;
        continue;
      }
      if (/^meta\s*\{/.test(trimmed)) {
        inMeta = true;
        continue;
      }
      if (trimmed === '}' && inMeta) {
        inMeta = false;
        continue;
      }

      const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        const key = kvMatch[1];
        const val = kvMatch[2].replace(/"/g, '');
        if (inMeta) {
          meta[key] = val;
        } else {
          frontmatter[key] = val;
        }
      }
    }

    // Build YAML
    let output = "---\n";
    for (const [k, v] of Object.entries(frontmatter)) {
      output += `${k}: ${v}\n`;
    }
    if (Object.keys(meta).length > 0) {
      output += "meta:\n";
      for (const [k, v] of Object.entries(meta)) {
        output += `  ${k}: ${v}\n`;
      }
    }
    output += "---\n\n";

    // Process Body Elements
    const bodyLines = bodyRaw.split('\n');
    let i = 0;

    const processFormatting = (text) => {
      if (!text) return "";
      // 1. link{...}
      text = text.replace(/link\s*\{[^}]*display:"([^"]+)"[^}]*url:"([^"]+)"[^}]*\}/g, '[$1]($2)');
      text = text.replace(/link\s*\{[^}]*url:"([^"]+)"[^}]*display:"([^"]+)"[^}]*\}/g, '[$2]($1)');
      // 2. link:
      text = text.replace(/link:(.+?):(https?:\/\/\S+)/g, '[$1]($2)');
      // 3. strong{...}
      text = text.replace(/(?:strong|bold|b)\s*\{([^}]+)\}/g, '**$1**');
      // 4. italic{...}
      text = text.replace(/(?:italic|it|i)\s*\{([^}]+)\}/g, '*$1*');
      // 5. code{...}
      text = text.replace(/code\s*\{([^}]+)\}/g, '`$1`');
      // 6. strong:
      text = text.replace(/(?:strong|bold|b):\s*(.*)$/g, '**$1**');
      // 7. italic:
      text = text.replace(/(?:italic|it|i):\s*(.*)$/g, '*$1*');
      // 8. code:
      text = text.replace(/code:\s*(.*)$/g, '`$1`');
      return text;
    };

    while (i < bodyLines.length) {
      let line = bodyLines[i].trim();
      if (!line || line === '}') { i++; continue; }

      // Headers
      let hMatch = line.match(/^(h[1-6]):\s*(.*?)\s*\{?$/);
      if (hMatch) {
        const level = hMatch[1][1];
        output += "#".repeat(level) + " " + processFormatting(hMatch[2]) + "\n\n";
        i++; continue;
      }

      // p{...}
      let pBraceInline = line.match(/^p\s*\{([^}]+)\}/);
      if (pBraceInline) {
        output += processFormatting(pBraceInline[1]) + "\n\n";
        i++; continue;
      }

      // p { ... }
      if (/^p\s*\{/.test(line)) {
        i++;
        while (i < bodyLines.length && bodyLines[i].trim() !== '}') {
          let pLine = bodyLines[i].trim();
          if (pLine) output += processFormatting(pLine) + "\n";
          i++;
        }
        output += "\n";
        i++; continue;
      }

      // p:
      if (line.startsWith('p:')) {
        output += processFormatting(line.substring(2).trim()) + "\n\n";
        i++; continue;
      }

      // Lists (ul/ol)
      if (/^(?:ul|ol)\s*\{/.test(line)) {
        const isOrdered = line.startsWith('ol');
        let count = 1;
        i++;
        while (i < bodyLines.length && bodyLines[i].trim() !== '}') {
          let lLine = bodyLines[i].trim();
          if (lLine.startsWith('li:')) {
            let bullet = isOrdered ? `${count++}.` : '-';
            output += `${bullet} ${processFormatting(lLine.substring(3).trim())}\n`;
          }
          i++;
        }
        output += "\n";
        i++; continue;
      }

      // Checklist
      if (/^(?:checklist|cl)\s*\{/.test(line)) {
        i++;
        while (i < bodyLines.length && bodyLines[i].trim() !== '}') {
          let cLine = bodyLines[i].trim();
          let m = cLine.match(/^(item\.checked|itm\.c):\s*(.*)$/);
          if (m) output += `- [x] ${processFormatting(m[2])}\n`;
          else {
            m = cLine.match(/^(item|item\.unchecked|itm\.u):\s*(.*)$/);
            if (m) output += `- [ ] ${processFormatting(m[2])}\n`;
          }
          i++;
        }
        output += "\n";
        i++; continue;
      }

      // Code Block
      let codeBlockMatch = line.match(/^code(?:\.(\w+))?\s*\{/);
      if (codeBlockMatch) {
        const lang = codeBlockMatch[1] || "";
        let codeLines = [];
        let depth = 1;
        i++;
        while (i < bodyLines.length) {
          let rawLine = bodyLines[i];
          let trimmed = rawLine.trim();
          if (trimmed === '}') depth--;
          else if (trimmed.includes('{') || trimmed.includes('}')) {
            depth += (rawLine.match(/\{/g) || []).length;
            depth -= (rawLine.match(/\}/g) || []).length;
          }
          if (depth === 0) break;
          codeLines.push(rawLine);
          i++;
        }
        // Strip common indent
        const minIndent = Math.min(...codeLines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
const finalCode = codeLines.map(l => l.substring(minIndent)).join('\n');
output += "```" + lang + "\n" + finalCode + "\n```\n\n";
i++; continue;
      }

      // Blockquote
      if (/^(?:blockquote|bq)\s*\{/.test(line)) {
        i++;
        while (i < bodyLines.length && bodyLines[i].trim() !== '}') {
          let bLine = bodyLines[i].trim();
          if (bLine) output += "> " + processFormatting(bLine) + "\n";
          i++;
        }
        output += "\n";
        i++; continue;
      }
      if (/^(?:blockquote|bq):/.test(line)) {
        output += "> " + processFormatting(line.split(':')[1].trim()) + "\n\n";
        i++; continue;
      }

      // Table
      if (/^table\s*\{/.test(line)) {
        i++;
        let rows = [];
        while (i < bodyLines.length && bodyLines[i].trim() !== '}') {
          if (/tr\s*\{/.test(bodyLines[i])) {
            i++;
            let cells = [];
            while (i < bodyLines.length && bodyLines[i].trim() !== '}') {
              let c = bodyLines[i].trim();
              if (c.startsWith('td:') || c.startsWith('th:')) cells.push(processFormatting(c.substring(3).trim()));
              i++;
            }
            rows.push(cells);
          }
          i++;
        }
        if (rows.length > 0) {
          output += "| " + rows[0].join(" | ") + " |\n";
          output += "| " + rows[0].map(() => "---").join(" | ") + " |\n";
          for (let r = 1; r < rows.length; r++) {
            output += "| " + rows[r].join(" | ") + " |\n";
          }
          output += "\n";
        }
        continue;
      }

      // Media & Misc
      if (line === 'br:') { output += "\n"; i++; continue; }
      if (line === 'hr') { output += "---\n\n"; i++; continue; }

      let imgBrace = line.match(/^img\s*\{[^}]*src:"([^"]+)"[^}]*alt:"([^"]+)"[^}]*\}/);
      if (!imgBrace) imgBrace = line.match(/^img\s*\{[^}]*alt:"([^"]+)"[^}]*src:"([^"]+)"[^}]*\}/);
      if (imgBrace) {
        const [_, first, second] = imgBrace;
        const src = line.includes(`src:"${first}"`) ? first : second;
        const alt = src === first ? second : first;
        output += `![${alt}](${src})\n\n`;
        i++; continue;
      }

      let imgCol = line.match(/^img:(.*?):(.*)$/);
      if (imgCol) {
        output += `![${imgCol[1]}](${imgCol[2]})\n\n`;
        i++; continue;
      }

      if (line.startsWith('li:')) {
        output += `- ${processFormatting(line.substring(3).trim())}\n`;
        i++; continue;
      }

      let codeLangCol = line.match(/^code\.(\w+):\s*(.*)$/);
      if (codeLangCol) {
        output += "```" + codeLangCol[1] + "\n" + codeLangCol[2] + "\n```\n\n";
        i++; continue;
      }

      if (line.startsWith('code:')) {
        output += "`" + line.substring(5).trim() + "`\n\n";
        i++; continue;
      }

      i++;
    }

    fs.writeFileSync(target_md_file, output.trim() + "\n");
  }
}

if (process.argv.length >= 4) {
  Converter.convertCurlyPromptToSKILL(process.argv[2], process.argv[3]);
}
