const fs = require('fs');

class Converter {
    static convertCurlyPromptToSKILL(source_prompt_file, target_md_file) {
        const input = fs.readFileSync(source_prompt_file, 'utf8');
        const lines = input.split(/\r?\n/);

        let inSkill = false;
        let skillLines = [];
        let depth = 0;

        for (let line of lines) {
            const trimmed = line.trim();
            if (!inSkill) {
                if (trimmed.match(/^skill\s*\{/)) {
                    inSkill = true;
                    depth = 1;
                }
                continue;
            }

            if (trimmed === '{') depth++;
            else if (trimmed === '}') depth--;

            if (depth === 0) break;
            if (depth >= 1) skillLines.push(line);
        }

        if (skillLines.length === 0) return;

        let frontmatter = {};
        let contentLines = [];
        let i = 0;

        while (i < skillLines.length) {
            let line = skillLines[i].trim();
            if (!line) { i++; continue; }

            if (line.match(/^(header|head)\s*\{/)) {
                i = this.parseFrontmatterBlock(skillLines, i + 1, frontmatter);
            } else if (line.match(/^(content|body)\s*\{/)) {
                contentLines = this.extractBlock(skillLines, i);
                break;
            } else if (line.includes(':') && !line.match(/^(header|head|content|body|meta)\s*\{/)) {
                this.parseKV(line, frontmatter);
                i++;
            } else if (line.match(/^meta\s*\{/)) {
                i = this.parseMetaBlock(skillLines, i + 1, frontmatter);
            } else {
                i++;
            }
        }

        let output = '---\n';
        for (const [key, val] of Object.entries(frontmatter)) {
            if (typeof val === 'object') {
                output += `${key}:\n`;
                for (const [mk, mv] of Object.entries(val)) {
                    output += `  ${mk}: ${mv}\n`;
                }
            } else {
                output += `${key}: ${val}\n`;
            }
        }
        output += '---\n\n';

        output += this.processContent(contentLines);
        fs.writeFileSync(target_md_file, output.trimEnd() + '\n');
    }

    static parseKV(line, obj) {
        const idx = line.indexOf(':');
        if (idx === -1) return;
        const key = line.substring(0, idx).trim();
        const val = line.substring(idx + 1).trim().replace(/"/g, '');
        obj[key] = val;
    }

    static parseFrontmatterBlock(lines, start, obj) {
        let i = start;
        let d = 1;
        while (i < lines.length && d > 0) {
            let l = lines[i].trim();
            if (l === '{') d++;
            else if (l === '}') d--;
            else if (d === 1) {
                if (l.match(/^meta\s*\{/)) i = this.parseMetaBlock(lines, i + 1, obj) - 1;
                else this.parseKV(l, obj);
            }
            i++;
        }
        return i;
    }

    static parseMetaBlock(lines, start, obj) {
        if (!obj.meta) obj.meta = {};
        let i = start;
        let d = 1;
        while (i < lines.length && d > 0) {
            let l = lines[i].trim();
            if (l === '{') d++;
            else if (l === '}') d--;
            else if (d === 1) this.parseKV(l, obj.meta);
            i++;
        }
        return i;
    }

    static extractBlock(lines, startIdx) {
        let block = [];
        let d = 0;
        for (let i = startIdx; i < lines.length; i++) {
            let l = lines[i];
            let tl = l.trim();
            if (i === startIdx) { d = 1; continue; }
            if (tl === '{') d++;
            else if (tl === '}') d--;
            if (d === 0) break;
            block.push(l);
        }
        return block;
    }

    static processFormatting(text) {
        // 1. link{...}
        text = text.replace(/link\s*\{\s*display\s*:\s*"(.+?)"\s*,?\s*url\s*:\s*"(.+?)"\s*\}/g, '[$1]($2)');
        text = text.replace(/link\s*\{\s*url\s*:\s*"(.+?)"\s*,?\s*display\s*:\s*"(.+?)"\s*\}/g, '[$2]($1)');
        // 2. link:
        text = text.replace(/link:(.+?):(https?:\/\/\S+)/g, '[$1]($2)');
        // 3. strong{...}
        text = text.replace(/(?:strong|bold|b)\s*\{(.+?)\}/g, '**$1**');
        // 4. italic{...}
        text = text.replace(/(?:italic|it|i)\s*\{(.+?)\}/g, '*$1*');
        // 5. code{...}
        text = text.replace(/code\s*\{(.+?)\}/g, '`$1`');
        // 6. strong:
        text = text.replace(/(?:strong|bold|b):(.+)$/g, '**$1**');
        // 7. italic:
        text = text.replace(/(?:italic|it|i):(.+)$/g, '*$1*');
        // 8. code:
        text = text.replace(/code:(.+)$/g, '`$1`');
        return text;
    }

    static processContent(lines) {
        let out = "";
        let i = 0;
        while (i < lines.length) {
            let line = lines[i];
            let tl = line.trim();
            if (!tl || tl === '}') { i++; continue; }

            // Headers
            let m;
            if (m = tl.match(/^(h[1-6]):(.*)/)) {
                let lvl = m[1][1];
                let txt = m[2].trim().replace(/\s*\{$/, '');
                out += '#'.repeat(lvl) + ' ' + this.processFormatting(txt) + '\n\n';
                i++;
                continue;
            }
            // p{...}
            if (m = tl.match(/^p\s*\{(.+?)\}/)) {
                out += this.processFormatting(m[1]) + '\n\n';
                i++; continue;
            }
            // p block
            if (tl.match(/^p\s*\{/)) {
                let block = this.extractBlock(lines, i);
                block.forEach(l => { if(l.trim()) out += this.processFormatting(l.trim()) + '\n'; });
                out += '\n';
                i += block.length + 2; continue;
            }
            // p:
            if (tl.startsWith('p:')) {
                out += this.processFormatting(tl.substring(2).trim()) + '\n\n';
                i++; continue;
            }
            // lists
            if (m = tl.match(/^(ul|ol)\s*\{/)) {
                let type = m[1];
                let block = this.extractBlock(lines, i);
                let idx = 1;
                block.forEach(l => {
                    let itl = l.trim();
                    if (itl.startsWith('li:')) {
                        let bullet = type === 'ul' ? '-' : `${idx++}.`;
                        out += `${bullet} ${this.processFormatting(itl.substring(3).trim())}\n`;
                    }
                });
                out += '\n';
                i += block.length + 2; continue;
            }
            // checklist
            if (m = tl.match(/^(checklist|cl)\s*\{/)) {
                let block = this.extractBlock(lines, i);
                block.forEach(l => {
                    let itl = l.trim();
                    if (itl.match(/^(item\.checked|itm\.c):/)) out += `- [x] ${this.processFormatting(itl.split(':')[1].trim())}\n`;
                    else if (itl.match(/^(item|item\.unchecked|itm\.u):/)) out += `- [ ] ${this.processFormatting(itl.split(':')[1].trim())}\n`;
                });
                out += '\n';
                i += block.length + 2; continue;
            }
            // code block
            if (m = tl.match(/^code(?:\.(\w+))?\s*\{/)) {
                let lang = m[1] || '';
                let block = this.extractBlock(lines, i);
                let minIndent = Infinity;
                block.forEach(l => { if(l.trim()) minIndent = Math.min(minIndent, l.search(/\S/)); });
                out += '```' + lang + '\n';
                block.forEach(l => { out += (minIndent === Infinity ? l : l.substring(minIndent)) + '\n'; });
                out += '```\n\n';
                i += block.length + 2; continue;
            }
            // blockquote block
            if (m = tl.match(/^(blockquote|bq)\s*\{/)) {
                let block = this.extractBlock(lines, i);
                block.forEach(l => { if(l.trim()) out += `> ${this.processFormatting(l.trim())}\n`; });
                out += '\n';
                i += block.length + 2; continue;
            }
            // br:
            if (tl === 'br:') { out += '\n'; i++; continue; }
            // hr
            if (tl === 'hr') { out += '---\n\n'; i++; continue; }
            // img{...}
            if (m = tl.match(/^img\s*\{\s*(src|alt)\s*:\s*"(.+?)"\s*,?\s*(src|alt)\s*:\s*"(.+?)"\s*\}/)) {
                let data = {}; data[m[1]] = m[2]; data[m[3]] = m[4];
                out += `![${data.alt}](${data.src})\n\n`;
                i++; continue;
            }
            // img:
            if (tl.startsWith('img:')) {
                let parts = tl.substring(4).split(':');
                out += `![${parts[0]}](${parts.slice(1).join(':')})\n\n`;
                i++; continue;
            }
            // table
            if (tl.match(/^table\s*\{/)) {
                let block = this.extractBlock(lines, i);
                let rows = [];
                for(let j=0; j<block.length; j++) {
                    if(block[j].trim().match(/^tr\s*\{/)) {
                        let rowData = this.extractBlock(block, j);
                        let cells = rowData.map(c => this.processFormatting(c.trim().split(':')[1] || '').trim());
                        rows.push(cells);
                        j += rowData.length + 1;
                    }
                }
                if (rows.length > 0) {
                    out += `| ${rows[0].join(' | ')} |\n| ${rows[0].map(() => '---').join(' | ')} |\n`;
                    for(let r=1; r<rows.length; r++) out += `| ${rows[r].join(' | ')} |\n`;
                    out += '\n';
                }
                i += block.length + 2; continue;
            }
            // standalone
            if (tl.startsWith('blockquote:') || tl.startsWith('bq:')) {
                out += `> ${this.processFormatting(tl.substring(tl.indexOf(':')+1).trim())}\n\n`;
            } else if (tl.startsWith('li:')) {
                out += `- ${this.processFormatting(tl.substring(3).trim())}\n`;
            } else if (m = tl.match(/^code\.(\w+):(.*)/)) {
                out += '```' + m[1] + '\n' + m[2].trim() + '\n```\n\n';
            } else if (tl.startsWith('code:')) {
                out += '`' + tl.substring(5).trim() + '`' + '\n\n';
            }
            i++;
        }
        return out;
    }
}

if (process.argv.length >= 4) {
    Converter.convertCurlyPromptToSKILL(process.argv[2], process.argv[3]);
}
