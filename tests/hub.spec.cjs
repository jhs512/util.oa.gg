const {test,expect}=require('@playwright/test');
test('hub entry, canonical, real discovery, privacy and no active ad script',async({page,request})=>{
  await page.goto('/');await expect(page.locator('.brand')).toContainText('util.oa.gg');await expect(page.locator('#file')).toBeAttached();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://util.oa.gg/');
  await expect(page.locator('nav a[href$="/text-counter/"]')).toBeVisible();expect(await page.locator('script[src*="googlesyndication"]').count()).toBe(0);
  await expect(page.locator('meta[name="google-adsense-account"]')).toHaveAttribute('content','ca-pub-8194376114167709');
  const sitemap=await request.get('/sitemap.xml');expect(sitemap.status()).toBe(200);expect(await sitemap.text()).toContain('https://util.oa.gg/text-counter/');
  for(const route of ['/about/','/privacy/']){const response=await request.get(route);expect(response.status()).toBe(200);expect(await response.text()).toContain('<link rel="canonical"');}
  expect((await request.get('/AGENTS.md')).status()).toBe(404);expect((await request.get('/not-a-tool/')).status()).toBe(404);
});
test('text count handles Korean, emoji, whitespace and resets',async({page})=>{
  await page.goto('/text-counter/');await page.locator('#text-input').fill('가 A🙂\n');await expect(page.locator('#characters')).toHaveText('5');await expect(page.locator('#no-spaces')).toHaveText('3');await expect(page.locator('#bytes')).toHaveText('10');await expect(page.locator('#words')).toHaveText('2');
  await page.locator('#clear').click();await expect(page.locator('#bytes')).toHaveText('0');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('file size converter distinguishes decimal and binary and rejects negatives',async({page})=>{
  await page.goto('/data-size/');await expect(page.locator('[data-factor="1"]')).toHaveText('1,000,000');await expect(page.locator('[data-factor="1024"]')).toHaveText('976.5625');await page.locator('#from-unit').selectOption('1048576');await expect(page.locator('[data-factor="1"]')).toHaveText('1,048,576');
  await page.locator('#quantity').fill('-1');await expect(page.locator('[data-factor="1"]')).toHaveText('—');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
