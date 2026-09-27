import { useEffect, useRef, useState, type Dispatch } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, CircleHelp, Download, FileCheck2, HeartHandshake, Pause, Play, RotateCcw, Server, ShieldCheck, ShoppingBag, Signal, Sparkles, X } from 'lucide-react';
import { account, accepted, cohort, currentEvidence, forecast, type Action, type AccountId, type Scenario, type State } from '../domain/engine';
import './simple.css';
import RecoveryWorkflow from './RecoveryWorkflow';
import {AgreementDetails,ServiceDetails,WorkDetails,EvidenceDetails,BudgetDetails,HistoryDetails,DetailSection,friendlyCriterion} from './RecoveryDetails';

type Props = { state: State; dispatch: Dispatch<Action>; onExport: () => void; onExportData:()=>void; onResetAll:()=>void; storageNotice: string };
const choices: {id: Scenario; accountId:AccountId; customer: string; title: string; description: string; icon: typeof ShoppingBag}[] = [
  {id:'S1',accountId:'toko',customer:'TokoCepat',title:'Tiket menumpuk',description:'Bantu semua tiket selesai.',icon:ShoppingBag},
  {id:'S2',accountId:'bank',customer:'Bank FinNusantara',title:'Layanan terhenti',description:'Pulihkan layanan dengan aman.',icon:ShieldCheck},
  {id:'S3',accountId:'tele',customer:'TeleNusa',title:'Laporan terlambat',description:'Tampilkan data terbaru.',icon:Signal},
];
choices.push({id:'S1',accountId:'logistik',customer:'LogistikGo',title:'Pengiriman sering gagal',description:'Pastikan pekerjaan selesai dan kegagalan berkurang.',icon:ShoppingBag},{id:'S1',accountId:'medika',customer:'MedikaCare',title:'Layanan lambat',description:'Periksa kecepatan dan operasional medis.',icon:HeartHandshake});
const steps = ['Pilih kebutuhan', 'Pulihkan layanan', 'Periksa hasil', 'Putuskan bersama'];
const formatMoney = (n:number) => `Rp${n.toLocaleString('id-ID')} juta`;

export default function SimpleExperience({state:s,dispatch:d,onExport,onExportData,onResetAll,storageNotice}:Props) {
  const ac = account(s), jobs = cohort(s), evidence = currentEvidence(s);
  const [page,setPage] = useState(()=>{const path=window.location.hash.replace('#','')||window.location.pathname;return /\/(core|flow)(\?|$)/.test(path)?1:/\/trust(\?|$)/.test(path)?2:0;});
  const [help,setHelp] = useState(false), [restart,setRestart] = useState(false),[erase,setErase]=useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null), restartRef = useRef<HTMLDialogElement>(null);
  const active = choices.find(c=>c.accountId===s.run.accountId)!;
  const [decisionOwner,setDecisionOwner]=useState(ac.owner),[decisionNote,setDecisionNote]=useState('Hasil pemulihan telah diperiksa bersama pelanggan. Keputusan simulasi.');
  const [sort,setSort]=useState('default');
  useEffect(()=>{setDecisionOwner(ac.owner);},[s.selected]);
  const medical=s.selected==='medika', logistics=s.selected==='logistik';
  const finished = jobs.filter(j=>j.status==='succeeded').length;
  const ambiguous = jobs.find(j=>j.status==='needs_verification');
  const hasJobs = jobs.length>0;
  const pipelineReady = s.pipeline.status==='published';
  const coreReady = s.core.status==='healthy';
  const sample = s.fixtures.some(f=>f.accountId===s.selected&&f.runId===s.run.id&&!f.manual);
  const manual = s.fixtures.some(f=>f.accountId===s.selected&&f.runId===s.run.id&&f.manual);
  const ready = medical?coreReady&&sample&&manual:s.run.scenario==='S2'?coreReady&&sample&&manual:pipelineReady&&(s.run.scenario==='S3'||hasJobs&&finished===jobs.length)&&(!logistics||sample);
  const reviewReady = ac.criteria.every(c=>evidence.some(e=>e.criterionId===c.id&&['customer_review_pending','accepted'].includes(e.validation)));
  const isAccepted = accepted(s);
  const run = (...actions:Action[]) => actions.forEach(d);
  const go = (next:number) => { d({type:'pause'}); setPage(next); };
  const play = () => run({type:'speed',value:4},...(!s.running?[{type:'play'}]:[]));
  const startBatch = () => {d({type:'batch'});play();};
  useEffect(()=>{ if(page>0) titleRef.current?.focus(); },[page]);
  useEffect(()=>{if(restart)restartRef.current?.showModal();},[restart]);
  useEffect(()=>{
    if(!s.running)return;
    const jobsSettled = hasJobs&&jobs.every(j=>['succeeded','needs_verification','needs_attention'].includes(j.status));
    if((jobsSettled&&s.pipeline.status==='idle')||(['failed','published'].includes(s.pipeline.status)&&!jobs.some(j=>['accepted','queued','running','retry_wait'].includes(j.status)))) d({type:'pause'});
  },[s.running,s.run.now,s.pipeline.status,hasJobs,jobs,d]);
  const choose = (choice:typeof choices[number]) => {run({type:'scenario',scenario:choice.id,accountId:choice.accountId},{type:'role',value:'Presenter'});setPage(0);};

  let taskTitle = '', taskText = '', actionText = '', action:()=>void = ()=>{};
  if(!coreReady){
    if(s.core.incident==='none') {taskTitle='Cari penyebab gangguan';taskText='Tim akan memeriksa layanan dan menyiapkan penanganan.';actionText='Periksa gangguan';action=()=>run(...(s.run.scenario==='S2'?[{type:'prepare'}]:[]),{type:'inject'},{type:'assign'},{type:'diagnose'});}
    else {taskTitle='Penyebab sudah ditemukan';taskText='Sekarang pulihkan layanan dan pastikan hasilnya aman.';actionText='Pulihkan layanan';action=()=>run(...(s.core.incident==='detected'?[{type:'assign'}]:[]),...(['assigned','detected'].includes(s.core.incident)?[{type:'diagnose'}]:[]),...(s.core.incident!=='verifying'?[{type:'recover',playbook:'mitigate'}]:[]),{type:'verifyCore'});}
  } else if(s.run.scenario==='S2'||medical){
    if(!sample){taskTitle='Layanan sudah pulih';taskText='Lihat contoh catatan layanan selama tujuh hari.';actionText='Lihat contoh catatan';action=()=>d({type:'fixture'});}
    else if(!manual){taskTitle='Masih ada pemeriksaan tambahan';taskText=medical?'Operasional medis perlu diperiksa bersama penanggung jawab.':'Keamanan dan lokasi data perlu diperiksa terpisah.';actionText='Tambahkan contoh pemeriksaan';action=()=>d({type:'fixture',manual:true});}
    else {taskTitle='Hasil siap diperiksa';taskText='Contoh bukti telah tersedia untuk pelanggan.';actionText='Lanjut ke hasil';action=()=>go(2);}
  } else if(s.run.scenario==='S1'&&!hasJobs){taskTitle='Layanan siap bekerja';taskText='Kirim sepuluh tiket contoh. Kita ikuti sampai selesai.';actionText='Proses 10 tiket';action=()=>{d({type:'submit',count:10});play();};}
  else if(s.run.scenario==='S1'&&finished<jobs.length){
    if(ambiguous&&jobs.every(j=>['succeeded','needs_verification'].includes(j.status))){taskTitle='Satu tiket perlu dipastikan';taskText='Balasan belum diterima. Periksa hasilnya agar tiket tidak diproses dua kali.';actionText='Pastikan hasil tiket';action=()=>d({type:'verifyJob',id:ambiguous.id});}
    else if(jobs.some(j=>j.status==='needs_attention')){taskTitle='Ada tiket yang perlu diperbaiki';taskText='Perbaiki data tiket, lalu proses kembali dengan aman.';actionText='Perbaiki tiket';action=()=>{jobs.filter(j=>j.status==='needs_attention').forEach(j=>d({type:'retry',id:j.id}));play();};}
    else {taskTitle='Tiket sedang diselesaikan';taskText='Tiket yang sempat gagal akan dicoba kembali secara aman.';actionText=s.running?'Jeda sebentar':'Lanjutkan proses';action=()=>s.running?d({type:'pause'}):play();}
  } else if(!pipelineReady){
    if(s.pipeline.status==='failed'){taskTitle='Laporan belum dapat diperbarui';taskText='Ada data yang perlu diperbaiki. Laporan lama tetap aman.';actionText='Perbaiki dan coba lagi';action=()=>{d({type:'mapping'});startBatch();};}
    else if(s.pipeline.status==='extracting'){taskTitle='Laporan sedang diperbarui';taskText='Hanya data yang lengkap dan benar yang akan ditampilkan.';actionText=s.running?'Jeda sebentar':'Lanjutkan proses';action=()=>s.running?d({type:'pause'}):play();}
    else {taskTitle=s.run.scenario==='S3'?'Periksa laporan terbaru':'Semua tiket sudah selesai';taskText='Perbarui laporan agar pelanggan melihat hasil yang lengkap.';actionText='Perbarui laporan';action=startBatch;}
  } else if(logistics&&!sample){taskTitle='Periksa kegagalan pengiriman';taskText='Gunakan catatan tujuh hari contoh untuk menghitung permintaan yang gagal.';actionText='Lihat contoh catatan';action=()=>d({type:'fixture'});
  } else {taskTitle='Pemulihan selesai';taskText='Layanan dan laporan siap diperiksa oleh pelanggan.';actionText='Lanjut ke hasil';action=()=>go(2);}
  const resultLabels = medical?['Layanan sudah pulih','Contoh waktu tanggapan tersedia','Contoh pemeriksaan medis tersedia']:logistics?['Pekerjaan selesai dan dipastikan','Laporan sudah diperbarui','Contoh tingkat kegagalan tersedia']:s.run.scenario==='S1'?[`${finished} dari ${jobs.length} tiket selesai`,'Tidak ada pekerjaan ganda','Laporan sudah diperbarui']:s.run.scenario==='S2'?['Layanan pulih dan diperiksa','Contoh catatan 7 hari tersedia','Contoh pemeriksaan tambahan tersedia']:['Data terbaru sudah tampil','Semua perubahan tercatat','Data lama tetap aman saat gagal'];

  return <div className="easy-app">
    <header className="easy-header"><a className="easy-brand" href={import.meta.env.BASE_URL}><span>S</span>ServeNow</a><span className="easy-simulation"><i/>Simulasi · data contoh</span><button className="easy-help" onClick={()=>setHelp(!help)} aria-expanded={help}><CircleHelp size={21}/> Bantuan</button></header>
    {help&&<aside className="easy-help-panel"><strong>Ikuti tombol berwarna ungu.</strong><p>Setiap layar menunjukkan satu langkah. Anda bisa berhenti kapan saja; hasil tersimpan di perangkat ini.</p><button onClick={()=>setHelp(false)}>Mengerti <Check size={18}/></button></aside>}
    <main className="easy-main">
      <nav className="easy-steps" aria-label="Langkah pemulihan">{steps.map((label,i)=><div key={label} className={`${page===i?'current':''} ${page>i?'done':''}`} aria-current={page===i?'step':undefined}><button className="easy-step-button" onClick={()=>go(i)} aria-label={`Langkah ${i+1}: ${label}`}><span>{page>i?<Check size={19}/>:i+1}</span><b>{label}</b></button></div>)}</nav>
      {storageNotice&&<p className="easy-notice" role="status">{storageNotice} Gunakan “Simpan ringkasan” agar hasil tidak hilang.</p>}
      {s.notice&&!s.notice.startsWith('Run baru')&&<p className="easy-notice" role="status">{s.notice}</p>}
      {s.selected!==s.run.accountId?<section className="easy-card easy-intro"><h1 ref={titleRef} tabIndex={-1}>Lanjutkan contoh pelanggan</h1><p>Pilih contoh untuk mengikuti pemulihan dari awal.</p><button className="easy-primary" onClick={()=>d({type:'select',id:s.run.accountId})}>Lanjutkan {active.customer}<ArrowRight/></button></section>:<>
      {page===0&&<>
        <section className="easy-intro"><span className="easy-eyebrow">SELAMAT DATANG</span><h1 ref={titleRef} tabIndex={-1}>Mari pulihkan layanan,<br/><em>selangkah demi selangkah.</em></h1><p>Pilih masalahnya. Kami bantu sampai pelanggan merasa yakin.</p></section>
        <label className="easy-account-sort">Urutkan pelanggan<select value={sort} onChange={e=>setSort(e.target.value)}><option value="default">Contoh utama dahulu</option><option value="renewal">Waktu perpanjangan terdekat</option><option value="arr">Nilai langganan terbesar</option><option value="gap">Permintaan perbaikan terbanyak</option></select></label><div className="easy-choices" role="group" aria-label="Pilih contoh masalah">{[...choices].sort((a,b)=>{const aa=s.accounts.find(x=>x.id===a.accountId)!,bb=s.accounts.find(x=>x.id===b.accountId)!;return sort==='renewal'?aa.months-bb.months:sort==='arr'?bb.arr-aa.arr:sort==='gap'?s.gaps.filter(g=>g.accountId===bb.id).length-s.gaps.filter(g=>g.accountId===aa.id).length:0;}).map(c=>{const I=c.icon;const customer=s.accounts.find(x=>x.id===c.accountId)!;return <button key={c.accountId} className={`easy-choice ${s.run.accountId===c.accountId?'chosen':''}`} aria-pressed={s.run.accountId===c.accountId} onClick={()=>s.run.accountId!==c.accountId&&choose(c)}><span className="easy-choice-top"><span className="easy-choice-icon"><I size={27}/></span>{s.run.accountId===c.accountId?<span className="easy-chosen"><Check size={17}/> Dipilih</span>:<span className="easy-choice-circle"/>}</span><small>{c.customer}</small><strong>{c.title}</strong><p>{c.description}</p><span className="easy-account-meta">{customer.months} bulan menuju perpanjangan</span></button>})}</div>
        <section className="easy-start"><div><span className="easy-eyebrow">YANG INGIN DICAPAI</span><h2>{medical?'Layanan cepat, operasional diperiksa bersama.':logistics?'Pengiriman selesai, kegagalan kurang dari 1%.':s.run.scenario==='S1'?'Semua tiket selesai, pelanggan yakin.':s.run.scenario==='S2'?'Layanan pulih dan hasilnya dapat dipercaya.':'Laporan terbaru, lengkap, dan jelas.'}</h2><details className="easy-details"><summary>Lihat ukuran keberhasilan <ChevronDown size={18}/></summary><ul>{ac.criteria.map(c=><li key={c.id}>{friendlyCriterion(c)}: {c.op.replace('<=','≤').replace('>=','≥')} {c.threshold} {c.unit}{c.duration>0?' · periode contoh 7 hari':''}</li>)}</ul><p>Ukuran ini memakai kesepakatan contoh untuk simulasi.</p></details></div><button className="easy-primary" onClick={()=>{d({type:'agree'});go(1);}}>{ac.agreed?'Lanjutkan pemulihan':'Setuju, mulai pemulihan'}<ArrowRight size={22}/></button></section>
        <AgreementDetails state={s} dispatch={d}/>
        <DetailSection title="Lihat profil dan perkembangan pelanggan"><p>Semua pelanggan mendapat penanganan. Waktu perpanjangan dihitung dari awal kasus.</p><div className="easy-portfolio"><span>{s.accounts.filter(a=>a.criteria.every(c=>s.evidence.some(e=>e.accountId===a.id&&e.covenantVersion===a.version&&e.criterionId===c.id&&e.validation==='accepted'))).length} pelanggan dengan bukti diterima</span><span>{s.accounts.filter(a=>a.intent==='continue_intent').length} ingin melanjutkan</span><span>{s.accounts.filter(a=>a.contract==='renewed').length} keputusan melanjutkan</span></div><div className="easy-records">{s.accounts.map(a=><article key={a.id}><strong>{a.name}</strong><p>{a.owner}</p><p>{formatMoney(a.arr)} per tahun · perpanjangan {a.months} bulan lagi</p><p>{s.gaps.filter(g=>g.accountId===a.id).length} permintaan perbaikan</p><p>{a.contract==='renewed'?'Keputusan contoh: dilanjutkan':a.contract==='not_renewed'?'Keputusan contoh: tidak dilanjutkan':a.contract==='negotiating'?'Masih dibicarakan':'Dalam penanganan'}</p></article>)}</div><p className="easy-hint">Keputusan terdahulu tetap tercatat. Memulai contoh baru memerlukan bukti dan pemeriksaan baru.</p></DetailSection>
        <p className="easy-reassurance"><ShieldCheck size={18}/>Aman dicoba. Tidak memengaruhi layanan atau data asli.</p>
      </>}
      {page===1&&<>
        <div className="easy-section-heading"><button className="easy-back" onClick={()=>go(0)}><ArrowLeft size={20}/> Kembali</button><span>{active.customer} <span> / </span> {active.title}</span></div>
        <RecoveryWorkflow state={s} onPause={()=>d({type:'pause'})}>
          <div className="easy-task" aria-live="polite"><span className="easy-eyebrow">YANG KITA LAKUKAN SEKARANG</span><h1 ref={titleRef} tabIndex={-1}>{taskTitle}</h1><p>{taskText}</p>
            {s.run.scenario==='S1'&&hasJobs&&<div className="easy-progress" aria-label={`${finished} dari ${jobs.length} tiket selesai`}><div><strong>{finished} <span>dari {jobs.length} tiket selesai</span></strong>{s.running&&<span className="easy-running-dot"/>}</div><progress max={jobs.length} value={finished}/></div>}
            {s.pipeline.status==='failed'&&<div className="easy-soft-warning">Belum ada data baru yang diterbitkan.</div>}
            {s.run.scenario==='S2'&&coreReady&&<p className="easy-hint">Catatan dan pemeriksaan ini hanya contoh, bukan bukti audit nyata.</p>}
            <button className="easy-primary" onClick={action}>{s.running?<Pause size={20}/>:null}{actionText}{!s.running&&<ArrowRight size={22}/>}</button>
            <details className="easy-details"><summary>Apa yang terjadi? <ChevronDown size={18}/></summary><p>{medical?'Layanan dipulihkan, lalu kecepatan dan operasional medis diperiksa terpisah.':s.run.scenario==='S1'?'Layanan dipulihkan, tiket diselesaikan satu kali, lalu laporan diperbarui. Penerimaan tiket belum berarti tiket selesai.':s.run.scenario==='S2'?'Tim menyiapkan layanan cadangan, memulihkan layanan, lalu memeriksa hasilnya. Pemeriksaan keamanan tetap terpisah.':'Data diperiksa sebelum laporan diterbitkan. Jika pemeriksaan gagal, laporan sebelumnya tetap tersedia.'}</p></details>
          </div>
        </RecoveryWorkflow>
        <section className="easy-support" aria-label="Rincian pemulihan"><h2>Ikuti setiap bagian</h2><div className="easy-clock-control"><span>Waktu contoh: {s.run.now} detik · {s.running?'berjalan':'dijeda'}</span><button onClick={()=>d({type:s.running?'pause':'play'})}>{s.running?'Jeda waktu contoh':'Jalankan waktu contoh'}</button><label>Kecepatan<select value={s.speed} onChange={e=>d({type:'speed',value:+e.target.value})}><option value="1">Biasa</option><option value="4">4 kali lebih cepat</option></select></label></div><ServiceDetails state={s} dispatch={d}/><WorkDetails state={s} dispatch={d}/></section>
      </>}
      {page===2&&<>
        <div className="easy-section-heading"><button className="easy-back" onClick={()=>go(1)}><ArrowLeft size={20}/> Kembali</button><span>{ac.name}</span></div>
        <section className="easy-review"><span className="easy-large-icon"><FileCheck2 size={34}/></span><span className="easy-eyebrow">LANGKAH 3 DARI 4</span><h1 ref={titleRef} tabIndex={-1}>Mari periksa hasilnya.</h1><p>Pelanggan memutuskan apakah hasilnya sudah sesuai.</p>
          <div className="easy-results">{resultLabels.map((label,i)=><div key={label}><span>{(medical||s.run.scenario==='S2'?[coreReady,sample,manual]:logistics?[finished===jobs.length&&hasJobs,pipelineReady,sample]:s.run.scenario==='S3'?[pipelineReady,pipelineReady,true]:[hasJobs&&finished===jobs.length,hasJobs&&finished===jobs.length,pipelineReady])[i]?<Check size={22}/>:i+1}</span><strong>{label}</strong></div>)}</div>
          {!ac.agreed&&<div className="easy-soft-warning">Ukuran keberhasilan belum disepakati.<button onClick={()=>go(0)}>Periksa kesepakatan</button></div>}
          {!ready&&<div className="easy-soft-warning">Ada langkah pemulihan yang belum selesai.<button onClick={()=>go(1)}>Lengkapi pemulihan</button></div>}
          {!reviewReady?<button className="easy-primary" onClick={()=>run({type:'generate'},{type:'validate'})}>Siapkan hasil pemeriksaan <ArrowRight size={22}/></button>:isAccepted?<><div className="easy-success"><CheckCircle2 size={22}/> Hasil sudah diterima pelanggan.</div><button className="easy-primary" onClick={()=>go(3)}>Lanjut ke keputusan <ArrowRight size={22}/></button></>:<>
            <span className="easy-role-label">Keputusan pelanggan · simulasi</span><div className="easy-review-actions"><button className="easy-primary" onClick={()=>run({type:'role',value:'Customer reviewer'},{type:'accept'})}>Hasil sudah sesuai <Check size={22}/></button><button className="easy-secondary" onClick={()=>run({type:'role',value:'Customer reviewer'},{type:'reject',note:'Pelanggan meminta hasil diperiksa dan diperbaiki.'})}>Minta diperbaiki</button></div>
          </>}
          {evidence.some(e=>e.customerReview==='rejected')&&!isAccepted&&<div className="easy-soft-warning">Permintaan perbaikan sudah dicatat untuk {ac.owner.split(' · ')[0]}.<button className="easy-text-button" onClick={()=>run({type:'generate'},{type:'validate'})}>Periksa hasil kembali</button></div>}
          {evidence.some(e=>['missing','failed','incomplete'].includes(e.validation))&&<div className="easy-soft-warning">Ada bukti yang belum cukup. <button className="easy-text-button" onClick={()=>go(1)}>Kembali ke pemulihan</button></div>}
          <details className="easy-details"><summary>Lihat bukti pemeriksaan <ChevronDown size={18}/></summary>{ac.criteria.map(c=>{const e=evidence.find(e=>e.criterionId===c.id);return <p key={c.id}><strong>{friendlyCriterion(c)}</strong><br/>{e?.value==null?'Belum tersedia':`${Number(e.value.toFixed(2))} ${e.unit}`} · {e?.window.duration===604800?'contoh 7 hari':'hasil simulasi ini'}</p>;})}<p>Bukti milik {ac.name}, kesepakatan versi {ac.version}.</p><button className="easy-text-button" onClick={onExport}><Download size={18}/> Simpan bukti</button></details>
        </section>
      </>}
      {page===2&&<EvidenceDetails state={s} dispatch={d}/>}
      {page===3&&<>
        <div className="easy-section-heading"><button className="easy-back" onClick={()=>go(2)}><ArrowLeft size={20}/> Kembali</button><span>{ac.name}</span></div>
        <section className="easy-review"><span className="easy-large-icon"><HeartHandshake size={37}/></span><span className="easy-eyebrow">LANGKAH 4 DARI 4</span><h1 ref={titleRef} tabIndex={-1}>{ac.contract==='renewed'&&isAccepted?'Terima kasih. Kita lanjut bersama.':'Apakah kerja sama dilanjutkan?'}</h1><p>{ac.contract==='renewed'?'Keputusan sudah dicatat. Ringkasan dapat disimpan.':isAccepted?'Hasil telah diterima. Keputusan kerja sama tetap dibuat terpisah.':'Hasil perlu diterima pelanggan sebelum keputusan dicatat.'}</p>
          <div className="easy-outcome"><CheckCircle2 size={25}/><div><strong>{ac.name}</strong><span>{ac.contract==='renewed'?'Kerja sama dilanjutkan · simulasi':ac.contract==='not_renewed'?'Tidak dilanjutkan · simulasi':ac.contract==='negotiating'?'Masih dibicarakan · simulasi':isAccepted?'Hasil pemulihan diterima':'Hasil belum diterima pelanggan'}</span></div></div>
          {!isAccepted&&<div className="easy-soft-warning">Bukti untuk kesepakatan saat ini belum diterima.<button onClick={()=>go(2)}>Kembali periksa hasil</button></div>}
          <div className="easy-decision-fields"><label>Keinginan pelanggan<select value={ac.intent} onChange={e=>d({type:'intent',value:e.target.value})}><option value="not_discussed">Belum dibicarakan</option><option value="continue_intent">Ingin melanjutkan</option><option value="undecided">Belum memutuskan</option><option value="decline_intent">Tidak ingin melanjutkan</option></select></label><label>Penanggung jawab keputusan<input value={decisionOwner} onChange={e=>setDecisionOwner(e.target.value)}/></label><label>Catatan keputusan<textarea value={decisionNote} onChange={e=>setDecisionNote(e.target.value)}/></label></div>
          {ac.contract!=='renewed'?<><span className="easy-role-label">Keputusan penanggung jawab · simulasi</span><div className="easy-review-actions"><button className="easy-primary" disabled={!isAccepted||!decisionOwner.trim()||!decisionNote.trim()} onClick={()=>run({type:'role',value:'Finance / decision owner'},{type:'intent',value:'continue_intent'},{type:'decision',value:'renewed',owner:decisionOwner,note:decisionNote})}>Lanjutkan kerja sama <ArrowRight size={22}/></button><button className="easy-secondary" disabled={!isAccepted||!decisionOwner.trim()||!decisionNote.trim()} onClick={()=>run({type:'role',value:'Finance / decision owner'},{type:'intent',value:'undecided'},{type:'decision',value:'negotiating',owner:decisionOwner,note:decisionNote})}>Bicarakan dulu</button><button className="easy-secondary" disabled={!isAccepted||!decisionOwner.trim()||!decisionNote.trim()} onClick={()=>run({type:'role',value:'Finance / decision owner'},{type:'intent',value:'decline_intent'},{type:'decision',value:'not_renewed',owner:decisionOwner,note:decisionNote})}>Tidak melanjutkan</button></div></>:<button className="easy-primary" onClick={onExport}><Download size={22}/> Simpan ringkasan</button>}
          {ac.decisionNote&&<p className="easy-hint">Catatan: {ac.decisionNote} · {ac.decisionOwner}</p>}
          <div className="easy-budget"><div><span>Rencana biaya</span><strong>{formatMoney(forecast(s))}</strong></div><div><span>Sisa anggaran</span><strong>{formatMoney(750-forecast(s))}</strong></div></div>
          <p className="easy-hint">Keputusan contoh, bukan kontrak nyata. Biaya di atas adalah rencana.</p>
          <button className="easy-text-button" onClick={()=>{setErase(false);setRestart(true);}}><RotateCcw size={18}/> Coba lagi dari awal</button>
        </section>
      </>}
      </>}
      <section className="easy-support" aria-label="Biaya dan riwayat"><BudgetDetails state={s} dispatch={d}/><HistoryDetails state={s}/><DetailSection title="Lihat fakta awal dan target"><p>Fakta kasus: kegagalan permintaan 7%, layanan tersedia 97,8%, rata-rata tanggapan 4,5 detik, laporan tertinggal 6–12 jam.</p><p>Target: kegagalan paling banyak 1% (LogistikGo kurang dari 1%), ketersediaan paling sedikit 99,9%, tanggapan kurang dari 1 detik, usia laporan paling banyak 15 menit dengan data lengkap.</p><p>Program 60 hari, anggaran Rp750 juta, penghentian layanan terencana paling lama 30 menit. Nilai langganan tahunan berisiko Rp6 miliar bukan laba atau pendapatan yang sudah terselamatkan.</p><p>Hasil simulasi terpisah dari fakta dan target. Lokasi data produksi Indonesia tetap perlu diperiksa; lokasi hosting contoh ini bukan bukti.</p></DetailSection><DetailSection title="Atur data simulasi"><p>Simpan data lengkap untuk melanjutkan pemeriksaan di luar aplikasi.</p><button onClick={onExportData}>Unduh data lengkap (JSON)</button><p>Jika ingin menghapus seluruh catatan, keputusan, dan anggaran contoh di perangkat ini, mulai dari data awal.</p><button onClick={()=>{setErase(true);setRestart(true);}}>Hapus semua data contoh</button></DetailSection></section>
      <footer className="easy-footer"><span><i/>{storageNotice?'Hasil belum tersimpan di perangkat':'Hasil tersimpan di perangkat ini'}</span><div className="easy-footer-actions"><button className="easy-text-button" onClick={onExport}><Download size={18}/> Simpan ringkasan</button><button className="easy-text-button" onClick={()=>{setErase(false);setRestart(true);}}><RotateCcw size={18}/> Mulai contoh baru</button></div></footer>
    </main>
    <dialog className="easy-dialog" ref={restartRef} onCancel={()=>setRestart(false)} onClose={()=>setRestart(false)}><button className="easy-close" aria-label="Tutup" onClick={()=>{restartRef.current?.close();setRestart(false);}}><X/></button><h2>{erase?'Hapus seluruh data contoh?':'Mulai contoh baru?'}</h2><p>{erase?'Semua riwayat, keputusan, dan perubahan biaya di perangkat ini akan dihapus. Simpan ringkasan sebelum melanjutkan.':'Hasil sebelumnya tetap tersimpan sebagai riwayat.'}</p><button className="easy-primary" onClick={()=>{if(erase)onResetAll();else d({type:'resetRun'});setPage(0);restartRef.current?.close();setRestart(false);}}>{erase?'Ya, hapus semua':'Ya, mulai lagi'} <ArrowRight/></button></dialog>
  </div>;
}
