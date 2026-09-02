document.querySelector('#go').onclick=()=>chrome.tabs.create({url:'https://www.cortexify.in/login?extension=connect'});
chrome.storage.local.get('cortexifyTheme').then(({cortexifyTheme})=>{
  const theme=['light','dark','system'].includes(cortexifyTheme)?cortexifyTheme:'system';
  localStorage.setItem('cx-theme',theme);
  document.documentElement.dataset.theme=theme;
  document.documentElement.classList.toggle('dark',theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches));
});
