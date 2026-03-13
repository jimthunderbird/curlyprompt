---
name: Project Architecture Guide
description: Documents the architecture of a cross-platform desktop application
license: MIT
version: 1.2
---

# Project Overview

This is a cross-platform desktop application using a hybrid architecture.

## Key Architecture Points

- Runtime uses Rust-based Tauri for the native desktop shell
- App uses .NET Blazor Server for the UI and business logic
- Communication happens via HTTPS with TLS certificates
- Multi-provider architecture supporting OpenAI and Anthropic

# Building

## Prerequisites

- .NET 9 SDK
- Rust toolchain stable
- Tauri CLI

## Running Tests

Tests can be run as follows:

- Run unit tests with pytest
- Run integration tests with the test runner
- Check coverage with the coverage tool

# Architecture Details

## Runtime Layer

The runtime layer handles window management and system integration.

- app_window - Tauri window management
- dotnet - Launches and manages the .NET sidecar process
- runtime_api - HTTPS API for communication
- certificate - Generates self-signed TLS certificates

## Application Layer

The application layer provides the UI and core functionality.

- Provider - LLM provider implementations
- Chat - Chat functionality and message handling
- Assistants - Pre-configured assistants
- Tools - Core background services

