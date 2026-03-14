---
name: Security Checklist
description: Application security review checklist
license: MIT
version: 2.0
---

# Security Review Checklist

> Security is everyone's responsibility.

## Authentication

- Use **bcrypt for password hashing**
- Implement rate limiting on login endpoints
- Enable **two-factor authentication**

## Data Protection

1. Encrypt data at rest
2. Use TLS for data in transit
3. Sanitize all user inputs
4. Use parameterized queries

## Resources

Refer to the [OWASP Top 10](https://owasp.org/www-project-top-ten/) for common vulnerabilities.

See also [Security Best Practices](https://example.com/security-guide) for internal guidelines.

---

## Incident Response

In case of a security incident:

1. **Contain the breach immediately**
2. Notify the security team
3. Document the incident
4. Perform a post-mortem

