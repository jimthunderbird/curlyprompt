---
name: Testing Strategy
description: Comprehensive testing strategy for the project
license: MIT
version: 1.5
---

# Testing Strategy

A **comprehensive approach to testing our application.**

## Test Pyramid

1. **Unit Tests - Fast, isolated, test individual functions**
2. **Integration Tests - Test component interactions**
3. **E2E Tests - Test complete user flows**

## Unit Testing

Use `jest as the test framework.`

```
describe('Calculator', () => {
  it('should add numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

## Running Tests

- `npm test for all tests`
- `npm run test:unit for unit tests only`
- `npm run test:coverage for coverage report`

> All PRs must have at least 80% code coverage.

## Mocking Guidelines

Use *dependency injection to make code testable.*

- Mock external APIs
- Do **not mock the database in integration tests**
- Use *factory functions for test data*

