importScripts('api.js');
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({id:'cx-page',title:'Save page to Cortexify',contexts:['page','link']});
  chrome.contextMenus.create({id:'cx-selection',title:'Save selection as Cortexify note',contexts:['selection']});
});
async function notify(title,message){ try{ await chrome.notifications.create({type:'basic',iconUrl:'icons/128.png',title,message}); }catch(_){} }
async function saveTab(tab){
  if(!tab?.url?.startsWith('http')) throw new Error('This page cannot be saved.');
  const result=await CX.saveUrl(tab.url,null);
  await notify('Cortexify', result.duplicate ? 'Already in your library.' : 'Saved. AI processing started.');
}
chrome.contextMenus.onClicked.addListener(async (info,tab)=>{
  try {
    if(info.menuItemId==='cx-selection') await CX.saveNote((tab?.title||'Clipping').slice(0,120),`${info.selectionText}\n\nSource: ${tab.url}`);
    else await CX.saveUrl(info.linkUrl||tab.url,null);
    await notify('Cortexify','Saved without leaving the page.');
  } catch(e) { await notify('Cortexify', e.message==='CONNECT_REQUIRED'?'Open the extension and connect first.':e.message); }
});
chrome.commands.onCommand.addListener(async c=>{ if(c==='save-current-page'){const [t]=await chrome.tabs.query({active:true,currentWindow:true});try{await saveTab(t)}catch(e){await notify('Cortexify',e.message)}} });
