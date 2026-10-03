const {test,expect}=require('@playwright/test');

test('English pages have unique crawlable search metadata and usable layouts',async({page,request})=>{
  const titles=new Set(),checkedLinks=new Set();
  for(const route of ['/','/text-counter/','/data-size/','/about/','/privacy/']){
    const response=await request.get(route);expect(response.status()).toBe(200);
    const html=await response.text();expect(html).not.toMatch(/[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f]/u);
    await page.goto(route);await expect(page.locator('html')).toHaveAttribute('lang','en');
    const title=await page.title();expect(titles.has(title)).toBe(false);titles.add(title);
    expect((await page.locator('meta[name="description"]').getAttribute('content')).length).toBeGreaterThan(40);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://util.oa.gg'+route);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const href of await page.locator('nav a,.discover a').evaluateAll(links=>links.map(link=>link.getAttribute('href')))){
      expect(href.startsWith('https://util.oa.gg/')||href.startsWith('/')).toBe(true);
      const pathname=new URL(href,'https://util.oa.gg').pathname;
      if(!checkedLinks.has(pathname)){expect((await request.get(pathname)).status()).toBe(200);checkedLinks.add(pathname);}
    }
  }
});
test('hub entry, canonical, real discovery, privacy and no active ad script',async({page,request})=>{
  await page.goto('/');await expect(page.locator('.brand')).toContainText('util.oa.gg');await expect(page.locator('#file')).toBeAttached();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://util.oa.gg/');
  await expect(page.locator('nav a[href$="/text-counter/"]')).toBeVisible();expect(await page.locator('script[src*="googlesyndication"]').count()).toBe(0);
  await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute('content','ca-pub-8194376114167709');
  const sitemap=await request.get('/sitemap.xml');expect(sitemap.status()).toBe(200);expect(await sitemap.text()).toContain('https://util.oa.gg/text-counter/');
  for(const route of ['/about/','/privacy/']){const response=await request.get(route);expect(response.status()).toBe(200);expect(await response.text()).toContain('<link rel="canonical"');}
  expect((await request.get('/AGENTS.md')).status()).toBe(404);expect((await request.get('/not-a-tool/')).status()).toBe(404);
});
test('text count handles Unicode, emoji, whitespace and resets',async({page})=>{
  await page.goto('/text-counter/');await page.locator('#text-input').fill('é A🙂\n');await expect(page.locator('#characters')).toHaveText('5');await expect(page.locator('#no-spaces')).toHaveText('3');await expect(page.locator('#bytes')).toHaveText('9');await expect(page.locator('#words')).toHaveText('2');
  await page.locator('#clear').click();await expect(page.locator('#bytes')).toHaveText('0');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('file size converter distinguishes decimal and binary and rejects negatives',async({page})=>{
  await page.goto('/data-size/');await expect(page.locator('[data-factor="1"]')).toHaveText('1,000,000');await expect(page.locator('[data-factor="1024"]')).toHaveText('976.5625');await page.locator('#from-unit').selectOption('1048576');await expect(page.locator('[data-factor="1"]')).toHaveText('1,048,576');
  await page.locator('#quantity').fill('-1');await expect(page.locator('[data-factor="1"]')).toHaveText('—');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
