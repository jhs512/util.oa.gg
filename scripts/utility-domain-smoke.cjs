const {chromium}=require('@playwright/test');
const {Resolver}=require('node:dns').promises;
const fs=require('node:fs');
const {tools}=require('../tool-catalog.cjs');
const korean=process.argv.includes('--korean');
(async()=>{
 const resolver=new Resolver();resolver.setServers(['8.8.8.8']);
 const hosts=['util.oa.gg','image-compressor.util.oa.gg','compress.oa.gg',...tools.map(t=>t.host)];
 const addresses={},report=[];
 for(const host of hosts){try{addresses[host]=(await resolver.resolve4(host))[0];}catch(e){report.push({host,ok:false,error:e.message});}}
 const browser=await chromium.launch({args:['--host-resolver-rules='+Object.entries(addresses).map(([h,a])=>`MAP ${h} ${a}`).join(',')]});
 try{for(const [view,width,height] of [['desktop',1280,960],['mobile',390,844]]){const page=await browser.newPage({viewport:{width,height}});
 for(const t of tools){const entry={host:t.host,view,ok:false};report.push(entry);try{const response=await page.goto('https://'+t.host+'/',{timeout:15000});if(response.status()!==200)throw Error('HTTP '+response.status());if(page.url()!==`https://util.oa.gg/${t.slug}/`)throw Error('Wrong entry destination');if(korean){await page.locator('.language-switch a[lang=ko]').click();await page.waitForLoadState('load');if(page.url()!==`https://util.oa.gg/ko/${t.slug}/`)throw Error('Wrong Korean destination');}
 await page.locator('[data-tool]').waitFor();
 if(t.slug==='calendar'){await page.locator('#month').fill('2024-02');if(await page.locator('[role=gridcell]').filter({hasText:/^29$/}).count()!==1)throw Error('Leap date missing');}
 else if(t.slug==='password-generator'){await page.locator('#generate').click();if((await page.locator('#password-output').inputValue()).length!==20)throw Error('Password generation failed');}
 else if(t.slug==='timer'){await page.locator('#timer-minutes').fill('0.01');await page.locator('#timer-start').click();await page.waitForFunction(expected=>document.querySelector('#tool-result').textContent===expected,korean?'시간이 끝났습니다.':'Time is up.');}
 else if(t.slug==='json-formatter'){await page.locator('#json-format').click();if(!(await page.locator('#json-output').inputValue()).includes('hello'))throw Error('JSON formatting failed');}
 else if(t.slug==='url-encoder'||t.slug==='base64'){const prefix=t.slug==='base64'?'base64':'url';await page.locator('#'+prefix+'-encode').click();if(!(await page.locator('#'+prefix+'-output').inputValue()))throw Error('Encoding failed');}
 else if(!(await page.locator('#tool-result').textContent()))throw Error('Calculation missing');
 if(!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))throw Error('Horizontal overflow');entry.ok=true;entry.finalURL=page.url();entry.status=response.status();
 }catch(e){entry.error=e.message;}console.log(JSON.stringify(entry));}
 await page.close();}
 }finally{await browser.close();fs.mkdirSync('verification-artifacts',{recursive:true});fs.writeFileSync(korean?'verification-artifacts/utility-domains-ko.json':'verification-artifacts/utility-domains.json',JSON.stringify(report,null,2));if(report.some(x=>!x.ok))process.exitCode=1;}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
