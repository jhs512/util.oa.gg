const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
async function fixture(page,type='image/png') {
  return Buffer.from(await page.evaluate(async type=>{
    const c=document.createElement('canvas');c.width=1200;c.height=800;
    const ctx=c.getContext('2d');const image=ctx.createImageData(1200,800);
    let seed=42;
    for(let i=0;i<image.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;image.data[i]=seed&255;image.data[i+1]=(seed>>>8)&255;image.data[i+2]=(seed>>>16)&255;image.data[i+3]=i<4800*32?0:180;}
    ctx.putImageData(image,0,0);
    return c.toDataURL(type,.92).split(',')[1];
  },type),'base64');
}
async function upload(page,buffer,name='test.png',mimeType='image/png'){
  await page.locator('#file').setInputFiles({name,mimeType,buffer});await expect(page.locator('#compress')).toBeEnabled();
}
async function run(page){await page.locator('#compress').click();await expect(page.locator('#download')).toBeVisible();}
async function decodeResult(page){
  const wait=page.waitForEvent('download');await page.locator('#download').click();const download=await wait;
  const buffer=fs.readFileSync(await download.path());
  const type={'jpg':'image/jpeg','png':'image/png','webp':'image/webp'}[download.suggestedFilename().split('.').pop()];
  return page.evaluate(async({base64,type})=>{const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const blob=new Blob([bytes],{type});const bm=await createImageBitmap(blob);const c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;const ctx=c.getContext('2d');ctx.drawImage(bm,0,0);const pixel=[...ctx.getImageData(0,0,1,1).data];return {size:blob.size,type:blob.type,width:bm.width,height:bm.height,pixel};},{base64:buffer.toString('base64'),type});
}
test.beforeEach(async({page})=>{await page.goto('/');});
test('target size, resize disclosure, alpha and download',async({page},info)=>{
  const external=[],network=[];const origin=new URL(page.url()).origin;page.on('request',r=>{if(!r.url().startsWith('blob:')){network.push(r.method());if(new URL(r.url()).origin!==origin)external.push(r.url());}});
  await upload(page,await fixture(page));await page.locator('#amount').fill('50');await run(page);
  await expect(page.locator('#badge')).toHaveText('목표 달성');const result=await decodeResult(page);
  expect(result.size).toBeLessThanOrEqual(50000);expect(result.type).toBe('image/webp');expect(result.pixel[3]).toBeLessThan(255);
  expect(result.width).toBeGreaterThanOrEqual(300);expect(result.width).toBeLessThan(1200);await expect(page.locator('#changes')).toContainText('가로·세로');
  const wait=page.waitForEvent('download');await page.locator('#download').click();const download=await wait;expect(download.suggestedFilename()).toBe('test-compressed.webp');expect(await download.failure()).toBeNull();
  expect(external).toEqual([]);expect(network.every(method=>method==='GET')).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`test-results/${info.project.name}-result.png`,fullPage:true});
  await page.locator('#amount').fill('100');await expect(page.locator('#download')).toBeHidden();
});
test('JPG flattens transparent input to white; PNG preserves alpha',async({page})=>{
  await upload(page,await fixture(page));await page.locator('#amount').fill('5000');await page.locator('#format').selectOption('image/jpeg');await run(page);
  let result=await decodeResult(page);expect(result.type).toBe('image/jpeg');expect(result.pixel[3]).toBe(255);expect(result.pixel[0]).toBeGreaterThan(240);await expect(page.locator('#changes')).toContainText('흰 배경');
  await page.locator('#format').selectOption('image/png');await page.locator('#amount').fill('500');await run(page);result=await decodeResult(page);expect(result.type).toBe('image/png');expect(result.pixel[3]).toBe(0);expect(result.width).toBeLessThan(1200);expect(result.size).toBeLessThanOrEqual(500000);
});
test('unreachable goal is explicit, resize disabled keeps dimensions',async({page})=>{
  await upload(page,await fixture(page));await page.locator('#resize').uncheck();await page.locator('#amount').fill('0.001');await run(page);
  await expect(page.locator('#badge')).toHaveText('목표 미달');expect((await decodeResult(page)).width).toBe(1200);await expect(page.locator('#download')).toHaveText('목표 초과 결과 내려받기');
});
test('rejects SVG disguised as PNG and corrupt raster; recovers',async({page})=>{
  await page.locator('#file').setInputFiles({name:'fake.png',mimeType:'image/png',buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')});await expect(page.locator('#status')).toContainText('정지 JPG');await expect(page.locator('#compress')).toBeDisabled();
  const buffer=Buffer.alloc(32);Buffer.from('89504e470d0a1a0a','hex').copy(buffer);buffer.writeUInt32BE(100,16);buffer.writeUInt32BE(100,20);
  await page.locator('#file').setInputFiles({name:'broken.png',mimeType:'image/png',buffer});await expect(page.locator('#status')).toContainText('열 수 없습니다');
  await upload(page,await fixture(page,'image/jpeg'),'real.jpg','image/jpeg');await run(page);await expect(page.locator('#badge')).toHaveText('목표 달성');
});
test('encoder failure and unsupported output are reported without download',async({page})=>{
  await upload(page,await fixture(page));await page.evaluate(()=>HTMLCanvasElement.prototype.toBlob=function(cb){cb(null);});await page.locator('#compress').click();await expect(page.locator('#badge')).toHaveText('압축 실패');await expect(page.locator('#download')).toBeHidden();
  await page.reload();await upload(page,await fixture(page));await page.evaluate(()=>{const original=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=function(cb){original.call(this,cb,'image/png');};});await page.locator('#compress').click();await expect(page.locator('#status')).toContainText('저장 형식을 지원하지');await expect(page.locator('#download')).toBeHidden();
});
test('animated images, oversized dimensions and input bytes rejected before decode',async({page})=>{
  const png=await fixture(page);const actl=Buffer.alloc(20);actl.writeUInt32BE(8,0);actl.write('acTL',4);const animated=Buffer.concat([png.subarray(0,33),actl,png.subarray(33)]);
  await page.locator('#file').setInputFiles({name:'animated.png',mimeType:'image/png',buffer:animated});await expect(page.locator('#status')).toContainText('애니메이션 PNG');
  const webp=Buffer.alloc(30);webp.write('RIFF');webp.writeUInt32LE(22,4);webp.write('WEBP',8);webp.write('VP8X',12);webp.writeUInt32LE(10,16);webp[20]=2;
  await page.locator('#file').setInputFiles({name:'animated.webp',mimeType:'image/webp',buffer:webp});await expect(page.locator('#status')).toContainText('애니메이션 WebP');
  const huge=Buffer.from(png);huge.writeUInt32BE(9000,16);await page.locator('#file').setInputFiles({name:'huge.png',mimeType:'image/png',buffer:huge});await expect(page.locator('#status')).toContainText('이하의 이미지');
  await page.locator('#file').setInputFiles({name:'huge.png',mimeType:'image/png',buffer:Buffer.alloc(20_000_001)});await expect(page.locator('#status')).toContainText('20 MB 이하');
});
test('real photo upload and goal in MB',async({page})=>{
  const file=path.join(__dirname,'fixtures','rhino.jpg');
  await page.locator('#file').setInputFiles(file);await expect(page.locator('#compress')).toBeEnabled();await page.locator('#unit').selectOption('1000000');await page.locator('#amount').fill('0.01');await run(page);
  const result=await decodeResult(page);expect(result.size).toBeLessThanOrEqual(10000);await expect(page.locator('#badge')).toHaveText('목표 달성');expect(result.type).toBe('image/webp');console.log('MDN photo: '+JSON.stringify(result));
});
test('static WebP drag and drop and keyboard preview',async({page})=>{
  const buffer=await fixture(page,'image/webp');
  const data=await page.evaluateHandle(base64=>{const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));const dt=new DataTransfer();dt.items.add(new File([bytes],'drop.webp',{type:'image/webp'}));return dt;},buffer.toString('base64'));
  await page.locator('#drop').dispatchEvent('drop',{dataTransfer:data});await expect(page.locator('#compress')).toBeEnabled();await page.locator('#amount').fill('100');await run(page);expect((await decodeResult(page)).size).toBeLessThanOrEqual(100000);
  const popup=page.waitForEvent('popup');await page.locator('#after').focus();await page.keyboard.press('Enter');const preview=await popup;expect(preview.url()).toContain('blob:');await preview.close();
});
test('already-small original is retained and invalid target has no download',async({page})=>{
  await page.locator('#file').setInputFiles(path.join(__dirname,'fixtures','rhino.jpg'));await expect(page.locator('#compress')).toBeEnabled();await page.locator('#format').selectOption('image/jpeg');await run(page);await expect(page.locator('#changes')).toContainText('원본 그대로');expect((await decodeResult(page)).size).toBe(fs.statSync(path.join(__dirname,'fixtures','rhino.jpg')).size);
  await page.locator('#amount').fill('20001');await page.locator('#compress').click();await expect(page.locator('#status')).toContainText('20 MB 이하');await expect(page.locator('#download')).toBeHidden();
});
