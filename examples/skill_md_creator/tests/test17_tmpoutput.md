---
name: CI/CD Pipeline Guide
description: Continuous integration and deployment guidelines
license: MIT
version: 1.0
---

# CI/CD Pipeline

This guide covers the continuous integration and deployment process.

## Pipeline Stages

1. **Build** - Compile source code and assets
2. **Test** - Run unit and integration tests
3. **Deploy** - Push to staging or production

## Branch Strategy

- `main` branch is production
- `develop` branch is staging
- Feature branches use `feature/` prefix

> Never push directly to the main branch.

## Deployment Checklist

1. Ensure all tests pass
2. Review code changes
3. Update version number
4. Create release tag
5. Monitor deployment logs

