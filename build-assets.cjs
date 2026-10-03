const fs=require('node:fs');
const path=require('node:path');
const destination=path.join(__dirname,'dist');
fs.mkdirSync(destination,{recursive:true});
const {pages,generated}=require('./render-pages.cjs');
const copied=['style.css','app.js','compressor.js','hub-tools.js','utility-tools.js','localize.js','_headers','robots.txt','sitemap.xml','ads.txt'];
const allowed=[...Object.keys(pages),...Object.keys(generated),...copied];
for(const [name,html] of Object.entries(pages)){
  const language=name.startsWith('ko/')?'ko':'en';
  if(language==='en'&&/[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f]/u.test(html))throw new Error(`Unexpected Korean content in default page ${name}`);
  if(!html.includes(`<html lang="${language}">`))throw new Error(`Incorrect document language in ${name}`);
}
for(const name of copied.filter(name=>name.endsWith('.js')&&name!=='localize.js')){
  if(/[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f]/u.test(fs.readFileSync(path.join(__dirname,name),'utf8')))throw new Error(`English-only policy violated in ${name}`);
}
function files(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name),prefix+entry.name+'/'):[prefix+entry.name]);}
if(files(destination).some(name=>!allowed.includes(name)))throw new Error('dist contains unexpected files; inspect them before deployment.');
for(const [name,html] of Object.entries(pages)){const target=path.join(destination,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);}
for(const file of copied)fs.copyFileSync(path.join(__dirname,file),path.join(destination,file));
for(const [name,data] of Object.entries(generated))fs.writeFileSync(path.join(destination,name),data);
console.log('Public assets: '+allowed.join(', '));
