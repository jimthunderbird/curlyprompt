---
name: API Design Guidelines
description: Best practices for designing RESTful APIs
license: MIT
version: 2.1
---

# REST API Design Principles

Follow these **principles** when designing API endpoints.

## URL Structure

Use nouns not verbs in endpoint paths.

- Use plural resource names
- Use lowercase with hyphens for multi-word resources
- Nest resources to show relationships
- Keep URLs under 3 levels of nesting

## HTTP Methods

- GET - retrieve resources
- POST - create new resources
- PUT - replace entire resources
- PATCH - partial updates
- DELETE - remove resources

## Response Codes

- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Internal Server Error

# Error Handling

All errors must return a **consistent** JSON structure.

- Include an error code field
- Include a human-readable message
- Include a request ID for tracing
- Never expose internal stack traces

