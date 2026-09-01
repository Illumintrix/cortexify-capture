const CX = {
  app: 'https://www.cortexify.in',
  supabase: 'https://tfbujtucezcpxdzlhqrj.supabase.co',
  anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYnVqdHVjZXpjcHhkemxocXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTEyOTMsImV4cCI6MjA3MTYyNzI5M30.NZpjHHCd9Mj2nQxVd_fGMXVXiY6xrLleLIyfqkdCiJU',
  async session() {
    const { cortexifySession } = await chrome.storage.local.get('cortexifySession');
    if (!cortexifySession?.access_token) throw new Error('CONNECT_REQUIRED');
    if ((cortexifySession.expires_at || 0) * 1000 < Date.now() + 30000) throw new Error('SESSION_EXPIRED');
    return cortexifySession;
  },
  async headers(json = true) {
    const s = await this.session();
    return { apikey: this.anon, Authorization: `Bearer ${s.access_token}`, ...(json ? {'Content-Type':'application/json'} : {}) };
  },
  async rest(path, init={}) {
    const res = await fetch(`${this.supabase}/rest/v1/${path}`, { ...init, headers:{...(await this.headers()), Prefer:'return=representation', ...(init.headers||{})} });
    if (!res.ok) throw new Error((await res.text()) || `Cortexify error ${res.status}`);
    return res.status === 204 ? null : res.json();
  },
  async collections() { return this.rest('collections?select=id,name,emoji,parent_id&order=created_at.desc'); },
  async duplicate(url) {
    const q = encodeURIComponent(url);
    const rows = await this.rest(`content?select=id,title,url,status&url=eq.${q}&limit=1`);
    return rows[0] || null;
  },
  async saveUrl(url, collectionId) {
    const found = await this.duplicate(url);
    if (found) return {duplicate:true,item:found};
    const id = crypto.randomUUID();
    const s = await this.session();
    const res = await fetch(`${this.app}/api/process-content`, {method:'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${s.access_token}`}, body:JSON.stringify({type:'url',payload:{url},id})});
    if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || `Could not save (${res.status})`); }
    if (collectionId) await this.rest('collection_content?on_conflict=collection_id,content_id', {method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({collection_id:collectionId,content_id:id})});
    return {id,duplicate:false};
  },
  async saveNote(title, content) {
    const s = await this.session();
    const [note] = await this.rest('notes', {method:'POST',body:JSON.stringify({title,content,user_id:s.user.id})});
    return note;
  }
};
if (typeof self !== 'undefined') self.CX = CX;
