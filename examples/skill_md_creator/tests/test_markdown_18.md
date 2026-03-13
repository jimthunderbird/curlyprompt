---
name: Database Migration Guide
description: Guidelines for database schema migrations
license: MIT
version: 1.0
---

# Database Migrations

All schema changes must go through the migration system.

## Creating a Migration

Run the following command:

`npx knex migrate:make migration_name`

## Migration Structure

```
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name');
  });
};
```

## Running Migrations

1. Run `npx knex migrate:latest` to apply
2. Run `npx knex migrate:rollback` to undo

> Always test migrations on a staging database first.

---

## Best Practices

- Never modify an existing migration
- Always provide a **rollback** function
- Keep migrations *small* and focused

