#!/usr/bin/env node

/**
 * AgentSkills SKILL.md Generator
 * Converts a custom prompt format into AgentSkills.io compliant SKILL.md
 */

const fs = require('fs');
const path = require('path');

function parsePrompt(promptText) {
  if (!promptText || typeof promptText !== 'string') {
    throw new Error('Invalid input: promptText must be a non-empty string');
  }

  const skill = {
    metadata: {},
    sections: [],
    standaloneHeaders: [],
    standaloneItems: []
  };

  const lines = promptText.trim().split('\n');
  let inSkillBlock = false;
  let inContentBlock = false;
  let currentSection = null;
  let currentElement = null;
  let braceStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Handle skill block start
    if (trimmed.startsWith('skill {')) {
      inSkillBlock = true;
      braceStack.push('skill');
      continue;
    }

    // Handle content block start
    if (trimmed.startsWith('content {')) {
      inContentBlock = true;
      braceStack.push('content');
      continue;
    }

    // Handle closing braces
    if (trimmed === '}') {
      const popped = braceStack.pop();

      if (popped === 'ul' && currentSection) {
        // Closing ul block
        currentElement = null;
      } else if (popped === 'h1' && currentSection) {
        // Closing h1 block
        skill.sections.push(currentSection);
        currentSection = null;
      } else if (popped === 'content') {
        inContentBlock = false;
      } else if (popped === 'skill') {
        inSkillBlock = false;
      }
      continue;
    }

    // Parse metadata (key: value)
    if (inSkillBlock && !inContentBlock && trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');

      skill.metadata[key] = value;
      continue;
    }

    // Handle h1 sections
    if (trimmed.startsWith('h1:')) {
      // If there's a current section, push it before starting a new one
      if (currentSection) {
        skill.sections.push(currentSection);
        // Remove h1 from braceStack if it exists
        const h1Index = braceStack.lastIndexOf('h1');
        if (h1Index !== -1) {
          braceStack.splice(h1Index, 1);
        }
      }
      
      const titleMatch = trimmed.match(/^h1:(.+?)(?:\s*\{)?$/);
      if (titleMatch) {
        currentSection = {
          title: titleMatch[1].trim(),
          items: []
        };
        braceStack.push('h1');
      }
      continue;
    }

    // Handle h2 headers (inside or outside h1)
    if (trimmed.startsWith('h2:')) {
      let content = trimmed.substring(3).trim();
      content = content.replace(/strong:(\w+)/g, '**$1**');
      if (currentSection) {
        currentSection.items.push({
          type: 'h2',
          text: content
        });
      } else if (inContentBlock) {
        // Standalone h2 outside h1 block
        skill.standaloneHeaders.push({
          type: 'h2',
          text: content
        });
      }
      continue;
    }

    // Handle h3 headers (inside or outside h1)
    if (trimmed.startsWith('h3:')) {
      let content = trimmed.substring(3).trim();
      content = content.replace(/strong:(\w+)/g, '**$1**');
      if (currentSection) {
        currentSection.items.push({
          type: 'h3',
          text: content
        });
      } else if (inContentBlock) {
        // Standalone h3 outside h1 block
        skill.standaloneHeaders.push({
          type: 'h3',
          text: content
        });
      }
      continue;
    }

    // Handle ul block start
    if (trimmed === 'ul {') {
      braceStack.push('ul');
      currentElement = 'ul';
      continue;
    }

    // Handle paragraph with formatting (p:text with strong:word)
    if (trimmed.startsWith('p:')) {
      const content = trimmed.substring(2).trim();
      if (currentSection) {
        currentSection.items.push({
          type: 'p',
          text: content
        });
      }
      continue;
    }

    // Handle list items
    if (trimmed.startsWith('li:')) {
      let content = trimmed.substring(3).trim();
      content = content.replace(/strong:(\w+)/g, '**$1**');
      if (currentSection) {
        currentSection.items.push({
          type: 'li',
          text: content
        });
      } else if (inContentBlock) {
        // Standalone li outside h1 block
        skill.standaloneItems.push({
          type: 'li',
          text: content
        });
      }
      continue;
    }
  }

  // Push any remaining section
  if (currentSection) {
    skill.sections.push(currentSection);
  }

  return skill;
}

function convertToMarkdown(skill) {
  if (!skill || typeof skill !== 'object') {
    throw new Error('Invalid skill object');
  }

  let output = '';

  // Generate YAML frontmatter
  output += '---\n';
  output += `name: ${skill.metadata.name || 'unnamed-skill'}\n`;
  output += `description: ${skill.metadata.description || 'No description provided'}\n`;

  if (skill.metadata.license) {
    output += `license: ${skill.metadata.license}\n`;
  }

  if (skill.metadata.version) {
    output += `version: ${skill.metadata.version}\n`;
  }

  // Add optional fields only if present in source
  if (skill.metadata.compatibility) {
    output += `compatibility: ${skill.metadata.compatibility}\n`;
  }

  if (skill.metadata['allowed-tools']) {
    output += `allowed-tools: ${skill.metadata['allowed-tools']}\n`;
  }

  output += '---\n\n';

  // Generate content sections
  for (const section of skill.sections) {
    output += `# ${section.title}\n`;
    
    let prevItemType = null;
    for (let idx = 0; idx < section.items.length; idx++) {
      const item = section.items[idx];
      const nextItem = idx + 1 < section.items.length ? section.items[idx + 1] : null;
      
      if (item.type === 'h2') {
        output += `\n## ${item.text}\n`;
        prevItemType = 'h2';
      } else if (item.type === 'h3') {
        output += `\n### ${item.text}\n`;
        // Add blank line after h3 if next item is a list item
        if (nextItem && nextItem.type === 'li') {
          output += '\n';
        }
        prevItemType = 'h3';
      } else if (item.type === 'p') {
        // Add blank line before p if after h2/h3
        if (prevItemType === 'h2' || prevItemType === 'h3') {
          output += '\n';
        } else if (prevItemType === null) {
          // First item after h1
          output += '\n';
        }
        // Handle paragraph with inline formatting
        let text = item.text;
        // Convert strong:word to **word**
        text = text.replace(/strong:(\w+)/g, '**$1**');
        output += `${text}\n\n`;
        prevItemType = 'p';
      } else if (item.type === 'li') {
        output += `- ${item.text}\n`;
        prevItemType = 'li';
      }
    }

    // Add blank line after section only if last item wasn't a paragraph
    if (prevItemType !== 'p') {
      output += '\n';
    }
  }

  // Handle standalone headers and items (h2/h3/li outside h1 blocks)
  for (const header of skill.standaloneHeaders) {
    if (header.type === 'h2') {
      output += `## ${header.text}\n\n`;
    } else if (header.type === 'h3') {
      output += `### ${header.text}\n\n`;
    }
  }

  for (const item of skill.standaloneItems) {
    if (item.type === 'li') {
      output += `- ${item.text}\n`;
    }
  }

  if (skill.standaloneItems.length > 0) {
    output += '\n';
  }

  return output;
}

// Main execution
function main() {
  const sourceFile = process.argv[2];
  const targetFile = process.argv[3];

  // Defensive coding: validate arguments
  if (!sourceFile || !targetFile) {
    console.error('Usage: node action.js <source.prompt> <target.md>');
    process.exit(1);
  }

  try {
    // Defensive coding: check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`Error: Source file '${sourceFile}' not found`);
      process.exit(1);
    }

    // Read source file
    const promptText = fs.readFileSync(sourceFile, 'utf-8');

    // Parse prompt
    const skill = parsePrompt(promptText);

    // Generate markdown
    const markdown = convertToMarkdown(skill);

    // Ensure target directory exists
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write to target file
    fs.writeFileSync(targetFile, markdown, 'utf-8');

    console.log(`✓ Generated ${targetFile} successfully!`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parsePrompt, convertToMarkdown };
