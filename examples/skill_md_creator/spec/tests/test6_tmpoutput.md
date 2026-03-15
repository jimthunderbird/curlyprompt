---
name: Light Manager Air Integration
description: Guidelines for the Home Assistant Light Manager Air integration
license: MIT
version: 1.2.2
---

# Integration Guidelines

This file provides coding and release guidelines for the Light Manager Air integration.

## Commit Guidelines

- Do NOT include generated with Claude Code in commit messages
- Commit messages should be clear, concise, and descriptive
- Use the **imperative mood in commit messages**
- No need for co-author attribution to Claude

## Code Style Guidelines

### General Principles

- Maintain clean, readable, and consistent code
- Follow the Home Assistant code style guidelines
- Keep methods small and focused on a single task
- Use type hints where appropriate
- Write unit tests for new functionality

### Naming Conventions

- Use descriptive names for classes, methods, and variables
- **snake_case for methods and variables**
- **CamelCase for classes**
- **UPPER_CASE for constants**

## Release Process

Tags should be created **without v prefix**

- The release title should simply be the version number
- Create tag with git tag command
- Push tag to origin
- Create release with gh release create

