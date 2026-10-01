import { mkdir, cp, copyFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
await mkdir('public/legacy',{recursive:true});
await cp('assets','public/assets',{recursive:true});
for(const name of ['style.css','main.js','kavex_logo.svg']) await copyFile(name,join('public',name));
await copyFile('index.html','public/legacy/index.html');
for(const dir of ['about','capabilities','careers','contact','newsroom','privacy','404']) await cp(dir,join('public/legacy',dir),{recursive:true});
// Preserve the exported Framer layout. Intercept only the existing ring commissioning CTAs.
const html=await readFile('public/legacy/index.html','utf8');
const entry=`<script>document.addEventListener('click',function(event){const link=event.target.closest('a');if(!link||link.textContent.trim()!=='Commission a Ring')return;event.preventDefault();event.stopImmediatePropagation();if(event.metaKey||event.ctrlKey){window.open('/bespoke','_blank','noopener');}else{window.location.assign('/bespoke');}},true);</script>`;
await writeFile('public/legacy/index.html',html.replace('</body>',entry+'</body>'));
console.log('Prepared original Kavex pages, assets and commissioning entry points.');
