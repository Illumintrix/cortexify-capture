const $=s=>document.querySelector(s); let active, tabs=[];
function status(text,type=''){ const el=$('#status'); el.className=type; el.replaceChildren(Object.assign(document.createElement('i'),{ariaHidden:'true'}),document.createTextNode(text)); }
async function boot(){
  [active]=await chrome.tabs.query({active:true,currentWindow:true});
  $('#title').textContent=active?.title||'Untitled'; $('#host').textContent=new URL(active.url).hostname; $('#favicon').src=active.favIconUrl||'icons/32.png';
  try { await CX.session(); $('#capture').hidden=false; $('#connect').hidden=true; await loadCollections(); const d=await CX.duplicate(active.url); $('#dup').hidden=!d; }
  catch(e){ $('#connect').hidden=false; $('#capture').hidden=true; $('#disconnect').hidden=true; status(e.message==='SESSION_EXPIRED'?'Connection expired':'Not connected','warn'); }
}
async function loadCollections(){ const rows=await CX.collections(); for(const c of rows){const o=document.createElement('option');o.value=c.id;o.textContent=`${c.emoji||'📁'} ${c.name}`;$('#collection').append(o);} }
async function saveOne(){ const button=$('#save'),label=button.querySelector('.button-label'); button.disabled=true;button.setAttribute('aria-busy','true');status('Saving…');try{const r=await CX.saveUrl(active.url,$('#collection').value||null);status(r.duplicate?'Already saved':'Saved · AI is organizing it','ok');$('#dup').hidden=false;label.lastChild.textContent='Saved to Cortexify';button.classList.add('is-saved');}catch(e){status(human(e),'error')}finally{button.disabled=false;button.removeAttribute('aria-busy')} }
function human(e){return ['CONNECT_REQUIRED','SESSION_EXPIRED'].includes(e.message)?'Reconnect to Cortexify':e.message}
$('#connectBtn').onclick=()=>chrome.tabs.create({url:'https://www.cortexify.in/login?extension=connect'});
$('#open').onclick=()=>chrome.tabs.create({url:'https://www.cortexify.in/library'});
$('#save').onclick=saveOne;
$('#selection').onclick=async()=>{const b=$('#selection');b.disabled=true;try{const [{result}]=await chrome.scripting.executeScript({target:{tabId:active.id},func:()=>getSelection().toString().trim()});if(!result)return status('Select text on the page first','warn');await CX.saveNote((active.title||'Clipping').slice(0,120),`${result}\n\nSource: ${active.url}`);status('Selection saved as a note','ok')}catch(e){status(human(e),'error')}finally{b.disabled=false}};
$('#tabs').onclick=async()=>{const b=$('#tabs');b.disabled=true;tabs=(await chrome.tabs.query({currentWindow:true})).filter(t=>/^https?:/.test(t.url));$('#tabList').innerHTML=tabs.map((t,i)=>`<label class="check"><input type="checkbox" value="${i}" checked><span>${esc(t.title||t.url)}</span></label>`).join('');$('#tabCount').textContent=`${tabs.length} tabs`;$('#batch').hidden=false;b.disabled=false};
$('#saveTabs').onclick=async()=>{const b=$('#saveTabs');b.disabled=true;const picks=[...document.querySelectorAll('#tabList input:checked')].map(x=>tabs[+x.value]);status(`Saving ${picks.length} tabs…`);let done=0,skip=0,fail=0;for(const t of picks){try{const r=await CX.saveUrl(t.url,$('#collection').value||null);r.duplicate?skip++:done++}catch(_){fail++}}status(`${done} saved · ${skip} already there${fail?` · ${fail} failed`:''}`,fail?'warn':'ok');b.disabled=false};
$('#disconnect').onclick=async()=>{await chrome.storage.local.remove(['cortexifySession','connectedAt']);location.reload()};
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
boot();

const THEMES=['system','light','dark'];
function resolvedTheme(theme){return theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme}
function paintTheme(theme){
  document.documentElement.dataset.theme=theme;
  document.documentElement.classList.toggle('dark',resolvedTheme(theme)==='dark');
  const button=$('#theme'); if(button){button.title=`Theme: ${theme}`;button.setAttribute('aria-label',`Theme: ${theme}. Click to change`);}
}
async function initTheme(){
  const {cortexifyTheme}=await chrome.storage.local.get('cortexifyTheme');
  const theme=THEMES.includes(cortexifyTheme)?cortexifyTheme:'system';
  localStorage.setItem('cx-theme',theme);paintTheme(theme);
}
$('#theme').onclick=async()=>{
  const current=document.documentElement.dataset.theme||'system';
  const theme=THEMES[(THEMES.indexOf(current)+1)%THEMES.length];
  localStorage.setItem('cx-theme',theme);await chrome.storage.local.set({cortexifyTheme:theme});paintTheme(theme);status(`Theme · ${theme}`);
};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if((document.documentElement.dataset.theme||'system')==='system')paintTheme('system')});
initTheme();
