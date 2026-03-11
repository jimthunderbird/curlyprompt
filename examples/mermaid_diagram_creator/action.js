const fs = require('fs');
const { exec } = require('child_process');

class App {
  init() {
    const mermaidContent = `flowchart TD
    A["Specification"] --> B["Code"]
    B --> C["Test"]
    C --> D["Deploy"]
    C --> A["Specification"]`;

    const mermaidFile = './chart.mmd';
    const svgFile = './chart.svg';

    fs.writeFileSync(mermaidFile, mermaidContent);

    exec(`npx mmdc -i ${mermaidFile} -o ${svgFile}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error generating diagram:', error);
        return;
      }
      console.log('Diagram generated successfully at', svgFile);
      fs.unlinkSync(mermaidFile);
    });
  }
}

if (typeof App !== 'undefined') {
  const app = new App();
  app.init();
}

