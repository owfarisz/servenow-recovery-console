import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AlertTriangle, ArrowDown, ArrowRight, Check, CheckCircle2, Clock3, Database, FileCheck2, Layers, Search, Server, ShieldCheck, Ticket, Users, ZoomIn } from 'lucide-react';
import { cohort, type State } from '../domain/engine';
import './workflow.css';
import DataMotion from './DataMotion';

type Tone = 'good' | 'problem' | 'warning' | 'waiting' | 'working';
type Node = { id:string; label:string; caption:string; tone:Tone; icon:typeof Server };
type Focus = {key:string; index:number; tone:Tone; label:string; title:string; cause:string; impact:string; before:string; after:string; visual:'queue'|'database'|'reply'|'data'|'clear'; resolved:boolean};
export function recoveryStory(s:State):{nodes:Node[];focus:Focus} {
  const jobs=cohort(s), completed=jobs.filter(j=>j.status==='succeeded').length;
  const verified=s.core.status==='healthy';
  const diagnosed=['diagnosed','verifying'].includes(s.core.incident);
  const ambiguous=jobs.some(j=>j.status==='needs_verification');
  const retry=jobs.some(j=>['retry_wait','needs_attention'].includes(j.status));
  const published=s.pipeline.status==='published';
  const processing=s.pipeline.status==='extracting';
  const failed=s.pipeline.status==='failed';
  const make=(key:string,index:number,tone:Tone,title:string,cause:string,impact:string,before:string,after:string,visual:Focus['visual'],resolved=false):Focus=>({key,index,tone,title,cause,impact,before,after,visual,resolved,label:tone==='problem'?'DI SINI MASALAHNYA':tone==='warning'?'BAGIAN INI PERLU DIPERIKSA':resolved?'PERUBAHANNYA TERLIHAT':'LANGKAH YANG SEDANG DIKERJAKAN'});
  if(s.run.scenario==='S2'){
    const nodes:Node[]=[{id:'request',label:'Permintaan masuk',caption:'Diterima',tone:'good',icon:Users},{id:'app',label:'Layanan bank',caption:verified?'Berjalan kembali':diagnosed?'Menunggu data':'Perlu diperiksa',tone:verified?'good':diagnosed?'waiting':'warning',icon:Server},{id:'database',label:'Penyimpanan data',caption:verified?'Sudah pulih':diagnosed?'Tidak merespons':'Belum diperiksa',tone:verified?'good':diagnosed?'problem':'waiting',icon:Database},{id:'customer',label:'Hasil ke pelanggan',caption:verified?'Layanan tersedia':'Belum tersedia',tone:verified?'good':'waiting',icon:ShieldCheck}];
    return {nodes,focus:!verified?(diagnosed?make('bank-diagnosed',2,'problem','Penyimpanan data tidak merespons.','Layanan bank tidak bisa mengambil data yang dibutuhkan.','Permintaan pelanggan berhenti di sini.','Terputus','Siapkan layanan pengganti','database'):make('bank-search',1,'warning','Pelanggan belum mendapat layanan.','Kita perlu memeriksa bagian mana yang menghambat layanan.','Permintaan belum bisa diselesaikan.','Tertahan','Periksa penyebabnya','queue')):make('bank-recovered',2,'good','Jalur data sudah tersambung lagi.','Layanan pengganti sudah siap; hasil pemulihan telah diperiksa.','Layanan tersedia. Pemeriksaan keamanan tetap terpisah.','Tidak merespons','Sudah pulih','clear',true)};
  }
  if(s.run.scenario==='S3'){
    const nodes:Node[]=[{id:'source',label:'Data masuk',caption:'3 perubahan contoh',tone:'good',icon:Layers},{id:'check',label:'Periksa data',caption:failed?'Format tidak sesuai':published?'Lolos pemeriksaan':processing?'Sedang diperiksa':'Belum diperiksa',tone:failed?'problem':published?'good':processing?'working':'waiting',icon:Search},{id:'publish',label:'Perbarui laporan',caption:published?'Berhasil':failed?'Ditahan dahulu':'Menunggu data lengkap',tone:published?'good':'waiting',icon:FileCheck2},{id:'dashboard',label:'Laporan pelanggan',caption:published?'Data terbaru':'Masih data lama',tone:published?'good':'warning',icon:Users}];
    return {nodes,focus:failed?make('data-failed',1,'problem','Format data tidak sesuai.','Pemeriksaan menemukan data yang belum bisa dibaca dengan benar.','Laporan baru ditahan. Laporan sebelumnya tetap aman.','Laporan lama','Perbaiki format data','data'):published?make('data-recovered',3,'good','Laporan terbaru sudah tersedia.','Data sudah lolos pemeriksaan dan diterbitkan satu kali.','Pelanggan melihat perubahan yang lengkap.','Data lama','Data terbaru','clear',true):processing?make('data-checking',1,'working','Data sedang diperiksa.','Setiap perubahan diperiksa sebelum laporan diganti.','Laporan lama tetap tersedia selama pemeriksaan.','Data masuk','Sedang diperiksa','data'):make('data-symptom',3,'warning','Laporan pelanggan masih tertinggal.','Data baru sudah ada, tetapi belum muncul dalam laporan.','Pelanggan masih melihat informasi lama.','Data baru masuk','Laporan belum berubah','data')};
  }
  const jobsDone=jobs.length>0&&completed===jobs.length;
  const nodes:Node[]=[{id:'tickets',label:'Tiket masuk',caption:jobs.length?`${jobs.length} tiket diterima`:'Siap menerima tiket',tone:'good',icon:Ticket},{id:'app',label:'Proses layanan',caption:verified?'Siap bekerja':diagnosed?'Menunggu data':'Melambat',tone:verified?'good':diagnosed?'waiting':'warning',icon:Server},{id:'database',label:'Penyimpanan data',caption:verified?'Kapasitas terkendali':diagnosed?'Terlalu penuh':'Perlu diperiksa',tone:verified?'good':diagnosed?'problem':'waiting',icon:Database},{id:'sync',label:'Sistem pelanggan',caption:ambiguous?'Balasan belum pasti':jobsDone?'Semua tiket selesai':retry?'Ada tiket tertunda':jobs.length?`${completed}/${jobs.length} selesai`:'Menunggu tiket',tone:ambiguous?'warning':retry?'warning':jobsDone?'good':jobs.length?'working':'waiting',icon:Users},{id:'report',label:'Laporan',caption:published?'Sudah diperbarui':failed?'Belum bisa diperbarui':'Belum diperbarui',tone:published?'good':failed?'problem':'waiting',icon:FileCheck2}];
  let focus:Focus;
  if(!verified)focus=diagnosed?make('toko-diagnosed',2,'problem','Jalur penyimpanan terlalu penuh.','Terlalu banyak pekerjaan memakai jalur data secara bersamaan.','Proses melambat. Tiket belum bisa diselesaikan.','Pekerjaan menumpuk','Atur beban layanan','database'):make('toko-search',1,'warning','Tiket masuk, tetapi proses melambat.','Penyebabnya belum dipastikan. Mari telusuri alurnya.','Pelanggan harus menunggu lebih lama.','Tiket masuk','Proses tertahan','queue');
  else if(ambiguous)focus=make('toko-reply',3,'warning','Balasan satu tiket belum diterima.','Tiket mungkin sudah selesai di sistem pelanggan. Hasilnya perlu dipastikan.','Jangan kirim ulang: pekerjaan bisa tercatat dua kali.','Sudah dikirim','Balasan belum pasti','reply');
  else if(retry)focus=make('toko-retry',3,'warning','Satu tiket sempat tertunda.','Sistem pelanggan mengalami gangguan sementara.','Tiket dicoba kembali dengan aman, bukan diabaikan.','Tertunda','Dicoba kembali','queue');
  else if(!jobs.length)focus=make('toko-core-recovered',2,'good','Jalur data sudah lebih lapang.','Beban layanan sudah diatur dan hasilnya diperiksa.','Sekarang tiket bisa mulai diproses.','Terlalu penuh','Siap bekerja','clear',true);
  else if(!jobsDone)focus=make('toko-processing',3,'working','Tiket bergerak ke sistem pelanggan.',`${completed} dari ${jobs.length} tiket sudah dipastikan selesai.`,'Tiket baru dianggap selesai setelah hasilnya terkonfirmasi.','Tiket diterima','Sedang diselesaikan','queue');
  else if(published)focus=make('toko-complete',4,'good','Tiket selesai. Laporan sudah menyusul.','Seluruh tiket telah diperiksa dan data laporan diperbarui.','Hasil pemulihan siap ditunjukkan kepada pelanggan.','Proses tertahan','Hasil tersedia','clear',true);
  else focus=make('toko-report',4,failed?'problem':processing?'working':'warning',failed?'Laporan belum lolos pemeriksaan.':'Tiket selesai, laporan belum diperbarui.','Hasil tiket perlu diperiksa dan dimasukkan ke laporan.','Pelanggan belum melihat hasil terbaru dalam laporan.','Tiket selesai','Perbarui laporan','data');
  return {nodes,focus};
}

export default function RecoveryWorkflow({state:s,children,onPause}:{state:State;children:ReactNode;onPause:()=>void}){
  const {nodes,focus}=recoveryStory(s);
  const [preview,setPreview]=useState(true);
  const [reducedMotion,setReducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const wasRunning=useRef(s.running);
  useEffect(()=>{if(wasRunning.current&&!s.running)setPreview(false);wasRunning.current=s.running;},[s.running]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>setReducedMotion(media.matches);
    const visibility=()=>{if(document.hidden)setPreview(false);};
    media.addEventListener('change',change);document.addEventListener('visibilitychange',visibility);
    return ()=>{media.removeEventListener('change',change);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  const playing=(s.running||preview)&&!reducedMotion;
  const toggleMotion=()=>{if(playing){setPreview(false);if(s.running)onPause();}else setPreview(true);};
  const [selection,setSelection]=useState<{key:string;index:number}|null>(null);
  const selected=selection?.key===focus.key?selection.index:focus.index;
  const active=nodes[selected], onProblem=selected===focus.index;
  const detailRef=useRef<HTMLDivElement>(null);
  const previous=useRef(focus.key);
  const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(()=>{
    if(previous.current!==focus.key&&['toko-diagnosed','bank-diagnosed','data-failed','toko-reply'].includes(focus.key))detailRef.current?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'nearest'});
    previous.current=focus.key;
  },[focus.key]);
  const inspect=(index:number)=>{setSelection({key:focus.key,index});detailRef.current?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'nearest'});};
  const tone=onProblem?focus.tone:active.tone;
  const mode=onProblem&&focus.visual==='reply'?'awaiting':tone==='problem'||tone==='warning'?'blocked':tone==='waiting'?'waiting':'flowing';
  return <section className={`recovery-story ${s.running?'flow-running':''} ${playing?'illustration-playing':''}`} aria-label="Alur layanan dan lokasi gangguan">
    <div className="story-heading"><div><span className="easy-eyebrow">IKUTI ALURNYA</span><h2>Di mana prosesnya tersendat?</h2></div><span className={`story-signal ${focus.tone}`}><span/>{focus.resolved?'Bagian ini sudah pulih':focus.tone==='problem'?'Masalah ditemukan':focus.tone==='working'?'Proses berjalan':'Perlu diperiksa'}</span></div>
    <ol className="story-flow">{nodes.map((node,i)=>{const I=node.icon;const blocked=['problem','warning'].includes(node.tone)&&i===focus.index;return <li key={node.id} className={`${blocked?'flow-blocked':''} ${node.tone}`}><button className={`flow-node ${node.tone} ${selected===i?'selected':''}`} onClick={()=>inspect(i)} aria-pressed={selected===i} aria-label={`Perbesar ${node.label}: ${node.caption}`}><span className="flow-node-top"><span className="flow-step">{i+1}</span><I size={25}/>{node.tone==='good'?<CheckCircle2 size={18}/>:node.tone==='problem'?<AlertTriangle size={19}/>:null}</span><strong>{node.label}</strong><span className="flow-caption">{node.caption}</span><span className="transit-rail" data-route={node.tone==='waiting'?'waiting':'active'} aria-hidden="true"><i className="node-packet" style={{'--packet-delay':`${-i*.65}s`} as CSSProperties}/></span><span className="flow-focus-label">{selected===i?<><ZoomIn size={15}/> Sedang diperbesar</>:<>Lihat bagian ini <ZoomIn size={14}/></>}</span></button>{i<nodes.length-1&&<span className={`flow-connector ${node.tone==='waiting'||nodes[i+1]?.tone==='waiting'?'waiting':''}`} aria-label={blocked?'Alur tertahan':'Alur menuju tahap berikutnya'}>{blocked?<span className="flow-stop">!</span>:<ArrowRight size={21}/>}<i className="flow-data-dot" aria-hidden="true"/></span>}</li>;})}</ol>
    <div className="focus-bridge"><span/><ZoomIn size={17}/><b>{active.label}</b><ArrowDown size={17}/><span/></div>
    <div className={`story-focus ${tone}`} ref={detailRef}>
      <div className="problem-closeup" key={`${focus.key}-${selected}`}>
        <div className="closeup-heading"><span className={`closeup-symbol ${tone}`}>{tone==='problem'?<AlertTriangle size={22}/>:tone==='good'?<CheckCircle2 size={23}/>:<ZoomIn size={22}/>}</span><span>{onProblem?focus.label:'BAGIAN ALUR YANG DIPILIH'}</span><span className="closeup-step">{selected+1}/{nodes.length}</span></div>
        <h2>{onProblem?focus.title:active.label}</h2>
        <DataMotion mode={mode} playing={playing} reduced={reducedMotion} live={s.running} onToggle={toggleMotion} source={onProblem?focus.before:active.label} destination={onProblem?focus.after:active.caption}/>
        <p className="closeup-cause">{onProblem?focus.cause:active.tone==='good'?'Bagian ini sudah berjalan. Titik yang perlu ditangani ditandai pada alur di atas.':active.tone==='waiting'?'Bagian ini menunggu proses sebelumnya selesai.':'Status bagian ini mengikuti hasil simulasi yang sedang berjalan.'}</p>
        {onProblem&&<div className="closeup-impact"><Users size={21}/><div><span>DAMPAK BAGI PELANGGAN</span><p>{focus.impact}</p></div></div>}
        {!onProblem&&<button className="easy-text-button" onClick={()=>inspect(focus.index)}>Kembali ke bagian yang ditangani <ArrowRight size={17}/></button>}
      </div>
      <div className="workflow-action">{children}</div>
    </div>
  </section>;
}
