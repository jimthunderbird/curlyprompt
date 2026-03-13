---
name: Deployment Pipeline
description: Guides an agent through deployment procedures
license: MIT
version: 3.0
---

# Deployment Checklist

**Important**: Always follow this checklist before deploying to production.

## Pre-deployment

- Ensure all tests pass
- Check for **security** vulnerabilities
- Review database migrations
- Verify environment variables are set
- Confirm rollback plan is documented

## Deployment Steps

- Tag the release in git
- Build the Docker image
- Push to container registry
- Deploy to staging first
- Run smoke tests on staging
- Deploy to production
- Monitor dashboards for 30 minutes

## Post-deployment

- Verify health checks are green
- Check error rates in monitoring
- Notify the team in Slack

