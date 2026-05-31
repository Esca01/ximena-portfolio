/* =========================================================
   store.js — data + appearance layer with GLOBAL persistence.

   Reads instantly from a localStorage cache (or data.js defaults) for a
   no-flicker first paint, then hydrates from /api/content (Vercel Blob) and
   dispatches "xm-updated" so the page re-renders with the shared content.

   - Global (shared by all visitors, in Blob): content (es/en) + appearance
     (fonts, palette, photo URL).
   - Local (per visitor, localStorage): language, light/dark theme, and a
     cache of the last-seen content for offline/instant render.

   Admin writes go through saveRemote()/uploadPhoto(), authorized with the
   password kept in sessionStorage after a successful /api/login.
   ========================================================= */
(function(){
  const PALETTES = {
    oleos:     { label:"Óleos",     colors:['#C5552F','#DCA02E','#4E7B55','#2C5E7E','#84436A'] },
    atardecer: { label:"Atardecer", colors:['#C0392B','#E07B39','#E6B53D','#B8556A','#6D4E8C'] },
    bosque:    { label:"Bosque",    colors:['#3E6B4F','#7C8A3A','#C28A2C','#8C5A3C','#2F5E5A'] },
    tinta:     { label:"Tinta",     colors:['#2C5E7E','#3E8C93','#4E7B55','#84436A','#C5552F'] },
  };
  const DISPLAY_FONTS = ['Bodoni Moda','Playfair Display','Cormorant Garamond','DM Serif Display'];
  const BODY_FONTS    = ['Archivo','Karla','Mulish','Work Sans'];
  const APPEAR_DEF    = { display:'Bodoni Moda', body:'Archivo', palette:'oleos', photo:'' };
  const PAL_VARS      = ['--terracotta','--ochre','--sap','--cobalt','--plum'];
  const DEFAULT_PASS  = 'ximena2026'; // fallback only, for pure-static local preview (no API)

  function clone(o){ return JSON.parse(JSON.stringify(o)); }

  /* ---- appearance (fonts, palette, photo) ---- */
  function loadAppearance(){
    let a = Object.assign({}, APPEAR_DEF);
    try{ Object.assign(a, JSON.parse(localStorage.getItem('xm-appear')||'{}')); }catch(e){}
    if(!PALETTES[a.palette]) a.palette = 'oleos';
    if(DISPLAY_FONTS.indexOf(a.display)<0) a.display = APPEAR_DEF.display;
    if(BODY_FONTS.indexOf(a.body)<0) a.body = APPEAR_DEF.body;
    if(typeof a.photo !== 'string') a.photo = '';
    return a;
  }
  function saveAppearance(a){ localStorage.setItem('xm-appear', JSON.stringify(a)); }
  function paletteArr(a){ a = a || loadAppearance(); return (PALETTES[a.palette]||PALETTES.oleos).colors; }
  function photoUrl(){ return loadAppearance().photo || ''; }
  function applyAppearance(a){
    a = a || loadAppearance();
    const s = document.documentElement.style;
    s.setProperty('--serif', `'${a.display}', Georgia, serif`);
    s.setProperty('--sans', `'${a.body}', system-ui, sans-serif`);
    const dark = loadTheme() === 'dark';
    paletteArr(a).forEach((c,i)=> s.setProperty(PAL_VARS[i], dark ? 'color-mix(in srgb, '+c+' 65%, white)' : c));
  }

  /* ---- content ---- */
  function loadData(){
    try{ const o = JSON.parse(localStorage.getItem('xm-data')||'null'); if(o && o.es && o.en) return o; }catch(e){}
    return clone(window.DATA);
  }
  function saveData(d){ localStorage.setItem('xm-data', JSON.stringify(d)); }
  function resetData(){ localStorage.removeItem('xm-data'); }
  function resetAll(){ localStorage.removeItem('xm-data'); localStorage.removeItem('xm-appear'); }

  /* ---- theme (light / dark) — per visitor ---- */
  function loadTheme(){ return localStorage.getItem('xm-theme') === 'dark' ? 'dark' : 'light'; }
  function saveTheme(t){ localStorage.setItem('xm-theme', t); }
  function applyTheme(t){ t = t || loadTheme(); document.documentElement.setAttribute('data-theme', t); return t; }
  function toggleTheme(){ const t = loadTheme()==='dark' ? 'light' : 'dark'; saveTheme(t); applyTheme(t); applyAppearance(); return t; }

  /* ---- admin auth (server-validated, session-scoped) ---- */
  function adminKey(){ return sessionStorage.getItem('xm-admin-key') || ''; }
  function isAuthed(){ return sessionStorage.getItem('xm-admin-auth') === '1'; }
  function grant(pass){ sessionStorage.setItem('xm-admin-auth','1'); sessionStorage.setItem('xm-admin-key', pass); }
  function logout(){ sessionStorage.removeItem('xm-admin-auth'); sessionStorage.removeItem('xm-admin-key'); }
  async function login(pass){
    try{
      const r = await fetch('/api/login', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ password:pass }),
      });
      if(r.ok){ grant(pass); return true; }
      if(r.status === 401) return false; // API present, wrong password
    }catch(e){ /* no API (static preview) — fall through */ }
    if(pass === DEFAULT_PASS){ grant(pass); return true; } // local-only fallback
    return false;
  }

  /* ---- remote (Vercel Blob via /api) ---- */
  async function saveRemote(payload){
    const r = await fetch('/api/content', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'x-admin-key': adminKey() },
      body: JSON.stringify(payload),
    });
    if(!r.ok){ const e = new Error('save failed'); e.status = r.status; throw e; }
    return r.json();
  }
  async function uploadPhoto(dataBase64, contentType){
    const r = await fetch('/api/photo', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'x-admin-key': adminKey() },
      body: JSON.stringify({ dataBase64, contentType }),
    });
    if(!r.ok){ const e = new Error('upload failed'); e.status = r.status; throw e; }
    return (await r.json()).url;
  }
  /* Pull the shared document and, if it changed, update the cache + notify. */
  async function bootstrap(){
    try{
      const r = await fetch('/api/content', { cache:'no-store' });
      if(!r.ok) return;
      const remote = await r.json();
      if(!remote || !remote.data || !remote.data.es || !remote.data.en) return;
      let changed = false;
      const nextData = JSON.stringify(remote.data);
      if(localStorage.getItem('xm-data') !== nextData){ localStorage.setItem('xm-data', nextData); changed = true; }
      if(remote.appearance && Object.keys(remote.appearance).length){
        const nextAppear = JSON.stringify(remote.appearance);
        if(localStorage.getItem('xm-appear') !== nextAppear){ localStorage.setItem('xm-appear', nextAppear); changed = true; }
        applyAppearance(loadAppearance());
      }
      if(changed) window.dispatchEvent(new Event('xm-updated'));
    }catch(e){ /* offline — keep the cached/default content */ }
  }

  window.XM = {
    PALETTES, DISPLAY_FONTS, BODY_FONTS, APPEAR_DEF, PAL_VARS,
    clone, defaults:()=>clone(window.DATA),
    loadAppearance, saveAppearance, paletteArr, photoUrl, applyAppearance,
    loadData, saveData, resetData, resetAll,
    loadTheme, saveTheme, applyTheme, toggleTheme,
    isAuthed, login, logout,
    saveRemote, uploadPhoto, bootstrap,
  };

  // Hydrate from the shared document on every page (fire-and-forget).
  bootstrap();
})();
