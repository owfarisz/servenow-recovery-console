import {test,expect} from '@playwright/test';
test('published single interface includes all customers, specialized motion and report recovery',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('https://owfarisz.github.io/servenow-recovery-console/?detail=1');expect(response?.status()).toBe(200);
 await expect(page.getByRole('heading',{name:/Mari pulihkan layanan/})).toBeVisible();await expect(page.locator('.easy-choice')).toHaveCount(5);
 await expect(page.getByRole('button',{name:'Buka tampilan lengkap'})).toHaveCount(0);
 await page.screenshot({path:'artifacts/published-simple-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();await page.getByRole('button',{name:'Periksa gangguan',exact:true}).click();
 await expect(page.locator('.data-motion')).toHaveAttribute('data-scene','queue');await expect(page.locator('.ticket-pile')).toBeVisible();
 await page.screenshot({path:'artifacts/published-workflow.png',fullPage:true,animations:'disabled'});
 await page.getByRole('button',{name:'Langkah 1: Pilih kebutuhan'}).click();await page.getByRole('button',{name:/TeleNusa.*Laporan terlambat/}).click();await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();
 await page.goto('https://owfarisz.github.io/servenow-recovery-console/#/flow');await page.reload();await expect(page.locator('.easy-app')).toBeVisible();
 await page.getByRole('button',{name:'Perbarui laporan',exact:true}).click();await expect(page.getByRole('button',{name:'Perbaiki dan coba lagi'})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('servenow-v1')!).pipeline.checkpoint)).toBe(100);
 await page.getByRole('button',{name:'Perbaiki dan coba lagi'}).click();await expect(page.getByRole('button',{name:'Lanjut ke hasil'})).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('servenow-v1')!).pipeline.checkpoint)).toBe(103);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/published-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
