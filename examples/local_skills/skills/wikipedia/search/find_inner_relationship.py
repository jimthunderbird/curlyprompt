import wikipediaapi
import ollama
import re

# Initialize Wikipedia API
wiki = wikipediaapi.Wikipedia(
    user_agent="WikiRelationBot/1.0 (your@email.com)",
    language='en'
)

MODEL = "qwen3:30b-a3b"

def get_page_data(title):
    page = wiki.page(title)
    if not page.exists():
        return None, None
    return page.text, page.categories

def find_intersection(text_a, title_b):
    """Finds paragraphs in Article A that mention Article B."""
    # Use regex for case-insensitive matching of the entity name
    paragraphs = text_a.split('\n')
    relevant = [p for p in paragraphs if re.search(rf"\b{title_b}\b", p, re.IGNORECASE)]
    return "\n".join(relevant[:3]) # Return top 3 matches to save context

def analyze_with_qwen(entity_a, entity_b, context):
    print(f"--- Analyzing connection via Qwen3:30b ---")
    prompt = f"""
    Using Wikipedia as the sole source of truth, explain the relationship between '{entity_a}' and '{entity_b}'.
    
    WIKIPEDIA CONTEXT:
    {context}
    
    If the context mentions specific chemicals, historical events, or biological processes linking them, emphasize those.
    """
    response = ollama.generate(model=MODEL, prompt=prompt)
    return response['response']

def connect_entities(entity_a, entity_b):
    print(f"Searching Wikipedia for '{entity_a}' and '{entity_b}'...")
    
    text_a, cats_a = get_page_data(entity_a)
    text_b, cats_b = get_page_data(entity_b)
    
    if not text_a or not text_b:
        return "One or both Wikipedia articles could not be found."

    # 1. Direct Mention Check (A -> B)
    bridge_context = find_intersection(text_a, entity_b)
    
    # 2. Reverse Mention Check (B -> A)
    if not bridge_context:
        bridge_context = find_intersection(text_b, entity_a)
        
    # 3. Category Overlap Check (The 'Hidden' Connection)
    if not bridge_context:
        common_cats = set(cats_a.keys()) & set(cats_b.keys())
        if common_cats:
            bridge_context = f"Both entities share Wikipedia categories: {', '.join(list(common_cats)[:3])}"

    if bridge_context:
        return analyze_with_qwen(entity_a, entity_b, bridge_context)
    else:
        return f"No direct or categorical link found on Wikipedia between {entity_a} and {entity_b}."

# --- TEST IT ---
# Example: "Cantonese salted fish" and "Nasopharyngeal carcinoma" (Cancer)
result = connect_entities("Cantonese salted fish", "Cancer")
print("\nRESULT:\n", result)
