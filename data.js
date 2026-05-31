/* Bilingual content for Ximena's portfolio. window.DATA = { es, en }.
   These are the DEFAULTS. The Admin panel saves overrides to localStorage
   (see store.js). Editing this file changes the permanent defaults. */
window.DATA = {
  es: {
    nav: { about:"Sobre mí", work:"Experiencia", skills:"Competencias", edu:"Educación", certs:"Certificaciones", contact:"Contacto", cv:"Descargar CV" },
    hero: {
      eyebrow:"Portafolio · 2026",
      first:"Ximena", last:"Córdoba",
      role:["Ingeniera Industrial","Análisis de datos","Gestión de procesos"],
      lede:"Especializada en la gestión eficiente de información y recursos. Combino el rigor del análisis con una mirada creativa: convierto datos en decisiones y procesos en resultados.",
      cta1:"Ver experiencia", cta2:"Contactar",
      scroll:"Desliza",
    },
    palette:["Senderismo","Fotografía","Pintura","Baile","Lectura"],
    about: {
      num:"01", title:"Sobre mí",
      lead:"Una profesional <em>versátil</em> que une la precisión de la ingeniería con la sensibilidad del detalle.",
      p1:"Ingeniera Industrial especializada en la gestión eficiente de información y recursos. Me destaco por mi adaptabilidad y habilidades de liderazgo, combinadas con una comunicación efectiva y una fuerte capacidad para trabajar en equipo.",
      p2:"Manejo múltiples tareas con una actitud comprometida y una gran atención al detalle. Mi enfoque es dinámico, proactivo y entusiasta, destacándome en el servicio al cliente con sólidos conocimientos digitales.",
      traits:["Análisis de datos","Gestión de procesos","Calidad y normatividad","Gestión de la información","Gestión de proyectos"],
    },
    work: {
      num:"02", title:"Experiencia", titleEm:"laboral",
      meta:"+6 años en gestión de procesos, calidad y análisis de datos en el sector farmacéutico.",
      expand:"Leer responsabilidades", collapse:"Ocultar",
      jobs:[
        {
          role:"Analista Venta al Público", company:"Outsourcing Farmacéutico Integral S.A.S",
          dates:"Ene 2025 — Actualidad", badge:"Actual",
          summary:"Identifico tendencias y evalúo resultados comerciales para apoyar la toma de decisiones estratégicas y optimizar márgenes.",
          bullets:[
            "Identificación de tendencias y líneas de trabajo para apoyar decisiones estratégicas.",
            "Evaluación de resultados comerciales y propuesta de estrategias para mejorar indicadores clave.",
            "Monitoreo de descuentos sobre ventas y diseño de planes de acción para optimizar márgenes.",
            "Análisis del comportamiento de productos y categorías para potenciar ventas.",
            "Seguimiento de facturas y monitoreo mensual de presupuesto frente al gasto ejecutado.",
            "Participación en mesas de trabajo para definir nuevos procesos y reestructurar modelos.",
            "Actualización de políticas, procedimientos e instructivos.",
          ],
        },
        {
          role:"Analista Procesos Administrativos · Farmacoepidemiología", company:"Audifarma S.A",
          dates:"Oct 2021 — Oct 2024", badge:"3 años",
          summary:"Consolidé y analicé información para informes gerenciales, lideré proyectos estratégicos y mantuve el sistema de gestión de calidad.",
          bullets:[
            "Consolidación y revisión de información con precisión y claridad en el 100% de los informes.",
            "Implementación y mantenimiento del sistema de gestión de calidad para procesos administrativos.",
            "Análisis de datos sobre consumo de medicamentos y dispositivos médicos para clientes internos y externos.",
            "Liderazgo de proyectos estratégicos con seguimiento de cronogramas y alertas oportunas.",
            "Coordinación de reuniones efectivas y mejoras continuas para resultados óptimos.",
            "Consolidación y presentación de la gestión gerencial mensual.",
          ],
        },
        {
          role:"Auxiliar Gestión de Competencias", company:"Audifarma S.A",
          dates:"Abr 2019 — Oct 2021", badge:"2.5 años",
          summary:"Diseñé estrategias de divulgación y un sistema de evaluación que elevó la participación por encima del 90%.",
          bullets:[
            "Sistema eficiente para programar y notificar evaluaciones, con participación superior al 90%.",
            "Estrategias de divulgación que incrementaron la comprensión de procesos en un 40%.",
            "Consolidación de información para informes, mejorando precisión y relevancia en un 20%.",
            "Coordinación de evaluaciones para colaboradores en período de prueba con retroalimentación oportuna.",
          ],
        },
        {
          role:"Practicante Organización y Métodos", company:"Papeles Nacionales S.A",
          dates:"Mar 2018 — Ene 2019", badge:"Práctica",
          summary:"Estructuré documentación y un sistema de archivo para auditorías del Sistema de Gestión Integrado.",
          bullets:[
            "Creación y estructuración de documentos según estándares de la compañía.",
            "Sistema de archivo efectivo para auditorías internas y externas.",
            "Documentación actualizada para la auditoría de certificación del Sistema de Gestión Integrado.",
            "Informe del estado documental e identificación de documentos en trámite y antiguos.",
            "Identificación de documentos con antigüedad superior a 3 años y actualización de bases de datos del personal.",
          ],
        },
        {
          role:"Asistente Administrativa", company:"Asesoría Jurídica Seguros Danesco",
          dates:"Jun 2011 — Jun 2012", badge:"",
          summary:"Garanticé el funcionamiento administrativo del área y un servicio al cliente con 95% de satisfacción.",
          bullets:[
            "Procedimientos que mejoraron la eficiencia administrativa en un 20%.",
            "Servicio al cliente eficaz con 95% de satisfacción.",
            "Revisión de procesos jurídicos garantizando el cumplimiento de plazos.",
            "Control financiero riguroso y gestión documental del área.",
          ],
        },
      ],
    },
    skills: {
      num:"03", title:"Competencias", titleEm:"digitales",
      lvlTitle:"Niveles de dominio", toolsTitle:"Herramientas & plataformas",
      levels:[
        { name:"Microsoft Office", lvl:"Avanzado", pct:95 },
        { name:"Google Workspace", lvl:"Avanzado", pct:90 },
        { name:"SAP · Business Intelligence", lvl:"Intermedio", pct:65 },
        { name:"Bizagi · Diseño de procesos", lvl:"Intermedio-alto", pct:78 },
        { name:"Análisis de datos", lvl:"Avanzado", pct:88 },
      ],
      tools:["Excel","Power Point","Word","Google Sheets","Forms","Drive","Outlook","Zoom","Google Meet","SAP BI","Bizagi","Diseño de procesos"],
    },
    langs: {
      num:"04", title:"Idiomas",
      items:[
        { name:"Español", sub:"Lengua materna", pct:100, note:"Comunicación fluida en todos los contextos profesionales." },
        { name:"Inglés", sub:"Nivel B2", pct:75, note:"Capacidad sólida de lectura, conversación y redacción técnica." },
      ],
    },
    edu: {
      num:"05", title:"Educación", subtitle:"Formación formal",
      items:[
        { yr:"2013 — 2019", deg:"Ingeniería Industrial", school:"Universidad Tecnológica de Pereira", note:"Pregrado" },
        { yr:"2008 — 2011", deg:"Bachiller Académico", school:"Gimnasio Norte del Valle", note:"Secundaria" },
        { yr:"1999 — 2008", deg:"Preescolar y Básica Primaria", school:"Colegio Cañaverales International School", note:"Primaria" },
      ],
    },
    certs: {
      num:"06", title:"Certificaciones", subtitle:"Educación informal y cursos",
      items:[
        { yr:"2011", deg:"Inglés — certificación nivel B1 (2011)", school:"Centro Cultural Colombo Americano", note:"Certificación" },
      ],
    },
    hobbies: { label:"Fuera del trabajo", items:["Senderismo","Fotografía","Pintura","Baile","Voleibol","Lectura","Amante de los perros"] },
    contact: {
      num:"07", title:"Trabajemos", titleEm:"juntos",
      rows:[
        { k:"Correo", v:"ximecordoba17@gmail.com", href:"mailto:ximecordoba17@gmail.com" },
        { k:"Celular", v:"(+57) 313 688 2415", href:"tel:+573136882415" },
        { k:"LinkedIn", v:"@ximena-a-cordoba-castro", href:"https://www.linkedin.com/in/ximena-a-cordoba-castro" },
        { k:"Ubicación", v:"Dosquebradas, Colombia", href:"" },
      ],
      foot:"Diseñado como portafolio profesional",
    },
  },

  en: {
    nav: { about:"About", work:"Experience", skills:"Skills", edu:"Education", certs:"Certifications", contact:"Contact", cv:"Download CV" },
    hero: {
      eyebrow:"Portfolio · 2026",
      first:"Ximena", last:"Córdoba",
      role:["Industrial Engineer","Data analysis","Process management"],
      lede:"Specialized in the efficient management of information and resources. I pair analytical rigor with a creative eye: turning data into decisions and processes into results.",
      cta1:"View experience", cta2:"Get in touch",
      scroll:"Scroll",
    },
    palette:["Hiking","Photography","Painting","Dancing","Reading"],
    about: {
      num:"01", title:"About me",
      lead:"A <em>versatile</em> professional uniting engineering precision with a sensitivity for detail.",
      p1:"Industrial Engineer specialized in the efficient management of information and resources. I stand out for my adaptability and leadership skills, combined with effective communication and a strong ability to work in teams.",
      p2:"I handle multiple tasks with a committed attitude and great attention to detail. My approach is dynamic, proactive and enthusiastic, excelling at customer service with solid digital skills.",
      traits:["Data analysis","Process management","Quality & compliance","Information management","Project management"],
    },
    work: {
      num:"02", title:"Work", titleEm:"experience",
      meta:"6+ years in process management, quality and data analysis in the pharmaceutical sector.",
      expand:"Read responsibilities", collapse:"Hide",
      jobs:[
        {
          role:"Retail Sales Analyst", company:"Outsourcing Farmacéutico Integral S.A.S",
          dates:"Jan 2025 — Present", badge:"Current",
          summary:"I identify trends and evaluate commercial results to support strategic decisions and optimize margins.",
          bullets:[
            "Identifying trends and work streams to support strategic decision-making.",
            "Evaluating commercial results and proposing strategies to improve key indicators.",
            "Monitoring discounts on sales and designing action plans to optimize margins.",
            "Analyzing product and category behavior to boost sales.",
            "Tracking invoices and monthly budget vs. actual spend monitoring.",
            "Active participation in working groups to define new processes and restructure models.",
            "Updated policies, procedures and work instructions.",
          ],
        },
        {
          role:"Administrative Process Analyst · Pharmacoepidemiology", company:"Audifarma S.A",
          dates:"Oct 2021 — Oct 2024", badge:"3 yrs",
          summary:"Consolidated and analyzed information for management reports, led strategic projects and maintained the quality management system.",
          bullets:[
            "Consolidating and reviewing information with precision and clarity across 100% of reports.",
            "Implementing and maintaining the quality management system for administrative processes.",
            "Analyzing data on medication and medical device consumption for internal and external clients.",
            "Leading strategic projects with schedule tracking and timely alerts.",
            "Coordinating effective meetings and continuous improvements for optimal results.",
            "Consolidated and presented monthly managerial reporting.",
          ],
        },
        {
          role:"Competency Management Assistant", company:"Audifarma S.A",
          dates:"Apr 2019 — Oct 2021", badge:"2.5 yrs",
          summary:"Designed outreach strategies and an assessment system that raised participation above 90%.",
          bullets:[
            "Efficient system to schedule and notify assessments, with over 90% participation.",
            "Outreach strategies that increased process understanding by 40%.",
            "Consolidating information for reports, improving accuracy and relevance by 20%.",
            "Coordinating assessments for employees on probation with timely feedback.",
          ],
        },
        {
          role:"Organization & Methods Intern", company:"Papeles Nacionales S.A",
          dates:"Mar 2018 — Jan 2019", badge:"Internship",
          summary:"Structured documentation and a filing system for Integrated Management System audits.",
          bullets:[
            "Creating and structuring documents according to company standards.",
            "Effective filing system for internal and external audits.",
            "Updated documentation for the Integrated Management System certification audit.",
            "Report on documentary status, identifying pending and outdated documents.",
            "Flagged documents over 3 years old and kept personnel databases up to date.",
          ],
        },
        {
          role:"Administrative Assistant", company:"Asesoría Jurídica Seguros Danesco",
          dates:"Jun 2011 — Jun 2012", badge:"",
          summary:"Ensured the administrative operation of the area and customer service with 95% satisfaction.",
          bullets:[
            "Procedures that improved administrative efficiency by 20%.",
            "Effective customer service with 95% satisfaction.",
            "Reviewing legal processes ensuring deadlines were met.",
            "Rigorous financial control and documentary management of the area.",
          ],
        },
      ],
    },
    skills: {
      num:"03", title:"Digital", titleEm:"skills",
      lvlTitle:"Proficiency levels", toolsTitle:"Tools & platforms",
      levels:[
        { name:"Microsoft Office", lvl:"Advanced", pct:95 },
        { name:"Google Workspace", lvl:"Advanced", pct:90 },
        { name:"SAP · Business Intelligence", lvl:"Intermediate", pct:65 },
        { name:"Bizagi · Process design", lvl:"Upper-intermediate", pct:78 },
        { name:"Data analysis", lvl:"Advanced", pct:88 },
      ],
      tools:["Excel","Power Point","Word","Google Sheets","Forms","Drive","Outlook","Zoom","Google Meet","SAP BI","Bizagi","Process design"],
    },
    langs: {
      num:"04", title:"Languages",
      items:[
        { name:"Spanish", sub:"Native", pct:100, note:"Fluent communication across all professional contexts." },
        { name:"English", sub:"Level B2", pct:75, note:"Solid reading, conversation and technical writing skills." },
      ],
    },
    edu: {
      num:"05", title:"Education", subtitle:"Formal education",
      items:[
        { yr:"2013 — 2019", deg:"Industrial Engineering", school:"Universidad Tecnológica de Pereira", note:"Degree" },
        { yr:"2008 — 2011", deg:"High School Diploma", school:"Gimnasio Norte del Valle", note:"Secondary" },
        { yr:"1999 — 2008", deg:"Preschool & Primary School", school:"Colegio Cañaverales International School", note:"Primary" },
      ],
    },
    certs: {
      num:"06", title:"Certifications", subtitle:"Informal education & courses",
      items:[
        { yr:"2011", deg:"English — B1 certification (2011)", school:"Centro Cultural Colombo Americano", note:"Certification" },
      ],
    },
    hobbies: { label:"Off the clock", items:["Hiking","Photography","Painting","Dancing","Volleyball","Reading","Dog lover"] },
    contact: {
      num:"07", title:"Let's work", titleEm:"together",
      rows:[
        { k:"Email", v:"ximecordoba17@gmail.com", href:"mailto:ximecordoba17@gmail.com" },
        { k:"Phone", v:"(+57) 313 688 2415", href:"tel:+573136882415" },
        { k:"LinkedIn", v:"@ximena-a-cordoba-castro", href:"https://www.linkedin.com/in/ximena-a-cordoba-castro" },
        { k:"Location", v:"Dosquebradas, Colombia", href:"" },
      ],
      foot:"Designed as a professional portfolio",
    },
  },
};
