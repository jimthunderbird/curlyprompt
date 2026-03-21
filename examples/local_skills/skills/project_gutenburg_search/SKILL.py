import requests

def fetch_gutenberg_index():
    url = "https://www.gutenberg.org/dirs/GUTINDEX.ALL"
    response = requests.get(url)
    return response.text

def parse_index(content):
    lines = content.split('\n')
    entries = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Split on the last occurrence of two or more spaces
        parts = line.rsplit('  +', 1)
        if len(parts) != 2:
            continue
            
        part_a, part_b = parts[0].strip(), parts[1].strip()
        
        # Extract numeric ID from part_b
        book_id = ''.join(filter(str.isdigit, part_b))
        if not book_id:
            continue
            
        entries.append({
            'title': part_a,
            'id': book_id
        })
    
    return entries

def search_books(entries, keyword):
    results = []
    keyword_lower = keyword.lower()
    
    for entry in entries:
        if keyword_lower in entry['title'].lower():
            results.append(entry)
    
    return results

def format_results(results):
    markdown_table = "| Title | ID | Link |\n|---|---|---|\n"
    for entry in results:
        link = f"https://www.gutenberg.org/cache/epub/{entry['id']}/pg{entry['id']}.txt"
        markdown_table += f"| {entry['title']} | {entry['id']} | {link} |\n"
    return markdown_table

def main(payload):
    keyword = payload.get('keyword', 'sherlock holmes')
    
    content = fetch_gutenberg_index()
    entries = parse_index(content)
    results = search_books(entries, keyword)
    output = format_results(results)
    
    return output