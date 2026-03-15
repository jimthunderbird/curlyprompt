const fs = require('fs');

class Converter {
    static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
        const input = fs.readFileSync(source_prompt_file, 'utf8');
        
        const skillMatch = input.match(/skill\s*\{([\s\S]*)\}/);
        if (!skillMatch) return;
        const skillContent = skillMatch[1];

        let frontmatter = {};
        let contentStr = "";

        // Determine blocks
        const headerMatch = skillContent.match(/(?:header|head)\s*\{([\s\S]*?)\}\s*(?:content|body)\s*\{([\s\S]*)\}/);
        if (headerMatch) {
            frontmatter = this.parseFrontmatter(headerMatch[1]);
            contentStr = headerMatch[2];
        } else {
            const contentSplit = skillContent.split(/(?:content|body)\s*\{/);
            frontmatter = this.parseFrontmatter(contentSplit[0]);
            contentStr = contentSplit[1] ? contentSplit[1].replace(/\}\s*$/, '') : "";
        }

        let output = "---\n";
        for (const [key, value] of Object.entries(frontmatter)) {
            if (typeof value === 'object') {
                output += `${key}:\n`;
                for (const [mk, mv] of Object.entries(value)) {
                    output += `  ${mk}: ${mv}\n`;
                }
            } else {
                output += `${key}: ${value}\n`;
            }
        }
        output += "---\n\n";

        output += this.parseBody(contentStr);
        fs.writeFileSync(target_md_file, output.trimEnd() + "\n");
    }

    static parseFrontmatter(str) {
        const lines = str.split('\n');
        const data = {};
        let inMeta = false;
        let metaObj = {};

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('meta') && line.includes('{')) {
                inMeta = true;
                continue;
            }
            if (inMeta && line === '}') {
                data['meta'] = metaObj;
                inMeta = false;
                continue;
            }

            const colonIdx = line.indexOf(':');
            if (colonIdx !== -1) {
                const key = line.substring(0, colonIdx).trim();
                const val = line.substring(colonIdx + 1).trim().replace(/"/g, '');
                if (inMeta) metaObj[key] = val;
                else data[key] = val;
            }
        }
        return data;
    }

    static processFormatting(text) {
        text = text.replace(/link\s*\{\s*display\s*:\s*"([^"]+)"\s*,?\s*url\s*:\s*"([^"]+)"\s*\}/gi, '[$1]($2)');
        text = text.replace(/link\s*\{\s*url\s*:\s*"([^"]+)"\s*,?\s*display\s*:\s*"([^"]+)"\s*\}/gi, '[$2]($1)');
        text = text.replace(/link:(.*?):(https?:\/\/\S+)/g, '[$1]($2)');
        text = text.replace(/(?:strong|bold|b)\s*\{([^}]+)\}/g, '**$1**');
        text = text.replace(/(?:italic|it|i)\s*\{([^}]+)\}/g, '*$1*');
        text = text.replace(/code\s*\{([^}]+)\}/g, '`$1`');
        text = text.replace(/(?:strong|bold|b):(.+)$/g, '**$1**');
        text = text.replace(/(?:italic|it|i):(.+)$/g, '*$1*');
        text = text.replace(/code:(.+)$/g, '`$1`');
        return text;
    }

    static parseBody(str) {
        const lines = str.split(/\r?\n/);
        let out = "";
        let i = 0;

        while (i < lines.length) {
            let line = lines[i].trim();
            if (!line || line === '}') { i++; continue; }

            // Headers
            const hMatch = line.match(/^(h[1-6]):(.*)/);
            if (hMatch) {
                const level = hMatch[1][1];
                let title = hMatch[2].trim().replace(/\{$/, '').trim();
                out += "#".repeat(level) + " " + this.processFormatting(title) + "\n\n";
                i++; continue;
            }

            // p{...}
            const pInline = line.match(/^p\s*\{([^}]+)\}/);
            if (pInline) {
                out += this.processFormatting(pInline[1]) + "\n\n";
                i++; continue;
            }

            // p { block
            if (line.match(/^p\s*\{/)) {
                i++;
                while (i < lines.length && lines[i].trim() !== '}') {
                    let content = lines[i].trim();
                    if (content) out += this.processFormatting(content) + "\n";
                    i++;
                }
                out += "\n";
                i++; continue;
            }

            // p:
            if (line.startsWith('p:')) {
                out += this.processFormatting(line.substring(2).trim()) + "\n\n";
                i++; continue;
            }

            // ul / ol
            if (line.match(/^(ul|ol)\s*\{/)) {
                const type = line.startsWith('ul') ? 'ul' : 'ol';
                i++;
                let count = 1;
                while (i < lines.length && lines[i].trim() !== '}') {
                    let li = lines[i].trim();
                    if (li.startsWith('li:')) {
                        let txt = this.processFormatting(li.substring(3).trim());
                        out += (type === 'ul' ? '- ' : `${count++}. `) + txt + "\n";
                    }
                    i++;
                }
                out += "\n";
                i++; continue;
            }

            // code block
            const codeBlockMatch = line.match(/^code(?:\.(\w+))?\s*\{/);
            if (codeBlockMatch) {
                const lang = codeBlockMatch[1] || "";
                let depth = 1;
                let codeLines = [];
                i++;
                while (i < lines.length && depth > 0) {
                    let raw = lines[i];
                    let trimmed = raw.trim();
                    if (trimmed === '}') depth--;
                    else {
                        depth += (raw.match(/\{/g) || []).length;
                        depth -= (raw.match(/\}/g) || []).length;
                    }
                    if (depth > 0) codeLines.push(raw);
                    i++;
                }
                const minIndent = Math.min(...codeLines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
                out += "```" + lang + "\n" + codeLines.map(l => l.slice(minIndent)).join('\n') + "\n```\n\n";
                continue;
            }

            // blockquote block
            if (line.match(/^(blockquote|bq)\s*\{/)) {
                i++;
                while (i < lines.length && lines[i].trim() !== '}') {
                    if (lines[i].trim()) out += "> " + this.processFormatting(lines[i].trim()) + "\n";
                    i++;
                }
                out += "\n";
                i++; continue;
            }

            // blockquote:
            if (line.match(/^(blockquote|bq):/)) {
                out += "> " + this.processFormatting(line.split(':')[1].trim()) + "\n\n";
                i++; continue;
            }

            // br:
            if (line === 'br:') {
                out += "\n";
                i++; continue;
            }

            // hr
            if (line === 'hr') {
                out += "---\n\n";
                i++; continue;
            }

            // img{...}
            const imgBrace = line.match(/^img\s*\{([^}]+)\}/);
            if (imgBrace) {
                const src = (imgBrace[1].match(/src\s*:\s*"([^"]+)"/) || [])[1];
                const alt = (imgBrace[1].match(/alt\s*:\s*"([^"]+)"/) || [])[1];
                out += `![${alt}](${src})\n\n`;
                i++; continue;
            }

            // img:
            if (line.startsWith('img:')) {
                const parts = line.substring(4).split(':');
                out += `![${parts[0]}](${parts[1]})\n\n`;
                i++; continue;
            }

            // table
            if (line.startsWith('table')) {
                i++;
                let rows = [];
                while (i < lines.length && lines[i].trim() !== '}') {
                    if (lines[i].trim().startsWith('tr')) {
                        i++;
                        let row = [];
                        while (i < lines.length && lines[i].trim() !== '}') {
                            if (lines[i].trim().match(/^(td|th):/)) {
                                row.push(this.processFormatting(lines[i].trim().split(':')[1].trim()));
                            }
                            i++;
                        }
                        rows.push(row);
                    }
                    i++;
                }
                if (rows.length > 0) {
                    out += "| " + rows[0].join(" | ") + " |\n";
                    out += "| " + rows[0].map(() => "---").join(" | ") + " |\n";
                    for (let r = 1; r < rows.length; r++) {
                        out += "| " + rows[r].join(" | ") + " |\n";
                    }
                    out += "\n";
                }
                continue;
            }

            // checklist
            if (line.match(/^(checklist|cl)\s*\{/)) {
                i++;
                while (i < lines.length && lines[i].trim() !== '}') {
                    let cl = lines[i].trim();
                    if (cl) {
                        let checked = cl.includes('.checked:') || cl.includes('.c:');
                        let txt = cl.split(':')[1].trim();
                        out += `- [${checked ? 'x' : ' '}] ${this.processFormatting(txt)}\n`;
                    }
                    i++;
                }
                out += "\n";
                i++; continue;
            }

            // li:
            if (line.startsWith('li:')) {
                out += "- " + this.processFormatting(line.substring(3).trim()) + "\n";
                i++; continue;
            }

            // code lang inline
            const langCodeMatch = line.match(/^code\.(\w+):(.*)/);
            if (langCodeMatch) {
                out += "```" + langCodeMatch[1] + "\n" + langCodeMatch[2].trim() + "\n```\n\n";
                i++; continue;
            }

            // fallback code:
            if (line.startsWith('code:')) {
                out += "`" + line.substring(5).trim() + "`\n\n";
                i++; continue;
            }

            i++;
        }
        return out;
    }
}

if (process.argv.length >= 4) {
    Converter.convertCurlyPromptToSKILL(process.argv[2], process.argv[3]);
}
