from mlx_lm import load, generate

# Load your custom model
model, tokenizer = load("./fused_curlyprompt-skill-convert_gemma")

def convert_dsl(dsl_input):
    prompt = f"<user>\nConvert this DSL to SKILL.MD:\n{dsl_input}\n<assistant>\n"
    response = generate(model, tokenizer, prompt=prompt, verbose=False, max_tokens=1000)
    return response

# Test it
test_dsl = "skill { name: Table Test content { h1: Hello } }"
print(convert_dsl(test_dsl))
