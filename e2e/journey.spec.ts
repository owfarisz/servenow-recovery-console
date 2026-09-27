import {test,expect,type Page} from '@playwright/test';
const open=async(page:Page,title:string)=>page.locator('summary').filter({hasText:title}).first().click();
const saved=(page:Page)=>page.evaluate(()=>JSON.parse(localStorage.getItem('servenow-v1')!));
test.beforeEach(async({page})=>{await page.goto('/?detail=1');await page.evaluate(()=>localStorage.clear());await page.reload();});
test('one accessible interface includes all customers, legacy links, export, keyboard and responsive layout',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await expect(page.getByRole('heading',{name:/Mari pulihkan layanan/})).toBeVisible();
 await expect(page.getByRole('button',{name:/Buka tampilan lengkap|Lihat rincian teknis/})).toHaveCount(0);
 await expect(page.locator('.easy-choice')).toHaveCount(5);
 await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'artifacts/unified-home-desktop.png',fullPage:true});
 await page.getByLabel('Urutkan pelanggan').selectOption('renewal');await expect(page.locator('.easy-choice').first()).toContainText('LogistikGo');
 await page.getByRole('button',{name:'Mulai contoh baru',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
 for(const route of ['/core','/flow','/trust']){await page.goto(route);await expect(page.locator('.easy-app')).toBeVisible();await expect(page.locator('.sidebar')).toHaveCount(0);}
 await page.getByRole('button',{name:'Langkah 1: Pilih kebutuhan'}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Simpan ringkasan',exact:true}).click();await (await download).saveAs('artifacts/session-summary.txt');
 await open(page,'Atur data simulasi');const jsonDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Unduh data lengkap (JSON)',exact:true}).click();await (await jsonDownload).saveAs('artifacts/session-evidence.json');
 await page.setViewportSize({width:1280,height:720});await page.screenshot({path:'artifacts/unified-home-1280.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/unified-home-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('step-by-step bank recovery preserves readiness and failed-verification guards',async({page})=>{
 await page.getByRole('button',{name:/Bank FinNusantara.*Layanan terhenti/}).click();await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();await open(page,'Lihat penanganan layanan');
 await expect(page.getByRole('button',{name:'Mulai contoh gangguan',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Siapkan penyimpanan pengganti',exact:true}).click();
 await page.getByRole('button',{name:'Mulai contoh gangguan',exact:true}).click();
 await page.getByLabel('Penanggung jawab',{exact:true}).fill('Tim contoh');await page.getByRole('button',{name:'Tugaskan penanggung jawab'}).click();
 await page.getByRole('button',{name:'Periksa penyebab',exact:true}).click();await page.getByRole('button',{name:'Pindah ke penyimpanan pengganti'}).click();await page.getByRole('button',{name:'Coba hasil pemeriksaan gagal'}).click();
 expect((await saved(page)).core.status).toBe('failed');
 await page.getByRole('button',{name:'Pindah ke penyimpanan pengganti'}).click();await page.getByRole('button',{name:'Pastikan layanan dan data aman'}).click();
 expect((await saved(page)).core.status).toBe('healthy');
 await page.getByRole('button',{name:'Langkah 3: Periksa hasil'}).click();await open(page,'Periksa bukti dan kekurangannya');
 await page.getByRole('button',{name:'Tambahkan catatan 7 hari contoh'}).click();await page.getByRole('button',{name:'Periksa ulang semua bukti'}).click();
 const evidence=(await saved(page)).evidence;expect(evidence.filter((e:any)=>e.value===null)).toHaveLength(2);
 await expect(page.getByRole('button',{name:'Hasil sudah sesuai',exact:true})).toHaveCount(0);
 await page.screenshot({path:'artifacts/unified-bank-evidence.png',fullPage:true});
});
test('request inputs survive ticks, failed recording creates no jobs, ambiguity is verified once and reload pauses',async({page})=>{
 await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();await page.getByRole('button',{name:'Periksa gangguan',exact:true}).click();await page.getByRole('button',{name:'Pulihkan layanan',exact:true}).click();
 await open(page,'Coba satu pekerjaan tambahan');await page.getByLabel('Nomor tiket',{exact:true}).fill('T-CUSTOM');await page.getByLabel('Coba pencatatan awal gagal').check();await page.getByRole('button',{name:'Kirim pekerjaan contoh'}).click();expect((await saved(page)).jobs).toHaveLength(0);
 await page.getByLabel('Coba pencatatan awal gagal').uncheck();await page.getByLabel('Kondisi contoh').selectOption('ambiguous');await page.getByRole('button',{name:'Kirim pekerjaan contoh'}).click();
 await page.getByRole('button',{name:'Jalankan waktu contoh',exact:true}).click();await page.waitForTimeout(1100);await expect(page.getByLabel('Nomor tiket',{exact:true})).toHaveValue('T-CUSTOM');
 await page.reload();expect((await saved(page)).running).toBe(false);await page.getByRole('button',{name:'Lanjutkan pemulihan'}).click();await open(page,'Coba satu pekerjaan tambahan');await page.getByRole('button',{name:'Jalankan 5 detik contoh',exact:true}).click();
 await open(page,'Lihat pekerjaan satu per satu');await page.getByRole('button',{name:'Pastikan hasil T-CUSTOM',exact:true}).click();const s=await saved(page);expect(s.remote['toko:T-CUSTOM'].effects).toBe(1);expect(s.jobs[0].status).toBe('succeeded');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/unified-work-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('report keeps old checkpoint on failure and UI refresh, then safely publishes corrected data',async({page})=>{
 await page.getByRole('button',{name:/TeleNusa.*Laporan terlambat/}).click();await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();await open(page,'Lihat isi dan usia laporan');
 await page.getByRole('button',{name:'Periksa pembaruan laporan',exact:true}).click();await page.getByRole('button',{name:'Jalankan 3 detik contoh'}).click();const before=await saved(page);expect(before.pipeline.checkpoint).toBe(100);
 await page.getByRole('button',{name:'Muat ulang tampilan laporan'}).click();expect((await saved(page)).pipeline.through).toBe(before.pipeline.through);
 await page.getByRole('button',{name:'Perbaiki format laporan',exact:true}).click();await page.getByRole('button',{name:'Periksa pembaruan laporan',exact:true}).click();await page.getByRole('button',{name:'Jalankan 3 detik contoh'}).click();expect((await saved(page)).pipeline.rows).toEqual({'T-01':2,'T-02':3});await page.goto('/flow');expect((await saved(page)).pipeline.checkpoint).toBe(103);await expect(page.locator('.easy-app')).toBeVisible();
});
test('editable agreements invalidate reviews; mandatory spending is recorded while excessive optional spending is blocked',async({page})=>{
 await page.getByRole('button',{name:/TeleNusa.*Laporan terlambat/}).click();await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();await page.getByRole('button',{name:'Perbarui laporan',exact:true}).click();await page.getByRole('button',{name:'Perbaiki dan coba lagi'}).click();await page.getByRole('button',{name:'Lanjut ke hasil'}).click();await page.getByRole('button',{name:'Siapkan hasil pemeriksaan'}).click();await page.getByRole('button',{name:'Hasil sudah sesuai'}).click();
 await page.getByRole('button',{name:'Langkah 1: Pilih kebutuhan'}).click();await open(page,'Atur ukuran keberhasilan');await page.getByLabel('Nilai (menit)').fill('10');await page.getByRole('button',{name:'Simpan ukuran baru'}).click();let s=await saved(page);expect(s.accounts.find((a:any)=>a.id==='tele').version).toBe(2);expect(s.evidence.every((e:any)=>e.validation==='outdated')).toBe(true);
 await page.getByRole('button',{name:'Langkah 4: Putuskan bersama'}).click();await expect(page.getByRole('button',{name:'Lanjutkan kerja sama'})).toBeDisabled();
 await open(page,'Lihat dan atur biaya pemulihan');await page.getByLabel('Jumlah rencana biaya (juta rupiah)').fill('900');await page.getByRole('button',{name:'Simpan rencana biaya',exact:true}).click();s=await saved(page);expect(s.ledger.find((l:any)=>l.id==='goodwill').allowance).toBe(25);
 await page.getByLabel('Ini kewajiban yang harus dicatat').check();await page.getByRole('button',{name:'Simpan rencana biaya',exact:true}).click();s=await saved(page);expect(s.ledger.find((l:any)=>l.id==='mandatory-extra').allowance).toBe(900);
 await page.getByLabel('Biaya langganan per bulan (juta rupiah)').fill('100');await page.getByLabel('Memenuhi syarat kontrak dalam contoh ini').check();await page.getByRole('button',{name:'Simpan pengembalian biaya',exact:true}).click();expect((await saved(page)).ledger.find((l:any)=>l.id==='refund').refundByAccount.tele).toBe(15);
 await page.screenshot({path:'artifacts/unified-budget.png',fullPage:true});
});
for(const customer of ['MedikaCare','LogistikGo'])test(`${customer} has its own complete evidence journey`,async({page})=>{
 await page.getByRole('button',{name:new RegExp(customer)}).click();await page.getByRole('button',{name:'Setuju, mulai pemulihan'}).click();await page.getByRole('button',{name:'Periksa gangguan',exact:true}).click();await page.getByRole('button',{name:'Pulihkan layanan',exact:true}).click();
 if(customer==='LogistikGo'){await page.getByRole('button',{name:'Proses 10 tiket'}).click();await page.getByRole('button',{name:'Pastikan hasil tiket'}).click({timeout:18000});await page.getByRole('button',{name:'Perbarui laporan',exact:true}).click();}
 await page.getByRole('button',{name:'Lihat contoh catatan'}).click();
 if(customer==='MedikaCare')await page.getByRole('button',{name:'Tambahkan contoh pemeriksaan'}).click();
 await page.getByRole('button',{name:'Lanjut ke hasil'}).click();await page.getByRole('button',{name:'Siapkan hasil pemeriksaan'}).click();await page.getByRole('button',{name:'Hasil sudah sesuai'}).click();await page.getByRole('button',{name:'Lanjut ke keputusan'}).click();await page.getByRole('button',{name:'Tidak melanjutkan',exact:true}).click();
 const s=await saved(page),id=customer==='MedikaCare'?'medika':'logistik';expect(s.run.accountId).toBe(id);expect(s.evidence.every((e:any)=>e.accountId===id&&e.customerReview==='accepted')).toBe(true);expect(s.accounts.find((a:any)=>a.id===id).contract).toBe('not_renewed');expect(s.accounts.filter((a:any)=>a.id!==id).every((a:any)=>a.contract==='not_started')).toBe(true);
});

test('corrupt saved data is preserved until the user explicitly resets it',async({page})=>{
 await page.evaluate(()=>localStorage.setItem('servenow-v1','broken-record'));await page.reload();
 await expect(page.getByRole('status')).toContainText('Data tersimpan tidak dapat dibaca');
 expect(await page.evaluate(()=>localStorage.getItem('servenow-v1'))).toBe('broken-record');
 await open(page,'Atur data simulasi');await page.getByRole('button',{name:'Hapus semua data contoh',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Ya, hapus semua',exact:true}).click();
 expect((await saved(page)).schemaVersion).toBe(1);await expect(page.getByRole('status')).toHaveCount(0);
});
