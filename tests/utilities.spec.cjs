const {test,expect}=require('@playwright/test');
const {tools}=require('../tool-catalog.cjs');
test('all ten tools have unique metadata, discovery and usable mobile layouts',async({page,request})=>{
 for(const t of tools){await page.goto('/'+t.slug+'/');await expect(page.locator('h1')).toHaveText(t.title);await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://util.oa.gg/'+t.slug+'/');await expect(page.locator('[data-tool]')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.cards a').count()).toBe(13);}
 expect((await request.get('/tool-catalog.cjs')).status()).toBe(404);
});
test('calendar leap year and date differences across DST',async({page})=>{
 await page.goto('/calendar/');await page.locator('#month').fill('2024-02');await expect(page.locator('#calendar-grid [role=gridcell]').filter({hasText:/^29$/})).toHaveCount(1);await page.locator('#next').click();await expect(page.locator('#month-title')).toHaveText('March 2024');
 await page.goto('/date-calculator/');await page.locator('#date-start').fill('2024-03-09');await page.locator('#date-end').fill('2024-03-11');await page.locator('#date-offset').fill('-9');await expect(page.locator('#tool-result')).toContainText('Difference: 2 days');await expect(page.locator('#tool-result')).toContainText('2024-02-29');
});
test('percentage, unit and color known results with invalid states',async({page})=>{
 await page.goto('/percentage-calculator/');await expect(page.locator('#tool-result')).toContainText('20% of 100 = 20');await page.locator('#part').fill('0');await expect(page.locator('#tool-result')).toContainText('Undefined');
 await page.goto('/unit-converter/');await page.locator('#unit-category').selectOption('temperature');await page.locator('#unit-value').fill('100');await expect(page.locator('#tool-result')).toHaveText('100 C = 212 F');await page.locator('#unit-value').fill('-274');await expect(page.locator('#tool-result')).toContainText('absolute zero');
 await page.goto('/color-picker/');await page.locator('#color-hex').fill('#f00');await expect(page.locator('#tool-result')).toContainText('rgb(255, 0, 0)');await expect(page.locator('#tool-result')).toContainText('hsl(0, 100%, 50%)');
});
test('password groups, invalid settings and countdown completion',async({page})=>{
 await page.goto('/password-generator/');await page.locator('#generate').click();const v=await page.locator('#password-output').inputValue();expect(v).toHaveLength(20);for(const re of [/[A-Z]/,/[a-z]/,/[0-9]/,/[^a-zA-Z0-9]/])expect(v).toMatch(re);for(const id of ['uppercase','lowercase','numbers','symbols'])await page.locator('#'+id).uncheck();await page.locator('#generate').click();await expect(page.locator('#tool-result')).toContainText('at least one');await expect(page.locator('#password-output')).toHaveValue('');
 await page.goto('/timer/');await page.locator('#timer-minutes').fill('0.01');await page.locator('#timer-start').click();await expect(page.locator('#tool-result')).toHaveText('Time is up.');await page.locator('#timer-mode').selectOption('stopwatch');await page.locator('#timer-start').click();await page.locator('#timer-pause').click();await expect(page.locator('#tool-result')).toHaveText('Paused.');
});
test('JSON, URL and UTF-8 Base64 round trips and error clearing',async({page})=>{
 await page.goto('/json-formatter/');await page.locator('#json-input').fill('{"x":[1,true]}');await page.locator('#json-minify').click();await expect(page.locator('#json-output')).toHaveValue('{"x":[1,true]}');await page.locator('#json-input').fill('{');await page.locator('#json-format').click();await expect(page.locator('#tool-result')).toContainText('Invalid input');await expect(page.locator('#json-output')).toHaveValue('');
 await page.goto('/url-encoder/');await page.locator('#url-input').fill('a b/é');await page.locator('#url-encode').click();await expect(page.locator('#url-output')).toHaveValue('a%20b%2F%C3%A9');await page.locator('#url-input').fill('%');await page.locator('#url-decode').click();await expect(page.locator('#url-output')).toHaveValue('');
 await page.goto('/base64/');await page.locator('#base64-input').fill('Hello 🙂');await page.locator('#base64-encode').click();const encoded=await page.locator('#base64-output').inputValue();await page.locator('#base64-input').fill(encoded);await page.locator('#base64-decode').click();await expect(page.locator('#base64-output')).toHaveValue('Hello 🙂');await page.locator('#base64-input').fill('/w==');await page.locator('#base64-decode').click();await expect(page.locator('#tool-result')).toContainText('Invalid input');
});
