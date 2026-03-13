---
name: React Component Guide
description: Guidelines for building React components
license: MIT
version: 2.0
---

# React Component Guide

Follow these guidelines when creating React components.

## Component Structure

```
import React from 'react';

interface Props {
  title: string;
  count: number;
}

export const MyComponent: React.FC<Props> = ({ title, count }) => {
  return <div>{title}: {count}</div>;
};
```

## Naming Conventions

- Use **PascalCase** for component names
- Use **camelCase** for props and variables
- Prefix custom hooks with `use`

## Best Practices

> Favor composition over inheritance.

- Keep components *small* and focused
- Extract reusable logic into custom hooks
- Use `React.memo` for expensive renders

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

![Component Lifecycle](docs/lifecycle.png)

