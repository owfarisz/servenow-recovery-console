import { Pause, Play } from 'lucide-react';
import './motion.css';
export type DataMotionMode = 'flowing'|'blocked'|'awaiting'|'waiting';
type Props = {mode:DataMotionMode;playing:boolean;reduced:boolean;live:boolean;onToggle:()=>void;source:string;destination:string};
const descriptions:Record<DataMotionMode,string>={
  flowing:'Paket data bergerak ke tujuan. Tanda centang menunjukkan jalur sudah terbuka.',
  blocked:'Paket data berhenti dan mengantre di depan titik gangguan. Tidak ada paket yang melewatinya.',
  awaiting:'Data sudah dikirim. Balasan dari tujuan masih tertahan dan belum dapat dipastikan.',
  waiting:'Data menunggu tahap sebelumnya selesai. Belum ada pengiriman pada bagian ini.',
};
export default function DataMotion({mode,playing,reduced,live,onToggle,source,destination}:Props){
  const moving=playing&&!reduced&&mode!=='waiting';
  const route=mode==='awaiting'?'return':mode==='blocked'?'stopped':'forward';
  return <figure className={`data-motion ${mode} ${moving?'is-moving':'is-still'}`} data-flow-state={mode} data-motion={reduced?'reduced':moving?'running':'paused'}>
    <figcaption className="motion-caption"><span><i className={moving?'moving-dot':''}/>{live?'Mengikuti proses':'Ilustrasi alur data'}</span><button className="motion-toggle" onClick={onToggle} disabled={reduced||mode==='waiting'} aria-label={playing?'Jeda animasi data':'Putar animasi data'} title={reduced?'Gerakan dikurangi mengikuti pengaturan perangkat':mode==='waiting'?'Bagian ini menunggu tahap sebelumnya':'Gerakan contoh; tidak menambah pekerjaan atau mengubah hasil'}>{reduced?'Gerakan dikurangi':mode==='waiting'?'Menunggu':playing?<><Pause size={15}/> Jeda</>:<><Play size={15}/> Putar</>}</button></figcaption>
    <svg className="motion-canvas" viewBox="0 0 520 195" role="img" aria-label={descriptions[mode]}>
      <defs><marker id={`arrow-${route}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 L6 4 L1 7" fill="none" stroke="currentColor" strokeWidth="1.5"/></marker></defs>
      <path className="motion-track track-background" d="M86 78 H434"/>
      {mode==='blocked'?<><path className="motion-track track-open" d="M86 78 H288"/><path className="motion-track track-muted" d="M318 78 H434"/></>:<path className={`motion-track ${mode==='waiting'?'track-muted':'track-open'}`} d="M86 78 H434"/>}
      {mode==='awaiting'&&<><path className="motion-track return-background" d="M446 107 Q446 144 408 144 H112 Q74 144 74 107"/><path className="motion-track return-open" d="M446 107 Q446 144 408 144 H235"/></>}
      <g className="motion-source"><rect x="20" y="40" width="67" height="76" rx="16"/><rect className="source-paper" x="37" y="58" width="30" height="35" rx="5"/><path d="M44 68 H60 M44 77 H56 M44 85 H58"/></g>
      <g className="motion-target"><rect x="434" y="40" width="67" height="76" rx="16"/>{mode==='flowing'?<path className="target-check" d="M449 79 L462 91 L486 65"/>:<><ellipse cx="468" cy="65" rx="17" ry="7"/><path d="M451 65 V87 C451 97 485 97 485 87 V65 M451 76 C451 86 485 86 485 76"/></>}</g>
      {mode==='blocked'&&<g className="motion-barrier"><rect x="298" y="48" width="10" height="59" rx="5"/><circle cx="303" cy="78" r="19"/><path d="M296 71 L310 85 M310 71 L296 85"/><text x="303" y="132" textAnchor="middle">Tertahan di sini</text></g>}
      {mode==='awaiting'&&<g className="reply-question"><circle cx="218" cy="144" r="16"/><text x="218" y="150" textAnchor="middle">?</text></g>}
      {mode!=='waiting'&&[0,1,2].map(i=><g key={i} aria-hidden="true" className={`data-packet packet-${i} ${route}`}><rect x="-12" y="-9" width="24" height="18" rx="4"/><path d="M-6 -3 H6 M-6 3 H2"/></g>)}
      {mode==='blocked'&&<g className="static-queue" aria-hidden="true"><rect x="240" y="69" width="22" height="18" rx="4"/><rect x="267" y="69" width="22" height="18" rx="4"/></g>}
      <text className="motion-endpoint" x="53" y="177" textAnchor="middle">{mode==='awaiting'?'Pengirim':'Data masuk'}</text><text className="motion-endpoint" x="467" y="177" textAnchor="middle">{mode==='awaiting'?'Tujuan':'Tujuan'}</text>
      {mode==='awaiting'&&<text className="motion-explanation" x="294" y="178" textAnchor="middle">Menunggu balasan</text>}
      {mode==='flowing'&&<g className="arrival-rings" aria-hidden="true"><circle cx="468" cy="78" r="39"/><circle cx="468" cy="78" r="39"/></g>}
    </svg>
    <div className="motion-meaning"><span>{source}</span><span aria-hidden="true">{mode==='blocked'?'⊣':'→'}</span><strong>{destination}</strong></div>
    <span className="motion-note">{mode==='awaiting'?'Belum ada kepastian. Jangan kirim ulang.':mode==='blocked'?'Data tidak melewati bagian yang bermasalah.':mode==='waiting'?'Pengiriman belum dimulai.':'Gerakan contoh, bukan jumlah pekerjaan.'}</span>
  </figure>;
}
