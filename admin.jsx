const { useState, useEffect, useRef } = React;
const clone = o => JSON.parse(JSON.stringify(o));
window.XM.applyAppearance();
window.XM.applyTheme();

function ThemeToggle(){
  const [dark, setDark] = useState(window.XM.loadTheme()==="dark");
  function flip(){ const t=window.XM.toggleTheme(); setDark(t==="dark"); }
  return (
    <button className="theme-tog" onClick={flip} title={dark?"Modo claro":"Modo oscuro"} aria-label="Tema">
      {dark
        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>
        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 7 7 0 1 0 20 14.5z"/></svg>}
    </button>
  );
}

function Login({ onSuccess }){
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e){
    e.preventDefault();
    if(busy) return;
    setBusy(true);
    const ok = await window.XM.login(pass);
    setBusy(false);
    if(ok) onSuccess();
    else { setErr("Contraseña incorrecta"); setPass(""); }
  }
  return (
    <div className="login-screen">
      <div className="login-top"><ThemeToggle/></div>
      <div className="login-card">
        <div className="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="2.4"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg></div>
        <div className="eb">Acceso restringido</div>
        <h1>Panel de administración</h1>
        <p>Ingresa la contraseña para editar el contenido del portafolio.</p>
        <form onSubmit={submit}>
          <input type="password" value={pass} autoFocus placeholder="Contraseña"
            onChange={e=>{ setPass(e.target.value); setErr(""); }}/>
          <div className="err">{err}</div>
          <button type="submit" disabled={busy} className="abtn primary" style={{justifyContent:"center",padding:"13px"}}>{busy?"Entrando…":"Entrar"}</button>
        </form>
        <div className="hint">Acceso solo para la administradora del sitio.</div>
      </div>
    </div>
  );
}

function Gate(){
  const [authed, setAuthed] = useState(window.XM.isAuthed());
  if(!authed) return <Login onSuccess={()=>setAuthed(true)}/>;
  return <Admin onLogout={()=>{ window.XM.logout(); setAuthed(false); }}/>;
}

/* ---------- reusable fields ---------- */
function Field({ label, value, onChange, area, placeholder }){
  return (
    <div className="fld">
      {label && <label>{label}</label>}
      {area
        ? <textarea value={value||""} placeholder={placeholder||""} onChange={e=>onChange(e.target.value)}/>
        : <input type="text" value={value||""} placeholder={placeholder||""} onChange={e=>onChange(e.target.value)}/>}
    </div>
  );
}
function NumField({ label, value, onChange }){
  return (
    <div className="fld">
      <label>{label}</label>
      <div className="rng">
        <input type="range" min="0" max="100" value={value} onChange={e=>onChange(+e.target.value)}/>
        <span className="val">{value}%</span>
      </div>
    </div>
  );
}
function StringList({ label, items, onChange, placeholder }){
  const set = (i,v)=>{ const a=items.slice(); a[i]=v; onChange(a); };
  const del = i => onChange(items.filter((_,k)=>k!==i));
  const add = () => onChange([...items, ""]);
  return (
    <div className="fld slist">
      {label && <label>{label}</label>}
      {items.map((it,i)=>(
        <div className="row" key={i}>
          <input type="text" value={it} placeholder={placeholder||""} onChange={e=>set(i,e.target.value)}/>
          <button className="x" onClick={()=>del(i)} title="Eliminar">✕</button>
        </div>
      ))}
      <button className="add-btn" onClick={add}>+ Agregar</button>
    </div>
  );
}
function ObjList({ items, tag, render, onAdd, onDel, onMove, addLabel }){
  return (
    <React.Fragment>
      {items.map((it,i)=>(
        <div className="adm-item" key={i}>
          <div className="ih">
            <span className="tag">{tag?tag(i):("#"+(i+1))}</span>
            <span className="sp"></span>
            <button onClick={()=>onMove(i,-1)} title="Subir">↑</button>
            <button onClick={()=>onMove(i,1)} title="Bajar">↓</button>
            <button className="del" onClick={()=>onDel(i)} title="Eliminar">✕</button>
          </div>
          {render(it,i)}
        </div>
      ))}
      <button className="add-btn" onClick={onAdd}>+ {addLabel||"Agregar"}</button>
    </React.Fragment>
  );
}
function Card({ id, eb, title, open, toggle, children }){
  return (
    <div className={"adm-card"+(open?" open":"")}>
      <div className="ch" onClick={()=>toggle(id)}>
        <span className="eb">{eb}</span>
        <h2>{title}</h2>
        <span className="chev">⌄</span>
      </div>
      <div className="cbody">{children}</div>
    </div>
  );
}
/* Downscale + re-encode to WebP so the upload stays small (profile photo). */
async function fileToWebp(file, max=640){
  const bitmap = await createImageBitmap(file);
  try{
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width*scale));
    const h = Math.max(1, Math.round(bitmap.height*scale));
    const c = document.createElement('canvas'); c.width=w; c.height=h;
    c.getContext('2d').drawImage(bitmap,0,0,w,h);
    return c.toDataURL('image/webp', 0.85);
  } finally { bitmap.close && bitmap.close(); }
}

function PhotoUploader({ lang, photo, onChange }){
  const inp = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  async function handle(file){
    if(!file) return;
    if(!/^image\/(png|jpe?g|webp|avif)$/i.test(file.type)){ setErr(lang==="es"?"Usa PNG, JPG, WebP o AVIF":"Use PNG, JPG, WebP or AVIF"); return; }
    setErr(""); setBusy(true);
    try{
      const dataUrl = await fileToWebp(file);
      const url = await window.XM.uploadPhoto(dataUrl.split(',')[1], 'image/webp');
      onChange(url);
    }catch(e){
      setErr(e && e.status===401 ? (lang==="es"?"Sesión expirada — vuelve a entrar":"Session expired — log in again") : (lang==="es"?"No se pudo subir la imagen":"Upload failed"));
    }finally{ setBusy(false); }
  }
  const pick = ()=> inp.current && inp.current.click();
  return (
    <div className={"xphoto"+(over?" over":"")}
      onDragOver={e=>{e.preventDefault(); setOver(true);}}
      onDragLeave={()=>setOver(false)}
      onDrop={e=>{e.preventDefault(); setOver(false); handle(e.dataTransfer.files && e.dataTransfer.files[0]);}}>
      <div className="xphoto-pic" onClick={pick} title={lang==="es"?"Subir foto":"Upload photo"}>
        {photo ? <img src={photo} alt=""/> : <span className="xphoto-ph">XC</span>}
        {busy && <span className="xphoto-busy"></span>}
      </div>
      <div className="xphoto-side">
        <div className="xphoto-btns">
          <button className="abtn" type="button" onClick={pick} disabled={busy}>
            {busy ? (lang==="es"?"Subiendo…":"Uploading…") : (photo ? (lang==="es"?"Cambiar foto":"Change photo") : (lang==="es"?"Subir foto":"Upload photo"))}
          </button>
          {photo && <button className="abtn danger" type="button" disabled={busy} onClick={()=>onChange("")}>{lang==="es"?"Quitar":"Remove"}</button>}
        </div>
        <div className="hint">{lang==="es"?"Foto de perfil de la página principal. Arrástrala o haz clic. Pulsa Guardar para publicarla para todos.":"Main-site profile photo. Drag or click. Click Save to publish it for everyone."}</div>
        {err && <div className="xphoto-err">{err}</div>}
      </div>
      <input ref={inp} type="file" accept="image/png,image/jpeg,image/webp,image/avif" style={{display:"none"}}
        onChange={e=>{ handle(e.target.files && e.target.files[0]); e.target.value=""; }}/>
    </div>
  );
}

/* ---------- main panel ---------- */
const blanks = {
  job:  { role:"", company:"", dates:"", badge:"", summary:"", bullets:[] },
  level:{ name:"", lvl:"", pct:50 },
  lang: { name:"", sub:"", pct:50, note:"" },
  rec:  { yr:"", deg:"", school:"", note:"" },
  row:  { k:"", v:"", href:"" },
};

function Admin({ onLogout }){
  const [lang, setLang] = useState("es");
  const [draft, setDraft] = useState(()=>XM.loadData());
  const [appear, setAppear] = useState(()=>XM.loadAppearance());
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");
  const [open, setOpen] = useState({ app:true, hero:true, about:true, work:true, skills:true, langs:true, edu:true, certs:true, hobbies:true, contact:true, security:false });
  const fileRef = useRef(null);
  const toggle = id => setOpen(o=>({...o,[id]:!o[id]}));

  useEffect(()=>{ XM.applyAppearance(appear); },[appear]);

  /* If the shared content hydrates from the server and we have no unsaved
     edits, adopt it so the panel starts from the latest published version. */
  useEffect(()=>{
    function onUpdated(){
      if(dirty) return;
      setDraft(XM.loadData());
      const ap = XM.loadAppearance(); setAppear(ap); XM.applyAppearance(ap);
    }
    window.addEventListener("xm-updated", onUpdated);
    return ()=> window.removeEventListener("xm-updated", onUpdated);
  },[dirty]);

  const d = draft[lang];
  const T = lang==="es"
    ? { L:{ app:"Apariencia", hero:"Inicio", about:"Sobre mí", work:"Experiencia", skills:"Competencias", langs:"Idiomas", edu:"Educación", certs:"Certificaciones", hobbies:"Hobbies", contact:"Contacto" } }
    : { L:{ app:"Appearance", hero:"Home", about:"About", work:"Experience", skills:"Skills", langs:"Languages", edu:"Education", certs:"Certifications", hobbies:"Hobbies", contact:"Contact" } };

  function mutate(fn){ setDraft(p=>{ const c=clone(p); fn(c); return c; }); setDirty(true); }
  const getArr = (root,path)=> path.reduce((o,k)=>o[k], root);
  const setField  = (sec,key,val)=> mutate(c=>{ c[lang][sec][key]=val; });
  const listSet   = (path,i,key,val)=> mutate(c=>{ getArr(c[lang],path)[i][key]=val; });
  const listSetA  = (path,i,key,arr)=> mutate(c=>{ getArr(c[lang],path)[i][key]=arr; });
  const listAdd   = (path,blank)=> mutate(c=>{ ["es","en"].forEach(L=>getArr(c[L],path).push(clone(blank))); });
  const listDel   = (path,i)=> mutate(c=>{ ["es","en"].forEach(L=>getArr(c[L],path).splice(i,1)); });
  const listMove  = (path,i,dir)=> mutate(c=>{ ["es","en"].forEach(L=>{ const a=getArr(c[L],path); const j=i+dir; if(j<0||j>=a.length)return; const t=a[i]; a[i]=a[j]; a[j]=t; }); });
  const setStr    = (sec,key,arr)=> mutate(c=>{ c[lang][sec][key]=arr; });

  function flash(msg){ setToast(msg); setTimeout(()=>setToast(""), 2600); }
  async function save(){
    XM.saveData(draft); XM.saveAppearance(appear); setDirty(false);
    try{
      await XM.saveRemote({ data:draft, appearance:appear });
      flash(lang==="es"?"✓ Guardado — visible para todos los visitantes":"✓ Saved — visible to all visitors");
    }catch(err){
      if(err && err.status===401){ setDirty(true); flash(lang==="es"?"Sesión expirada. Vuelve a iniciar sesión.":"Session expired. Log in again."); }
      else { flash(lang==="es"?"Guardado local (sin conexión al servidor)":"Saved locally (no server connection)"); }
    }
  }
  function setPhoto(url){
    setAppear(a=>({ ...a, photo:url })); setDirty(true);
    flash(url ? (lang==="es"?"Foto lista — pulsa Guardar para publicarla":"Photo ready — click Save to publish")
              : (lang==="es"?"Foto quitada — pulsa Guardar":"Photo removed — click Save"));
  }
  function resetAll(){
    if(!window.confirm(lang==="es"?"¿Restablecer TODO a los valores originales? Se perderán los cambios guardados.":"Reset EVERYTHING to defaults? Saved changes will be lost.")) return;
    XM.resetAll(); const def=XM.defaults(); setDraft(def); const ap=XM.loadAppearance(); setAppear(ap); XM.applyAppearance(ap); setDirty(false);
    flash(lang==="es"?"Restablecido":"Reset done");
  }
  function exportJSON(){
    const blob = new Blob([JSON.stringify({ data:draft, appearance:appear }, null, 2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "ximena-portafolio-contenido.json"; a.click(); URL.revokeObjectURL(a.href);
  }
  function importJSON(e){
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = () => { try{
      const o = JSON.parse(r.result);
      if(o.data && o.data.es && o.data.en){ setDraft(o.data); }
      if(o.appearance){ setAppear(o.appearance); XM.applyAppearance(o.appearance); }
      setDirty(true); flash(lang==="es"?"Importado — recuerda Guardar":"Imported — remember to Save");
    }catch(err){ flash(lang==="es"?"Archivo inválido":"Invalid file"); } };
    r.readAsText(f); e.target.value="";
  }

  return (
    <React.Fragment>
      <div className="adm-bar">
        <div className="brand">
          <span className="dab"><svg viewBox="0 0 88 88"><path d="M48 8c14 2 30 11 33 26 3 15-9 27-21 35-13 9-31 16-43 7C4 67-2 49 3 34 8 18 24 9 38 8z" fill="var(--terracotta)"/></svg></span>
          <span>{lang==="es"?"Administración":"Admin"}<small>Portafolio · Ximena Córdoba</small></span>
        </div>
        <div className="adm-actions">
          <div className="lang"><button className={lang==="es"?"on":""} onClick={()=>setLang("es")}>ES</button><button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button></div>
          <ThemeToggle/>
          <button className="abtn" onClick={()=>fileRef.current.click()}>{lang==="es"?"Importar":"Import"}</button>
          <input ref={fileRef} type="file" accept="application/json,.json" style={{display:"none"}} onChange={importJSON}/>
          <button className="abtn" onClick={exportJSON}>{lang==="es"?"Exportar":"Export"}</button>
          <button className="abtn danger" onClick={resetAll}>{lang==="es"?"Restablecer":"Reset"}</button>
          <a className="abtn" href="index.html" target="_blank" rel="noopener">{lang==="es"?"Ver página ↗":"View site ↗"}</a>
          <button className="abtn" onClick={onLogout}>{lang==="es"?"Salir":"Log out"}</button>
          <button className={"abtn primary"} onClick={save}>{dirty? (lang==="es"?"Guardar cambios •":"Save changes •") : (lang==="es"?"Guardar":"Save")}</button>
        </div>
      </div>

      <div className="adm-wrap">
        <div className="adm-note">
          {lang==="es"
            ? <span><b>Cómo funciona:</b> edita los campos y pulsa <b>Guardar cambios</b>; se publican <b>para todos los visitantes</b> (página principal y CV). Edita cada idioma por separado con el botón <b>ES / EN</b> de arriba. Sube la <b>foto de perfil</b> en <i>Apariencia</i>. Usa <b>Exportar</b> para respaldar tu contenido.</span>
            : <span><b>How it works:</b> edit the fields and click <b>Save changes</b>; they publish <b>for all visitors</b> (main site and CV). Edit each language separately with the <b>ES / EN</b> toggle above. Upload the <b>profile photo</b> under <i>Appearance</i>. Use <b>Export</b> to back up your content.</span>}
        </div>

        {/* APARIENCIA */}
        <Card id="app" eb="00" title={T.L.app} open={open.app} toggle={toggle}>
          <div className="photo-box" style={{marginBottom:24}}>
            <PhotoUploader lang={lang} photo={appear.photo} onChange={setPhoto}/>
          </div>
          <div className="appgrid">
            <div className="fld">
              <label>{lang==="es"?"Tipografía de títulos":"Display font"}</label>
              <select value={appear.display} onChange={e=>{ setAppear(a=>({...a,display:e.target.value})); setDirty(true); }}>
                {XM.DISPLAY_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="fld">
              <label>{lang==="es"?"Tipografía de texto":"Body font"}</label>
              <select value={appear.body} onChange={e=>{ setAppear(a=>({...a,body:e.target.value})); setDirty(true); }}>
                {XM.BODY_FONTS.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="fld">
            <label>{lang==="es"?"Paleta de colores":"Color palette"}</label>
            <div className="pal-opts">
              {Object.keys(XM.PALETTES).map(k=>(
                <div key={k} className={"pal-opt"+(appear.palette===k?" on":"")} onClick={()=>{ setAppear(a=>({...a,palette:k})); setDirty(true); }}>
                  <span className="sw">{XM.PALETTES[k].colors.map((c,i)=><span key={i} style={{background:c}}></span>)}</span>
                  <span className="nm">{XM.PALETTES[k].label}</span>
                  <span className="chk">✓</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* HERO */}
        <Card id="hero" eb="01" title={T.L.hero} open={open.hero} toggle={toggle}>
          <div className="fld-row">
            <Field label={lang==="es"?"Nombre":"First name"} value={d.hero.first} onChange={v=>setField("hero","first",v)}/>
            <Field label={lang==="es"?"Apellido":"Last name"} value={d.hero.last} onChange={v=>setField("hero","last",v)}/>
          </div>
          <Field label={lang==="es"?"Etiqueta superior":"Eyebrow"} value={d.hero.eyebrow} onChange={v=>setField("hero","eyebrow",v)}/>
          <StringList label={lang==="es"?"Roles / especialidades":"Roles"} items={d.hero.role} onChange={a=>setStr("hero","role",a)}/>
          <Field label={lang==="es"?"Descripción (titular)":"Lede"} area value={d.hero.lede} onChange={v=>setField("hero","lede",v)}/>
          <div className="fld-row">
            <Field label={lang==="es"?"Botón 1":"Button 1"} value={d.hero.cta1} onChange={v=>setField("hero","cta1",v)}/>
            <Field label={lang==="es"?"Botón 2":"Button 2"} value={d.hero.cta2} onChange={v=>setField("hero","cta2",v)}/>
          </div>
        </Card>

        {/* ABOUT */}
        <Card id="about" eb="02" title={T.L.about} open={open.about} toggle={toggle}>
          <Field label={lang==="es"?"Frase principal (usa <em>…</em> para resaltar)":"Lead (use <em>…</em> to highlight)"} area value={d.about.lead} onChange={v=>setField("about","lead",v)}/>
          <Field label={lang==="es"?"Párrafo 1":"Paragraph 1"} area value={d.about.p1} onChange={v=>setField("about","p1",v)}/>
          <Field label={lang==="es"?"Párrafo 2":"Paragraph 2"} area value={d.about.p2} onChange={v=>setField("about","p2",v)}/>
          <StringList label={lang==="es"?"Aptitudes (etiquetas)":"Traits"} items={d.about.traits} onChange={a=>setStr("about","traits",a)}/>
        </Card>

        {/* WORK */}
        <Card id="work" eb="03" title={T.L.work} open={open.work} toggle={toggle}>
          <Field label={lang==="es"?"Nota lateral":"Side note"} area value={d.work.meta} onChange={v=>setField("work","meta",v)}/>
          <ObjList
            items={d.work.jobs}
            tag={i=>(lang==="es"?"Cargo ":"Role ")+(i+1)}
            addLabel={lang==="es"?"Agregar cargo":"Add role"}
            onAdd={()=>listAdd(["work","jobs"], blanks.job)}
            onDel={i=>listDel(["work","jobs"], i)}
            onMove={(i,dir)=>listMove(["work","jobs"], i, dir)}
            render={(it,i)=>(
              <React.Fragment>
                <Field label={lang==="es"?"Cargo":"Role"} value={it.role} onChange={v=>listSet(["work","jobs"],i,"role",v)}/>
                <div className="fld-row">
                  <Field label={lang==="es"?"Empresa":"Company"} value={it.company} onChange={v=>listSet(["work","jobs"],i,"company",v)}/>
                  <Field label={lang==="es"?"Fechas":"Dates"} value={it.dates} onChange={v=>listSet(["work","jobs"],i,"dates",v)}/>
                </div>
                <Field label={lang==="es"?"Etiqueta (ej. Actual, 3 años)":"Badge (e.g. Current)"} value={it.badge} onChange={v=>listSet(["work","jobs"],i,"badge",v)}/>
                <Field label={lang==="es"?"Resumen":"Summary"} area value={it.summary} onChange={v=>listSet(["work","jobs"],i,"summary",v)}/>
                <StringList label={lang==="es"?"Responsabilidades":"Responsibilities"} items={it.bullets} onChange={a=>listSetA(["work","jobs"],i,"bullets",a)}/>
              </React.Fragment>
            )}
          />
        </Card>

        {/* SKILLS */}
        <Card id="skills" eb="04" title={T.L.skills} open={open.skills} toggle={toggle}>
          <label className="fld" style={{display:"block",marginBottom:4}}><span style={{fontFamily:"var(--mono)",fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"var(--ink-faint)"}}>{lang==="es"?"Niveles de dominio":"Proficiency levels"}</span></label>
          <ObjList
            items={d.skills.levels}
            tag={i=>(lang==="es"?"Habilidad ":"Skill ")+(i+1)}
            addLabel={lang==="es"?"Agregar habilidad":"Add skill"}
            onAdd={()=>listAdd(["skills","levels"], blanks.level)}
            onDel={i=>listDel(["skills","levels"], i)}
            onMove={(i,dir)=>listMove(["skills","levels"], i, dir)}
            render={(it,i)=>(
              <React.Fragment>
                <div className="fld-row">
                  <Field label={lang==="es"?"Nombre":"Name"} value={it.name} onChange={v=>listSet(["skills","levels"],i,"name",v)}/>
                  <Field label={lang==="es"?"Etiqueta de nivel":"Level label"} value={it.lvl} onChange={v=>listSet(["skills","levels"],i,"lvl",v)}/>
                </div>
                <NumField label={lang==="es"?"Porcentaje":"Percentage"} value={it.pct} onChange={v=>listSet(["skills","levels"],i,"pct",v)}/>
              </React.Fragment>
            )}
          />
          <div style={{marginTop:18}}>
            <StringList label={lang==="es"?"Herramientas & plataformas":"Tools & platforms"} items={d.skills.tools} onChange={a=>setStr("skills","tools",a)}/>
          </div>
        </Card>

        {/* LANGUAGES */}
        <Card id="langs" eb="05" title={T.L.langs} open={open.langs} toggle={toggle}>
          <ObjList
            items={d.langs.items}
            tag={i=>(lang==="es"?"Idioma ":"Language ")+(i+1)}
            addLabel={lang==="es"?"Agregar idioma":"Add language"}
            onAdd={()=>listAdd(["langs","items"], blanks.lang)}
            onDel={i=>listDel(["langs","items"], i)}
            onMove={(i,dir)=>listMove(["langs","items"], i, dir)}
            render={(it,i)=>(
              <React.Fragment>
                <div className="fld-row">
                  <Field label={lang==="es"?"Idioma":"Language"} value={it.name} onChange={v=>listSet(["langs","items"],i,"name",v)}/>
                  <Field label={lang==="es"?"Nivel (ej. Nivel B2)":"Level (e.g. B2)"} value={it.sub} onChange={v=>listSet(["langs","items"],i,"sub",v)}/>
                </div>
                <NumField label={lang==="es"?"Porcentaje":"Percentage"} value={it.pct} onChange={v=>listSet(["langs","items"],i,"pct",v)}/>
                <Field label={lang==="es"?"Descripción":"Description"} area value={it.note} onChange={v=>listSet(["langs","items"],i,"note",v)}/>
              </React.Fragment>
            )}
          />
        </Card>

        {/* EDU */}
        <Card id="edu" eb="06" title={T.L.edu} open={open.edu} toggle={toggle}>
          <Field label={lang==="es"?"Subtítulo":"Subtitle"} value={d.edu.subtitle} onChange={v=>setField("edu","subtitle",v)}/>
          <ObjList
            items={d.edu.items}
            tag={i=>(lang==="es"?"Estudio ":"Record ")+(i+1)}
            addLabel={lang==="es"?"Agregar estudio":"Add record"}
            onAdd={()=>listAdd(["edu","items"], blanks.rec)}
            onDel={i=>listDel(["edu","items"], i)}
            onMove={(i,dir)=>listMove(["edu","items"], i, dir)}
            render={(it,i)=>(
              <React.Fragment>
                <div className="fld-row">
                  <Field label={lang==="es"?"Años":"Years"} value={it.yr} onChange={v=>listSet(["edu","items"],i,"yr",v)}/>
                  <Field label={lang==="es"?"Etiqueta (ej. Pregrado)":"Note (e.g. Degree)"} value={it.note} onChange={v=>listSet(["edu","items"],i,"note",v)}/>
                </div>
                <Field label={lang==="es"?"Título / programa":"Degree / program"} value={it.deg} onChange={v=>listSet(["edu","items"],i,"deg",v)}/>
                <Field label={lang==="es"?"Institución":"Institution"} value={it.school} onChange={v=>listSet(["edu","items"],i,"school",v)}/>
              </React.Fragment>
            )}
          />
        </Card>

        {/* CERTS */}
        <Card id="certs" eb="07" title={T.L.certs} open={open.certs} toggle={toggle}>
          <Field label={lang==="es"?"Subtítulo":"Subtitle"} value={d.certs.subtitle} onChange={v=>setField("certs","subtitle",v)}/>
          <ObjList
            items={d.certs.items}
            tag={i=>(lang==="es"?"Certificación ":"Certification ")+(i+1)}
            addLabel={lang==="es"?"Agregar certificación":"Add certification"}
            onAdd={()=>listAdd(["certs","items"], blanks.rec)}
            onDel={i=>listDel(["certs","items"], i)}
            onMove={(i,dir)=>listMove(["certs","items"], i, dir)}
            render={(it,i)=>(
              <React.Fragment>
                <div className="fld-row">
                  <Field label={lang==="es"?"Año":"Year"} value={it.yr} onChange={v=>listSet(["certs","items"],i,"yr",v)}/>
                  <Field label={lang==="es"?"Etiqueta":"Note"} value={it.note} onChange={v=>listSet(["certs","items"],i,"note",v)}/>
                </div>
                <Field label={lang==="es"?"Certificación / curso":"Certification / course"} value={it.deg} onChange={v=>listSet(["certs","items"],i,"deg",v)}/>
                <Field label={lang==="es"?"Institución":"Institution"} value={it.school} onChange={v=>listSet(["certs","items"],i,"school",v)}/>
              </React.Fragment>
            )}
          />
        </Card>

        {/* HOBBIES */}
        <Card id="hobbies" eb="08" title={T.L.hobbies} open={open.hobbies} toggle={toggle}>
          <Field label={lang==="es"?"Título de la franja":"Strip label"} value={d.hobbies.label} onChange={v=>setField("hobbies","label",v)}/>
          <StringList label={lang==="es"?"Intereses":"Interests"} items={d.hobbies.items} onChange={a=>setStr("hobbies","items",a)}/>
        </Card>

        {/* CONTACT */}
        <Card id="contact" eb="09" title={T.L.contact} open={open.contact} toggle={toggle}>
          <ObjList
            items={d.contact.rows}
            tag={i=>(lang==="es"?"Dato ":"Item ")+(i+1)}
            addLabel={lang==="es"?"Agregar dato":"Add item"}
            onAdd={()=>listAdd(["contact","rows"], blanks.row)}
            onDel={i=>listDel(["contact","rows"], i)}
            onMove={(i,dir)=>listMove(["contact","rows"], i, dir)}
            render={(it,i)=>(
              <React.Fragment>
                <div className="fld-row">
                  <Field label={lang==="es"?"Etiqueta (ej. Correo)":"Label (e.g. Email)"} value={it.k} onChange={v=>listSet(["contact","rows"],i,"k",v)}/>
                  <Field label={lang==="es"?"Valor visible":"Visible value"} value={it.v} onChange={v=>listSet(["contact","rows"],i,"v",v)}/>
                </div>
                <Field label={lang==="es"?"Enlace (mailto:, tel:, https://) — opcional":"Link (mailto:, tel:, https://) — optional"} value={it.href} onChange={v=>listSet(["contact","rows"],i,"href",v)}/>
              </React.Fragment>
            )}
          />
          <Field label={lang==="es"?"Pie de página":"Footer text"} value={d.contact.foot} onChange={v=>setField("contact","foot",v)}/>
        </Card>

        {/* SECURITY */}
        <Card id="security" eb="🔒" title={lang==="es"?"Seguridad":"Security"} open={open.security} toggle={toggle}>
          <div className="adm-note">
            {lang==="es"
              ? <span>La contraseña de este panel es una <b>variable de entorno</b> en Vercel (<code>ADMIN_PASSWORD</code>), validada en el <b>servidor</b>: los visitantes no pueden verla ni cambiarla, y sin ella no se puede escribir en el sitio. Para cambiarla, ve en Vercel a tu proyecto → <b>Settings → Environment Variables</b>, edita <code>ADMIN_PASSWORD</code> y vuelve a desplegar (<b>Deployments → ⋯ → Redeploy</b>).</span>
              : <span>This panel's password is an <b>environment variable</b> in Vercel (<code>ADMIN_PASSWORD</code>), validated on the <b>server</b>: visitors can't see or change it, and without it nobody can write to the site. To change it, open your project in Vercel → <b>Settings → Environment Variables</b>, edit <code>ADMIN_PASSWORD</code> and redeploy (<b>Deployments → ⋯ → Redeploy</b>).</span>}
          </div>
        </Card>
      </div>

      <div className={"toast"+(toast?" show":"")}>{toast}</div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Gate/>);
