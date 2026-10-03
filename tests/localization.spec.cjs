const {test,expect}=require('@playwright/test');
const {pages}=require('../render-pages.cjs');
const fs=require('node:fs');
const path=require('node:path');
test('paired language pages have translated metadata, navigation and correct SEO',async({page,request})=>{
 for(const name of Object.keys(pages).filter(name=>!name.startsWith('ko/'))){
  const route='/'+name.replace(/index\.html$/,'');
  await page.goto('/ko'+route);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
  expect(await page.title()).toMatch(/[가-힣]/);
  expect(await page.locator('meta[name=description]').getAttribute('content')).toMatch(/[가-힣]/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://util.oa.gg/ko'+route);
  await expect(page.locator('link[hreflang=en]')).toHaveAttribute('href','https://util.oa.gg'+route);
  await expect(page.locator('link[hreflang=ko]')).toHaveAttribute('href','https://util.oa.gg/ko'+route);
  await expect(page.locator('link[hreflang=x-default]')).toHaveAttribute('href','https://util.oa.gg'+route);
  await expect(page.locator('.language-switch a[lang=en]')).toHaveAttribute('href',new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'));
  for(const href of await page.locator('header nav a,.cards a,.site-footer a').evaluateAll(links=>links.map(a=>a.getAttribute('href'))))if(!href.includes('github.com'))expect(new URL(href,'https://util.oa.gg').pathname).toMatch(/^\/ko\//);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.locator('.language-switch a[lang=en]').click();await expect(page.locator('html')).toHaveAttribute('lang','en');
 const sitemap=await (await request.get('/sitemap.xml')).text();expect((sitemap.match(/<loc>/g)||[])).toHaveLength(32);
 expect((await request.get('/translations-ko.cjs')).status()).toBe(404);
});
test('Korean results and errors preserve user input across tools',async({page})=>{
 await page.goto('/ko/calendar/');await page.locator('#month').fill('2024-02');await expect(page.locator('#month-title')).toHaveText('2024년 2월');await expect(page.locator('[role=columnheader]').first()).toHaveText(/^[일월]$/);
 await page.goto('/ko/date-calculator/');await page.locator('#date-start').fill('2024-03-09');await page.locator('#date-end').fill('2024-03-11');await expect(page.locator('#tool-result')).toContainText('날짜 차이: 2일');
 await page.goto('/ko/percentage-calculator/');await expect(page.locator('#tool-result')).toContainText('100의 20% = 20');
 await page.goto('/ko/unit-converter/');await page.locator('#unit-category').selectOption('temperature');await page.locator('#unit-value').fill('-274');await expect(page.locator('#tool-result')).toContainText('절대 영도');
 await page.goto('/ko/password-generator/');await page.locator('#generate').click();expect(await page.locator('#password-output').inputValue()).toHaveLength(20);await expect(page.locator('#tool-result')).toContainText('기기에서 생성');
 await page.goto('/ko/timer/');await page.locator('#timer-minutes').fill('0.01');await page.locator('#timer-start').click();await expect(page.locator('#tool-result')).toHaveText('시간이 끝났습니다.');
 await page.goto('/ko/json-formatter/');await page.locator('#json-input').fill('{"Ready":"안녕"}');await page.locator('#json-minify').click();await expect(page.locator('#json-output')).toHaveValue('{"Ready":"안녕"}');await page.locator('#json-input').fill('{');await page.locator('#json-format').click();await expect(page.locator('#tool-result')).toContainText('입력이 올바르지');
 await page.goto('/ko/base64/');await page.locator('#base64-input').fill('Ready 안녕 🙂');await page.locator('#base64-encode').click();const encoded=await page.locator('#base64-output').inputValue();await page.locator('#base64-input').fill(encoded);await page.locator('#base64-decode').click();await expect(page.locator('#base64-output')).toHaveValue('Ready 안녕 🙂');
 await page.goto('/ko/text-counter/');await page.locator('#text-input').fill('Ready');await expect(page.locator('#text-input')).toHaveValue('Ready');await expect(page.locator('#characters')).toHaveText('5');
 await page.goto('/ko/data-size/');await expect(page.locator('#conversion-status')).toContainText('십진 단위');
});
test('Korean compressor downloads locally with translated messages and original filename',async({page})=>{
 const external=[];await page.goto('/ko/');const origin=new URL(page.url()).origin;page.on('request',r=>{if(!r.url().startsWith('blob:')&&(r.method()!=='GET'||new URL(r.url()).origin!==origin))external.push(r.url());});
 await page.locator('#file').setInputFiles({name:'Ready.jpg',mimeType:'image/jpeg',buffer:fs.readFileSync(path.join(__dirname,'fixtures/rhino.jpg'))});await expect(page.locator('#compress')).toBeEnabled();await expect(page.locator('#filename')).toHaveText('Ready.jpg');await expect(page.locator('#status')).toContainText('목표 용량');
 await page.locator('#amount').fill('10');await page.locator('#compress').click();await expect(page.locator('#download')).toBeVisible();await expect(page.locator('#badge')).toHaveText('목표 달성');await expect(page.locator('#changes')).toContainText('품질 설정');await expect(page.locator('#before')).toHaveAttribute('aria-label','원본 이미지를 원래 크기로 열기');
 const pending=page.waitForEvent('download');await page.locator('#download').click();const download=await pending;expect(fs.readFileSync(await download.path()).length).toBeLessThanOrEqual(10000);expect(external).toEqual([]);
 await page.locator('#amount').fill('0');await page.locator('#compress').click();await expect(page.locator('#status')).toContainText('목표 용량을 입력');
});
