import json
import random
import os

# Create the data directory
os.makedirs("data", exist_ok=True)

# Load your data
with open('dataset.jsonl', 'r') as f:
    lines = [json.loads(line) for line in f]

# Rename keys to prompt/completion if needed
for line in lines:
    if "input" in line:
        line["prompt"] = line.pop("input")
    if "output" in line:
        line["completion"] = line.pop("output")

# Shuffle and split (80% train, 10% valid, 10% test)
random.shuffle(lines)
n = len(lines)
train = lines[:int(n*0.8)]
valid = lines[int(n*0.8):int(n*0.9)]
test = lines[int(n*0.9):]

def save_jsonl(data, filename):
    with open(f"data/{filename}", 'w') as f:
        for entry in data:
            f.write(json.dumps(entry) + '\n')

save_jsonl(train, 'train.jsonl')
save_jsonl(valid, 'valid.jsonl')
save_jsonl(test, 'test.jsonl')

print("Data split into data/train.jsonl, data/valid.jsonl, and data/test.jsonl")
