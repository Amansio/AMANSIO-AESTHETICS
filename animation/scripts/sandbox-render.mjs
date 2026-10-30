// Linux x64 fallback for networks that block Remotion's Chrome download host.
import chromium from '@sparticuz/chromium';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {brotliDecompressSync} from 'node:zlib';
import {execFileSync,spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
import {tmpdir} from 'node:os';
if(process.platform!=='linux'||process.arch!=='x64')throw new Error('Use npm run render on this platform');
const require=createRequire(import.meta.url);
const pkg=join(dirname(require.resolve('@sparticuz/chromium')),'..');
const libs=join(tmpdir(),'hoodie-chromium-libs');mkdirSync(libs,{recursive:true});
const tar=join(libs,'libs.tar');writeFileSync(tar,brotliDecompressSync(readFileSync(join(pkg,'bin/al2023.tar.br'))));
execFileSync('tar',['xf',tar,'-C',libs]);
const executable=await chromium.executablePath();
const output=process.argv.slice(2).some(a=>a==='--output'||a.startsWith('--output='))?[]:['out/kitchen.mp4'];
const result=spawnSync(process.execPath,[join(dirname(require.resolve('@remotion/cli/package.json')),'remotion-cli.js'), 'render','src/index.ts','Kitchen',...output,'--codec=h264','--concurrency=1','--gl=swangle',`--browser-executable=${executable}`,...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,LD_LIBRARY_PATH:join(libs,'lib')+':'+(process.env.LD_LIBRARY_PATH??'')}});
process.exit(result.status??1);
