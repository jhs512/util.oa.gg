const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const {pages}=require('./render-pages.cjs');
const publicFiles=new Set(['style.css','app.js','compressor.js','hub-tools.js','robots.txt','sitemap.xml','ads.txt']);
const port=Number(process.env.PORT||4173);
http.createServer((req,res)=>{
  let name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
  if(name.endsWith('/'))name+='index.html';
  if(!publicFiles.has(name)&&!pages[name]){res.writeHead(404);res.end('Not found');return;}
  const headers={'Content-Type':types[path.extname(name)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; img-src 'self' blob:; style-src 'self'; script-src 'self'; connect-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'none'"};
  if(pages[name]){res.writeHead(200,headers);res.end(pages[name]);return;}
  fs.readFile(path.join(__dirname,name),(error,data)=>{
    if(error){res.writeHead(500);res.end('Read error');return;}
    res.writeHead(200,headers);res.end(data);
  });
}).listen(port,'127.0.0.1',()=>console.log(`Open http://127.0.0.1:${port}`));
