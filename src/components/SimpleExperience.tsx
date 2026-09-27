import { useEffect, useRef, useState, type Dispatch } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, CircleHelp, Download, FileCheck2, HeartHandshake, Pause, Play, RotateCcw, Server, ShieldCheck, ShoppingBag, Signal, Sparkles, X } from 'lucide-react';
import { account, accepted, cohort, currentEvidence, forecast, type Action, type Scenario, type State } from '../domain/engine';
import './simple.css';
import RecoveryWorkflow from './RecoveryWorkflow';

type Props = { state: State; dispatch: Dispatch<Action>; onAdvanced: () => void; onExport: () => void; storageNotice: string };
const choices: {id: Scenario; customer: string; title: string; description: string; icon: typeof ShoppingBag}[] = [
  {id:'S1',customer:'TokoCepat',title:'Tiket menumpuk',description:'Bantu semua tiket selesai.',icon:ShoppingBag},
  {id:'S2',customer:'Bank FinNusantara',title:'Layanan terhenti',description:'Pulihkan layanan dengan aman.',icon:ShieldCheck},
  {id:'S3',customer:'TeleNusa',title:'Laporan terlambat',description:'Tampilkan data terbaru.',icon:Signal},
];
const steps = ['Pilih kebutuhan', 'Pulihkan layanan', 'Periksa hasil', 'Putuskan bersama'];
const formatMoney = (n:number) => `Rp${n.toLocaleString('id-ID')} juta`;

export default function SimpleExperience({state:s,dispatch:d,onAdvanced,onExport,storageNotice}:Props) {
  const ac = account(s), jobs = cohort(s), evidence = currentEvidence(s);
  const [page,setPage] = useState(0);
  const [help,setHelp] = useState(false), [restart,setRestart] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null), restartRef = useRef<HTMLDialogElement>(null);
  const active = choices.find(c=>c.id===s.run.scenario)!;
  const Icon = active.icon;
  const finished = jobs.filter(j=>j.status==='succeeded').length;
  const ambiguous = jobs.find(j=>j.status==='needs_verification');
  const hasJobs = jobs.length>0;
  const pipelineReady = s.pipeline.status==='published';
  const coreReady = s.core.status==='healthy';
  const sample = s.fixtures.some(f=>f.accountId===s.selected&&f.runId===s.run.id&&!f.manual);
  const manual = s.fixtures.some(f=>f.accountId===s.selected&&f.runId===s.run.id&&f.manual);
  const ready = s.run.scenario==='S2'?coreReady&&sample&&manual:pipelineReady&&(s.run.scenario==='S3'||hasJobs&&finished===jobs.length);
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
    if((jobsSettled&&s.pipeline.status==='idle')||['failed','published'].includes(s.pipeline.status)) d({type:'pause'});
  },[s.running,s.run.now,s.pipeline.status,hasJobs,jobs,d]);
  const choose = (scenario:Scenario) => {run({type:'scenario',scenario},{type:'role',value:'Presenter'});setPage(0);};
  const switchDetails = () => {d({type:'pause'});onAdvanced();};

  let taskTitle = '', taskText = '', actionText = '', action:()=>void = ()=>{};
  if(!coreReady){
    if(s.core.incident==='none') {taskTitle='Cari penyebab gangguan';taskText='Tim akan memeriksa layanan dan menyiapkan penanganan.';actionText='Periksa gangguan';action=()=>run(...(s.run.scenario==='S2'?[{type:'prepare'}]:[]),{type:'inject'},{type:'assign'},{type:'diagnose'});}
    else {taskTitle='Penyebab sudah ditemukan';taskText='Sekarang pulihkan layanan dan pastikan hasilnya aman.';actionText='Pulihkan layanan';action=()=>run(...(s.core.incident==='detected'?[{type:'assign'}]:[]),...(['assigned','detected'].includes(s.core.incident)?[{type:'diagnose'}]:[]),...(s.core.incident!=='verifying'?[{type:'recover',playbook:'mitigate'}]:[]),{type:'verifyCore'});}
  } else if(s.run.scenario==='S2'){
    if(!sample){taskTitle='Layanan sudah pulih';taskText='Lihat contoh catatan layanan selama tujuh hari.';actionText='Lihat contoh catatan';action=()=>d({type:'fixture'});}
    else if(!manual){taskTitle='Masih ada pemeriksaan tambahan';taskText='Keamanan dan lokasi data perlu diperiksa terpisah.';actionText='Tambahkan contoh pemeriksaan';action=()=>d({type:'fixture',manual:true});}
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
  } else {taskTitle='Pemulihan selesai';taskText='Layanan dan laporan siap diperiksa oleh pelanggan.';actionText='Lanjut ke hasil';action=()=>go(2);}
  const resultLabels = s.run.scenario==='S1'?['10 tiket selesai','Tidak ada pekerjaan ganda','Laporan sudah diperbarui']:s.run.scenario==='S2'?['Layanan pulih dan diperiksa','Contoh catatan 7 hari tersedia','Contoh pemeriksaan tambahan tersedia']:['Data terbaru sudah tampil','Semua perubahan tercatat','Data lama tetap aman saat gagal'];

  return <div className="easy-app">
    <header className="easy-header"><a className="easy-brand" href={import.meta.env.BASE_URL}><span>S</span>ServeNow</a><span className="easy-simulation"><i/>Simulasi · data contoh</span><button className="easy-help" onClick={()=>setHelp(!help)} aria-expanded={help}><CircleHelp size={21}/> Bantuan</button></header>
    {help&&<aside className="easy-help-panel"><strong>Ikuti tombol berwarna ungu.</strong><p>Setiap layar menunjukkan satu langkah. Anda bisa berhenti kapan saja; hasil tersimpan di perangkat ini.</p><button onClick={()=>setHelp(false)}>Mengerti <Check size={18}/></button></aside>}
    <main className="easy-main">
      <nav className="easy-steps" aria-label="Langkah pemulihan">{steps.map((label,i)=><div key={label} className={`${page===i?'current':''} ${page>i?'done':''}`} aria-current={page===i?'step':undefined}><span>{page>i?<Check size={19}/>:i+1}</span><b>{label}</b></div>)}</nav>
      {storageNotice&&<p className="easy-notice" role="status">Penyimpanan perangkat bermasalah. Gunakan “Simpan ringkasan” agar hasil tidak hilang.</p>}
      {s.notice&&!s.notice.startsWith('Run baru')&&<p className="easy-notice" role="status">{s.notice}</p>}
      {s.selected!==s.run.accountId?<section className="easy-card easy-intro"><h1 ref={titleRef} tabIndex={-1}>Lanjutkan contoh pelanggan</h1><p>Pilih contoh untuk mengikuti pemulihan dari awal.</p><button className="easy-primary" onClick={()=>d({type:'select',id:s.run.accountId})}>Lanjutkan {active.customer}<ArrowRight/></button><button className="easy-text-button" onClick={switchDetails}>Buka rincian {ac.name}</button></section>:<>
      {page===0&&<>
        <section className="easy-intro"><span className="easy-eyebrow">SELAMAT DATANG</span><h1 ref={titleRef} tabIndex={-1}>Mari pulihkan layanan,<br/><em>selangkah demi selangkah.</em></h1><p>Pilih masalahnya. Kami bantu sampai pelanggan merasa yakin.</p></section>
        <div className="easy-choices" role="group" aria-label="Pilih contoh masalah">{choices.map(c=>{const I=c.icon;return <button key={c.id} className={`easy-choice ${s.run.scenario===c.id?'chosen':''}`} aria-pressed={s.run.scenario===c.id} onClick={()=>s.run.scenario!==c.id&&choose(c.id)}><span className="easy-choice-top"><span className="easy-choice-icon"><I size={27}/></span>{s.run.scenario===c.id?<span className="easy-chosen"><Check size={17}/> Dipilih</span>:<span className="easy-choice-circle"/>}</span><small>{c.customer}</small><strong>{c.title}</strong><p>{c.description}</p></button>})}</div>
        <section className="easy-start"><div><span className="easy-eyebrow">YANG INGIN DICAPAI</span><h2>{s.run.scenario==='S1'?'Semua tiket selesai, pelanggan yakin.':s.run.scenario==='S2'?'Layanan pulih dan hasilnya dapat dipercaya.':'Laporan terbaru, lengkap, dan jelas.'}</h2><details className="easy-details"><summary>Lihat ukuran keberhasilan <ChevronDown size={18}/></summary><ul>{ac.criteria.map(c=><li key={c.id}>{c.label}: {c.op.replace('<=','≤').replace('>=','≥')} {c.threshold} {c.unit}{c.duration>0?' · periode contoh 7 hari':''}</li>)}</ul><p>Ukuran ini memakai kesepakatan contoh untuk simulasi.</p></details></div><button className="easy-primary" onClick={()=>{d({type:'agree'});go(1);}}>{ac.agreed?'Lanjutkan pemulihan':'Setuju, mulai pemulihan'}<ArrowRight size={22}/></button></section>
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
            <details className="easy-details"><summary>Apa yang terjadi? <ChevronDown size={18}/></summary><p>{s.run.scenario==='S1'?'Layanan dipulihkan, tiket diselesaikan satu kali, lalu laporan diperbarui. Penerimaan tiket belum berarti tiket selesai.':s.run.scenario==='S2'?'Tim menyiapkan layanan cadangan, memulihkan layanan, lalu memeriksa hasilnya. Pemeriksaan keamanan tetap terpisah.':'Data diperiksa sebelum laporan diterbitkan. Jika pemeriksaan gagal, laporan sebelumnya tetap tersedia.'}</p><button className="easy-text-button" onClick={switchDetails}>Lihat rincian teknis <ArrowRight size={17}/></button></details>
          </div>
        </RecoveryWorkflow>
      </>}
      {page===2&&<>
        <div className="easy-section-heading"><button className="easy-back" onClick={()=>go(1)}><ArrowLeft size={20}/> Kembali</button><span>{ac.name}</span></div>
        <section className="easy-review"><span className="easy-large-icon"><FileCheck2 size={34}/></span><span className="easy-eyebrow">LANGKAH 3 DARI 4</span><h1 ref={titleRef} tabIndex={-1}>Mari periksa hasilnya.</h1><p>Pelanggan memutuskan apakah hasilnya sudah sesuai.</p>
          <div className="easy-results">{resultLabels.map((label,i)=><div key={label}><span>{ready?<Check size={22}/>:i+1}</span><strong>{label}</strong></div>)}</div>
          {!reviewReady?<button className="easy-primary" onClick={()=>run({type:'generate'},{type:'validate'})}>Siapkan hasil pemeriksaan <ArrowRight size={22}/></button>:isAccepted?<><div className="easy-success"><CheckCircle2 size={22}/> Hasil sudah diterima pelanggan.</div><button className="easy-primary" onClick={()=>go(3)}>Lanjut ke keputusan <ArrowRight size={22}/></button></>:<>
            <span className="easy-role-label">Keputusan pelanggan · simulasi</span><div className="easy-review-actions"><button className="easy-primary" onClick={()=>run({type:'role',value:'Customer reviewer'},{type:'accept'})}>Hasil sudah sesuai <Check size={22}/></button><button className="easy-secondary" onClick={()=>run({type:'role',value:'Customer reviewer'},{type:'reject',note:'Pelanggan meminta hasil diperiksa dan diperbaiki.'})}>Minta diperbaiki</button></div>
          </>}
          {evidence.some(e=>e.customerReview==='rejected')&&!isAccepted&&<div className="easy-soft-warning">Permintaan perbaikan sudah dicatat untuk {ac.owner.split(' · ')[0]}.<button className="easy-text-button" onClick={()=>run({type:'generate'},{type:'validate'})}>Periksa hasil kembali</button></div>}
          {evidence.some(e=>['missing','failed','incomplete'].includes(e.validation))&&<div className="easy-soft-warning">Ada bukti yang belum cukup. <button className="easy-text-button" onClick={switchDetails}>Lihat bagian yang perlu dilengkapi</button></div>}
          <details className="easy-details"><summary>Lihat bukti pemeriksaan <ChevronDown size={18}/></summary>{ac.criteria.map(c=>{const e=evidence.find(e=>e.criterionId===c.id);return <p key={c.id}><strong>{c.label}</strong><br/>{e?.value==null?'Belum tersedia':`${Number(e.value.toFixed(2))} ${e.unit}`} · {e?.window.duration===604800?'contoh 7 hari':'hasil simulasi ini'}</p>;})}<p>Bukti milik {ac.name}, kesepakatan versi {ac.version}.</p><button className="easy-text-button" onClick={onExport}><Download size={18}/> Simpan bukti</button></details>
        </section>
      </>}
      {page===3&&<>
        <div className="easy-section-heading"><button className="easy-back" onClick={()=>go(2)}><ArrowLeft size={20}/> Kembali</button><span>{ac.name}</span></div>
        <section className="easy-review"><span className="easy-large-icon"><HeartHandshake size={37}/></span><span className="easy-eyebrow">LANGKAH 4 DARI 4</span><h1 ref={titleRef} tabIndex={-1}>{ac.contract==='renewed'?'Terima kasih. Kita lanjut bersama.':'Apakah kerja sama dilanjutkan?'}</h1><p>{ac.contract==='renewed'?'Keputusan sudah dicatat. Ringkasan dapat disimpan.':'Hasil telah diterima. Keputusan kerja sama tetap dibuat terpisah.'}</p>
          <div className="easy-outcome"><CheckCircle2 size={25}/><div><strong>{ac.name}</strong><span>{ac.contract==='renewed'?'Kerja sama dilanjutkan · simulasi':ac.contract==='not_renewed'?'Tidak dilanjutkan · simulasi':ac.contract==='negotiating'?'Masih dibicarakan · simulasi':'Hasil pemulihan diterima'}</span></div></div>
          {ac.contract!=='renewed'?<><span className="easy-role-label">Keputusan penanggung jawab · simulasi</span><div className="easy-review-actions"><button className="easy-primary" onClick={()=>run({type:'role',value:'Finance / decision owner'},{type:'intent',value:'continue_intent'},{type:'decision',value:'renewed',owner:ac.owner,note:'Pemilik keputusan memilih melanjutkan kerja sama setelah hasil diterima pelanggan. Simulasi.'})}>Lanjutkan kerja sama <ArrowRight size={22}/></button><button className="easy-secondary" onClick={()=>run({type:'role',value:'Finance / decision owner'},{type:'intent',value:'undecided'},{type:'decision',value:'negotiating',owner:ac.owner,note:'Hasil diterima; keputusan kerja sama masih dibicarakan. Simulasi.'})}>Bicarakan dulu</button></div></>:<button className="easy-primary" onClick={onExport}><Download size={22}/> Simpan ringkasan</button>}
          <div className="easy-budget"><div><span>Rencana biaya</span><strong>{formatMoney(forecast(s))}</strong></div><div><span>Sisa anggaran</span><strong>{formatMoney(750-forecast(s))}</strong></div></div>
          <p className="easy-hint">Keputusan contoh, bukan kontrak nyata. Biaya di atas adalah rencana.</p>
          <button className="easy-text-button" onClick={()=>setRestart(true)}><RotateCcw size={18}/> Coba lagi dari awal</button>
        </section>
      </>}
      </>}
      <footer className="easy-footer"><span><i/> Hasil tersimpan di perangkat ini</span><button onClick={switchDetails}>Buka tampilan lengkap <ArrowRight size={17}/></button></footer>
    </main>
    <dialog className="easy-dialog" ref={restartRef} onCancel={()=>setRestart(false)} onClose={()=>setRestart(false)}><button className="easy-close" aria-label="Tutup" onClick={()=>{restartRef.current?.close();setRestart(false);}}><X/></button><h2>Mulai contoh baru?</h2><p>Hasil sebelumnya tetap tersimpan sebagai riwayat.</p><button className="easy-primary" onClick={()=>{d({type:'resetRun'});setPage(0);restartRef.current?.close();setRestart(false);}}>Ya, mulai lagi <ArrowRight/></button></dialog>
  </div>;
}
