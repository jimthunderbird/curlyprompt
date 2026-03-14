#!/usr/bin/env python3
"""
Generate 5,000 CurlyPrompt -> SKILL Markdown fine-tuning pairs using Faker.
Output: dataset.jsonl  (one JSON object per line with "input" and "output" keys)
"""

import json
import random
import re
from faker import Faker

fake = Faker()
Faker.seed(42)
random.seed(42)

# ── Stop-word lists (from action.js) ────────────────────────────────────────
STRONG_STOP = {
    "to", "for", "in", "with", "and", "or", "within", "from", "by", "at",
    "on", "of", "as", "the", "is", "are", "a", "an", "instruction", "token",
    "supported", "setup", "requests", "mock", "approach", "function", "word",
    "text", "specification", "element", "steps", "style", "content",
    "authentication", "inside", "guide", "mode", "scripts", "paragraph",
}
ITALIC_STOP = {
    "to", "for", "in", "with", "and", "or", "within", "from", "by", "at",
    "on", "of", "as", "the", "is", "are", "a", "an", "text", "information",
    "reviewers",
}
CODE_STOP = {
    "to", "for", "in", "with", "and", "or", "within", "from", "by", "at",
    "on", "of", "as", "the", "is", "are", "a", "an", "parameters", "branch",
    "prefix",
}

# ── Helpers ─────────────────────────────────────────────────────────────────

def word_token():
    """Return a single word safe for word-capture formatting (no stop words)."""
    while True:
        w = fake.word()
        if w.lower() not in STRONG_STOP | ITALIC_STOP | CODE_STOP and re.match(r'^[\w]+$', w):
            return w


def safe_words(n, stop_set):
    """Return n words that are NOT in the given stop_set."""
    out = []
    for _ in range(n):
        while True:
            w = fake.word()
            if w.lower() not in stop_set and re.match(r'^[\w.]+$', w):
                out.append(w)
                break
    return out


def sentence_fragment(min_w=3, max_w=10):
    """Generate a plain sentence fragment (no DSL markers)."""
    words = []
    for _ in range(random.randint(min_w, max_w)):
        words.append(fake.word())
    return " ".join(words)


def process_formatting(text):
    """Python port of action.js processFormatting()."""
    # 1. link brace syntax
    def link_brace_repl(m):
        inner = m.group(1)
        dm = re.search(r'display:"([^"]+)"', inner)
        um = re.search(r'url:"([^"]+)"', inner)
        display = dm.group(1) if dm else ""
        url = um.group(1) if um else ""
        return f"[{display}]({url})"
    text = re.sub(r'link\s*\{([^}]+)\}', link_brace_repl, text)

    # 2. link colon syntax
    text = re.sub(r'link:(.+?):(https?://\S+)', r'[\1](\2)', text)

    # 3. brace inline: strong{...}, italic{...}, code{...}
    text = re.sub(r'strong\{([^}]+)\}', r'**\1**', text)
    text = re.sub(r'italic\{([^}]+)\}', r'*\1*', text)
    text = re.sub(r'code\{([^}]+)\}', r'`\1`', text)

    # 4. word-capture strong:
    sw = r'(?:' + '|'.join(sorted(STRONG_STOP)) + r')'
    text = re.sub(
        rf'strong:([\w.]+(?:-[\w.]+)*(?:\s+(?!{sw}\b)[\w.]+(?:-[\w.]+)*)*)',
        r'**\1**', text
    )

    # 5. word-capture italic:
    iw = r'(?:' + '|'.join(sorted(ITALIC_STOP)) + r')'
    text = re.sub(
        rf'italic:([\w.]+(?:-[\w.]+)*(?:\s+(?!{iw}\b)[\w.]+(?:-[\w.]+)*)*)',
        r'*\1*', text
    )

    # 6. word-capture code:
    cw = r'(?:' + '|'.join(sorted(CODE_STOP)) + r')'
    text = re.sub(
        rf'code:\s*(\S+(?:\s+(?!{cw}\b)\S+)*)',
        r'`\1`', text
    )

    return text


# ── Inline formatting generators ───────────────────────────────────────────

def gen_strong_word():
    """Generate a strong:WORD phrase with its Markdown equivalent."""
    words = safe_words(random.randint(1, 3), STRONG_STOP)
    tail_options = list(STRONG_STOP - {"a", "an"})
    tail = random.choice(tail_options)
    remaining = sentence_fragment(1, 4)
    curly_text = f"strong:{' '.join(words)} {tail} {remaining}"
    md_text = f"**{' '.join(words)}** {tail} {remaining}"
    return curly_text, md_text


def gen_italic_word():
    words = safe_words(random.randint(1, 2), ITALIC_STOP)
    tail = random.choice(list(ITALIC_STOP - {"a", "an"}))
    remaining = sentence_fragment(1, 4)
    curly_text = f"italic:{' '.join(words)} {tail} {remaining}"
    md_text = f"*{' '.join(words)}* {tail} {remaining}"
    return curly_text, md_text


def gen_code_word():
    tokens = []
    for _ in range(random.randint(1, 2)):
        tokens.append(fake.pystr(min_chars=3, max_chars=8))
    tail = random.choice(list(CODE_STOP - {"a", "an"}))
    remaining = sentence_fragment(1, 3)
    curly_text = f"code:{' '.join(tokens)} {tail} {remaining}"
    md_text = f"`{' '.join(tokens)}` {tail} {remaining}"
    return curly_text, md_text


def gen_strong_brace():
    text = sentence_fragment(1, 4)
    return f"strong{{{text}}}", f"**{text}**"


def gen_italic_brace():
    text = sentence_fragment(1, 4)
    return f"italic{{{text}}}", f"*{text}*"


def gen_code_brace():
    text = fake.pystr(min_chars=4, max_chars=15)
    return f"code{{{text}}}", f"`{text}`"


def gen_link_colon():
    display = fake.company().replace('"', '')[:20]
    url = fake.url(schemes=["https"])
    return f"link:{display}:{url}", f"[{display}]({url})"


def gen_link_brace():
    display = fake.bs().replace('"', '').title()[:25]
    url = fake.url(schemes=["https"])
    # Vary spacing
    sp = random.choice(["", " ", "  "])
    inner_sp = random.choice(["", " ", "  "])
    sep = random.choice([" ", ", ", " , "])
    if random.choice([True, False]):
        inner = f'{inner_sp}display:"{display}"{sep}url:"{url}"{inner_sp}'
    else:
        inner = f'{inner_sp}url:"{url}"{sep}display:"{display}"{inner_sp}'
    curly = f"link{sp}{{{inner}}}"
    md = f"[{display}]({url})"
    return curly, md


def gen_formatted_text():
    """Generate a sentence with 0-2 inline formatting elements mixed in."""
    parts_curly = []
    parts_md = []
    n_parts = random.randint(2, 5)
    fmt_positions = set(random.sample(range(n_parts), min(random.randint(0, 2), n_parts)))

    for idx in range(n_parts):
        if idx in fmt_positions:
            fmt_type = random.choice([
                "strong_word", "italic_word", "code_word",
                "strong_brace", "italic_brace", "code_brace",
                "link_colon", "link_brace",
            ])
            if fmt_type == "strong_word":
                c, m = gen_strong_word()
            elif fmt_type == "italic_word":
                c, m = gen_italic_word()
            elif fmt_type == "code_word":
                c, m = gen_code_word()
            elif fmt_type == "strong_brace":
                c, m = gen_strong_brace()
            elif fmt_type == "italic_brace":
                c, m = gen_italic_brace()
            elif fmt_type == "code_brace":
                c, m = gen_code_brace()
            elif fmt_type == "link_colon":
                c, m = gen_link_colon()
            else:
                c, m = gen_link_brace()
            parts_curly.append(c)
            parts_md.append(m)
        else:
            frag = sentence_fragment(1, 5)
            parts_curly.append(frag)
            parts_md.append(frag)

    return " ".join(parts_curly), " ".join(parts_md)


# ── Content element generators ─────────────────────────────────────────────
# Each returns (list_of_prompt_lines, list_of_md_lines)

def gen_header(level=None):
    if level is None:
        level = random.randint(1, 6)
    title_plain = fake.catch_phrase().replace('"', '')
    use_braces = random.choice([True, False])
    # Optionally add inline formatting to the title (use brace form for predictable boundaries)
    if random.random() < 0.3:
        w = word_token()
        fmt = random.choice(["strong", "italic"])
        if fmt == "strong":
            title_curly = f"strong{{{w}}} {title_plain}"
            title_md = f"**{w}** {title_plain}"
        else:
            title_curly = f"italic{{{w}}} {title_plain}"
            title_md = f"*{w}* {title_plain}"
    else:
        title_curly = title_plain
        title_md = title_plain

    prompt_line = f"h{level}:{title_curly}"
    md_line = f"{'#' * level} {title_md}"

    if use_braces:
        prompt_line += " {"
    return [prompt_line], [md_line, ""], use_braces


def gen_paragraph_inline():
    """p:TEXT form."""
    c, m = gen_formatted_text()
    return [f"p:{c}"], [m, ""]


def gen_paragraph_block():
    """p { ... } form."""
    n_lines = random.randint(1, 4)
    prompt_lines = ["p {"]
    md_lines = []
    for _ in range(n_lines):
        c, m = gen_formatted_text()
        prompt_lines.append(f"  {c}")
        md_lines.append(m)
    prompt_lines.append("}")
    md_lines.append("")
    return prompt_lines, md_lines


def gen_paragraph_sameline():
    """p{TEXT} form."""
    c, m = gen_formatted_text()
    return [f"p{{{c}}}"], [m, ""]


def gen_ul():
    n = random.randint(2, 6)
    prompt_lines = ["ul {"]
    md_lines = []
    for _ in range(n):
        c, m = gen_formatted_text()
        prompt_lines.append(f"  li:{c}")
        md_lines.append(f"- {m}")
    prompt_lines.append("}")
    md_lines.append("")
    return prompt_lines, md_lines


def gen_ol():
    n = random.randint(2, 6)
    prompt_lines = ["ol {"]
    md_lines = []
    for i in range(n):
        c, m = gen_formatted_text()
        prompt_lines.append(f"  li:{c}")
        md_lines.append(f"{i+1}. {m}")
    prompt_lines.append("}")
    md_lines.append("")
    return prompt_lines, md_lines


def gen_standalone_li():
    c, m = gen_formatted_text()
    return [f"li:{c}"], [f"- {m}"]


def gen_code_block():
    n = random.randint(1, 5)
    prompt_lines = ["code {"]
    code_content = []
    for _ in range(n):
        # Generate realistic-ish code lines
        line_type = random.choice(["assign", "call", "comment", "import"])
        if line_type == "assign":
            code_line = f"  {fake.pystr(min_chars=3, max_chars=8)} = {fake.pystr(min_chars=5, max_chars=15)}"
        elif line_type == "call":
            code_line = f"  {fake.pystr(min_chars=3, max_chars=8)}({fake.pystr(min_chars=3, max_chars=10)})"
        elif line_type == "comment":
            code_line = f"  // {sentence_fragment(3, 8)}"
        else:
            code_line = f"  import {fake.pystr(min_chars=4, max_chars=10)}"
        prompt_lines.append(code_line)
        code_content.append(code_line)
    prompt_lines.append("}")

    # Strip common indent (matching action.js behavior)
    min_indent = float('inf')
    for cl in code_content:
        if cl.strip() == "":
            continue
        indent = len(cl) - len(cl.lstrip())
        min_indent = min(min_indent, indent)
    if min_indent == float('inf'):
        min_indent = 0

    md_lines = ["```"]
    for cl in code_content:
        md_lines.append(cl[min_indent:])
    md_lines.append("```")
    md_lines.append("")
    return prompt_lines, md_lines


def gen_blockquote():
    use_bq = random.choice([True, False])
    c, m = gen_formatted_text()
    prefix = "bq" if use_bq else "blockquote"
    return [f"{prefix}:{c}"], [f"> {m}", ""]


def gen_hr():
    return ["hr"], ["---", ""]


def gen_img_colon():
    alt = fake.word().capitalize() + " " + fake.word().capitalize()
    path = f"{fake.file_path(depth=2, extension=random.choice(['png', 'jpg', 'svg']))}"
    # remove leading /
    path = path.lstrip("/")
    return [f"img:{alt}:{path}"], [f"![{alt}]({path})", ""]


def gen_img_brace():
    alt = fake.word().capitalize() + " " + fake.word().capitalize()
    url = fake.image_url()
    sp = random.choice(["", " ", "  "])
    inner_sp = random.choice(["", " "])
    return (
        [f'img{sp}{{{inner_sp}src:"{url}" alt:"{alt}"{inner_sp}}}'],
        [f"![{alt}]({url})", ""],
    )


def gen_table():
    n_cols = random.randint(2, 4)
    n_rows = random.randint(1, 4)
    use_th = random.choice([True, False])

    prompt_lines = ["table {"]
    header_cells = [fake.word().capitalize() for _ in range(n_cols)]

    # Header row
    if use_th:
        prompt_lines.append("  tr {")
        for cell in header_cells:
            prompt_lines.append(f"    th: {cell}")
        prompt_lines.append("  }")
    else:
        prompt_lines.append("  tr {")
        for cell in header_cells:
            prompt_lines.append(f"    td: {cell}")
        prompt_lines.append("  }")

    md_lines = []
    md_lines.append("| " + " | ".join(header_cells) + " |")
    md_lines.append("| " + " | ".join(["---"] * n_cols) + " |")

    # Data rows
    for _ in range(n_rows):
        prompt_lines.append("  tr {")
        cells = []
        for _ in range(n_cols):
            # Occasionally use inline formatting in cells
            if random.random() < 0.2:
                w = word_token()
                prompt_lines.append(f"    td: strong{{{w}}}")
                cells.append(f"**{w}**")
            elif random.random() < 0.15:
                w = word_token()
                prompt_lines.append(f"    td: italic{{{w}}}")
                cells.append(f"*{w}*")
            else:
                cell_text = fake.word()
                prompt_lines.append(f"    td: {cell_text}")
                cells.append(cell_text)
        prompt_lines.append("  }")
        md_lines.append("| " + " | ".join(cells) + " |")

    prompt_lines.append("}")
    md_lines.append("")
    return prompt_lines, md_lines


def gen_standalone_code_line():
    text = fake.pystr(min_chars=5, max_chars=20)
    return [f"code:{text}"], [f"`{text}`", ""]


# ── Element weights ─────────────────────────────────────────────────────────

ELEMENT_GENERATORS = [
    (gen_paragraph_inline, 25),
    (gen_paragraph_block, 10),
    (gen_paragraph_sameline, 8),
    (gen_ul, 15),
    (gen_ol, 12),
    (gen_code_block, 10),
    (gen_blockquote, 8),
    (gen_hr, 4),
    (gen_img_colon, 5),
    (gen_img_brace, 5),
    (gen_table, 6),
    (gen_standalone_li, 4),
    (gen_standalone_code_line, 4),
]


def pick_element():
    gens, weights = zip(*ELEMENT_GENERATORS)
    return random.choices(gens, weights=weights, k=1)[0]


# ── Frontmatter generators ─────────────────────────────────────────────────

LICENSES = ["MIT", "Apache-2.0", "Apache 2.0", "GPL-3.0", "BSD-3-Clause", "ISC", "MPL-2.0", "Unlicense"]


def gen_frontmatter():
    """Return (prompt_lines, md_lines) for the frontmatter section."""
    fm_style = random.choice(["flat", "header", "head"])
    use_quotes = random.choice([True, False])

    name = fake.catch_phrase().replace('"', '')
    desc = fake.sentence(nb_words=random.randint(4, 10)).rstrip(".").replace('"', '')
    license_val = random.choice(LICENSES)
    version = f"{random.randint(0, 5)}.{random.randint(0, 9)}"

    has_include = random.random() < 0.25
    has_meta = random.random() < 0.3

    include_file = fake.file_name(extension="md") if has_include else None

    meta_keys = {}
    if has_meta:
        n_meta = random.randint(1, 4)
        possible_keys = ["author", "team", "priority", "category", "status",
                         "env", "region", "owner", "tier", "language"]
        chosen = random.sample(possible_keys, min(n_meta, len(possible_keys)))
        for k in chosen:
            meta_keys[k] = fake.word()

    def q(val):
        return f'"{val}"' if use_quotes else val

    # Which keys to include (name always, others random)
    include_desc = random.random() < 0.85
    include_license = random.random() < 0.6
    include_version = random.random() < 0.7

    # Build prompt and md frontmatter
    prompt_kv = []
    md_kv = []

    prompt_kv.append(f"name: {q(name)}")
    md_kv.append(f"name: {name}")

    if include_desc:
        prompt_kv.append(f"description: {q(desc)}")
        md_kv.append(f"description: {desc}")

    if include_license:
        prompt_kv.append(f"license: {q(license_val)}")
        md_kv.append(f"license: {license_val}")

    if include_version:
        prompt_kv.append(f"version: {q(version)}")
        md_kv.append(f"version: {version}")

    if has_include:
        prompt_kv.append(f"include: {q(include_file)}")
        md_kv.append(f"include: {include_file}")

    meta_prompt = []
    meta_md = []
    if has_meta:
        meta_prompt.append("meta {")
        meta_md.append("meta:")
        for k, v in meta_keys.items():
            meta_prompt.append(f"  {k}: {v}")
            meta_md.append(f"  {k}: {v}")
        meta_prompt.append("}")

    # Assemble
    prompt_lines = []
    md_lines = ["---"]

    content_keyword = random.choice(["content", "body"])

    if fm_style == "flat":
        for line in prompt_kv:
            prompt_lines.append(f"  {line}")
        for line in meta_prompt:
            prompt_lines.append(f"  {line}")
        prompt_lines.append(f"  {content_keyword} {{")
    elif fm_style in ("header", "head"):
        kw = fm_style
        prompt_lines.append(f"  {kw} {{")
        for line in prompt_kv:
            prompt_lines.append(f"    {line}")
        for line in meta_prompt:
            prompt_lines.append(f"    {line}")
        prompt_lines.append("  }")
        prompt_lines.append(f"  {content_keyword} {{")

    md_lines.extend(md_kv)
    md_lines.extend(meta_md)
    md_lines.append("---")
    md_lines.append("")

    return prompt_lines, md_lines, content_keyword


# ── Full document generator ────────────────────────────────────────────────

def generate_sample():
    """Generate one (curly_prompt, markdown) pair."""
    fm_prompt, fm_md, content_kw = gen_frontmatter()

    # Generate content elements
    n_elements = random.randint(2, 12)
    content_prompt = []
    content_md = []

    # Always start with at least one header
    h_prompt, h_md, has_brace = gen_header(level=1)
    content_prompt.extend(["    " + l for l in h_prompt])
    content_md.extend(h_md)

    open_sections = 0
    if has_brace:
        open_sections += 1

    for _ in range(n_elements):
        # Sometimes add a new header section
        if random.random() < 0.25:
            # Close any open section first
            if open_sections > 0 and random.random() < 0.5:
                content_prompt.append("    }")
                open_sections -= 1

            level = random.randint(1, 4)
            h_prompt, h_md, has_brace = gen_header(level)
            indent = "    " + "  " * open_sections
            content_prompt.extend([indent + l for l in h_prompt])
            content_md.extend(h_md)
            if has_brace:
                open_sections += 1
        else:
            gen = pick_element()
            elem_prompt, elem_md = gen()
            indent = "    " + "  " * open_sections
            content_prompt.extend([indent + l for l in elem_prompt])
            content_md.extend(elem_md)

    # Close all open sections
    while open_sections > 0:
        content_prompt.append("    }")
        open_sections -= 1

    # Assemble full prompt
    prompt_lines = ["skill {"]
    prompt_lines.extend(fm_prompt)
    prompt_lines.extend(content_prompt)
    prompt_lines.append(f"  }}")  # close content
    prompt_lines.append("}")

    # Assemble full markdown
    all_md = fm_md + content_md
    md_text = "\n".join(all_md) + "\n"

    prompt_text = "\n".join(prompt_lines) + "\n"

    return prompt_text, md_text


# ── Validation: run through action.js ───────────────────────────────────────

def validate_sample(prompt_text, expected_md):
    """Write prompt to temp file, run action.js, compare output."""
    import subprocess, tempfile, os
    with tempfile.NamedTemporaryFile(mode='w', suffix='.prompt', delete=False) as f:
        f.write(prompt_text)
        prompt_path = f.name
    md_path = prompt_path.replace('.prompt', '.md')
    try:
        action_js = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'action.js')
        result = subprocess.run(
            ['node', action_js, prompt_path, md_path],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode != 0:
            return False, f"action.js error: {result.stderr}"
        with open(md_path, 'r') as f:
            actual_md = f.read()
        if actual_md == expected_md:
            return True, ""
        else:
            return False, f"MISMATCH\nEXPECTED:\n{repr(expected_md)}\nACTUAL:\n{repr(actual_md)}"
    except Exception as e:
        return False, str(e)
    finally:
        for p in [prompt_path, md_path]:
            try:
                os.unlink(p)
            except:
                pass


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    import sys
    N = 5000
    validate = "--validate" in sys.argv
    validate_count = 50 if validate else 0

    seen = set()
    samples = []
    attempts = 0
    max_attempts = N * 3

    print(f"Generating {N} unique samples...")

    while len(samples) < N and attempts < max_attempts:
        attempts += 1
        try:
            prompt, md = generate_sample()
        except Exception:
            continue

        # Deduplicate by prompt
        key = prompt.strip()
        if key in seen:
            continue
        seen.add(key)

        samples.append((prompt, md))

        if len(samples) % 500 == 0:
            print(f"  {len(samples)}/{N} generated...")

    print(f"Generated {len(samples)} unique samples in {attempts} attempts.")

    # Optional validation of a subset
    if validate and len(samples) > 0:
        print(f"Validating first {validate_count} samples against action.js...")
        passed = 0
        failed = 0
        for i in range(min(validate_count, len(samples))):
            ok, msg = validate_sample(samples[i][0], samples[i][1])
            if ok:
                passed += 1
            else:
                failed += 1
                if failed <= 5:
                    print(f"  FAIL sample {i}: {msg[:200]}")
        print(f"  Validation: {passed}/{passed+failed} passed")

    # Write JSONL
    output_path = "dataset.jsonl"
    with open(output_path, "w") as f:
        for prompt, md in samples:
            record = {
                "input": prompt,
                "output": md,
            }
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

    print(f"Wrote {len(samples)} samples to {output_path}")


if __name__ == "__main__":
    main()
