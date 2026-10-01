const fs=require('node:fs');
const path=require('node:path');
const destination=path.join(__dirname,'dist');
fs.mkdirSync(destination,{recursive:true});
const {pages}=require('./render-pages.cjs');
const copied=['style.css','app.js','compressor.js','hub-tools.js','_headers','robots.txt','sitemap.xml','ads.txt'];
const allowed=[...Object.keys(pages),...copied];
function files(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name),prefix+entry.name+'/'):[prefix+entry.name]);}
if(files(destination).some(name=>!allowed.includes(name)))throw new Error('dist contains unexpected files; inspect them before deployment.');
for(const [name,html] of Object.entries(pages)){const target=path.join(destination,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);}
for(const file of copied)fs.copyFileSync(path.join(__dirname,file),path.join(destination,file));
console.log('Public assets: '+allowed.join(', '));
