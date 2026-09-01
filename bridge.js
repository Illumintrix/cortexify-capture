(() => {
  const KEY = 'sb-tfbujtucezcpxdzlhqrj-auth-token';
  function sync() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return chrome.storage.local.remove(['cortexifySession','connectedAt']);
      const parsed = JSON.parse(raw);
      const session = parsed?.access_token ? parsed : parsed?.currentSession || parsed;
      if (!session?.access_token) return;
      chrome.storage.local.set({cortexifySession:{access_token:session.access_token,refresh_token:session.refresh_token,expires_at:session.expires_at,user:{id:session.user?.id,email:session.user?.email}},connectedAt:Date.now()});
    } catch (_) {}
  }
  sync();
  setInterval(sync, 30000);
  chrome.runtime.onMessage.addListener((m,_,send) => { if(m?.type==='CX_SYNC'){sync();send({ok:true});} });
})();
