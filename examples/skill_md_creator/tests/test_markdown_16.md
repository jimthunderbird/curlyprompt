---
name: REST API Guide
description: API documentation for a REST service
license: MIT
version: 3.1
---

# API Documentation

This document describes the REST API endpoints.

## Authentication

All requests require a **Bearer** token in the Authorization header.

> Tokens expire after 24 hours.

## Endpoints

### Get All Users

`GET /api/users`

- Returns a list of all users
- Supports pagination with `page` and `limit` parameters

### Create User

`POST /api/users`

Request body:

```
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Rate Limiting

API is limited to **100** requests per minute.

See [rate limit docs](https://api.example.com/docs/rate-limits) for details.

