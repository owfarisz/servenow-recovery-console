import {useEffect,useReducer,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {seed,transition,restore,exportSession,account,currentEvidence,forecast} from './domain/engine';
import SimpleExperience from './components/SimpleExperience';
import './base.css';
function App(){
  const [loaded]=useState(()=>{try{const raw=localStorage.getItem('servenow-v1');return {state:raw?restore(raw):seed(),error:''};}catch{return {state:seed(),error:'Data tersimpan tidak dapat dibaca. Simpan sesi ini atau pilih Hapus semua data contoh untuk mulai menyimpan kembali.'};}});
  const [storageNotice,setStorageNotice]=useState(loaded.error),[storageBlocked,setStorageBlocked]=useState(Boolean(loaded.error));
  const [state,dispatch]=useReducer(transition,loaded.state);
  useEffect(()=>{if(storageBlocked)return;try{localStorage.setItem('servenow-v1',JSON.stringify(state));setStorageNotice('');}catch{setStorageNotice('Hasil belum dapat disimpan di perangkat ini.');}},[state,storageBlocked]);
  useEffect(()=>{const timer=setInterval(()=>dispatch({type:'tick'}),1000);const hide=()=>{if(document.hidden)dispatch({type:'pause'});};document.addEventListener('visibilitychange',hide);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',hide);};},[]);
  const exportData=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(exportSession(state),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`servenow-${state.selected}-${state.run.id}-evidence.json`;a.click();URL.revokeObjectURL(url);};
  const exportSummary=()=>{
    const ac=account(state),ev=currentEvidence(state),contract=ac.contract==='renewed'?'Dilanjutkan':ac.contract==='not_renewed'?'Tidak dilanjutkan':ac.contract==='negotiating'?'Masih dibicarakan':'Belum diputuskan';
    const lines=['SERVENOW — RINGKASAN PEMULIHAN','Simulasi dengan data contoh, bukan kontrak nyata.',`Pelanggan: ${ac.name}`,`Penanggung jawab: ${ac.owner}`,`Sesi: ${state.run.id}`,`Kesepakatan versi: ${ac.version}`,`Layanan: ${state.core.status==='healthy'?'Sudah pulih':'Masih ditangani'}`,'','HASIL PEMERIKSAAN',...ac.criteria.map(c=>{const e=ev.find(e=>e.criterionId===c.id);return `${c.label}: ${e?.value==null?'Belum tersedia':e.value+' '+e.unit} (target ${c.op} ${c.threshold} ${c.unit}). ${e?.customerReview==='accepted'?'Diterima pelanggan':e?.customerReview==='rejected'?'Perbaikan diminta':'Belum diterima pelanggan'}.`;}),'',`Keputusan kerja sama: ${contract}`,`Pemilik keputusan: ${ac.decisionOwner||'Belum ditetapkan'}`,`Catatan: ${ac.decisionNote||'Belum ada'}`,`Rencana biaya bersama: Rp${forecast(state).toLocaleString('id-ID')} juta dari Rp750 juta`,'Catatan dan pemeriksaan tujuh hari bersifat contoh, bukan pengukuran produksi.'];
    const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`ringkasan-${state.selected}.txt`;a.click();URL.revokeObjectURL(url);
  };
  return <SimpleExperience state={state} dispatch={dispatch} storageNotice={storageNotice} onExport={exportSummary} onExportData={exportData} onResetAll={()=>{dispatch({type:'resetAll'});setStorageBlocked(false);setStorageNotice('');}}/>;
}
createRoot(document.getElementById('root')!).render(<App/>);
