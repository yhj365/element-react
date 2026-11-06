const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const coverage=JSON.parse(read('design/coverage.json'));
const manifest=JSON.parse(read('design/source-manifest.json'));
const api=JSON.parse(read('design/api-matrix.json'));
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message);};
assert(coverage.missingDocumentDesigns.length===0,'有文档主题遗漏');
assert(coverage.missingDirectoryDesigns.length===0,'有组件目录遗漏');
assert(coverage.unmappedDirectories.length===0,'有目录未定位');
assert(coverage.unresolvedExampleReferences.length===0,'有示例未解析');
assert(new Set(api.map(x=>x.id)).size===api.length,'API来源行ID重复');
assert(manifest.documents.length===coverage.documentCount,'文档统计不一致');
assert(manifest.directories.length===coverage.sourceDirectoryCount,'目录统计不一致');
assert(manifest.documents.reduce((n,d)=>n+d.apiRows,0)===api.length,'API总数不一致');
for(const item of [...manifest.files,...manifest.documents.map(d=>({path:'docs/'+d.name+'.md',sha256:d.sha256}))]){
 const file=path.join(root,'reference/element-plus',item.path);
 assert(fs.existsSync(file),`缺少来源快照：${item.path}`);
 if(fs.existsSync(file))assert(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')===item.sha256,`快照哈希不一致：${item.path}`);
}
for(const r of api){
 assert(r.sourceName.length>0&&r.reactName.length>0,`${r.id}缺少API映射`);
 if(r.kind==='prop'&&/^model-value/.test(r.sourceName))assert(r.reactName==='value / defaultValue / onValueChange',`${r.id}model映射错误`);
 assert(fs.existsSync(path.join(root,'design/components',r.component+'.md')),`${r.id}没有设计页`);
}
const authored=[path.join(root,'README.md'),path.join(root,'element-plus项目结构导读.md'),...walk(path.join(root,'design')).filter(f=>f.endsWith('.md'))];
const brokenLinks=[];
for(const file of authored){
 const text=fs.readFileSync(file,'utf8');
 for(const m of text.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)){
  const target=m[1].replace(/^<|>$/g,'').split('#')[0];
  if(!target||/^(https?:|file:|mailto:|\/)/.test(target))continue;
  let decoded;try{decoded=decodeURIComponent(target);}catch{decoded=target;}
  if(!fs.existsSync(path.resolve(path.dirname(file),decoded)))brokenLinks.push({file:path.relative(root,file),target});
 }
}
assert(brokenLinks.length===0,`发现${brokenLinks.length}个失效本地链接`);
const report={checkedAt:'2026-11-05',authoredMarkdownFiles:authored.length,documentThemes:coverage.documentCount,sourceDirectories:coverage.sourceDirectoryCount,sourceFiles:coverage.sourceFileCount,apiTableRows:api.length,exampleReferences:coverage.exampleReferences,brokenLinks,errors,passed:errors.length===0,note:'仅静态文档验证；不代表React类型、组件行为或视觉等价已通过。'};
fs.writeFileSync(path.join(root,'design/verification.json'),JSON.stringify(report,null,2)+'\n');
process.stdout.write(JSON.stringify(report,null,2));
process.exitCode=errors.length?1:0;
