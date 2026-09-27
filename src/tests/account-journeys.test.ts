import {describe,it,expect} from 'vitest';
import {seed,transition as t} from '../domain/engine';
describe('all customer journeys in one interface',()=>{
 it('starts a scoped customer journey and preserves that customer on restart',()=>{
  let s=t(seed(),{type:'scenario',scenario:'S1',accountId:'medika'});
  expect(s.selected).toBe('medika');expect(s.run.accountId).toBe('medika');
  s=t(s,{type:'resetRun'});expect(s.run.accountId).toBe('medika');expect(s.selected).toBe('medika');
 });
 it('archives existing work without assigning it to the next customer or duplicating the shared budget',()=>{
  let s=t(seed(),{type:'submit',entity:'T-ORIGINAL'});const ledger=structuredClone(s.ledger);
  s=t(s,{type:'scenario',scenario:'S1',accountId:'logistik'});
  expect(s.jobs).toHaveLength(0);expect((s.archives[0] as any).jobs[0].accountId).toBe('toko');expect(s.ledger).toEqual(ledger);
  s=t(s,{type:'submit',entity:'T-NEW'});expect(s.jobs[0].accountId).toBe('logistik');
 });
});
