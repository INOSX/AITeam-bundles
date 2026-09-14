import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
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
test('missing capability declaration rejected',()=>fixture(r=>{alter(r,m=>m.capabilities.pop());assert.throws(()=>packageAgent(r),/Incomplete/);}));
test('missing mandatory resource rejected',()=>fixture(r=>{fs.unlinkSync(path.join(r,'RULES.md'));assert.throws(()=>packageAgent(r));}));
test('traversal rejected',()=>fixture(r=>{alter(r,m=>m.support.push('../secret.md'));assert.throws(()=>packageAgent(r),/path/);}));
test('duplicate resource rejected',()=>fixture(r=>{alter(r,m=>m.support.push('AGENT.md'));assert.throws(()=>packageAgent(r),/Duplicate/);}));
test('incomplete core rejected',()=>fixture(r=>{alter(r,m=>m.core.pop());assert.throws(()=>packageAgent(r),/core/);}));
test('identity mismatch rejected',()=>fixture(r=>{alter(r,m=>m.version='9.0.0');assert.throws(()=>packageAgent(r),/mismatch/);}));
test('invalid UTF8 rejected',()=>fixture(r=>{fs.writeFileSync(path.join(r,'RULES.md'),Buffer.from([0xff]));assert.throws(()=>packageAgent(r));}));
test('invalid portrait rejected',()=>fixture(r=>{fs.writeFileSync(path.join(r,'assets','portrait.png'),'not a png');assert.throws(()=>packageAgent(r),/PNG/);}));
test('oversized instruction rejected',()=>fixture(r=>{fs.writeFileSync(path.join(r,'RULES.md'),'x'.repeat(65537));assert.throws(()=>packageAgent(r),/large/);}));
