const $=s=>document.querySelector(s); let active, tabs=[];
function status(text,type=''){ $('#status').textContent=text; $('#status').className=type; }
async function boot(){
  [active]=await chrome.tabs.query({active:true,currentWindow:true});
  $('#title').textContent=active?.title||'Untitled'; $('#host').textContent=new URL(active.url).hostname; $('#favicon').src=active.favIconUrl||'icons/32.png';
  try { await CX.session(); $('#capture').hidden=false; $('#connect').hidden=true; await loadCollections(); const d=await CX.duplicate(active.url); $('#dup').hidden=!d; }
  catch(e){ $('#connect').hidden=false; $('#capture').hidden=true; $('#disconnect').hidden=true; status(e.message==='SESSION_EXPIRED'?'Connection expired':'Not connected','warn'); }
}
async function loadCollections(){ const rows=await CX.collections(); for(const c of rows){const o=document.createElement('option');o.value=c.id;o.textContent=`${c.emoji||'📁'} ${c.name}`;$('#collection').append(o);} }
async function saveOne(){ $('#save').disabled=true;status('Saving…');try{const r=await CX.saveUrl(active.url,$('#collection').value||null);status(r.duplicate?'Already saved':'Saved · AI is organizing it','ok');$('#dup').hidden=false;$('#save').textContent='Saved ✓';}catch(e){status(human(e),'error')}finally{$('#save').disabled=false} }
function human(e){return ['CONNECT_REQUIRED','SESSION_EXPIRED'].includes(e.message)?'Reconnect to Cortexify':e.message}
$('#connectBtn').onclick=()=>chrome.tabs.create({url:'https://www.cortexify.in/login?extension=connect'});
$('#open').onclick=()=>chrome.tabs.create({url:'https://www.cortexify.in/library'});
$('#save').onclick=saveOne;
$('#selection').onclick=async()=>{try{const [{result}]=await chrome.scripting.executeScript({target:{tabId:active.id},func:()=>getSelection().toString().trim()});if(!result)return status('Select text on the page first','warn');await CX.saveNote((active.title||'Clipping').slice(0,120),`${result}\n\nSource: ${active.url}`);status('Selection saved as a note','ok')}catch(e){status(human(e),'error')}};
$('#tabs').onclick=async()=>{tabs=(await chrome.tabs.query({currentWindow:true})).filter(t=>/^https?:/.test(t.url));$('#tabList').innerHTML=tabs.map((t,i)=>`<label class="check"><input type="checkbox" value="${i}" checked><span>${esc(t.title||t.url)}</span></label>`).join('');$('#tabCount').textContent=`${tabs.length} tabs`;$('#batch').hidden=false};
$('#saveTabs').onclick=async()=>{const picks=[...document.querySelectorAll('#tabList input:checked')].map(x=>tabs[+x.value]);status(`Saving ${picks.length} tabs…`);let done=0,skip=0,fail=0;for(const t of picks){try{const r=await CX.saveUrl(t.url,$('#collection').value||null);r.duplicate?skip++:done++}catch(_){fail++}}status(`${done} saved · ${skip} already there${fail?` · ${fail} failed`:''}`,fail?'warn':'ok')};
$('#disconnect').onclick=async()=>{await chrome.storage.local.remove(['cortexifySession','connectedAt']);location.reload()};
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
boot();
