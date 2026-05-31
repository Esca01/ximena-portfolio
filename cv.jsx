const { useState, useEffect } = React;
window.XM.applyAppearance();
window.XM.applyTheme();
let DATA = window.XM.loadData();

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

function CV(){
  const [lang, setLang] = useState(()=> localStorage.getItem("xm-lang") || "es");
  useEffect(()=>{ localStorage.setItem("xm-lang", lang); document.documentElement.lang = lang; },[lang]);
  const t = DATA[lang];
  const ui = lang==="es"
    ? { back:"Portafolio", dl:"Descargar PDF", ats:"Formato ATS", profile:"Perfil profesional", exp:"Experiencia profesional", skills:"Competencias digitales", tools:"Herramientas y plataformas", langs:"Idiomas", edu:"Educación", certs:"Certificaciones", hob:"Intereses" }
    : { back:"Portfolio", dl:"Download PDF", ats:"ATS format", profile:"Professional summary", exp:"Professional experience", skills:"Digital skills", tools:"Tools & platforms", langs:"Languages", edu:"Education", certs:"Certifications", hob:"Interests" };

  const contactLine = t.contact.rows.map(r=>r.v).join("   ·   ");

  return (
    <React.Fragment>
      <div className="cv-toolbar">
        <div className="left">
          <a href="index.html" className="back"><span>←</span> {ui.back}</a>
          <div className="lang">
            <button className={lang==="es"?"on":""} onClick={()=>setLang("es")}>ES</button>
            <button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <ThemeToggle/>
        </div>
        <div className="right">
          <span className="cv-hint">{ui.ats}</span>
          <button className="btn btn-solid" onClick={()=>window.print()} style={{padding:"11px 20px"}}>{ui.dl} <span>↓</span></button>
        </div>
      </div>

      <div className="sheet">
        <header className="ats-head">
          <h1>{t.hero.first} {t.hero.last}</h1>
          <div className="role">{t.hero.role.join("  |  ")}</div>
          <div className="ats-contact">
            {t.contact.rows.map((r,i)=>(
              <React.Fragment key={i}>
                {i>0 && "   ·   "}
                <b style={{color:"var(--ink)"}}>{r.k}: </b>
                {r.href ? <a href={r.href}>{r.v}</a> : r.v}
              </React.Fragment>
            ))}
          </div>
          <div className="ats-rule"></div>
        </header>

        <section className="ats-sec">
          <h2>{ui.profile}</h2>
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </section>

        <section className="ats-sec">
          <h2>{ui.exp}</h2>
          {t.work.jobs.map((j,i)=>(
            <div className="ats-job" key={i}>
              <div className="top">
                <span className="ttl">{j.role}</span>
                <span className="dt">{j.dates}</span>
              </div>
              <div className="co">{j.company}</div>
              <ul>{j.bullets.map((b,k)=><li key={k}>{b}</li>)}</ul>
            </div>
          ))}
        </section>

        <section className="ats-sec">
          <h2>{ui.skills}</h2>
          <p className="ats-line">
            {t.skills.levels.map((s,i)=>(
              <React.Fragment key={i}>{i>0 && "   ·   "}<b>{s.name}</b> ({s.lvl})</React.Fragment>
            ))}
          </p>
          <p className="ats-line" style={{marginTop:8}}>
            <b>{ui.tools}: </b>{t.skills.tools.join(", ")}.
          </p>
        </section>

        <section className="ats-sec">
          <h2>{ui.langs}</h2>
          <p className="ats-line">
            {t.langs.items.map((l,i)=>(
              <React.Fragment key={i}>{i>0 && "   ·   "}<b>{l.name}</b> — {l.sub}</React.Fragment>
            ))}
          </p>
        </section>

        <section className="ats-sec">
          <h2>{ui.edu}</h2>
          <div className="ats-grid">
            {t.edu.items.map((e,i)=>(
              <div className="ats-rec" key={i}>
                <div className="ti">{e.deg}</div>
                <div className="me">{e.school} · {e.yr}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ats-sec">
          <h2>{ui.certs}</h2>
          <div className="ats-grid">
            {t.certs.items.map((e,i)=>(
              <div className="ats-rec" key={i}>
                <div className="ti">{e.deg}</div>
                <div className="me">{e.school} · {e.yr}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="ats-sec">
          <h2>{ui.hob}</h2>
          <p className="ats-line">{t.hobbies.items.join(", ")}.</p>
        </section>
      </div>
    </React.Fragment>
  );
}

const _root = ReactDOM.createRoot(document.getElementById("root"));
function mount(){
  window.XM.applyAppearance();
  DATA = window.XM.loadData();
  _root.render(<CV/>);
}
mount();
/* re-render with the shared content once store.js finishes hydrating from Blob */
window.addEventListener("xm-updated", mount);
