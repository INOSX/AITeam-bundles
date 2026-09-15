import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {packageAgent} from './package-agent.mjs';
const source=fileURLToPath(new URL('../agents/adebayo/',import.meta.url));
function fixture(fn){const temp=fs.mkdtempSync(path.join(os.tmpdir(),'agent-package-'));try{fs.cpSync(source,temp,{recursive:true});fn(temp);}finally{fs.rmSync(temp,{recursive:true,force:true});}}
function alter(root,fn){const p=path.join(root,'manifest.json');const m=JSON.parse(fs.readFileSync(p));fn(m);fs.writeFileSync(p,JSON.stringify(m));}
test('deterministic package preserves every resource and portrait',()=>{
 const one=packageAgent(source);assert.equal(one,packageAgent(source));
 const parsed=JSON.parse(one);assert.equal(parsed.resources.length,19);
 for(const r of parsed.resources){const bytes=Buffer.from(r.data,'base64');assert.deepEqual(bytes,fs.readFileSync(path.join(source,r.path)));assert.equal(bytes.length,r.size);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256);}
});
test('runtime projection includes all professional documents and no portrait bytes',()=>{
 const p=JSON.parse(packageAgent(source));
 assert.equal(p.runtime.resources.length,15);
 for(const name of p.runtime.resources) assert.ok(p.runtime.instructions.includes(fs.readFileSync(path.join(source,name),'utf8')));
 assert.equal(crypto.createHash('sha256').update(p.runtime.instructions).digest('hex'),p.runtime.sha256);
 assert.ok(Buffer.byteLength(p.runtime.instructions)<=65536);
 assert.ok(!p.runtime.instructions.includes(p.resources.find(r=>r.path==='assets/portrait.png').data));
});
test('Adebayo envelope remains byte-identical to the approved package',()=>{
 assert.equal(crypto.createHash('sha256').update(packageAgent(source)).digest('hex'),'db563ce5bbd3097e0c7bc050b405ed32a4b0228591d4ecba85cc1f3c9c20d503');
});

function secondAgent(root){
 alter(root,m=>{m.id='priya';m.name='Priya Krishnan';m.role='Assistente de negócios';m.capabilities=['capabilities/compare.md','capabilities/analyze.md'];});
 const agentPath=path.join(root,'AGENT.md');
 fs.writeFileSync(agentPath,fs.readFileSync(agentPath,'utf8').replace('id: adebayo\n','id: priya\n'));
 fs.writeFileSync(path.join(root,'capabilities','compare.md'),'Compare options using explicit criteria.\n');
 fs.writeFileSync(path.join(root,'capabilities','analyze.md'),'Distinguish facts from assumptions.\n');
}

test('second agent packages exactly its declared capabilities in explicit runtime order',()=>fixture(r=>{
 secondAgent(r);
 const one=packageAgent(r);assert.equal(one,packageAgent(r));
 const p=JSON.parse(one);assert.equal(p.manifest.id,'priya');
 assert.deepEqual(p.runtime.resources.slice(-2),['capabilities/compare.md','capabilities/analyze.md']);
 assert.deepEqual(p.resources.filter(x=>x.path.startsWith('capabilities/')).map(x=>x.path),['capabilities/analyze.md','capabilities/compare.md']);
 assert.ok(!p.runtime.resources.includes('capabilities/organize.md'));
 for(const name of p.manifest.capabilities) assert.ok(p.runtime.instructions.includes(fs.readFileSync(path.join(r,name),'utf8')));
 assert.equal(crypto.createHash('sha256').update(p.runtime.instructions).digest('hex'),p.runtime.sha256);
}));

test('empty, missing, malformed, excessive and duplicate capabilities are rejected',()=>{
 for(const invalid of [undefined,null,{},[],['AGENT.md'],['capabilities/nested/x.md'],['capabilities/x.json'],['capabilities/../RULES.md'],['capabilities\\x.md'],[1],['capabilities/organize.md','capabilities/organize.md'],Array.from({length:33},(_,i)=>`capabilities/c${i}.md`)]) {
  fixture(r=>{alter(r,m=>m.capabilities=invalid);assert.throws(()=>packageAgent(r),/Invalid|Duplicate/);});
 }
});

test('declared capability must exist and obey text bounds',()=>fixture(r=>{
 alter(r,m=>m.capabilities=['capabilities/absent.md']);assert.throws(()=>packageAgent(r),/ENOENT/);
 fs.writeFileSync(path.join(r,'capabilities','absent.md'),'');assert.throws(()=>packageAgent(r),/size/);
 fs.writeFileSync(path.join(r,'capabilities','absent.md'),'x'.repeat(65537));assert.throws(()=>packageAgent(r),/large/);
}));

test('capability directory symlinks are rejected',()=>fixture(r=>{
 const original=path.join(r,'capabilities');const moved=path.join(r,'actual-capabilities');
 fs.renameSync(original,moved);fs.symlinkSync(moved,original,process.platform==='win32'?'junction':'dir');
 assert.throws(()=>packageAgent(r),/Symbolic/);
}));

test('CLI packages all manifest-bearing agents in sorted order deterministically',()=>{
 const repo=fs.mkdtempSync(path.join(os.tmpdir(),'agent-package-cli-'));
 try {
  fs.mkdirSync(path.join(repo,'scripts'));fs.copyFileSync(fileURLToPath(new URL('./package-agent.mjs',import.meta.url)),path.join(repo,'scripts','package-agent.mjs'));
  fs.cpSync(source,path.join(repo,'agents','priya'),{recursive:true});secondAgent(path.join(repo,'agents','priya'));
  fs.cpSync(source,path.join(repo,'agents','adebayo'),{recursive:true});fs.mkdirSync(path.join(repo,'agents','notes'));
  const run=()=>spawnSync(process.execPath,[path.join(repo,'scripts','package-agent.mjs')],{encoding:'utf8',windowsHide:true});
  const first=run();assert.equal(first.status,0,first.stderr);
  assert.deepEqual(first.stdout.trim().split(/\r?\n/).map(line=>line.split(' ')[0]),['adebayo','priya']);
  const adebayo=fs.readFileSync(path.join(repo,'dist','agents','adebayo.json'),'utf8');assert.equal(adebayo,packageAgent(source));
  const priya=fs.readFileSync(path.join(repo,'dist','agents','priya.json'),'utf8');assert.equal(priya,packageAgent(path.join(repo,'agents','priya')));
  const second=run();assert.equal(second.status,0,second.stderr);assert.equal(second.stdout,first.stdout);
  assert.equal(fs.readFileSync(path.join(repo,'dist','agents','priya.json'),'utf8'),priya);
 } finally {fs.rmSync(repo,{recursive:true,force:true});}
});
test('missing mandatory resource rejected',()=>fixture(r=>{fs.unlinkSync(path.join(r,'RULES.md'));assert.throws(()=>packageAgent(r));}));
test('traversal rejected',()=>fixture(r=>{alter(r,m=>m.support.push('../secret.md'));assert.throws(()=>packageAgent(r),/path/);}));
test('duplicate resource rejected',()=>fixture(r=>{alter(r,m=>m.support.push('AGENT.md'));assert.throws(()=>packageAgent(r),/Duplicate/);}));
test('incomplete core rejected',()=>fixture(r=>{alter(r,m=>m.core.pop());assert.throws(()=>packageAgent(r),/core/);}));
test('identity mismatch rejected',()=>fixture(r=>{alter(r,m=>m.version='9.0.0');assert.throws(()=>packageAgent(r),/mismatch/);}));
test('invalid UTF8 rejected',()=>fixture(r=>{fs.writeFileSync(path.join(r,'RULES.md'),Buffer.from([0xff]));assert.throws(()=>packageAgent(r));}));
test('invalid portrait rejected',()=>fixture(r=>{fs.writeFileSync(path.join(r,'assets','portrait.png'),'not a png');assert.throws(()=>packageAgent(r),/PNG/);}));
test('oversized instruction rejected',()=>fixture(r=>{fs.writeFileSync(path.join(r,'RULES.md'),'x'.repeat(65537));assert.throws(()=>packageAgent(r),/large/);}));
