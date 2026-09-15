import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const core = ['AGENT.md','PERSONA.md','RULES.md','GUARDRAILS.md','ACTIVATION.md','CAPABILITIES.md','QUALITY.md'];
export const support = ['MEMORY.md','COLLABORATION.md','WORKFLOW.md'];
export const capabilities = ['capabilities/organize.md','capabilities/decide.md','capabilities/draft.md','capabilities/follow-up.md','capabilities/coordinate.md'];
const maxCapabilities = 32;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export function packageAgent(root) {
  root = path.resolve(root);
  function read(name) {
    if (!/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.[A-Za-z0-9]+$/.test(name)) throw Error('Invalid resource path');
    let current = root;
    for (const part of name.split('/')) {
      current = path.join(current, part);
      if (fs.lstatSync(current).isSymbolicLink()) throw Error('Symbolic links forbidden');
    }
    if (!fs.statSync(current).isFile()) throw Error('Regular file required');
    const size = fs.statSync(current).size;
    if (size < 1 || size > 8 * 1024 * 1024) throw Error('Resource size invalid');
    const bytes = fs.readFileSync(current);
    if (/\.(md|json)$/.test(name)) {
      if (bytes.length > 65536) throw Error('Text resource too large');
      new TextDecoder('utf-8', {fatal:true}).decode(bytes);
    }
    return bytes;
  }
  if (fs.lstatSync(root).isSymbolicLink()) throw Error('Symbolic root forbidden');
  const manifest = JSON.parse(read('manifest.json').toString('utf8'));
  if (manifest.schemaVersion !== 1 || !/^[a-z][a-z0-9-]*$/.test(manifest.id) ||
      !/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/.test(manifest.version) ||
      typeof manifest.name !== 'string' || !manifest.name.trim() ||
      typeof manifest.role !== 'string' || !manifest.role.trim()) throw Error('Invalid identity');
  if (JSON.stringify(manifest.core) !== JSON.stringify(core)) throw Error('Invalid core');
  if (!Array.isArray(manifest.support) || !Array.isArray(manifest.capabilities) ||
      !manifest.assets || manifest.assets.portrait !== 'assets/portrait.png' ||
      manifest.assets.visual !== 'assets/visual.json') throw Error('Invalid resource declaration');
  const names = [...manifest.core,...manifest.support,...manifest.capabilities,
    manifest.assets.portrait,manifest.assets.visual,'evaluations.json','README.md'];
  if (new Set(names).size !== names.length) throw Error('Duplicate resources');
  if (names.some(name=>typeof name!=='string' || !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\.[A-Za-z0-9]+$/.test(name))) throw Error('Invalid resource path');
  if (JSON.stringify(manifest.support) !== JSON.stringify(support)) throw Error('Incomplete professional resources');
  if (manifest.capabilities.length < 1 || manifest.capabilities.length > maxCapabilities ||
      manifest.capabilities.some(name => !/^capabilities\/[A-Za-z0-9_-]+\.md$/.test(name))) throw Error('Invalid capabilities');
  const resources = names.sort().map(name => {
    const bytes = read(name);
    if (name === manifest.assets.portrait && bytes.subarray(0,8).toString('hex') !== '89504e470d0a1a0a') throw Error('Invalid PNG');
    if (name.endsWith('.json')) JSON.parse(bytes.toString('utf8'));
    return {path:name, size:bytes.length, sha256:sha(bytes), data:bytes.toString('base64')};
  });
  if(resources.reduce((sum,r)=>sum+r.size,0)>12*1024*1024) throw Error('Package too large');
  const agent = Buffer.from(resources.find(r=>r.path==='AGENT.md').data,'base64').toString('utf8');
  if (!agent.includes(`id: ${manifest.id}\n`) || !agent.includes(`version: ${manifest.version}\n`)) throw Error('Identity mismatch');
  const ordered = [...core,...support,...manifest.capabilities];
  const instructions = ordered.map(name => {
    const resource=resources.find(r=>r.path===name);
    return `\n<agent-resource path="${name}" sha256="${resource.sha256}">\n${Buffer.from(resource.data,'base64').toString('utf8')}\n</agent-resource>\n`;
  }).join('');
  if (Buffer.byteLength(instructions)>65536) throw Error('Runtime instructions too large');
  const runtime = {schema:'inosx-professional-agent-runtime/v1',id:manifest.id,
    version:manifest.version,loading:'complete-bounded',resources:ordered,
    instructions,sha256:sha(instructions)};
  return JSON.stringify({schemaVersion:1,manifest,resources,runtime},null,2)+'\n';
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const agents = fs.readdirSync(path.join(repo,'agents'),{withFileTypes:true})
    .filter(entry => (entry.isDirectory() || entry.isSymbolicLink()) &&
      fs.existsSync(path.join(repo,'agents',entry.name,'manifest.json')))
    .map(entry => entry.name).sort();
  const outputs = agents.map(id => {
    const output = packageAgent(path.join(repo,'agents',id));
    if (JSON.parse(output).manifest.id !== id) throw Error('Agent directory identity mismatch');
    return {id,output};
  });
  fs.mkdirSync(path.join(repo,'dist','agents'),{recursive:true});
  for (const {id,output} of outputs) {
    fs.writeFileSync(path.join(repo,'dist','agents',id+'.json'),output);
    console.log(id+' package generated; SHA-256 '+sha(output));
  }
}
