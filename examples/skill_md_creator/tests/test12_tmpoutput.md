---
name: Database Migration Agent
description: Safely handles database schema migrations
license: MIT
version: 1.0
---

# Migration Rules

**Never** run migrations directly on production without approval.

## Creating Migrations

Every schema change must have a corresponding migration file.

- One migration per logical change
- Always include a rollback step
- Name migrations with a timestamp prefix
- Test migrations against a copy of production data

## Migration Safety

These rules are **mandatory** for all database changes.

- Never drop columns in the same release that stops using them
- Add new columns as nullable first
- Use online DDL for large tables
- Set a lock timeout to avoid blocking

# Rollback Procedures

If a migration fails you must follow these steps:

- Stop the deployment immediately
- Run the rollback migration
- Verify data integrity
- Notify the on-call engineer
- File an incident report

