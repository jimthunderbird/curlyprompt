---
description: use wikipedia api like https://en.wikipedia.org/w/api.php?action=query&titles=Quantum%20Computing&format=json to perform search
---

## Logic and Script

- if the user's question involves multiple persons:
break the user's question into N small question, one for each person
example: 
- question: what is obama, warren buffett,donald trump, isaac newton's birthday and birth place
- code:
```python
persons = ["obama", "warren buffett", "donald trump", "isaac newton"]
save_to_file = "result.txt"
# empty the file first
with open(save_to_file, 'w', encoding='utf-8') as f:
    pass  # 'pass' does nothing, resulting in an empty file

results = []
for person in persons:
    keyword = person
    question = f"what is {person}'s birthday and birth place"
    num_of_results = 1
    try:
        # Run the skill for each person
        skills_wikipedia_search.run(question, keyword, num_of_results)
```

- if the user's question involves multiple entities and would like to know how are they related
  for each entity: 
    - search wiki on what is {entity}
    - save the findings on {entity}_findings.txt
  based on the related *_findings.txt, use skills.research.find_answer_for_question_from_files

{skill_package_import}
question = "What is Quantum Computing"
keyword = "Quantum Computing" //we should get the main entity from the question!
num_of_results = 1
save_to_file = "result.txt"
{skill_name}.run(question, keyword, num_of_results, save_to_file)
```
