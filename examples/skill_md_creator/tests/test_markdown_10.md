---
name: Game Boy Emulator Agent
description: Agent guidance for a C# Game Boy emulator project
license: MIT
version: 1.0
---

# Agent Instructions

Read this document to understand the repository structure and conventions.

- Match the existing code style and naming conventions
- Prefer existing frameworks and test patterns
- Use **American** English for comments and documentation
- Avoid ingesting very large files wholesale

# Project Stats

- Languages - C# at 99 percent
- Framework - .NET 9.0
- UI Framework - Avalonia
- Test Framework - NUnit

# Key Modules

## Core Emulator

- Instructions.cs - CPU instruction implementations
- PPU.cs - Pixel processing unit
- ApuDevice.cs - Audio processing unit
- BootRom.cs - Boot ROM data

## Application

- MainWindowViewModel.cs - Main window view model
- ShaderControl.cs - GPU shader rendering control

