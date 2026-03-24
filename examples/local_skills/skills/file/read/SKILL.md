# Skill: File Reading in Python

## 🧠 Knowledge Map

### Theoretical Understanding
* **The Context Manager (`with` statement)**: This is the industry-standard way to handle files. It ensures that the file is properly closed after the suite finishes, even if an exception is raised. It manages the "lifecycle" of the file resource automatically.
* **File Objects as Iterators**: In Python, a file object returned by `open()` is an iterator. This means you can loop over it to read one line at a time, which is significantly more memory-efficient than loading the entire file into RAM.
* **Character Encoding**: Text files are stored as bytes. Python decodes these bytes into strings using an encoding (like `utf-8`). Always specifying the encoding prevents "mojibake" or `UnicodeDecodeError` across different operating systems.

### Practical Application: Tutorial & Examples

**1. The Basic "Safe" Read**
Always use the `with` keyword. This example reads the entire content of a small file into a single string.

```python
# Reading a whole file safely
with open("example.txt", "r", encoding="utf-8") as file:
    data = file.read()
    print(data)
