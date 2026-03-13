---
name: Python Project Setup
description: Sets up a Python project with best practices
license: MIT
version: 1.0
---

# Project Setup

## Virtual Environment

Always use a virtual environment for Python projects.

- Create with python3 -m venv .venv
- Activate with source .venv/bin/activate
- Install dependencies with pip install -r requirements.txt

## Dependencies

Manage dependencies using **pip-tools** for reproducible builds.

- Define direct dependencies in requirements.in
- Compile locked dependencies with pip-compile
- Never edit requirements.txt manually

# Code Quality

## Linting

- Use ruff for fast Python linting
- Use mypy for type checking
- Use black for code formatting

## Testing

- Use pytest as the test framework
- Aim for 80 percent code coverage minimum
- Run tests with pytest -s tests/

# Conventions

Follow PEP 8 and these **additional** conventions:

- Use snake_case for functions and variables
- Use PascalCase for classes
- Use UPPER_CASE for constants
- Write docstrings for all public functions

