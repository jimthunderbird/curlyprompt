const fs = require('fs');
const path = require('path');

class App {
  init() {
    const skill = {
      name: "simple-skill",
      description: "A simple skill for AI Agent. Use when performing basic tasks or when the user requests general assistance.",
      license: "MIT"
    };

    const frontmatter = `---
name: ${skill.name}
description: ${skill.description}
license: ${skill.license}
---
`;

    const content = `# Simple Skill

This skill provides basic assistance for general tasks.

## Usage

Use this skill when:
- The user requests general help
- Performing simple operations
- Needing basic assistance

## Examples

\`\`\`text
User: "What can you help me with?"
Assistant: "I can assist with general tasks, answer questions, and provide information on various topics."
\`\`\`

## Limitations

- This skill is designed for basic tasks
- Complex operations may require specialized skills
`;

    const markdownContent = frontmatter + content;

    try {
      fs.writeFileSync('./SKILL.md', markdownContent);
      console.log('SKILL.md created successfully');
    } catch (error) {
      console.error('Error creating SKILL.md:', error);
    }
  }
}

if (typeof App !== 'undefined') {
  const APP = new App();
  APP.init();
}

