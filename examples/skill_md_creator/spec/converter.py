import sys
import re
import math


class Converter:
    @staticmethod
    def convert_curly_prompt_to_skill(source_prompt_file, target_md_file):
        with open(source_prompt_file, 'r', encoding='utf-8') as f:
            source_prompt_content = f.read()
        lines = source_prompt_content.split('\n')
        output_lines = []
        frontmatter = {}
        content_lines = []
        in_skill = False
        in_content = False

        # Step 1: Parse the source file line by line
        i = 0
        while i < len(lines):
            line = lines[i].strip()

            if not in_skill and re.match(r'^skill\s*\{', line):
                in_skill = True
                i += 1
                continue

            if not in_skill:
                i += 1
                continue

            if not in_content:
                # Handle header { } block - contains frontmatter key-value pairs
                if re.match(r'^(?:header|head)\s*\{', line):
                    i += 1
                    while i < len(lines):
                        header_line = lines[i].strip()
                        if header_line == '}':
                            break
                        i = Converter._parse_frontmatter_line(header_line, frontmatter, lines, i)
                        i += 1
                    i += 1
                    continue

                # Parse frontmatter key-value pairs (flat structure, no header block)
                i = Converter._parse_frontmatter_line(line, frontmatter, lines, i)

                if re.match(r'^(?:content|body)\s*\{', line):
                    in_content = True
                    i += 1
                    continue
            else:
                # Collect all lines inside the content block into content_lines array
                # Store RAW (untrimmed) lines for code block indentation preservation
                brace_depth = 1
                j = i
                while j < len(lines):
                    inner_line_raw = lines[j]
                    inner_line = inner_line_raw.strip()
                    if inner_line == '}':
                        brace_depth -= 1
                        if brace_depth == 0:
                            break
                    else:
                        brace_depth += len(re.findall(r'\{', inner_line))
                        brace_depth -= len(re.findall(r'\}', inner_line))
                    content_lines.append(inner_line_raw)
                    j += 1
                i = j

            i += 1

        # Step 2: Build the frontmatter section
        output_lines.append('---')
        for key in frontmatter:
            if key == 'meta':
                output_lines.append('meta:')
                for attr_key in frontmatter['meta']:
                    output_lines.append('  ' + attr_key + ': ' + frontmatter['meta'][attr_key])
            else:
                output_lines.append(key + ': ' + frontmatter[key])
        output_lines.append('---')
        output_lines.append('')

        # Step 3: Process content_lines to generate markdown
        Converter._process_content_lines(content_lines, output_lines)

        # Step 4: Join output_lines with newline and add trailing newline
        target_md_content = '\n'.join(output_lines) + '\n'
        with open(target_md_file, 'w', encoding='utf-8') as f:
            f.write(target_md_content)

    @staticmethod
    def _parse_frontmatter_line(line, frontmatter, lines, i):
        if line.startswith('name:'):
            frontmatter['name'] = line[5:].strip().replace('"', '')
        elif line.startswith('description:'):
            frontmatter['description'] = line[12:].strip().replace('"', '')
        elif line.startswith('license:'):
            frontmatter['license'] = line[8:].strip().replace('"', '')
        elif line.startswith('version:'):
            frontmatter['version'] = line[8:].strip().replace('"', '')
        elif line.startswith('include:'):
            frontmatter['include'] = line[8:].strip().replace('"', '')
        elif re.match(r'^meta\s*\{', line):
            frontmatter['meta'] = {}
            j = i + 1
            while j < len(lines):
                meta_line = lines[j].strip()
                if meta_line == '}':
                    break
                colon_idx = meta_line.find(':')
                if colon_idx != -1:
                    key = meta_line[:colon_idx].strip()
                    value = meta_line[colon_idx + 1:].strip().replace('"', '')
                    frontmatter['meta'][key] = value
                j += 1
            return j
        return i

    @staticmethod
    def _process_formatting(text):
        # Process links: link{display:"..." url:"..."} (brace syntax with flexible spacing)
        def link_brace_replacer(match):
            inner = match.group(1)
            display = ''
            url = ''
            display_match = re.search(r'display:"([^"]+)"', inner)
            url_match = re.search(r'url:"([^"]+)"', inner)
            if display_match:
                display = display_match.group(1)
            if url_match:
                url = url_match.group(1)
            return '[' + display + '](' + url + ')'

        text = re.sub(r'link\s*\{([^}]+)\}', link_brace_replacer, text)

        # Process links: link:display text:url
        text = re.sub(r'link:(.+?):(https?://\S+)', r'[\1](\2)', text)

        # Process same-line open/close: strong{...}/bold{...}/b{...}, italic{...}/i{...}, code{...}
        text = re.sub(r'(?:strong|bold|b)\s*\{([^}]+)\}', r'**\1**', text)
        text = re.sub(r'(?:italic|it|i)\s*\{([^}]+)\}', r'*\1*', text)
        text = re.sub(r'code\s*\{([^}]+)\}', r'`\1`', text)

        # Process strong/bold/b: captures to end of line
        text = re.sub(r'(?:strong|bold|b):(.+)$', r'**\1**', text)

        # Process italic/i: captures to end of line
        text = re.sub(r'(?:italic|it|i):(.+)$', r'*\1*', text)

        # Process inline code: captures to end of line
        text = re.sub(r'code:\s*(.+)$', r'`\1`', text)

        return text

    @staticmethod
    def _process_content_lines(lines, output):
        i = 0
        while i < len(lines):
            line = lines[i].strip()

            if line == '' or line == '}':
                i += 1
                continue

            # Handle headers
            header_match = re.match(r'^(h[1-6]):(.*)', line)
            if header_match:
                level = int(header_match.group(1)[1])
                text = header_match.group(2).strip()
                if text.endswith('{'):
                    text = text[:-1].strip()
                text = Converter._process_formatting(text)
                output.append('#' * level + ' ' + text)
                output.append('')
                i += 1
                continue

            # Handle paragraphs (same-line form: p{...})
            p_inline_match = re.match(r'^p\s*\{(.+)\}$', line)
            if p_inline_match:
                text = Converter._process_formatting(p_inline_match.group(1))
                output.append(text)
                output.append('')
                i += 1
                continue

            # Handle paragraphs (block form: p { ... })
            if re.match(r'^p\s*\{', line):
                i += 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        break
                    if inner == 'br:':
                        output.append('')
                    elif inner != '':
                        text = Converter._process_formatting(inner)
                        output.append(text)
                    i += 1
                output.append('')
                i += 1
                continue

            # Handle paragraphs (inline form: p:TEXT)
            if line.startswith('p:'):
                text = line[2:].strip()
                text = Converter._process_formatting(text)
                output.append(text)
                output.append('')
                i += 1
                continue

            # Handle unordered lists
            if re.match(r'^ul\s*\{', line):
                i += 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        break
                    if inner.startswith('li:'):
                        text = inner[3:].strip()
                        text = Converter._process_formatting(text)
                        output.append('- ' + text)
                    i += 1
                output.append('')
                i += 1
                continue

            # Handle ordered lists
            if re.match(r'^ol\s*\{', line):
                i += 1
                num = 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        break
                    if inner.startswith('li:'):
                        text = inner[3:].strip()
                        text = Converter._process_formatting(text)
                        output.append(str(num) + '. ' + text)
                        num += 1
                    i += 1
                output.append('')
                i += 1
                continue

            # Handle code blocks (with optional language: code { } or code.<lang> { })
            code_block_match = re.match(r'^code(?:\.(\w+))?\s*\{', line)
            if code_block_match:
                lang = code_block_match.group(1) or ''
                i += 1
                code_lines = []
                depth = 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        depth -= 1
                        if depth == 0:
                            break
                        code_lines.append(lines[i])
                    else:
                        if inner != '':
                            depth += len(re.findall(r'\{', inner))
                            depth -= len(re.findall(r'\}', inner))
                        code_lines.append(lines[i])
                    i += 1
                # Strip common indentation
                min_indent = math.inf
                for cl in code_lines:
                    if cl.strip() == '':
                        continue
                    indent = len(re.match(r'^(\s*)', cl).group(1))
                    if indent < min_indent:
                        min_indent = indent
                if min_indent == math.inf:
                    min_indent = 0
                else:
                    min_indent = int(min_indent)
                output.append('```' + lang)
                for cl in code_lines:
                    output.append(cl[min_indent:])
                output.append('```')
                output.append('')
                i += 1
                continue

            # Handle multi-line blockquotes (blockquote { } or bq { })
            if re.match(r'^(?:blockquote|bq)\s*\{', line):
                i += 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        break
                    if inner != '':
                        text = Converter._process_formatting(inner)
                        output.append('> ' + text)
                    i += 1
                output.append('')
                i += 1
                continue

            # Handle blockquotes (blockquote: or bq:)
            if line.startswith('blockquote:') or line.startswith('bq:'):
                prefix = 'blockquote:' if line.startswith('blockquote:') else 'bq:'
                text = line[len(prefix):].strip()
                text = Converter._process_formatting(text)
                output.append('> ' + text)
                output.append('')
                i += 1
                continue

            # Handle line breaks
            if line == 'br:':
                output.append('')
                i += 1
                continue

            # Handle horizontal rules
            if line == 'hr':
                output.append('---')
                output.append('')
                i += 1
                continue

            # Handle images (brace syntax)
            img_brace_match = re.match(r'^img\s*\{(.+)\}$', line)
            if img_brace_match:
                inner = img_brace_match.group(1)
                src = ''
                alt = ''
                src_match = re.search(r'src:"([^"]+)"', inner)
                alt_match = re.search(r'alt:"([^"]+)"', inner)
                if src_match:
                    src = src_match.group(1)
                if alt_match:
                    alt = alt_match.group(1)
                output.append('![' + alt + '](' + src + ')')
                output.append('')
                i += 1
                continue
            if line.startswith('img:'):
                rest = line[4:]
                colon_idx = rest.index(':')
                alt = rest[:colon_idx]
                path = rest[colon_idx + 1:]
                output.append('![' + alt + '](' + path + ')')
                output.append('')
                i += 1
                continue

            # Handle tables
            if re.match(r'^table\s*\{', line):
                rows = []
                i += 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        break
                    if re.match(r'^tr\s*\{', inner):
                        cells = []
                        is_header_row = False
                        i += 1
                        while i < len(lines):
                            cell_line = lines[i].strip()
                            if cell_line == '}':
                                break
                            if cell_line.startswith('th:'):
                                is_header_row = True
                                text = cell_line[3:].strip()
                                text = Converter._process_formatting(text)
                                cells.append(text)
                            elif cell_line.startswith('td:'):
                                text = cell_line[3:].strip()
                                text = Converter._process_formatting(text)
                                cells.append(text)
                            i += 1
                        rows.append({'cells': cells, 'is_header': is_header_row})
                    i += 1
                if rows:
                    first_row = rows[0]
                    col_count = len(first_row['cells'])
                    # Emit header row
                    output.append('| ' + ' | '.join(first_row['cells']) + ' |')
                    # Emit separator
                    output.append('| ' + ' | '.join(['---'] * col_count) + ' |')
                    # Emit data rows (skip first row since it's used as header)
                    for r in range(1, len(rows)):
                        output.append('| ' + ' | '.join(rows[r]['cells']) + ' |')
                    output.append('')
                i += 1
                continue

            # Handle checklists (checklist or cl)
            if re.match(r'^(?:checklist|cl)\s*\{', line):
                i += 1
                while i < len(lines):
                    inner = lines[i].strip()
                    if inner == '}':
                        break
                    # item.checked / itm.c
                    checked_match = re.match(r'^(?:item\.checked|itm\.c):', inner)
                    if checked_match:
                        text = inner[checked_match.end():].strip()
                        text = Converter._process_formatting(text)
                        output.append('- [x] ' + text)
                    else:
                        # item.unchecked / itm.u / item (plain)
                        unchecked_match = re.match(r'^(?:item\.unchecked|itm\.u|item):', inner)
                        if unchecked_match:
                            text = inner[unchecked_match.end():].strip()
                            text = Converter._process_formatting(text)
                            output.append('- [ ] ' + text)
                    i += 1
                output.append('')
                i += 1
                continue

            # Handle standalone list items
            if line.startswith('li:'):
                text = line[3:].strip()
                text = Converter._process_formatting(text)
                output.append('- ' + text)
                i += 1
                continue

            # Handle standalone code.<lang>:TEXT (single-line language code block)
            code_lang_inline_match = re.match(r'^code\.(\w+):(.+)$', line)
            if code_lang_inline_match:
                lang = code_lang_inline_match.group(1)
                text = code_lang_inline_match.group(2).strip()
                output.append('```' + lang)
                output.append(text)
                output.append('```')
                output.append('')
                i += 1
                continue

            # Handle standalone code: lines (inline code as paragraph)
            if line.startswith('code:'):
                text = line[5:].strip()
                output.append('`' + text + '`')
                output.append('')
                i += 1
                continue

            i += 1


# CLI entry point
if __name__ == '__main__':
    if len(sys.argv) >= 3:
        Converter.convert_curly_prompt_to_skill(sys.argv[1], sys.argv[2])
