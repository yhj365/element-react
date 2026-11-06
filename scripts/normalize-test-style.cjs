const fs = require('node:fs');
for (const file of fs.readdirSync('tests').filter(name => name.endsWith('.test.tsx'))) {
  const filename = 'tests/' + file;
  const input = fs.readFileSync(filename, 'utf8');
  // CSSStyleDeclaration以kebab-case和规范化颜色比较，避免jsdom颜色表示差异。
  const output = input.replace(/toHaveStyle\(\{([^}]*)\}\)/g, (_, body) => 'toHaveStyle({' + body.replace(/\b([a-z]+[A-Z][a-zA-Z]*)\s*:/g, (match, key) => `'${key.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())}':`).replace(/'red'/g, "'rgb(255, 0, 0)'") + '})');
  fs.writeFileSync(filename, output);
}
