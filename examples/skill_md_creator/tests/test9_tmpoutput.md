---
name: WordPress Plugin Scaffold
description: Scaffolds a WordPress plugin following best practices
license: GPL-2.0
version: 1.5
---

# WordPress Plugin Development

This skill helps you create WordPress plugins that follow **modern** PHP development standards.

## Project Structure

- admin/ - Admin area functionality
- includes/ - Core plugin classes
- public/ - Public-facing functionality
- languages/ - Translation files
- src/ - Source assets for development
- build/ - Compiled assets

## Coding Standards

All code must follow WordPress Coding Standards.

- Use PSR-4 autoloading
- Minimum PHP 7.4 required
- WordPress 4.9.1 or higher
- All strings must be translatable

# Testing

Run the test suite before submitting any changes.

- Unit tests with PHPUnit
- Integration tests with WordPress test framework
- Coding standards check with PHPCS

