const {chromium}=require('@playwright/test');
const {Resolver}=require('node:dns').promises;
const https=require('node:https');
const fs=require('node:fs');
const path=require('node:path');
// Resolve public records through Google DNS without changing system DNS or disabling TLS checks.
(async()=>{
  const resolver=new Resolver();resolver.setServers(['8.8.8.8']);
  const hosts=['util.oa.gg','image-compressor.util.oa.gg'];
  const addresses={};for(const host of hosts)addresses[host]=(await resolver.resolve4(host))[0];
  const output=path.join(__dirname,'..','verification-artifacts');fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({args:['--host-resolver-rules='+hosts.map(host=>`MAP ${host} ${addresses[host]}`).join(',')]});
  const report=[];
  try{
    for(const host of hosts){
      const entry={host,resolver:'8.8.8.8',address:addresses[host],https:false,views:[]};report.push(entry);
      try{
        const html=await new Promise((resolve,reject)=>{
          const req=https.get('https://'+host+'/',{lookup:(_host,options,cb)=>options.all?cb(null,[{address:addresses[host],family:4}]):cb(null,addresses[host],4)},res=>{
            let body='';res.setEncoding('utf8');res.on('data',chunk=>body+=chunk);res.on('end',()=>res.statusCode===200?resolve(body):reject(new Error('HTTP '+res.statusCode)));
          });req.setTimeout(10000,()=>req.destroy(new Error('HTTPS timeout')));req.on('error',reject);
        });
        if(!html.includes('href="https://util.oa.gg/"')||!html.includes('id="file"'))throw new Error('Unexpected canonical or tool page');
        entry.https=true;entry.html=html;
        for(const [view,width,height] of [['desktop',1280,960],['mobile',390,844]]){
          const page=await browser.newPage({viewport:{width,height}});const requests=[];page.on('request',req=>requests.push({method:req.method(),url:req.url(),request:req}));
          await page.goto('https://'+host+'/');await page.locator('#file').setInputFiles(path.join(__dirname,'..','tests','fixtures','rhino.jpg'));
          await page.waitForFunction(()=>!document.querySelector('#compress').disabled);await page.locator('#amount').fill('10');await page.locator('#compress').click();await page.locator('#download').waitFor({state:'visible'});
          const wait=page.waitForEvent('download');await page.locator('#download').click();const download=await wait;const file=fs.readFileSync(await download.path());
          if(file.length>10000||file.subarray(8,12).toString()!=='WEBP')throw new Error('Downloaded output failed size/format check');
          const blocked=requests.filter(req=>req.request.failure()?.errorText==='net::ERR_BLOCKED_BY_CSP');
          const unexpected=requests.filter(req=>!blocked.includes(req)&&(req.method!=='GET'||(!req.url.startsWith('blob:')&&new URL(req.url).hostname!==host)));
          if(unexpected.length)throw new Error('Unexpected requests: '+JSON.stringify(unexpected.map(req=>({method:req.method,host:new URL(req.url).hostname,path:new URL(req.url).pathname}))));
          const screenshot=host+'-'+view+'.png';await page.screenshot({path:path.join(output,screenshot),fullPage:true});entry.views.push({view,downloadBytes:file.length,uploadRequests:0,cspBlocked:blocked.map(req=>new URL(req.url).hostname),screenshot});await page.close();
        }
      }catch(error){entry.error=error.message;}
    }
    const successful=report.filter(entry=>entry.https&&entry.views.length===2);
    if(successful.length===2&&successful[0].html!==successful[1].html)throw new Error('Host pages differ');
    for(const entry of report)delete entry.html;
    fs.writeFileSync(path.join(output,'domain-smoke.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
    if(successful.length!==2)process.exitCode=1;
  }finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
