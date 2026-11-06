import { readFileSync, writeFileSync } from 'node:fs';

const vue = readFileSync('reference/element-plus/packages/components/empty/src/img-empty.vue', 'utf8');
let svg = vue.match(/<template>([\s\S]*?)<\/template>/)[1].trim();
/** SVG属性转为React命名，保留原路径、渐变与主题色变量。 */
function attr(name) {
  return name.replace(/[:-]([a-z])/g, (_, letter) => letter.toUpperCase());
}
svg = svg.replace(
  /(^|\s):([\w:-]+)="([^"]*)"/g,
  (_, space, name, expression) =>
    `${space}${attr(name)}={${expression.replace(/ns\.cssVarBlockName\('([^']+)'\)/g, (_, variable) => '`--${namespace}-empty-' + variable + '`')}}`,
);
svg = svg.replace(/([\w:-]+)="([^"]*)"/g, (_, name, value) => `${attr(name)}="${value}"`);
writeFileSync(
  'packages/components/presentation/empty-image.tsx',
  `// 衍生自Element Plus img-empty.vue，MIT License；原路径与渐变保持不变。\nimport { useId } from 'react';\nimport { useNamespace } from '../../hooks';\n\n/** 空状态默认插图；实例ID避免多个SVG渐变互相引用。 */\nexport function EmptyIllustration() {\n  const id = useId();\n  const { namespace } = useNamespace('empty');\n  return (${svg});\n}\n`,
);
