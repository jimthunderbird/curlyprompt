const fs = require('fs');

const skill = {
  name: "Simple Skill",
  description: "A simple skill for AI Agent",
  license: "MIT",
  version: "1.0",
  compatibility: "Yes",
  "allowed-tools": "Bash(git:*) Bash(jq:*) Read",
  content: {
    h1: {
      text: "Instruction"
    }
  }
};

const frontmatter = [
  '---',
  `name: ${skill.name}`,
  `description: ${skill.description}`,
  `license: ${skill.license}`,
  `version: ${skill.version}`,
  `compatibility: ${skill.compatibility}`,
  `"allowed-tools": ${skill["allowed-tools"]}`,
  '---'
].join('\n');

const content = `\n\n# ${skill.content.h1.text}\n\nthis is a very **important** instruction`;

const markdownContent = frontmatter.replaceAll('"','') + content.replaceAll('"', '') + "\n";

fs.writeFileSync('./SKILL.md', markdownContent);

