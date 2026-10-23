const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validateContent,isAllowedMedia,emptyContent,mediaName}=require('../../.partner-tests/model.js');
const valid={...emptyContent,title:'Para você',message:'Uma história especial.',consent:true};
test('requires an explicit publication consent',()=>assert.throws(()=>validateContent({...valid,consent:false},'gift',true),/autorização/));
test('permits incomplete drafts but rejects blank publication',()=>{assert.equal(validateContent({},'gift').title,'');assert.throws(()=>validateContent({},'gift',true),/título/);});
test('invitation cannot smuggle gift media or extra photo slots',()=>{assert.throws(()=>validateContent({...valid,audio:true},'invitation'),/Limite/);assert.throws(()=>validateContent({...valid,photoSlots:[1]},'invitation'),/Limite/);assert.throws(()=>validateContent({...valid,photoSlots:[0,1]},'invitation'),/Limite/);});
test('deduplicates gift slots and rejects paths instead of slot numbers',()=>{assert.deepEqual(validateContent({...valid,photoSlots:[1,1]},'gift').photoSlots,[1]);assert.throws(()=>validateContent({...valid,photoSlots:['../../private']},'gift'));});
test('invitation requires future bounded date, address and Brazilian RSVP number',()=>{
 const now=Date.parse('2026-10-23T12:00:00Z');
 const invite={...valid,eventAt:'2026-12-25T18:00:00-03:00',venue:'Salão',address:'Rua Teste, 123, São Paulo',rsvpPhone:'5511999999999'};
 assert.equal(validateContent(invite,'invitation',true,now).eventAt,invite.eventAt);
 for(const eventAt of ['invalid','2026-10-01','2030-01-01'])assert.throws(()=>validateContent({...invite,eventAt},'invitation',true,now),/data futura/);
 assert.throws(()=>validateContent({...invite,rsvpPhone:'javascript:alert(1)'},'invitation',true,now));
});
test('rejects disguised SVG/HTML and MIME mismatches',()=>{
 const svg=new TextEncoder().encode('<svg onload="alert(1)"></svg>');
 assert.equal(isAllowedMedia(svg,'image/svg+xml'),false);
 assert.equal(isAllowedMedia(svg,'image/png'),false);
 assert.equal(isAllowedMedia(new Uint8Array([137,80,78,71,13,10,26,10]),'image/png'),true);
 assert.equal(isAllowedMedia(new Uint8Array([255,216,255,0]),'image/jpeg'),true);
 assert.equal(isAllowedMedia(new TextEncoder().encode('RIFF0000WEBP'),'image/webp'),true);
 assert.equal(isAllowedMedia(new TextEncoder().encode('RIFF0000WAVE'),'image/webp'),false);
});
test('drops unknown fields instead of accepting client prices or ownership',()=>{const parsed=validateContent({...valid,price_cents:1,partner_id:'other'},'gift');assert.equal(parsed.price_cents,undefined);assert.equal(parsed.partner_id,undefined);});
test('media versions remain in bounded slots and cannot contain arbitrary paths',()=>{const current=validateContent({...valid,photoSlots:[0],mediaVersions:{'0':0}},'gift');const staged=validateContent({...current,mediaVersions:{'0':1}},'gift');assert.equal(mediaName('0',current),'0-0');assert.equal(mediaName('0',staged),'0-1');assert.throws(()=>validateContent({...current,mediaVersions:{'../../other':1}},'gift'));assert.throws(()=>validateContent({...current,mediaVersions:{'0':2}},'gift'));});
