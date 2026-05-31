const { useState, useEffect, useRef } = React;

/* apply saved appearance (fonts + palette) + theme before render */
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

/* oil palette comes from the store (admin can change preset).
   `let` so mount() can refresh them when the shared content hydrates. */
let PAL_ARR = window.XM.paletteArr();
let PAL = {
  "--terracotta":PAL_ARR[0], "--ochre":PAL_ARR[1], "--sap":PAL_ARR[2],
  "--cobalt":PAL_ARR[3], "--plum":PAL_ARR[4],
};

/* organic paint-dab blobs */
const BLOBS = [
  "M48 8c14 2 30 11 33 26 3 15-9 27-21 35-13 9-31 16-43 7C4 67-2 49 3 34 8 18 24 9 38 8c4 0 7 0 10 0z",
  "M50 6c16 4 33 14 31 31-2 16-20 22-34 28-13 6-29 9-37-3C2 49 4 30 16 19 27 9 38 3 50 6z",
  "M52 9c15 5 26 18 24 33-2 16-17 24-31 30-15 6-33 8-40-6C-2 51 6 31 19 20 31 9 41 5 52 9z",
];
function Dab({ color="#C5552F", i=0, style, className="" }){
  const d = BLOBS[i % BLOBS.length];
  return (
    <span className={"dab "+className} style={style}>
      <svg viewBox="0 0 88 88" preserveAspectRatio="xMidYMid meet">
        <path d={d} fill={color}/>
      </svg>
    </span>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ t, lang, setLang }){
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(()=>{
    const f = ()=> setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, {passive:true});
    return ()=> window.removeEventListener("scroll", f);
  },[]);
  const close = ()=> setMenu(false);
  return (
    <nav className={"nav"+(scrolled?" scrolled":"")+(menu?" menu-open":"")}>
      <a href="#top" className="brand" onClick={close}>
        <Dab color={PAL["--terracotta"]} i={0} style={{width:14,height:14}}/>
        {t.hero.first} <span style={{color:"var(--ink-faint)",fontWeight:400}}>{t.hero.last}</span>
      </a>
      <button className="menu-btn" aria-label="Menú" aria-expanded={menu} onClick={()=>setMenu(m=>!m)}>
        <span></span><span></span><span></span>
      </button>
      <div className={"nav-links"+(menu?" open":"")}>
        <a href="#about" onClick={close}>{t.nav.about}</a>
        <a href="#work" onClick={close}>{t.nav.work}</a>
        <a href="#skills" onClick={close}>{t.nav.skills}</a>
        <a href="#edu" onClick={close}>{t.nav.edu}</a>
        <a href="#contact" onClick={close}>{t.nav.contact}</a>
        <a href="cv.html" className="cv-btn" onClick={close}>{t.nav.cv} <span>↓</span></a>
        <div className="lang">
          <button className={lang==="es"?"on":""} onClick={()=>setLang("es")}>ES</button>
          <button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button>
        </div>
        <ThemeToggle/>
      </div>
    </nav>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ t }){
  const ref = useRef(null);
  useEffect(()=>{ const id=requestAnimationFrame(()=>ref.current&&ref.current.classList.add("ready")); return ()=>cancelAnimationFrame(id); },[]);
  const dabSpots = [
    {top:"12%", left:"6%", size:96, i:0, rot:"-12deg", c:1},
    {top:"66%", left:"2%", size:60, i:1, rot:"18deg", c:2},
    {top:"8%", right:"30%", size:48, i:2, rot:"10deg", c:3},
    {bottom:"14%", right:"6%", size:78, i:0, rot:"-8deg", c:0},
    {top:"40%", right:"2%", size:42, i:1, rot:"24deg", c:4},
  ];
  return (
    <header className="hero" id="top" ref={ref}>
      <div className="hero-dabs">
        {dabSpots.map((s,idx)=>(
          <Dab key={idx} color={PAL_ARR[s.c]} i={s.i}
            style={{top:s.top,left:s.left,right:s.right,bottom:s.bottom,width:s.size,height:s.size,"--rot":s.rot}}/>
        ))}
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-eyebrow fade f1">{t.hero.eyebrow}<Dab color={PAL["--ochre"]} i={1} style={{width:12,height:12}}/></div>
            <div className="hero-namerow">
              <h1>
                <span className="ln"><span>{t.hero.first}</span></span>
                <span className="ln"><span><em>{t.hero.last}</em></span></span>
              </h1>
              <div className="hero-avatar fade f1">
                <img src={window.XM.photoUrl() || "photo-placeholder.svg"} alt="Ximena Córdoba"
                  onError={(e)=>{ if(e.currentTarget.src.indexOf("photo-placeholder.svg")<0) e.currentTarget.src="photo-placeholder.svg"; }}/>
              </div>
            </div>
            <div className="hero-role fade f2">
              {t.hero.role.map((r,i)=>(
                <React.Fragment key={i}>
                  {i>0 && <span className="sep">/</span>}
                  <span>{r}</span>
                </React.Fragment>
              ))}
            </div>
            <p className="hero-lede fade f3">{t.hero.lede}</p>
            <div className="hero-cta fade f4">
              <a href="#work" className="btn btn-solid">{t.hero.cta1} <span>→</span></a>
              <a href="#contact" className="btn btn-ghost">{t.hero.cta2}</a>
            </div>
          </div>

          <div className="portrait-wrap">
            <div className="portrait-frame"></div>
            <div className="portrait">
              <image-slot id="ximena-portrait" shape="rect" fit="cover"
                src={window.XM.photoUrl() || "photo-placeholder.svg"}
                placeholder="Ximena Córdoba"></image-slot>
            </div>
            <div className="palette-strip" aria-hidden="true">
              {PAL_ARR.map((c,i)=>(
                <div className="chip" key={i} style={{background:c}}>
                  <span className="tip">{t.palette[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-hint"><span className="ln"></span>{t.hero.scroll}</div>
    </header>
  );
}

/* ---------------- ABOUT ---------------- */
function About({ t }){
  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="num">{t.about.num}</span> {t.about.title}</div>
        <div className="about-grid" style={{marginTop:34}}>
          <h2 className="about-lead reveal reveal-d1" dangerouslySetInnerHTML={{__html:t.about.lead}}></h2>
        </div>
        <div className="about-body">
          <div className="col reveal reveal-d2">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>
          <div className="col reveal reveal-d3">
            <div className="traits">
              {t.about.traits.map((tr,i)=><span className="trait" key={i}>{tr}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WORK ---------------- */
function Job({ job, idx, t, color }){
  const [open, setOpen] = useState(false);
  return (
    <div className="exp-reveal reveal">
      <div className={"exp"+(open?" open":"")} style={{"--accent":color}} onClick={()=>setOpen(o=>!o)}>
        <div className="idx"><span className="dot"></span>{String(idx+1).padStart(2,"0")}</div>
        <div className="role">
          <h3>{job.role}</h3>
          <div className="company">{job.company}</div>
          <div className="dates">{job.dates}</div>
          {job.badge && <span className="badge">{job.badge}</span>}
        </div>
        <div className="detail">
          <p className="summary">{job.summary}</p>
          <ul className="bullets">
            {job.bullets.map((b,i)=><li key={i}>{b}</li>)}
          </ul>
          <span className="toggle">
            <span className="pm">+</span>{open ? t.work.collapse : t.work.expand}
          </span>
        </div>
      </div>
    </div>
  );
}
function Work({ t }){
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="exp-head">
          <div>
            <div className="eyebrow reveal"><span className="num">{t.work.num}</span> {t.work.title}</div>
            <h2 className="section-title reveal reveal-d1" style={{marginTop:18}}>
              {t.work.title} <em>{t.work.titleEm}</em>
            </h2>
          </div>
          <div className="meta reveal reveal-d2" style={{whiteSpace:"pre-line"}}>{t.work.meta}</div>
        </div>
        <div className="exp-list">
          {t.work.jobs.map((j,i)=>(
            <Job key={i} job={j} idx={i} t={t} color={PAL_ARR[i % PAL_ARR.length]}/>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SKILLS ---------------- */
function Meter({ s, color }){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const io = new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){ el.style.width = s.pct+"%"; io.disconnect(); }});
    },{threshold:.4});
    io.observe(el); return ()=>io.disconnect();
  },[s.pct]);
  return (
    <div className="meter">
      <div className="top"><span className="name">{s.name}</span><span className="lvl">{s.lvl}</span></div>
      <div className="track"><div className="fill" ref={ref} style={{background:color}}></div></div>
    </div>
  );
}
function Skills({ t }){
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="num">{t.skills.num}</span> {t.skills.title} {t.skills.titleEm}</div>
        <h2 className="section-title reveal reveal-d1" style={{marginTop:18, marginBottom:60}}>
          {t.skills.title} <em>{t.skills.titleEm}</em>
        </h2>
        <div className="skills-grid">
          <div className="skill-block reveal reveal-d2">
            <h4><Dab color={PAL["--terracotta"]} i={0} style={{width:13,height:13}}/>{t.skills.lvlTitle}</h4>
            {t.skills.levels.map((s,i)=><Meter key={i} s={s} color={PAL_ARR[i % PAL_ARR.length]}/>)}
          </div>
          <div className="skill-block reveal reveal-d3">
            <h4><Dab color={PAL["--cobalt"]} i={1} style={{width:13,height:13}}/>{t.skills.toolsTitle}</h4>
            <div className="tools">
              {t.skills.tools.map((tool,i)=>(
                <span className="tool" key={i} style={{"--accent":PAL_ARR[i%PAL_ARR.length]}}>{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- LANGUAGES ---------------- */
function Ring({ pct, color }){
  const r=42, c=2*Math.PI*r;
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    el.style.strokeDashoffset=c;
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){ el.style.strokeDashoffset=c*(1-pct/100); io.disconnect(); }});
    },{threshold:.5});
    io.observe(el); return ()=>io.disconnect();
  },[pct]);
  return (
    <div className="ring">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--paper-deep)" strokeWidth="7"/>
        <circle ref={ref} cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={c} style={{transition:"stroke-dashoffset 1.3s cubic-bezier(.16,1,.3,1)"}}/>
      </svg>
      <div className="pct">{pct}%</div>
    </div>
  );
}
function Languages({ t }){
  return (
    <section className="section" id="langs">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="num">{t.langs.num}</span> {t.langs.title}</div>
        <h2 className="section-title reveal reveal-d1" style={{marginTop:18, marginBottom:54}}>{t.langs.title}</h2>
        <div className="lang-grid">
          {t.langs.items.map((l,i)=>(
            <div className="lang-card reveal" style={{transitionDelay:`${.12*i}s`}} key={i}>
              <Ring pct={l.pct} color={PAL_ARR[i % PAL_ARR.length]}/>
              <div className="info">
                <h3>{l.name}</h3>
                <div className="sub">{l.sub}</div>
                <p>{l.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EDUCATION + CERTS (shared) ---------------- */
function RecordList({ data, id }){
  return (
    <section className="section" id={id}>
      <div className="wrap">
        <div className="eyebrow reveal"><span className="num">{data.num}</span> {data.title}</div>
        <h2 className="section-title reveal reveal-d1" style={{marginTop:18}}>{data.title}</h2>
        {data.subtitle && <div className="section-sub reveal reveal-d1">{data.subtitle}</div>}
        <div className="edu-list" style={{marginTop:46}}>
          {data.items.map((e,i)=>(
            <div className="edu reveal" style={{transitionDelay:`${.07*i}s`,"--accent":PAL_ARR[i%PAL_ARR.length]}} key={i}>
              <div className="yr">{e.yr}</div>
              <div className="deg"><h3>{e.deg}</h3><div className="school">{e.school}</div></div>
              <div className="note">{e.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- HOBBIES STRIP ---------------- */
function Hobbies({ t }){
  const items = t.hobbies.items;
  const loop = [...items, ...items];
  return (
    <section className="hobbies">
      <div className="label">{t.hobbies.label}</div>
      <div className="marquee">
        {loop.map((h,i)=>(
          <span className="item" key={i}>{h}<Dab color={PAL_ARR[i%PAL_ARR.length]} i={i%3} style={{width:18,height:18}}/></span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact({ t }){
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="num">{t.contact.num}</span> {t.contact.title} {t.contact.titleEm}</div>
        <h2 className="big reveal reveal-d1" style={{marginTop:24}}>{t.contact.title} <em>{t.contact.titleEm}</em></h2>
        <div className="contact-rows reveal reveal-d2">
          {t.contact.rows.map((r,i)=>{
            const inner = (<><span className="k">{r.k}</span><span className="v">{r.v} {r.href && <span className="arrow">↗</span>}</span></>);
            return r.href
              ? <a className="crow" href={r.href} target="_blank" rel="noopener" key={i}>{inner}</a>
              : <div className="crow" key={i}>{inner}</div>;
          })}
        </div>
        <div className="reveal reveal-d3" style={{marginTop:46}}>
          <a href="cv.html" className="btn btn-solid">{t.nav.cv} <span>↓</span></a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer({ t }){
  return (
    <footer className="footer wrap">
      <span>© 2026 {t.hero.first} {t.hero.last} — {t.contact.foot}</span>
      <span className="dabs">{PAL_ARR.map((c,i)=><span key={i} style={{background:c}}></span>)}</span>
    </footer>
  );
}

/* ---------------- APP ---------------- */
let DATA = window.XM.loadData();

function App(){
  const [lang, setLang] = useState(()=> localStorage.getItem("xm-lang") || "es");
  useEffect(()=>{ localStorage.setItem("xm-lang", lang); document.documentElement.lang = lang; },[lang]);
  const t = DATA[lang];

  const [prog, setProg] = useState(0);
  useEffect(()=>{
    const f = ()=>{
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProg(max>0 ? (h.scrollTop/max)*100 : 0);
    };
    f(); window.addEventListener("scroll", f, {passive:true});
    return ()=> window.removeEventListener("scroll", f);
  },[]);

  useEffect(()=>{
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }});
    },{threshold:.14, rootMargin:"0px 0px -8% 0px"});
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[lang]);

  return (
    <React.Fragment>
      <div className="progress" style={{width:prog+"%"}}></div>
      <Nav t={t} lang={lang} setLang={setLang}/>
      <Hero t={t} key={"hero-"+lang}/>
      <About t={t}/>
      <Work t={t}/>
      <Skills t={t}/>
      <Languages t={t}/>
      <RecordList data={t.edu} id="edu"/>
      <RecordList data={t.certs} id="certs"/>
      <Hobbies t={t}/>
      <Contact t={t}/>
      <Footer t={t}/>
    </React.Fragment>
  );
}

const _root = ReactDOM.createRoot(document.getElementById("root"));
function mount(){
  window.XM.applyAppearance();
  DATA = window.XM.loadData();
  PAL_ARR = window.XM.paletteArr();
  PAL = {
    "--terracotta":PAL_ARR[0], "--ochre":PAL_ARR[1], "--sap":PAL_ARR[2],
    "--cobalt":PAL_ARR[3], "--plum":PAL_ARR[4],
  };
  _root.render(<App/>);
}
mount();
/* re-render with the shared content once store.js finishes hydrating from Blob */
window.addEventListener("xm-updated", mount);
