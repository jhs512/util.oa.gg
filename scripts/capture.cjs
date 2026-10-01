const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch();
  const output=path.join(__dirname,'..','verification-artifacts');fs.mkdirSync(output,{recursive:true});
  const base=process.env.TEST_BASE_URL||'https://ddak-image-compressor.jangka512.workers.dev';
  for(const [name,width,height] of [['desktop',1280,960],['mobile',390,844]]){
    const page=await browser.newPage({viewport:{width,height}});await page.goto(base);
    await page.locator('#file').setInputFiles(path.join(__dirname,'..','tests','fixtures','rhino.jpg'));
    await page.locator('#compress').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('#compress').disabled);
    await page.locator('#amount').fill('10');await page.locator('#compress').click();await page.locator('#download').waitFor({state:'visible'});
    await page.screenshot({path:path.join(output,name+'.png'),fullPage:true});await page.close();
  }
  await browser.close();console.log('Screenshots saved to '+output);
})().catch(error=>{console.error(error.message);process.exit(1);});
