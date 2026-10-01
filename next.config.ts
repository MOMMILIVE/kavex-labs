import type { NextConfig } from 'next';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const routes:string[]=[];
function walk(dir:string,prefix='') {
  if(!existsSync(dir)) return;
  for(const file of readdirSync(dir,{withFileTypes:true})) {
    if(file.isDirectory()) walk(join(dir,file.name),prefix+'/'+file.name);
    else if(file.name==='index.html'&&prefix) routes.push(prefix);
  }
}
walk('public/legacy');
const config:NextConfig={
  poweredByHeader:false,
  async rewrites(){return {beforeFiles:[{source:'/',destination:'/legacy/index.html'},...routes.map(source=>({source,destination:'/legacy'+source+'/index.html'}))],afterFiles:[],fallback:[]};},
  async headers(){return [{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'}]}];},
};
export default config;
