---
name: QRCode Vue Agent Guide
description: Guidelines for AI agents working on the qrcode.vue repository
license: MIT
version: 2.0
---

# Agent Guidelines for qrcode.vue

This document provides guidelines for AI agents working on the qrcode.vue repository.

## Build and Development Commands

The project uses npm scripts defined in **package.json:**

- npm run dev to start development server with hot reload
- npm run build to build production bundles using Rollup
- npm test to run all tests using rstest

## Code Style Guidelines

### Indentation and Formatting

- **Indentation: 2 spaces, no tabs**
- **Line endings: LF Unix**
- **Trailing whitespace: Trimmed**
- **Final newline: Yes**

### TypeScript Conventions

- Strict mode is always enabled
- Prefer explicit types for function parameters and return types
- Use type for simple aliases, interface for extensible object shapes

## Testing

Tests written with **rstest** and **vue test utils**

- Test files in test directory with .test.ts extension
- Use describe and it pattern
- Mount components with mount from vue test utils

