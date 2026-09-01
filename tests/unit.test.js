const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'../api.js'),'utf8');
const store={cortexifySession:{access_token:'token',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:'u1'}}};
const calls=[]; let duplicate=[];
const fetch=async (url,init={})=>{calls.push({url,init});if(String(url).includes('/content?select='))return {ok:true,status:200,json:async()=>duplicate};return {ok:true,status:200,json:async()=>[]}};
const context={self:{},chrome:{storage:{local:{get:async()=>store}}},crypto:{randomUUID:()=> 'id-1'},fetch,Date,encodeURIComponent,console};vm.createContext(context);vm.runInContext(src,context);const CX=context.self.CX;
(async()=>{
 assert.equal((await CX.session()).access_token,'token');
 assert.equal((await CX.headers()).Authorization,'Bearer token');
 duplicate=[{id:'old',url:'https://example.com'}]; let r=await CX.saveUrl('https://example.com'); assert.equal(r.duplicate,true); assert.equal(calls.filter(x=>String(x.url).includes('/api/process-content')).length,0);
 duplicate=[]; r=await CX.saveUrl('https://example.org'); assert.equal(r.id,'id-1'); const process=calls.find(x=>String(x.url).includes('/api/process-content')); assert(process); assert.deepEqual(JSON.parse(process.init.body),{type:'url',payload:{url:'https://example.org'},id:'id-1'});
 delete store.cortexifySession; await assert.rejects(()=>CX.session(),/CONNECT_REQUIRED/);
 console.log('6 tests passed');
})().catch(e=>{console.error(e);process.exit(1)});
