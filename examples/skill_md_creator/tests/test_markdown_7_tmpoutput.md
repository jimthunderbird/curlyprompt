---
name: G33kBoy Emulator Guide
description: Agent guidance for the Game Boy emulator written in C#
license: MIT
version: 1.0
---

# Agents Guidance for AI-assisted Development

An overview of the current repository and its related projects.

## Summary for Agents

Use this overview as factual context when generating or editing code.

- Read this report top-to-bottom to understand the repository structure
- Keep context usage lean and prefer summaries over full source files
- Match the **American English** style as reported below
- Prefer existing frameworks, tests, and naming conventions
- Use the ripgrep tool for efficient code searching

## Project Stats

- Files: 919
- Languages: C# at 99 percent
- English: American English

## Preferences

Align with nullable settings, test framework, and UI patterns already used.

- **Nullable**: disabled
- **Tests**: NUnit
- **Mocking**: Unknown
- **UI**: Avalonia

## Projects

### Top-level

- G33kBoy.csproj targeting net9.0
- UnitTests.csproj targeting net9.0

### Internal

- DTC.Core.csproj targeting net8.0
- DTC.SM83.csproj targeting net9.0

