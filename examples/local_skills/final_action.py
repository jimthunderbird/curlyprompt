def process_data(data):
    result = []
    for item in data:
        if isinstance(item, dict):
            processed = {key: value.upper() if key == 'name' else value 
                       for key, value in item.items()}
            result.append(processed)
        elif isinstance(item, str):
            result.append(item.upper())
    return result

# Example usage
input_data = [
    {'name': 'john', 'age': 30},
    {'name': 'jane', 'age': 25},
    'hello world'
]

output = process_data(input_data)
print(output)
