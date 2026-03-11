const fs = require('fs');
const { exec } = require('child_process');

class App {
  init() {
    const mermaidCode = `flowchart TD
    A["Specification"] --> B["Code"]
    B --> C["Test"]
    C --> D["Deploy"]
    C --> A["Specification"]`;

    const mermaidConfig = {
      theme: 'default',
      width: 800,
      height: 600
    };

    const diagram = `<!-- prettier-ignore -->
<div class="mermaid">
${mermaidCode}
</div>`;

    fs.writeFileSync('./chart.mmd', mermaidCode);

    exec('mmdc -i ./chart.mmd -o ./chart.svg', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating diagram: ${error}`);
        return;
      }
      console.log('Diagram generated successfully as chart.svg');
    });
  }
}

if (typeof App !== 'undefined') {
  const app = new App();
  app.init();
}

