const fs = require("fs");

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function convertBody(bodyLines) {
  let body = bodyLines.join("\n");

  // Convert VSCode variables → IntelliJ
  body = body.replace(/\$\{TM_SELECTED_TEXT(:.*?)?\}/g, "$SELECTION$");

  // Convert ${1} → $1$
  body = body.replace(/\$\{(\d+)(:[^}]*)?\}/g, (_, num) => `$${num}$`);

  // Convert $1 → $1$
  body = body.replace(/\$(\d+)/g, (_, num) => `$${num}$`);

  // Convert newlines
  body = body.replace(/\n/g, "&#10;");

  return escapeXml(body);
}

function extractVariables(body) {
  const vars = new Set();
  const regex = /\$(\d+)\$/g;

  let match;
  while ((match = regex.exec(body)) !== null) {
    vars.add(match[1]);
  }

  return [...vars].sort((a, b) => Number(a) - Number(b));
}

function generateTemplate(name, snippet) {
  const prefix = snippet.prefix;
  const description = snippet.description || "";
  const scope = snippet.scope || "";

  const body = convertBody(snippet.body);
  const variables = extractVariables(body);

  let xml = `  <template name="${prefix}" value="${body}" description="${escapeXml(description)}" toReformat="false" toShortenFQNames="false">\n`;

  variables.forEach(v => {
    xml += `    <variable name="${v}" alwaysStopAt="true" />\n`;
  });

  if (body.includes("$SELECTION$")) {
    xml += `    <variable name="SELECTION" alwaysStopAt="true" />\n`;
  }

  xml += `    <context>\n`;

  if (scope.includes("javascript")) {
    xml += `      <option name="JavaScript" value="true" />\n`;
  }
  if (scope.includes("typescript")) {
    xml += `      <option name="TypeScript" value="true" />\n`;
  }

  xml += `    </context>\n`;
  xml += `  </template>\n`;

  return xml;
}

function convertFile(inputPath, outputPath) {
  const raw = fs.readFileSync(inputPath, "utf-8");
  const json = JSON.parse(raw);

  let xml = `<templateSet group="Converted VSCode Snippets">\n\n`;

  for (const [name, snippet] of Object.entries(json)) {
    xml += generateTemplate(name, snippet) + "\n";
  }

  xml += `</templateSet>\n`;

  fs.writeFileSync(outputPath, xml, "utf-8");

  console.log(`✅ Converted → ${outputPath}`);
}

// CLI usage
const input = process.argv[2];
const output = process.argv[3] || "intellij-templates.xml";

if (!input) {
  console.error("Usage: node convert-snippets.js input.json [output.xml]");
  process.exit(1);
}

convertFile(input, output);
