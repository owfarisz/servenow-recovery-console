import {describe,it,expect} from 'vitest';
import {seed,transition as t,type State} from '../domain/engine';
import {recoveryStory} from '../components/RecoveryWorkflow';
const diagnose=(s:State)=>['inject','assign','diagnose'].reduce((v,type)=>t(v,{type}),s);
describe('plain-language incident workflow',()=>{
 it('does not invent a diagnosis before the incident is investigated',()=>{const initial=recoveryStory(seed());expect(initial.focus.index).toBe(1);expect(initial.focus.tone).toBe('warning');expect(initial.nodes.some(n=>n.tone==='problem')).toBe(false);const found=recoveryStory(diagnose(seed()));expect(found.focus.index).toBe(2);expect(found.nodes[2].tone).toBe('problem');});
 it('localizes failed validation without calling downstream publication successful',()=>{let s=t(seed(),{type:'scenario',scenario:'S3'});s=t(s,{type:'batch'});s=t(s,{type:'advance',seconds:3});const model=recoveryStory(s);expect(model.focus.index).toBe(1);expect(model.nodes[1].tone).toBe('problem');expect(model.nodes[2].tone).toBe('waiting');expect(model.nodes[3].caption).toBe('Masih data lama');});
 it('shows an ambiguous outcome as unconfirmed rather than an uncommitted failure',()=>{let s=diagnose(seed());s=t(s,{type:'recover'});s=t(s,{type:'verifyCore'});s=t(s,{type:'submit',fault:'ambiguous'});s=t(s,{type:'advance',seconds:6});const model=recoveryStory(s);expect(model.focus.key).toBe('toko-reply');expect(model.focus.tone).toBe('warning');expect(model.focus.cause).toContain('mungkin sudah selesai');expect(model.focus.impact).toContain('Jangan kirim ulang');});
});
