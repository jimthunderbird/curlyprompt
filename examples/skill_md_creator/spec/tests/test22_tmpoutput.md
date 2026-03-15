---
name: Git Workflow
description: Git branching and workflow conventions
license: MIT
version: 1.0
---

# Git Workflow

This document describes our team's Git workflow.

## Branch Naming

- `feature/description for new features`
- `bugfix/description for bug fixes`
- `hotfix/description for urgent production fixes`
- `release/version for release branches`

## Commit Message Format

Follow the **Conventional Commits specification:**

`type(scope): description`

## Examples

- `feat(auth): add OAuth2 login`
- `fix(api): handle null response`
- `docs(readme): update installation steps`

---

## Pull Request Process

1. Create a feature branch
2. Make your changes and commit
3. Push and open a pull request
4. Request at least *two reviewers*
5. Address feedback and merge

> Squash commits before merging to main.

