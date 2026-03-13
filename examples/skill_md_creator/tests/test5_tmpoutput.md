---
name: Generalized KMeans Clustering Guide
description: Repository guidelines for the generalized k-means clustering library
license: Apache-2.0
version: 1.0
---

# Repository Guidelines

Use this guide to make concise, high-signal contributions to the generalized k-means clustering library.

# Project Structure

- Scala sources live in src/main/scala
- Tests use ScalaTest under src/test/scala with Spark-local fixtures
- Python wrapper lives in python directory
- Documentation follows Diataxis structure in docs directory

# Build and Test Commands

## **Scala Commands**

- sbt compile to compile against default Scala and Spark matrix
- sbt test for full JVM suite with ScalaTest
- sbt scalafmtAll then sbt scalastyle for required format and lint gates
- sbt coverage test coverageReport to generate coverage

## **Python Commands**

- cd python and pip install for setup
- pytest for running tests

# Coding Style

- Scalafmt enforces 2-space indent and 100-col limit
- Prefer immutable vals and small helpers
- PascalCase for classes and objects
- camelCase for methods and vals
- Document public APIs with Scaladoc

# Commit Guidelines

Use **conventional commits** with format type scope subject

- PRs should summarize behavior changes
- List executed commands
- Link issues with Closes number

