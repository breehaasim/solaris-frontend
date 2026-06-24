import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import axios from "axios";

// ─── API ───────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "https://solaris-backend-production-b44b.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const apiGet  = (path)        => api.get(path).then(r => r.data);
const apiPost = (path, body)  => api.post(path, body).then(r => r.data);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const Y = {
  50:"#FFFBEB",100:"#FEF3C7",200:"#FDE68A",300:"#FCD34D",
  400:"#FBBF24",500:"#F59E0B",600:"#D97706",700:"#B45309",
  800:"#92400E",900:"#78350F",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{background:#050400;color:#fff;font-family:'Rajdhani',system-ui,sans-serif;overflow-x:hidden;}
  input,textarea,select{font-family:inherit;color:#fff;}
  input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25);}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
  @keyframes neonPulse{
    0%,100%{text-shadow:0 0 8px #F59E0B,0 0 24px #F59E0B50,0 0 48px #F59E0B20;}
    50%{text-shadow:0 0 18px #FBBF24,0 0 48px #F59E0B70,0 0 90px #F59E0B40;}
  }
  @keyframes gradientBorder{
    0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}
  }
  @keyframes floatY{0%,100%{transform:translateY(0px);}50%{transform:translateY(-12px);}}
  @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .neon-heading{animation:neonPulse 3.5s ease-in-out infinite;}
  .neon-btn{
    position:relative;overflow:hidden;
    box-shadow:0 0 20px #F59E0B50,0 0 40px #F59E0B20,inset 0 0 20px #F59E0B08;
    transition:all 0.35s cubic-bezier(0.22,1,0.36,1);
  }
  .neon-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent,rgba(255,255,255,0.08));opacity:0;transition:opacity 0.3s;}
  .neon-btn:hover{box-shadow:0 0 32px #FBBF2490,0 0 64px #F59E0B50,0 0 100px #F59E0B20,inset 0 0 24px #F59E0B15;transform:translateY(-3px);}
  .neon-btn:hover::before{opacity:1;}
  .card-hover{transition:transform 0.4s cubic-bezier(0.22,1,0.36,1),box-shadow 0.4s ease,border-color 0.3s;}
  .card-hover:hover{transform:translateY(-10px);box-shadow:0 32px 80px rgba(0,0,0,0.6),0 0 0 1px #B4530940;border-color:#D97706!important;}
  .img-zoom{overflow:hidden;}
  .img-zoom img{transition:transform 0.8s cubic-bezier(0.22,1,0.36,1),filter 0.5s ease;will-change:transform;}
  .img-zoom:hover img{transform:scale(1.08);filter:brightness(1.1) saturate(1.15);}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:#0a0800;}
  ::-webkit-scrollbar-thumb{background:#B45309;border-radius:2px;}
  .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
  .team-border::before{
    content:'';position:absolute;inset:-1px;border-radius:25px;
    background:linear-gradient(135deg,#F59E0B,#B45309,#F59E0B,#78350F);
    background-size:300% 300%;animation:gradientBorder 4s ease infinite;
    opacity:0;transition:opacity 0.4s;z-index:0;
  }
  .team-border:hover::before{opacity:1;}
  .mobile-menu-btn{display:none!important;}
  @media(max-width:768px){
    .hide-mobile{display:none!important;}
    .mobile-full{width:100%!important;}
    .mobile-menu-btn{display:flex!important;}
  }
`;

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {id:"home",label:"Home"},{id:"services",label:"Services"},
  {id:"about",label:"About"},{id:"team",label:"Team"},
  {id:"faq",label:"FAQ"},{id:"contact",label:"Contact"},
  {id:"admin",label:"Admin"},
];

// ─── STATIC FALLBACK DATA ─────────────────────────────────────────────────────
const FALLBACK_SERVICES = [
  {number:"01",title:"Residential Solar Systems",description:"End-to-end home solar installation from site survey and structural assessment through panel installation, inverter setup, battery storage, and utility interconnection.",tags:["Rooftop PV","Battery","Net Metering"]},
  {number:"02",title:"Commercial & Industrial",description:"Large-scale solar deployments for factories, warehouses, and commercial estates — designed to offset peak demand charges and achieve energy independence.",tags:["Ground Mount","Carport","BESS"]},
  {number:"03",title:"Smart Energy Management",description:"AI-powered energy management systems that predict consumption patterns, automate load shifting, and maximise self-consumption from on-site generation.",tags:["EMS","AI Forecasting","IoT"]},
  {number:"04",title:"Project Finance & Carbon",description:"Structured finance solutions, green bond advisory, and carbon credit monetisation strategies that turn renewable assets into investment-grade revenue streams.",tags:["Green Finance","Carbon Credits","ROI"]},
];

const FALLBACK_TEAM = [
  {name:"Breeha",role:"Founder & CEO",img:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",bio:"Solar energy visionary with 12 years shaping renewable policy and hyperscale PV deployments across Asia-Pacific.",skills:["Strategy","Vision","Solar Policy"]},
  {name:"Talha",role:"Chief Technology Officer",img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",bio:"Power electronics researcher turned grid-integration architect. Published 8 IEEE papers on MPPT optimisation algorithms.",skills:["Power Electronics","R&D","Grid Tech"]},
  {name:"Asim",role:"Head of Engineering",img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",bio:"Ex-Siemens principal engineer who designed PV systems powering 500,000+ homes across three continents.",skills:["Structural Eng","Project Mgmt","CAD"]},
  {name:"Laiba",role:"Smart Systems Lead",img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",bio:"IoT architect specialising in energy management systems, predictive AI, and real-time SCADA dashboards.",skills:["IoT","AI/ML","SCADA"]},
  {name:"Wajeeha",role:"Sustainability Director",img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",bio:"Climate finance expert who has structured $400M+ in green bonds and carbon monetisation programmes.",skills:["Carbon Credits","ESG","Green Finance"]},
  {name:"Mudasir",role:"Operations Manager",img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",bio:"O&M specialist overseeing 850+ active installations with drone-assisted thermal inspection protocols.",skills:["O&M","Logistics","Quality"]},
];

const FALLBACK_FAQS = [
  {question:"What types of solar systems do you install?",answer:"We design and install residential rooftop systems (3–30 kW), commercial & industrial ground-mount arrays (50 kW–10 MW), carport canopies, and off-grid hybrid systems with battery storage."},
  {question:"How long does a residential installation take?",answer:"A standard home installation takes 1–3 days on-site following a 2–3 week design, permitting, and procurement phase. Commercial projects range from 4–16 weeks depending on scale."},
  {question:"What warranties do you offer?",answer:"We provide a 25-year panel power warranty, 10-year inverter warranty, and our own 5-year workmanship guarantee. Battery storage systems carry a 10-year capacity warranty."},
  {question:"Can you handle utility interconnection?",answer:"Yes. Our team manages the entire grid interconnection process including net metering applications, utility coordination, and final commissioning inspection sign-offs."},
  {question:"Do you offer financing options?",answer:"We partner with green energy lenders to offer solar loans, leases, and power purchase agreements (PPAs) with $0 down options for qualified customers."},
];

const FALLBACK_PRICING = [
  {title:"Seed",price:"$0",features:["1 Project","Community Support","Basic Analytics"],hot:false},
  {title:"Growth",price:"$49",features:["Unlimited Projects","Priority Support","Advanced Analytics","API Access"],hot:true},
  {title:"Orbit",price:"$199",features:["Custom Domain","24/7 Phone Support","Dedicated Manager","White-Label"],hot:false},
];

const STATS = [
  {value:"850",label:"Installations",suffix:"+"},
  {value:"120",label:"MW Deployed",suffix:"MW"},
  {value:"99.7",label:"Uptime Rate",suffix:"%"},
  {value:"42",label:"Countries Served",suffix:""},
];

const ACHIEVEMENTS = [
  {icon:"🏆",value:"850",suffix:"+",label:"Installations",desc:"Successful solar deployments across 42 countries"},
  {icon:"⚡",value:"120",suffix:"MW",label:"Capacity Deployed",desc:"Clean energy powering hundreds of thousands of homes"},
  {icon:"🌿",value:"98",suffix:"k+",label:"Tonnes CO₂ Offset",desc:"Measurable climate impact since 2015"},
  {icon:"🌐",value:"42",suffix:"",label:"Countries Served",desc:"Global reach with local engineering expertise"},
];

const HERO_SLIDES = [
  {img:"https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1800&auto=format&fit=crop",tag:"SOLAR ENERGY",title:["Harnessing the","Sun's Power"],sub:"Next-generation photovoltaic systems delivering clean, scalable energy for a sustainable tomorrow."},
  {img:"https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1800&auto=format&fit=crop",tag:"SMART GRID",title:["Intelligent","Energy Networks"],sub:"AI-driven grid management optimising energy distribution across residential and commercial ecosystems."},
  {img:"https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1800&auto=format&fit=crop",tag:"FUTURE VISION",title:["Sustainable","Architecture"],sub:"Engineering eco-first building systems that generate, store, and intelligently manage solar energy at scale."},
];

const FEATURES = [
  {icon:"☀",title:"Solar Array Design",desc:"Custom photovoltaic system architecture optimised for maximum irradiance capture across any site topology."},
  {icon:"⚡",title:"Smart Inverters",desc:"MPPT-enabled intelligent inverters with real-time grid-sync, fault detection, and remote diagnostics."},
  {icon:"🔋",title:"Battery Storage",desc:"Modular lithium-iron-phosphate storage banks with 15,000+ cycle lifespans and BMS-controlled balancing."},
  {icon:"🌐",title:"Grid Integration",desc:"Bidirectional metering and virtual power plant capabilities for seamless utility-scale grid participation."},
  {icon:"📡",title:"Remote Monitoring",desc:"Cloud-connected SCADA dashboards delivering granular performance telemetry with 99.9% data availability."},
  {icon:"🏗",title:"Structural Engineering",desc:"Wind-load rated mounting systems engineered for rooftop, ground-mount, and carport solar installations."},
  {icon:"♻",title:"Carbon Analytics",desc:"Real-time CO₂ offset tracking and sustainability reporting aligned to GHG Protocol standards."},
  {icon:"🔧",title:"O&M Services",desc:"Preventive maintenance scheduling, drone-assisted thermal inspections, and performance guarantee SLAs."},
];

const PROJECTS = [
  {tag:"Commercial Solar",title:"Project Helios",desc:"Industrial estate — 4.2 MW ground-mount array with integrated BESS serving 800+ units.",img:"https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop"},
  {tag:"Smart Grid Integration",title:"Project Aurora",desc:"Urban microgrid — AI-managed virtual power plant across 240 residential rooftop systems.",img:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop"},
];

const GALLERY = [
  {src:"https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=600&auto=format&fit=crop",title:"Rooftop Solar Array",tag:"Commercial",desc:"High-efficiency monocrystalline panels on a commercial rooftop, delivering 48 kW of clean energy daily."},
  {src:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop",title:"Smart Grid Network",tag:"Smart Grid",desc:"AI-managed microgrid connecting 120 residential units with real-time load balancing."},
  {src:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop",title:"Battery Storage Unit",tag:"Storage",desc:"200 kWh LFP battery bank providing 12-hour backup power for an industrial facility."},
  {src:"https://images.unsplash.com/photo-1624397640148-949b1732bb0a?q=80&w=600&auto=format&fit=crop",title:"Eco-Smart Residence",tag:"Residential",desc:"Zero-carbon home with 18-panel array achieving 95% energy self-sufficiency year-round."},
];

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────
const fadeUp = {
  initial:{opacity:0,y:36},whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:"-60px"},transition:{duration:0.75,ease:[0.22,1,0.36,1]},
};
const stagger = {
  initial:{},whileInView:{transition:{staggerChildren:0.1}},viewport:{once:true,margin:"-40px"},
};
const child = {
  initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},
  transition:{duration:0.65,ease:[0.22,1,0.36,1]},
};

// ─── SPINNER ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"60px 0"}}>
      <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${Y[900]}`,borderTopColor:Y[400],animation:"spin 0.8s linear infinite"}}/>
    </div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedCounter({target,suffix="",duration=2000}) {
  const [count,setCount]=useState(0);
  const ref=useRef(null);
  const inView=useInView(ref,{once:true,margin:"-80px"});
  const started=useRef(false);
  useEffect(()=>{
    if(!inView||started.current) return;
    started.current=true;
    const num=parseFloat(String(target).replace(/[^0-9.]/g,""));
    const isFloat=String(target).includes(".");
    const start=performance.now();
    const tick=(now)=>{
      const elapsed=now-start;
      const progress=Math.min(elapsed/duration,1);
      const eased=1-Math.pow(1-progress,3);
      const cur=isFloat?(eased*num).toFixed(1):Math.round(eased*num);
      setCount(cur);
      if(progress<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },[inView,target,duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── SECTION LABEL & HEADER ───────────────────────────────────────────────────
function SectionLabel({children}) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:10,fontWeight:700,letterSpacing:"0.38em",textTransform:"uppercase",color:Y[400],background:`${Y[900]}80`,border:`1px solid ${Y[700]}60`,padding:"5px 16px",borderRadius:999,textShadow:`0 0 12px ${Y[500]}80`}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:Y[400],display:"inline-block",boxShadow:`0 0 8px ${Y[400]}`,animation:"pulse 2s infinite"}}/>
      {children}
    </span>
  );
}

function SectionHeader({label,title,subtitle}) {
  return (
    <motion.div {...fadeUp} style={{textAlign:"center",marginBottom:72}}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="neon-heading" style={{marginTop:20,marginBottom:16,fontSize:"clamp(2rem,4.5vw,3.2rem)",fontWeight:900,lineHeight:1.05,letterSpacing:"-0.03em",color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic"}}>{title}</h2>
      <div style={{width:56,height:3,background:`linear-gradient(90deg,${Y[400]},${Y[600]})`,margin:"0 auto 20px",borderRadius:2,boxShadow:`0 0 12px ${Y[500]}`}}/>
      {subtitle&&<p style={{color:"rgba(255,255,255,0.42)",maxWidth:520,margin:"0 auto",fontSize:13,lineHeight:1.8,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{subtitle}</p>}
    </motion.div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function SolarisLogo({onClick}) {
  return (
    <motion.div onClick={onClick} whileHover={{scale:1.04}} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",userSelect:"none"}}>
      <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
        <defs>
          <radialGradient id="lg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FBBF24"/><stop offset="100%" stopColor="#B45309"/></radialGradient>
          <filter id="lglow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="url(#lg)" filter="url(#lglow)"/>
        <polygon points="16,8 22,11.5 22,18.5 16,22 10,18.5 10,11.5" fill="#050400"/>
        <polygon points="16,12 19,13.7 19,17.3 16,19 13,17.3 13,13.7" fill="url(#lg)"/>
      </svg>
      <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",fontWeight:900,fontSize:20,color:"#FBBF24",letterSpacing:"-0.02em",textShadow:`0 0 12px #F59E0B,0 0 30px #F59E0B50`}}>Solaris</span>
    </motion.div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({active,setActive,scrolled}) {
  const [menuOpen,setMenuOpen]=useState(false);
  const handleNav=(id)=>{setActive(id);setMenuOpen(false);};
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:300,background:scrolled?"rgba(5,4,0,0.95)":"transparent",backdropFilter:scrolled?"blur(24px)":"none",WebkitBackdropFilter:scrolled?"blur(24px)":"none",borderBottom:scrolled?`1px solid ${Y[900]}60`:"none",padding:scrolled?"14px 0":"26px 0",transition:"all 0.4s ease"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <SolarisLogo onClick={()=>handleNav("home")}/>
        <div className="hide-mobile" style={{display:"flex",gap:28,alignItems:"center"}}>
          {NAV_ITEMS.map(item=>(
            <button key={item.id} onClick={()=>handleNav(item.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:"0.3em",textTransform:"uppercase",color:active===item.id?Y[400]:"rgba(255,255,255,0.42)",borderBottom:active===item.id?`1px solid ${Y[500]}`:"1px solid transparent",textShadow:active===item.id?`0 0 12px ${Y[500]}`:"none",transition:"all 0.25s",padding:"4px 0"}}
              onMouseEnter={e=>{if(active!==item.id)e.currentTarget.style.color="rgba(255,255,255,0.75)";}}
              onMouseLeave={e=>{if(active!==item.id)e.currentTarget.style.color="rgba(255,255,255,0.42)";}}>
              {item.label}
            </button>
          ))}
          <button className="neon-btn" onClick={()=>handleNav("contact")} style={{background:`linear-gradient(135deg,${Y[400]},${Y[600]})`,border:"none",cursor:"pointer",padding:"9px 22px",borderRadius:999,fontSize:10,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:"#000"}}>Initialize →</button>
        </div>
        <button className="mobile-menu-btn" onClick={()=>setMenuOpen(o=>!o)} style={{background:"none",border:`1px solid rgba(255,255,255,0.15)`,borderRadius:8,padding:"8px 12px",cursor:"pointer",color:Y[400],fontSize:18,alignItems:"center",justifyContent:"center"}}>{menuOpen?"✕":"☰"}</button>
      </div>
      <AnimatePresence>
        {menuOpen&&(
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{background:"rgba(5,4,0,0.98)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${Y[900]}60`,overflow:"hidden"}}>
            <div style={{padding:"16px 24px",display:"flex",flexDirection:"column",gap:4}}>
              {NAV_ITEMS.map(item=>(
                <button key={item.id} onClick={()=>handleNav(item.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,letterSpacing:"0.25em",textTransform:"uppercase",color:active===item.id?Y[400]:"rgba(255,255,255,0.55)",textAlign:"left",padding:"12px 0",borderBottom:`1px solid rgba(255,255,255,0.06)`}}>{item.label}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────
function HeroSlider({setPage}) {
  const [current,setCurrent]=useState(0);
  const [direction,setDirection]=useState(1);
  const timerRef=useRef(null);
  const go=useCallback((idx)=>{setDirection(idx>current?1:-1);setCurrent(idx);},[current]);
  const next=useCallback(()=>{setDirection(1);setCurrent(c=>(c+1)%HERO_SLIDES.length);},[]);
  const prev=useCallback(()=>{setDirection(-1);setCurrent(c=>(c-1+HERO_SLIDES.length)%HERO_SLIDES.length);},[]);
  useEffect(()=>{
    timerRef.current=setInterval(()=>{setDirection(1);setCurrent(c=>(c+1)%HERO_SLIDES.length);},5500);
    return ()=>clearInterval(timerRef.current);
  },[]);
  const slide=HERO_SLIDES[current];
  const variants={
    enter:(dir)=>({opacity:0,x:dir>0?60:-60,scale:1.04}),
    center:{opacity:1,x:0,scale:1},
    exit:(dir)=>({opacity:0,x:dir>0?-60:60,scale:0.98}),
  };
  return (
    <section style={{minHeight:"100vh",position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <AnimatePresence custom={direction} mode="wait">
        <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{duration:1,ease:[0.22,1,0.36,1]}} style={{position:"absolute",inset:0,zIndex:0}}>
          <motion.img src={slide.img} initial={{scale:1.08}} animate={{scale:1}} transition={{duration:6,ease:"linear"}} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block"}} alt={slide.tag}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(5,4,0,0.15) 0%,rgba(5,4,0,0.05) 35%,rgba(5,4,0,0.45) 72%,rgba(5,4,0,0.92) 100%)"}}/>
        </motion.div>
      </AnimatePresence>
      <div style={{position:"relative",zIndex:10,textAlign:"center",padding:"0 24px",maxWidth:900,margin:"0 auto"}}>
        <AnimatePresence mode="wait">
          <motion.div key={`content-${current}`} initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.7,delay:0.2}}>
            <motion.span initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.3,duration:0.5}} style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:9,fontWeight:900,letterSpacing:"0.5em",textTransform:"uppercase",color:Y[400],background:`${Y[900]}90`,border:`1px solid ${Y[700]}80`,padding:"6px 20px",borderRadius:999,marginBottom:28,boxShadow:`0 0 24px ${Y[500]}30`,textShadow:`0 0 10px ${Y[400]}`}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:Y[400],display:"inline-block",boxShadow:`0 0 8px ${Y[400]}`,animation:"pulse 1.8s infinite"}}/>
              {slide.tag}
            </motion.span>
            <h1 style={{fontSize:"clamp(2.6rem,7.5vw,6.5rem)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.04em",color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:24,textShadow:"0 4px 32px rgba(0,0,0,0.5)"}}>
              {slide.title[0]}<br/>
              <span className="neon-heading" style={{background:`linear-gradient(135deg,${Y[300]},${Y[500]},${Y[600]})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>{slide.title[1]}</span>
            </h1>
            <p style={{color:"rgba(255,255,255,0.62)",fontSize:"clamp(13px,1.8vw,16px)",fontWeight:500,letterSpacing:"0.05em",maxWidth:540,margin:"0 auto 36px",lineHeight:1.75}}>{slide.sub}</p>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="neon-btn" onClick={()=>setPage("services")} style={{background:`linear-gradient(135deg,${Y[400]},${Y[600]})`,border:"none",cursor:"pointer",padding:"13px 32px",borderRadius:999,fontSize:11,fontWeight:900,letterSpacing:"0.28em",textTransform:"uppercase",color:"#000"}}>Get Started →</button>
              <button onClick={()=>setPage("about")} style={{background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.2)`,cursor:"pointer",padding:"13px 32px",borderRadius:999,fontSize:11,fontWeight:900,letterSpacing:"0.28em",textTransform:"uppercase",color:"rgba(255,255,255,0.75)",transition:"all 0.3s",backdropFilter:"blur(10px)"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.14)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";}}>Our Story</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {[{action:prev,icon:"←",pos:{left:28}},{action:next,icon:"→",pos:{right:28}}].map(({action,icon,pos})=>(
        <button key={icon} onClick={action} style={{position:"absolute",top:"50%",transform:"translateY(-50%)",zIndex:20,width:50,height:50,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.18)`,color:Y[300],fontSize:18,cursor:"pointer",backdropFilter:"blur(10px)",transition:"all 0.3s",...pos}} onMouseEnter={e=>{e.currentTarget.style.background=`${Y[700]}50`;e.currentTarget.style.borderColor=Y[500];}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";}}>
          {icon}
        </button>
      ))}
      <div style={{position:"absolute",bottom:90,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,zIndex:20}}>
        {HERO_SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>go(i)} style={{width:i===current?30:8,height:8,borderRadius:4,border:"none",cursor:"pointer",background:i===current?Y[400]:"rgba(255,255,255,0.28)",transition:"all 0.35s ease",boxShadow:i===current?`0 0 12px ${Y[500]}`:"none"}}/>
        ))}
      </div>
      <motion.div animate={{y:[0,9,0]}} transition={{repeat:Infinity,duration:2.2}} style={{position:"absolute",bottom:42,left:"50%",transform:"translateX(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{width:1,height:36,background:`linear-gradient(to bottom,transparent,${Y[500]})`,boxShadow:`0 0 8px ${Y[500]}`}}/>
        <span style={{fontSize:8,letterSpacing:"0.5em",color:Y[600],fontWeight:800,textTransform:"uppercase"}}>Scroll</span>
      </motion.div>
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({setPage}) {
  return (
    <>
      <HeroSlider setPage={setPage}/>
      <section style={{background:`linear-gradient(135deg,${Y[900]},#1a1000)`,padding:"72px 24px",borderTop:`1px solid ${Y[800]}60`,borderBottom:`1px solid ${Y[800]}60`}}>
        <div style={{maxWidth:1080,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32}}>
          {STATS.map((s,i)=>(
            <motion.div key={i} {...child} style={{textAlign:"center"}}>
              <div className="neon-heading" style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:900,color:Y[400],fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:"-0.04em"}}><AnimatedCounter target={s.value} suffix={s.suffix}/></div>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.35em",color:"rgba(255,255,255,0.32)",textTransform:"uppercase",marginTop:8}}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
      <section style={{padding:"120px 24px",background:"#050400"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader label="The Engine" title="Core Systems" subtitle="Full-spectrum solar & energy technology"/>
          <motion.div variants={stagger} initial="initial" whileInView="whileInView" viewport={{once:true}} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:24}}>
            {FEATURES.map((f,i)=>(
              <motion.div key={i} variants={child} className="card-hover" style={{background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.07)`,borderRadius:22,padding:"38px 34px",cursor:"default",backdropFilter:"blur(10px)"}}>
                <div style={{width:52,height:52,borderRadius:14,background:Y[900],border:`1px solid ${Y[800]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:26,boxShadow:`0 0 16px ${Y[700]}30`}}>{f.icon}</div>
                <h4 style={{fontSize:13,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.2em",color:"#fff",marginBottom:10,fontStyle:"italic"}}>{f.title}</h4>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.38)",lineHeight:1.75,fontWeight:500}}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section style={{padding:"100px 24px",background:"#080600"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader label="Archive" title="Deployment Log" subtitle="Selected Projects — 2026"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:28}}>
            {PROJECTS.map((p,i)=>(
              <motion.div key={i} {...fadeUp} className="img-zoom" style={{position:"relative",height:400,borderRadius:28,overflow:"hidden",border:`1px solid rgba(255,255,255,0.08)`,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 32px 80px rgba(0,0,0,0.6)`;}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
                <img src={p.img} alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.92),rgba(0,0,0,0.2) 55%,transparent)"}}/>
                <div style={{position:"absolute",bottom:36,left:36,right:36}}>
                  <span style={{fontSize:9,fontWeight:900,letterSpacing:"0.45em",color:Y[400],textTransform:"uppercase",display:"block",marginBottom:10}}>{p.tag}</span>
                  <h4 className="neon-heading" style={{fontSize:30,fontWeight:900,letterSpacing:"-0.03em",color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginBottom:10}}>{p.title}</h4>
                  <p style={{fontSize:9,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.2em",lineHeight:1.7,fontWeight:700}}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"80px 24px",background:"#050400"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader label="Our Work" title="Solar in Action" subtitle="Real installations, real impact"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:22}}>
            {GALLERY.map((item,i)=>(
              <motion.div key={i} {...fadeUp} transition={{delay:i*0.1}} style={{borderRadius:20,overflow:"hidden",border:`1px solid rgba(255,255,255,0.08)`,background:"rgba(255,255,255,0.03)",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",transition:"all 0.4s cubic-bezier(0.22,1,0.36,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-10px)";e.currentTarget.style.boxShadow=`0 28px 64px rgba(0,0,0,0.6)`;e.currentTarget.style.borderColor=`${Y[700]}90`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.4)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
                <div className="img-zoom" style={{height:195,position:"relative",overflow:"hidden"}}>
                  <img src={item.src} alt={item.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 45%,rgba(5,4,0,0.55) 100%)"}}/>
                  <span style={{position:"absolute",top:12,left:12,fontSize:9,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:Y[400],background:`${Y[900]}CC`,border:`1px solid ${Y[700]}`,padding:"4px 10px",borderRadius:999,backdropFilter:"blur(10px)"}}>{item.tag}</span>
                </div>
                <div style={{padding:"20px 22px 24px"}}>
                  <h4 style={{fontSize:16,fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginBottom:9,letterSpacing:"-0.01em"}}>{item.title}</h4>
                  <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.78,fontWeight:500,marginBottom:14}}>{item.desc}</p>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:22,height:2,background:`linear-gradient(90deg,${Y[400]},${Y[600]})`,borderRadius:1,boxShadow:`0 0 6px ${Y[500]}`}}/>
                    <span style={{fontSize:9,fontWeight:900,letterSpacing:"0.3em",color:Y[500],textTransform:"uppercase"}}>View Project</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"100px 24px",background:`linear-gradient(135deg,${Y[900]},#0d0900)`,textAlign:"center"}}>
        <motion.div {...fadeUp}>
          <SectionLabel>Ready to Deploy?</SectionLabel>
          <h2 className="neon-heading" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:900,letterSpacing:"-0.03em",color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginTop:24,marginBottom:18}}>Start Your Solar Journey</h2>
          <p style={{color:"rgba(255,255,255,0.42)",fontSize:13,letterSpacing:"0.15em",textTransform:"uppercase",maxWidth:400,margin:"0 auto 40px",lineHeight:1.8,fontWeight:600}}>Connect with our engineering team and initialize your renewable energy transition today.</p>
          <button className="neon-btn" onClick={()=>setPage("contact")} style={{background:`linear-gradient(135deg,${Y[400]},${Y[600]})`,border:"none",cursor:"pointer",padding:"15px 40px",borderRadius:999,fontSize:11,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:"#000"}}>Establish Contact →</button>
        </motion.div>
      </section>
    </>
  );
}

// ─── SERVICES PAGE — dynamic from backend ────────────────────────────────────
function ServicesPage({setPage}) {
  const [services,setServices]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{
    setLoading(true);
    apiGet("/services")
      .then(res=>{
        const data=Array.isArray(res.data)&&res.data.length>0?res.data:FALLBACK_SERVICES;
        setServices(data);
      })
      .catch(()=>{ setError("Showing default services."); setServices(FALLBACK_SERVICES); })
      .finally(()=>setLoading(false));
  },[]);

  return (
    <div style={{paddingTop:120}}>
      <section style={{padding:"80px 24px 120px",background:"#050400"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <SectionHeader label="What We Build" title="Our Services" subtitle="End-to-end solar & energy solutions"/>
          {error&&<div style={{textAlign:"center",marginBottom:32,padding:"10px 20px",borderRadius:10,background:"rgba(251,191,36,0.08)",border:`1px solid ${Y[700]}`,color:Y[400],fontSize:12,fontWeight:700}}>⚠ {error}</div>}
          {loading?<Spinner/>:(
            <motion.div variants={stagger} initial="initial" whileInView="whileInView" viewport={{once:true}} style={{display:"flex",flexDirection:"column",gap:0}}>
              {services.map((s,i)=>(
                <motion.div key={s._id||i} variants={child} style={{display:"flex",gap:44,alignItems:"flex-start",padding:"48px 0",borderBottom:`1px solid rgba(255,255,255,0.06)`,cursor:"pointer"}} whileHover={{x:14}} onClick={()=>setPage("contact")}>
                  <span style={{fontSize:"clamp(2.8rem,5vw,4.5rem)",fontWeight:900,color:Y[800],fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1,minWidth:72,flexShrink:0}}>{s.number}</span>
                  <div style={{flex:1}}>
                    <h3 style={{fontSize:"clamp(1.2rem,2.5vw,1.7rem)",fontWeight:900,color:"#fff",letterSpacing:"-0.02em",marginBottom:12,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic"}}>{s.title}</h3>
                    <p style={{fontSize:14,color:"rgba(255,255,255,0.45)",lineHeight:1.8,maxWidth:560,fontWeight:500}}>{s.description}</p>
                    <div style={{display:"flex",gap:8,marginTop:18,flexWrap:"wrap"}}>
                      {(s.tags||[]).map(t=><span key={t} style={{fontSize:9,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:Y[400],background:Y[900],border:`1px solid ${Y[800]}`,padding:"5px 12px",borderRadius:999}}>{t}</span>)}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:20}}>
                      <span style={{fontSize:10,fontWeight:900,letterSpacing:"0.3em",color:Y[500],textTransform:"uppercase"}}>Inquire →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      <section style={{padding:"100px 24px",background:"#080600"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="How It Works" title="The Protocol" subtitle="Our four-phase engagement"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20}}>
            {[
              {phase:"Phase I",title:"Site Survey",desc:"Irradiance analysis, structural assessment, and consumption audit to baseline your energy profile."},
              {phase:"Phase II",title:"System Design",desc:"Custom PV system architecture, technology selection, and ROI modelling with 25-year projections."},
              {phase:"Phase III",title:"Installation",desc:"Certified installer teams executing zero-downtime deployments with real-time quality monitoring."},
              {phase:"Phase IV",title:"Monitoring & O&M",desc:"Cloud-connected performance dashboards, preventive maintenance, and performance guarantee SLAs."},
            ].map((p,i)=>(
              <motion.div key={i} {...fadeUp} transition={{delay:i*0.1}} style={{padding:"40px 32px",borderRadius:22,background:i%2===0?`${Y[900]}40`:"rgba(255,255,255,0.03)",border:`1px solid ${i%2===0?Y[800]:"rgba(255,255,255,0.07)"}`,transition:"box-shadow 0.3s,border-color 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 30px ${Y[900]}`;e.currentTarget.style.borderColor=Y[700];}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=i%2===0?Y[800]:"rgba(255,255,255,0.07)";}}>
                <span style={{fontSize:9,fontWeight:900,letterSpacing:"0.4em",color:Y[500],textTransform:"uppercase",display:"block",marginBottom:16}}>{p.phase}</span>
                <h4 style={{fontSize:20,fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginBottom:12}}>{p.title}</h4>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.75,fontWeight:500}}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── PRICING PAGE — dynamic from backend ─────────────────────────────────────
function PricingPage({setPage}) {
  const [plans,setPlans]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    apiGet("/pricing")
      .then(res=>{
        const data=Array.isArray(res.data)&&res.data.length>0?res.data:FALLBACK_PRICING;
        setPlans(data);
      })
      .catch(()=>setPlans(FALLBACK_PRICING))
      .finally(()=>setLoading(false));
  },[]);

  return (
    <div style={{paddingTop:120}}>
      <section style={{padding:"80px 24px 120px",background:"#050400"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="Pricing" title="Choose Your Plan" subtitle="Transparent, scalable pricing"/>
          {loading?<Spinner/>:(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
              {plans.map((p,i)=>(
                <motion.div key={p._id||i} {...fadeUp} transition={{delay:i*0.1}} style={{borderRadius:24,padding:"40px 32px",background:p.hot?`linear-gradient(135deg,${Y[900]},#1a1000)`:"rgba(255,255,255,0.03)",border:`1px solid ${p.hot?Y[600]:"rgba(255,255,255,0.08)"}`,position:"relative",boxShadow:p.hot?`0 0 40px ${Y[700]}30`:"none",transition:"transform 0.3s,box-shadow 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px)";e.currentTarget.style.boxShadow=`0 24px 60px rgba(0,0,0,0.5)`;}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=p.hot?`0 0 40px ${Y[700]}30`:"none";}}>
                  {p.hot&&<span style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${Y[400]},${Y[600]})`,color:"#000",fontSize:9,fontWeight:900,letterSpacing:"0.3em",padding:"4px 16px",borderRadius:999}}>MOST POPULAR</span>}
                  <h3 style={{fontSize:22,fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginBottom:8}}>{p.title}</h3>
                  <div style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:900,color:Y[400],fontFamily:"'Playfair Display',Georgia,serif",marginBottom:24,textShadow:`0 0 20px ${Y[500]}50`}}>{p.price}</div>
                  <ul style={{listStyle:"none",padding:0,margin:"0 0 32px",display:"flex",flexDirection:"column",gap:12}}>
                    {(p.features||[]).map((f,fi)=>(
                      <li key={fi} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"rgba(255,255,255,0.65)",fontWeight:600}}>
                        <span style={{color:Y[400],fontSize:14}}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button className="neon-btn" onClick={()=>setPage("contact")} style={{width:"100%",background:p.hot?`linear-gradient(135deg,${Y[400]},${Y[600]})`:"rgba(255,255,255,0.08)",border:p.hot?"none":`1px solid rgba(255,255,255,0.15)`,cursor:"pointer",padding:"12px",borderRadius:12,fontSize:11,fontWeight:900,letterSpacing:"0.25em",textTransform:"uppercase",color:p.hot?"#000":"rgba(255,255,255,0.7)"}}>
                    Get Started →
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div style={{paddingTop:100}}>
      <section style={{padding:"80px 24px 100px",background:"#050400"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:64,alignItems:"center"}}>
          <motion.div {...fadeUp}>
            <SectionLabel>Who We Are</SectionLabel>
            <h2 className="neon-heading" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",fontWeight:900,letterSpacing:"-0.04em",color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginTop:20,marginBottom:22,lineHeight:1.05}}>The Clean Energy<br/>Engineering Company</h2>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.5)",lineHeight:1.85,marginBottom:18}}>Founded in 2015, Solaris has grown from a rooftop installer to a full-spectrum renewable energy engineering firm. We operate across 42 countries, delivering solar systems that redefine what clean power can achieve.</p>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.5)",lineHeight:1.85}}>Our 120+ engineers, project managers, and sustainability specialists have collectively deployed 120 MW of clean capacity — enough to power 50,000 homes.</p>
          </motion.div>
          <motion.div initial={{opacity:0,scale:0.92}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.9}} className="img-zoom" style={{borderRadius:28,overflow:"hidden",border:`1px solid ${Y[800]}60`,boxShadow:`0 0 60px ${Y[900]}60`}}>
            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=900&auto=format&fit=crop" alt="Solar panels" style={{width:"100%",height:460,objectFit:"cover",display:"block"}}/>
          </motion.div>
        </div>
      </section>
      <section style={{padding:"72px 24px",background:`linear-gradient(135deg,${Y[900]},#0d0900)`}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32}}>
          {STATS.map((s,i)=>(
            <motion.div key={i} {...fadeUp} transition={{delay:i*0.1}} style={{textAlign:"center"}}>
              <div className="neon-heading" style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:900,color:Y[300],fontFamily:"'Playfair Display',Georgia,serif"}}><AnimatedCounter target={s.value} suffix={s.suffix}/></div>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.32)",letterSpacing:"0.35em",textTransform:"uppercase",marginTop:8}}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
      <section style={{padding:"100px 24px",background:"#080600"}}>
        <div style={{maxWidth:880,margin:"0 auto",textAlign:"center"}}>
          <SectionHeader label="Mission" title="Why We Build"/>
          <motion.blockquote {...fadeUp} style={{fontSize:"clamp(1.15rem,2.5vw,1.7rem)",fontStyle:"italic",fontWeight:700,color:"rgba(255,255,255,0.7)",lineHeight:1.65,borderLeft:`4px solid ${Y[500]}`,paddingLeft:32,textAlign:"left",margin:"0 0 44px",boxShadow:`-4px 0 20px ${Y[500]}25`}}>
            "We believe clean energy should be engineered with the same precision as mission-critical infrastructure — invisible when it works, extraordinary when it needs to perform."
          </motion.blockquote>
          <motion.p {...fadeUp} style={{fontSize:15,color:"rgba(255,255,255,0.42)",lineHeight:1.85,textAlign:"left"}}>Every system we design is built on three principles: maximum yield, structural integrity, and operational simplicity. These are contractual commitments embedded in every SLA we sign.</motion.p>
        </div>
      </section>
    </div>
  );
}

// ─── TEAM CARD ────────────────────────────────────────────────────────────────
function TeamCard({member,index}) {
  const [hovered,setHovered]=useState(false);
  return (
    <motion.div initial={{opacity:0,y:48}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:index*0.1,ease:[0.22,1,0.36,1]}}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      className="team-border" style={{position:"relative",borderRadius:25}}>
      <motion.div animate={{y:hovered?-10:0,scale:hovered?1.02:1}} transition={{duration:0.4,ease:[0.22,1,0.36,1]}} style={{position:"relative",zIndex:1,borderRadius:24,overflow:"hidden",background:hovered?"linear-gradient(145deg,rgba(120,53,15,0.4),rgba(5,4,0,0.97))":"rgba(255,255,255,0.04)",border:hovered?`1px solid ${Y[600]}`:"1px solid rgba(255,255,255,0.08)",transition:"border-color 0.4s,background 0.4s",boxShadow:hovered?`0 32px 80px rgba(0,0,0,0.8),0 0 40px ${Y[700]}35`:"0 8px 32px rgba(0,0,0,0.3)"}}>
        <div className="img-zoom" style={{height:250,position:"relative"}}>
          <img src={member.img} alt={member.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
          <div style={{position:"absolute",inset:0,background:hovered?"linear-gradient(to top,rgba(5,4,0,1) 0%,rgba(5,4,0,0.35) 60%,transparent 100%)":"linear-gradient(to top,rgba(5,4,0,0.88) 0%,rgba(5,4,0,0.25) 65%,transparent 100%)",transition:"all 0.4s"}}/>
          <div style={{position:"absolute",top:14,right:14,background:`${Y[900]}CC`,border:`1px solid ${Y[700]}`,borderRadius:999,padding:"4px 12px",fontSize:9,fontWeight:900,letterSpacing:"0.3em",color:Y[400],textTransform:"uppercase",backdropFilter:"blur(10px)"}}>{member.role}</div>
        </div>
        <div style={{padding:"26px 26px 22px"}}>
          <h3 style={{fontSize:22,fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginBottom:6,textShadow:hovered?`0 0 20px ${Y[500]}50`:"none",transition:"text-shadow 0.4s"}}>{member.name}</h3>
          <AnimatePresence>
            {hovered&&<motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.65,marginBottom:14,overflow:"hidden",fontWeight:500}}>{member.bio}</motion.p>}
          </AnimatePresence>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
            {(member.skills||[]).map(s=><span key={s} style={{fontSize:9,fontWeight:900,letterSpacing:"0.22em",color:hovered?Y[300]:Y[500],background:Y[900],border:`1px solid ${hovered?Y[700]:Y[800]}`,padding:"4px 10px",borderRadius:999,textTransform:"uppercase",transition:"all 0.3s"}}>{s}</span>)}
          </div>
          <motion.div animate={{opacity:hovered?1:0,y:hovered?0:8}} transition={{duration:0.3,delay:0.1}} style={{display:"flex",gap:9}}>
            {(member.social?.twitter||member.social?.linkedin||member.social?.github)?[
              member.social?.twitter&&{icon:"𝕏",link:member.social.twitter},
              member.social?.linkedin&&{icon:"in",link:member.social.linkedin},
              member.social?.github&&{icon:"⌨",link:member.social.github},
            ].filter(Boolean).map((s,i)=>(
              <a key={i} href={s.link} target="_blank" rel="noopener noreferrer" style={{width:34,height:34,borderRadius:"50%",background:Y[900],border:`1px solid ${Y[700]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:Y[400],cursor:"pointer",textDecoration:"none",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.background=Y[700];}} onMouseLeave={e=>{e.currentTarget.style.background=Y[900];}}>{s.icon}</a>
            )):[
              "𝕏","in","⌨"
            ].map((icon,i)=>(
              <div key={i} style={{width:34,height:34,borderRadius:"50%",background:Y[900],border:`1px solid ${Y[700]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:Y[400],cursor:"pointer",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.background=Y[700];}} onMouseLeave={e=>{e.currentTarget.style.background=Y[900];}}>{icon}</div>
            ))}
          </motion.div>
        </div>
        <motion.div animate={{scaleX:hovered?1:0,opacity:hovered?1:0}} style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${Y[400]},${Y[600]},${Y[400]})`,transformOrigin:"left",boxShadow:`0 0 12px ${Y[500]}`}}/>
      </motion.div>
    </motion.div>
  );
}

// ─── TEAM PAGE — dynamic from backend ────────────────────────────────────────
function TeamPage() {
  const [teamMembers,setTeamMembers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{
    apiGet("/team")
      .then(res=>{
        const data=Array.isArray(res.data)&&res.data.length>0?res.data:FALLBACK_TEAM;
        setTeamMembers(data);
      })
      .catch(()=>{ setError("Showing default team."); setTeamMembers(FALLBACK_TEAM); })
      .finally(()=>setLoading(false));
  },[]);

  return (
    <div style={{paddingTop:100,background:"#050400"}}>
      <section style={{position:"relative",padding:"100px 24px 72px",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,zIndex:0}}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1800&auto=format&fit=crop" alt="Team background" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.55}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(5,4,0,0.55) 0%,rgba(5,4,0,0.1) 35%,rgba(5,4,0,0.1) 60%,rgba(5,4,0,0.75) 100%)"}}/>
        </div>
        <div style={{position:"relative",zIndex:2,textAlign:"center",maxWidth:820,margin:"0 auto"}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}><SectionLabel>The Team</SectionLabel></motion.div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.15}} className="neon-heading" style={{fontSize:"clamp(2.6rem,7vw,5.5rem)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.04em",color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginTop:22,marginBottom:22}}>
            Meet the<br/><span style={{background:`linear-gradient(135deg,${Y[300]},${Y[500]},${Y[700]})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Solar Architects</span>
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8,delay:0.3}} style={{color:"rgba(255,255,255,0.42)",fontSize:13,fontWeight:600,letterSpacing:"0.18em",textTransform:"uppercase",maxWidth:540,margin:"0 auto",lineHeight:1.95}}>Six specialists united by one mission: engineering the world's cleanest, most reliable solar infrastructure.</motion.p>
        </div>
      </section>
      <section style={{padding:"60px 24px 100px",background:"#080600"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          {error&&<div style={{textAlign:"center",marginBottom:32,padding:"10px 20px",borderRadius:10,background:"rgba(251,191,36,0.08)",border:`1px solid ${Y[700]}`,color:Y[400],fontSize:12,fontWeight:700}}>⚠ {error}</div>}
          {loading?<Spinner/>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:26}}>{teamMembers.map((m,i)=><TeamCard key={m._id||i} member={m} index={i}/>)}</div>}
        </div>
      </section>
      <section style={{padding:"80px 24px",background:`linear-gradient(135deg,${Y[900]},#0d0900)`}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="Impact" title="Proven Results" subtitle="Numbers that define our track record"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:22}}>
            {ACHIEVEMENTS.map((a,i)=>(
              <motion.div key={i} {...fadeUp} transition={{delay:i*0.1}} style={{textAlign:"center",padding:"40px 26px",borderRadius:22,background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:`1px solid ${Y[800]}`,transition:"box-shadow 0.3s,border-color 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 0 40px ${Y[700]}35`;e.currentTarget.style.borderColor=Y[600];}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=Y[800];}}>
                <div style={{fontSize:34,marginBottom:12}}>{a.icon}</div>
                <div className="neon-heading" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:900,color:Y[300],fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:"-0.04em",marginBottom:6}}><AnimatedCounter target={a.value} suffix={a.suffix}/></div>
                <div style={{fontSize:11,fontWeight:900,color:Y[500],letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:10}}>{a.label}</div>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.32)",lineHeight:1.65}}>{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── FAQ PAGE — dynamic from backend ─────────────────────────────────────────
function FAQItem({question,answer}) {
  const [open,setOpen]=useState(false);
  return (
    <motion.div layout style={{borderBottom:`1px solid rgba(255,255,255,0.07)`,cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"28px 0",gap:20}}>
        <h4 style={{fontSize:15,fontWeight:700,color:open?Y[300]:"rgba(255,255,255,0.8)",transition:"color 0.25s",flex:1,textShadow:open?`0 0 12px ${Y[400]}50`:"none"}}>{question}</h4>
        <motion.span animate={{rotate:open?45:0}} transition={{duration:0.3}} style={{fontSize:24,color:Y[500],flexShrink:0}}>+</motion.span>
      </div>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.35}} style={{overflow:"hidden"}}>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.45)",lineHeight:1.85,paddingBottom:28,fontWeight:500}}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQPage() {
  const [faqs,setFaqs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  useEffect(()=>{
    apiGet("/faq")
      .then(res=>{
        const data=Array.isArray(res.data)&&res.data.length>0?res.data:FALLBACK_FAQS;
        setFaqs(data);
      })
      .catch(()=>{ setError("Showing default FAQs."); setFaqs(FALLBACK_FAQS); })
      .finally(()=>setLoading(false));
  },[]);

  return (
    <div style={{paddingTop:120}}>
      <section style={{padding:"80px 24px 120px",background:"#050400"}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <SectionHeader label="Questions" title="Frequently Asked" subtitle="Everything you need to know"/>
          {error&&<div style={{textAlign:"center",marginBottom:32,padding:"10px 20px",borderRadius:10,background:"rgba(251,191,36,0.08)",border:`1px solid ${Y[700]}`,color:Y[400],fontSize:12,fontWeight:700}}>⚠ {error}</div>}
          {loading?<Spinner/>:faqs.map((item,i)=><FAQItem key={item._id||i} question={item.question} answer={item.answer}/>)}
        </div>
      </section>
    </div>
  );
}

// ─── CONTACT PAGE — fully connected to backend ────────────────────────────────
function ContactPage() {
  const [form,setForm]=useState({name:"",email:"",subject:"",message:""});
  const [sent,setSent]=useState(false);
  const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);

  const validate=()=>{
    const e={};
    if(!form.name.trim()) e.name="Name is required";
    if(!form.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email="Valid email required";
    if(!form.subject.trim()) e.subject="Subject is required";
    if(form.message.trim().length<10) e.message="Message must be at least 10 characters";
    return e;
  };

  const handleSubmit=async()=>{
    const e=validate();
    if(Object.keys(e).length){setErrors(e);return;}
    setErrors({});setLoading(true);
    try{
      await apiPost("/contact",form);
      setSent(true);
      setForm({name:"",email:"",subject:"",message:""});
    }catch(err){
      setErrors({api:err?.response?.data?.message||"Failed to send. Please try again."});
    }finally{setLoading(false);}
  };

  const inputStyle=(field)=>({width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${errors[field]?"#f87171":"rgba(255,255,255,0.12)"}`,borderRadius:12,padding:"13px 16px",fontSize:14,color:"#fff",outline:"none",transition:"border-color 0.2s,box-shadow 0.2s"});

  return (
    <div style={{paddingTop:120}}>
      <section style={{padding:"80px 24px 120px",background:"#050400"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionHeader label="Get In Touch" title="Send a Transmission" subtitle="Secure, direct line to our team"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:48}}>
            <motion.div {...fadeUp} style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:`1px solid rgba(255,255,255,0.08)`,borderRadius:26,padding:"44px 40px"}}>
              {sent?(
                <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} style={{textAlign:"center",padding:"60px 0"}}>
                  <div style={{fontSize:48,marginBottom:20}}>✓</div>
                  <h3 className="neon-heading" style={{color:Y[300],fontSize:22,fontWeight:900,fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",marginBottom:12}}>Message Sent!</h3>
                  <p style={{color:"rgba(255,255,255,0.42)",fontSize:13,lineHeight:1.75}}>Your message has been saved. We'll respond within 24 hours.</p>
                  <button onClick={()=>setSent(false)} style={{marginTop:24,background:"none",border:`1px solid ${Y[700]}`,color:Y[400],padding:"8px 20px",borderRadius:999,cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase"}}>Send Another</button>
                </motion.div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:18}}>
                  {errors.api&&<div style={{background:"rgba(248,113,113,0.12)",border:"1px solid #f87171",borderRadius:10,padding:"10px 14px"}}><p style={{fontSize:12,color:"#f87171",fontWeight:700}}>{errors.api}</p></div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {[["name","Full Name","text"],["email","Email","email"]].map(([field,label,type])=>(
                      <div key={field}>
                        <label style={{fontSize:9,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:Y[500],display:"block",marginBottom:8}}>{label}</label>
                        <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={inputStyle(field)} onFocus={e=>{e.target.style.borderColor=Y[500];e.target.style.boxShadow=`0 0 12px ${Y[500]}25`;}} onBlur={e=>{e.target.style.borderColor=errors[field]?"#f87171":"rgba(255,255,255,0.12)";e.target.style.boxShadow="none";}}/>
                        {errors[field]&&<p style={{fontSize:10,color:"#f87171",marginTop:4,fontWeight:700}}>{errors[field]}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{fontSize:9,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:Y[500],display:"block",marginBottom:8}}>Subject</label>
                    <input type="text" placeholder="Project Inquiry" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} style={inputStyle("subject")} onFocus={e=>{e.target.style.borderColor=Y[500];e.target.style.boxShadow=`0 0 12px ${Y[500]}25`;}} onBlur={e=>{e.target.style.borderColor=errors.subject?"#f87171":"rgba(255,255,255,0.12)";e.target.style.boxShadow="none";}}/>
                    {errors.subject&&<p style={{fontSize:10,color:"#f87171",marginTop:4,fontWeight:700}}>{errors.subject}</p>}
                  </div>
                  <div>
                    <label style={{fontSize:9,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:Y[500],display:"block",marginBottom:8}}>Message</label>
                    <textarea rows={5} placeholder="Tell us about your energy goals..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{...inputStyle("message"),resize:"vertical",fontFamily:"inherit"}} onFocus={e=>{e.target.style.borderColor=Y[500];e.target.style.boxShadow=`0 0 12px ${Y[500]}25`;}} onBlur={e=>{e.target.style.borderColor=errors.message?"#f87171":"rgba(255,255,255,0.12)";e.target.style.boxShadow="none";}}/>
                    {errors.message&&<p style={{fontSize:10,color:"#f87171",marginTop:4,fontWeight:700}}>{errors.message}</p>}
                  </div>
                  <button className="neon-btn" onClick={handleSubmit} disabled={loading} style={{background:loading?Y[800]:`linear-gradient(135deg,${Y[400]},${Y[600]})`,border:"none",cursor:loading?"not-allowed":"pointer",padding:"15px",borderRadius:12,fontSize:11,fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase",color:"#000",marginTop:6,opacity:loading?0.7:1,transition:"all 0.3s"}}>
                    {loading?"Sending…":"Send Message →"}
                  </button>
                </div>
              )}
            </motion.div>
            <motion.div {...fadeUp} transition={{delay:0.15}} style={{display:"flex",flexDirection:"column",gap:32,justifyContent:"center"}}>
              {[{icon:"✉",label:"Email",value:"breehaasim@gmail.com"},{icon:"☎",label:"Phone",value:"+92 300 0000000"},{icon:"◎",label:"Office",value:"Sahiwal Jail Road, Punjab"}].map((c,i)=>(
                <motion.div key={i} whileHover={{x:10}} style={{display:"flex",gap:18,alignItems:"center",cursor:"pointer"}}>
                  <div style={{width:54,height:54,borderRadius:16,background:Y[900],border:`1px solid ${Y[800]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:Y[400],flexShrink:0,transition:"background 0.3s,box-shadow 0.3s"}} onMouseEnter={e=>{e.currentTarget.style.background=Y[700];e.currentTarget.style.boxShadow=`0 0 20px ${Y[500]}50`;}} onMouseLeave={e=>{e.currentTarget.style.background=Y[900];e.currentTarget.style.boxShadow="none";}}>{c.icon}</div>
                  <div>
                    <p style={{fontSize:9,fontWeight:900,letterSpacing:"0.3em",color:"rgba(255,255,255,0.28)",textTransform:"uppercase",marginBottom:4}}>{c.label}</p>
                    <p style={{fontSize:15,fontWeight:700,color:"#fff"}}>{c.value}</p>
                  </div>
                </motion.div>
              ))}
              <div style={{borderRadius:18,overflow:"hidden",border:`1px solid ${Y[800]}60`,height:210,boxShadow:`0 0 20px ${Y[900]}60`}}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13745.244243632971!2d73.0886105!3d30.6621213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b624b5a26569%3A0x67399438096f6a7e!2sJail%20Rd%2C%20Sahiwal%2C%20Sahiwal%20District%2C%20Punjab!5e0!3m2!1sen!2spk!4v1714312345678!5m2!1sen!2spk"
                  style={{width:"100%",height:"100%",border:0,filter:"invert(90%) hue-rotate(180deg) brightness(0.55) saturate(0.5)",display:"block"}}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location"/>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── ADMIN MODALS ─────────────────────────────────────────────────────────────
function ServiceModal({data,onSave,onClose,inp,btn}) {
  const [form,setForm]=useState({number:data?.number||"",title:data?.title||"",description:data?.description||"",tags:(data?.tags||[]).join(", "),order:data?.order||0});
  const save=()=>onSave("/services",data?._id,{...form,tags:form.tags.split(",").map(t=>t.trim()).filter(Boolean)},"services");
  return (
    <div>
      <h3 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:22,fontWeight:900,marginBottom:24}}>{data?"Edit":"Add"} Service</h3>
      <input placeholder="Number (e.g. 01)" value={form.number} onChange={e=>setForm(f=>({...f,number:e.target.value}))} style={inp}/>
      <input placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inp}/>
      <textarea placeholder="Description" rows={4} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} style={{...inp,resize:"vertical"}}/>
      <input placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} style={inp}/>
      <input placeholder="Order (1,2,3...)" type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:Number(e.target.value)}))} style={inp}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button onClick={save} style={{...btn(),flex:1,padding:"12px"}}>Save →</button>
        <button onClick={onClose} style={{...btn("rgba(255,255,255,0.08)"),flex:1,padding:"12px",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)"}}>Cancel</button>
      </div>
    </div>
  );
}

function TeamModal({data,onSave,onClose,inp,btn}) {
  const [form,setForm]=useState({name:data?.name||"",role:data?.role||"",bio:data?.bio||"",img:data?.img||"",skills:(data?.skills||[]).join(", "),order:data?.order||0});
  const save=()=>onSave("/team",data?._id,{...form,skills:form.skills.split(",").map(s=>s.trim()).filter(Boolean)},"team");
  return (
    <div>
      <h3 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:22,fontWeight:900,marginBottom:24}}>{data?"Edit":"Add"} Team Member</h3>
      <input placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}/>
      <input placeholder="Role" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={inp}/>
      <textarea placeholder="Bio" rows={3} value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} style={{...inp,resize:"vertical"}}/>
      <input placeholder="Image URL" value={form.img} onChange={e=>setForm(f=>({...f,img:e.target.value}))} style={inp}/>
      <input placeholder="Skills (comma separated)" value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))} style={inp}/>
      <input placeholder="Order (1,2,3...)" type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:Number(e.target.value)}))} style={inp}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button onClick={save} style={{...btn(),flex:1,padding:"12px"}}>Save →</button>
        <button onClick={onClose} style={{...btn("rgba(255,255,255,0.08)"),flex:1,padding:"12px",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)"}}>Cancel</button>
      </div>
    </div>
  );
}

function FAQModal({data,onSave,onClose,inp,btn}) {
  const [form,setForm]=useState({question:data?.question||"",answer:data?.answer||"",order:data?.order||0});
  const save=()=>onSave("/faq",data?._id,form,"faqs");
  return (
    <div>
      <h3 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:22,fontWeight:900,marginBottom:24}}>{data?"Edit":"Add"} FAQ</h3>
      <input placeholder="Question" value={form.question} onChange={e=>setForm(f=>({...f,question:e.target.value}))} style={inp}/>
      <textarea placeholder="Answer" rows={4} value={form.answer} onChange={e=>setForm(f=>({...f,answer:e.target.value}))} style={{...inp,resize:"vertical"}}/>
      <input placeholder="Order (1,2,3...)" type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:Number(e.target.value)}))} style={inp}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button onClick={save} style={{...btn(),flex:1,padding:"12px"}}>Save →</button>
        <button onClick={onClose} style={{...btn("rgba(255,255,255,0.08)"),flex:1,padding:"12px",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)"}}>Cancel</button>
      </div>
    </div>
  );
}

function PricingModal({data,onSave,onClose,inp,btn}) {
  const [form,setForm]=useState({title:data?.title||"",price:data?.price||"",features:(data?.features||[]).join(", "),hot:data?.hot||false,order:data?.order||0});
  const save=()=>onSave("/pricing",data?._id,{...form,features:form.features.split(",").map(f=>f.trim()).filter(Boolean)},"pricings");
  return (
    <div>
      <h3 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:22,fontWeight:900,marginBottom:24}}>{data?"Edit":"Add"} Pricing Plan</h3>
      <input placeholder="Plan Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inp}/>
      <input placeholder="Price (e.g. $49)" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} style={inp}/>
      <textarea placeholder="Features (comma separated)" rows={3} value={form.features} onChange={e=>setForm(f=>({...f,features:e.target.value}))} style={{...inp,resize:"vertical"}}/>
      <label style={{display:"flex",alignItems:"center",gap:10,color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:700,marginBottom:10,cursor:"pointer"}}>
        <input type="checkbox" checked={form.hot} onChange={e=>setForm(f=>({...f,hot:e.target.checked}))} style={{width:16,height:16,accentColor:Y[500]}}/>
        Mark as Most Popular
      </label>
      <input placeholder="Order (1,2,3...)" type="number" value={form.order} onChange={e=>setForm(f=>({...f,order:Number(e.target.value)}))} style={inp}/>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button onClick={save} style={{...btn(),flex:1,padding:"12px"}}>Save →</button>
        <button onClick={onClose} style={{...btn("rgba(255,255,255,0.08)"),flex:1,padding:"12px",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)"}}>Cancel</button>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage() {
  const [token,setToken]=useState("");
  const [loginForm,setLoginForm]=useState({username:"",password:""});
  const [loginErr,setLoginErr]=useState("");
  const [logging,setLogging]=useState(false);
  const [tab,setTab]=useState("services");
  const [services,setServices]=useState([]);
  const [team,setTeam]=useState([]);
  const [faqs,setFaqs]=useState([]);
  const [pricings,setPricings]=useState([]);
  const [contacts,setContacts]=useState([]);
  const [loading,setLoading]=useState(false);
  const [modal,setModal]=useState(null);

  const authHeaders=useCallback(()=>({headers:{Authorization:`Bearer ${token}`}}),[token]);

  const handleLogin=async()=>{
    setLogging(true);setLoginErr("");
    try{
      const res=await api.post("/auth/login",loginForm);
      setToken(res.data.token);
    }catch(e){setLoginErr(e.response?.data?.message||"Login failed. Check credentials.");}
    finally{setLogging(false);}
  };

  const fetchTab=async(t)=>{
    setLoading(true);
    try{
      const map={services:"/services",team:"/team",faqs:"/faq",pricings:"/pricing",contacts:"/contact"};
      const res=t==="contacts"?await api.get(map[t],authHeaders()):await api.get(map[t]);
      if(t==="services") setServices(res.data.data||[]);
      if(t==="team")     setTeam(res.data.data||[]);
      if(t==="faqs")     setFaqs(res.data.data||[]);
      if(t==="pricings") setPricings(res.data.data||[]);
      if(t==="contacts") setContacts(res.data.data||[]);
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  useEffect(()=>{if(token) fetchTab(tab);},[tab,token]);

  const handleDelete=async(route,id,refresh)=>{
    if(!window.confirm("Delete this item?")) return;
    try{await api.delete(`${route}/${id}`,authHeaders());fetchTab(refresh);}
    catch(e){alert(e.response?.data?.message||"Delete failed");}
  };

  const handleSave=async(route,id,body,refresh)=>{
    try{
      if(id){await api.put(`${route}/${id}`,body,authHeaders());}
      else{await api.post(route,body,authHeaders());}
      setModal(null);fetchTab(refresh);
    }catch(e){alert(e.response?.data?.message||"Save failed");}
  };

  const card={background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.1)`,borderRadius:16,padding:"20px 24px",marginBottom:12};
  const inp={width:"100%",background:"rgba(255,255,255,0.07)",border:`1px solid rgba(255,255,255,0.15)`,borderRadius:10,padding:"10px 14px",fontSize:13,color:"#fff",outline:"none",marginBottom:10,fontFamily:"inherit"};
  const btn=(color=Y[500])=>({background:color,border:"none",borderRadius:8,padding:"8px 18px",fontSize:11,fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",color:color===Y[500]?"#000":"#fff"});

  if(!token) return (
    <div style={{paddingTop:120,minHeight:"100vh",background:"#050400",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <motion.div {...fadeUp} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${Y[700]}`,borderRadius:24,padding:"48px 40px",width:"100%",maxWidth:400}}>
        <SectionLabel>Admin Access</SectionLabel>
        <h2 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:28,fontWeight:900,margin:"16px 0 28px"}}>Sign In</h2>
        {loginErr&&<div style={{background:"rgba(248,113,113,0.12)",border:"1px solid #f87171",borderRadius:8,padding:"10px 14px",marginBottom:16}}><p style={{color:"#f87171",fontSize:12,fontWeight:700}}>{loginErr}</p></div>}
        <input placeholder="Username" value={loginForm.username} onChange={e=>setLoginForm(f=>({...f,username:e.target.value}))} style={inp}/>
        <input placeholder="Password" type="password" value={loginForm.password} onChange={e=>setLoginForm(f=>({...f,password:e.target.value}))} style={inp} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        <button onClick={handleLogin} disabled={logging} style={{...btn(),width:"100%",padding:"13px",fontSize:12,marginTop:8}}>{logging?"Signing in…":"Sign In →"}</button>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginTop:16,textAlign:"center"}}>Default: admin / solaris2026</p>
      </motion.div>
    </div>
  );

  const TABS=[{id:"services",label:"Services"},{id:"team",label:"Team"},{id:"faqs",label:"FAQs"},{id:"pricings",label:"Pricing"},{id:"contacts",label:"Contacts"}];

  return (
    <div style={{paddingTop:100,minHeight:"100vh",background:"#050400"}}>
      <div style={{background:`linear-gradient(135deg,${Y[900]},#0d0900)`,padding:"32px 24px",borderBottom:`1px solid ${Y[800]}40`}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><SectionLabel>Admin Panel</SectionLabel><h1 style={{color:"#fff",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:900,marginTop:12}}>Dashboard</h1></div>
          <button onClick={()=>setToken("")} style={{...btn("rgba(255,255,255,0.1)"),border:`1px solid rgba(255,255,255,0.2)`,color:"rgba(255,255,255,0.7)"}}>Log Out</button>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:40}}>
          {[{label:"Services",count:services.length,color:Y[500]},{label:"Team",count:team.length,color:Y[400]},{label:"FAQs",count:faqs.length,color:Y[300]},{label:"Pricing",count:pricings.length,color:Y[600]},{label:"Contacts",count:contacts.length,color:"#4ade80"}].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.08)`,borderRadius:14,padding:"20px",textAlign:"center"}}>
              <div style={{fontSize:32,fontWeight:900,color:s.color,fontFamily:"'Playfair Display',serif"}}>{s.count}</div>
              <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",letterSpacing:"0.3em",textTransform:"uppercase",marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{background:tab===t.id?`linear-gradient(135deg,${Y[500]},${Y[700]})`:"rgba(255,255,255,0.06)",border:tab===t.id?"none":`1px solid rgba(255,255,255,0.1)`,borderRadius:999,padding:"8px 20px",fontSize:11,fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",color:tab===t.id?"#000":"rgba(255,255,255,0.6)",transition:"all 0.2s"}}>{t.label}</button>
          ))}
        </div>
        {loading?<Spinner/>:(
          <>
            {tab==="services"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <h3 style={{color:"#fff",fontWeight:900,fontSize:18}}>Services ({services.length})</h3>
                  <button onClick={()=>setModal({type:"service",data:null})} style={btn()}>+ Add Service</button>
                </div>
                {services.length===0&&<p style={{color:"rgba(255,255,255,0.3)",textAlign:"center",padding:"40px 0"}}>No services yet. Add one!</p>}
                {services.map(s=>(
                  <div key={s._id} style={card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                      <div style={{flex:1}}>
                        <span style={{fontSize:9,color:Y[500],fontWeight:900,letterSpacing:"0.3em",textTransform:"uppercase"}}>{s.number}</span>
                        <h4 style={{color:"#fff",fontWeight:900,fontSize:15,margin:"4px 0 6px"}}>{s.title}</h4>
                        <p style={{color:"rgba(255,255,255,0.4)",fontSize:12,lineHeight:1.6}}>{s.description}</p>
                        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                          {(s.tags||[]).map(t=><span key={t} style={{fontSize:9,color:Y[400],background:Y[900],border:`1px solid ${Y[800]}`,padding:"3px 10px",borderRadius:999,fontWeight:700}}>{t}</span>)}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button onClick={()=>setModal({type:"service",data:s})} style={btn()}>Edit</button>
                        <button onClick={()=>handleDelete("/services",s._id,"services")} style={btn("#ef4444")}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab==="team"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <h3 style={{color:"#fff",fontWeight:900,fontSize:18}}>Team Members ({team.length})</h3>
                  <button onClick={()=>setModal({type:"team",data:null})} style={btn()}>+ Add Member</button>
                </div>
                {team.length===0&&<p style={{color:"rgba(255,255,255,0.3)",textAlign:"center",padding:"40px 0"}}>No team members yet. Add one!</p>}
                {team.map(m=>(
                  <div key={m._id} style={card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                      <div style={{display:"flex",gap:14,alignItems:"center",flex:1}}>
                        <img src={m.img} alt={m.name} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:`2px solid ${Y[700]}`}}/>
                        <div>
                          <h4 style={{color:"#fff",fontWeight:900,fontSize:15}}>{m.name}</h4>
                          <p style={{color:Y[400],fontSize:12,fontWeight:700}}>{m.role}</p>
                          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                            {(m.skills||[]).map(s=><span key={s} style={{fontSize:9,color:Y[500],background:Y[900],border:`1px solid ${Y[800]}`,padding:"2px 8px",borderRadius:999,fontWeight:700}}>{s}</span>)}
                          </div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button onClick={()=>setModal({type:"team",data:m})} style={btn()}>Edit</button>
                        <button onClick={()=>handleDelete("/team",m._id,"team")} style={btn("#ef4444")}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab==="faqs"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <h3 style={{color:"#fff",fontWeight:900,fontSize:18}}>FAQs ({faqs.length})</h3>
                  <button onClick={()=>setModal({type:"faq",data:null})} style={btn()}>+ Add FAQ</button>
                </div>
                {faqs.length===0&&<p style={{color:"rgba(255,255,255,0.3)",textAlign:"center",padding:"40px 0"}}>No FAQs yet. Add one!</p>}
                {faqs.map(f=>(
                  <div key={f._id} style={card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                      <div style={{flex:1}}>
                        <h4 style={{color:"#fff",fontWeight:900,fontSize:14,marginBottom:6}}>{f.question}</h4>
                        <p style={{color:"rgba(255,255,255,0.4)",fontSize:12,lineHeight:1.6}}>{f.answer}</p>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button onClick={()=>setModal({type:"faq",data:f})} style={btn()}>Edit</button>
                        <button onClick={()=>handleDelete("/faq",f._id,"faqs")} style={btn("#ef4444")}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab==="pricings"&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <h3 style={{color:"#fff",fontWeight:900,fontSize:18}}>Pricing Plans ({pricings.length})</h3>
                  <button onClick={()=>setModal({type:"pricing",data:null})} style={btn()}>+ Add Plan</button>
                </div>
                {pricings.length===0&&<p style={{color:"rgba(255,255,255,0.3)",textAlign:"center",padding:"40px 0"}}>No pricing plans yet. Add one!</p>}
                {pricings.map(p=>(
                  <div key={p._id} style={card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                          <h4 style={{color:"#fff",fontWeight:900,fontSize:15}}>{p.title}</h4>
                          <span style={{color:Y[400],fontWeight:900,fontSize:18}}>{p.price}</span>
                          {p.hot&&<span style={{background:Y[500],color:"#000",fontSize:9,fontWeight:900,padding:"2px 10px",borderRadius:999,letterSpacing:"0.2em"}}>HOT</span>}
                        </div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {(p.features||[]).map((f,i)=><span key={i} style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>✓ {f}</span>)}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <button onClick={()=>setModal({type:"pricing",data:p})} style={btn()}>Edit</button>
                        <button onClick={()=>handleDelete("/pricing",p._id,"pricings")} style={btn("#ef4444")}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab==="contacts"&&(
              <div>
                <h3 style={{color:"#fff",fontWeight:900,fontSize:18,marginBottom:20}}>Contact Submissions ({contacts.length})</h3>
                {contacts.length===0&&<p style={{color:"rgba(255,255,255,0.3)",textAlign:"center",padding:"40px 0"}}>No contact submissions yet.</p>}
                {contacts.map(c=>(
                  <div key={c._id} style={card}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:16,marginBottom:6,flexWrap:"wrap"}}>
                          <span style={{color:"#fff",fontWeight:900,fontSize:14}}>{c.name}</span>
                          <span style={{color:Y[400],fontSize:13}}>{c.email}</span>
                          <span style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{color:Y[500],fontWeight:700,fontSize:12,marginBottom:4}}>{c.subject}</p>
                        <p style={{color:"rgba(255,255,255,0.4)",fontSize:12,lineHeight:1.6}}>{c.message}</p>
                      </div>
                      <button onClick={()=>handleDelete("/contact",c._id,"contacts")} style={btn("#ef4444")}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <AnimatePresence>
        {modal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
            <motion.div initial={{opacity:0,scale:0.92,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.92}} style={{background:"#0d0900",border:`1px solid ${Y[700]}`,borderRadius:20,padding:"36px",width:"100%",maxWidth:520,maxHeight:"85vh",overflowY:"auto"}}>
              {modal.type==="service"&&<ServiceModal data={modal.data} onSave={handleSave} onClose={()=>setModal(null)} inp={inp} btn={btn}/>}
              {modal.type==="team"&&<TeamModal data={modal.data} onSave={handleSave} onClose={()=>setModal(null)} inp={inp} btn={btn}/>}
              {modal.type==="faq"&&<FAQModal data={modal.data} onSave={handleSave} onClose={()=>setModal(null)} inp={inp} btn={btn}/>}
              {modal.type==="pricing"&&<PricingModal data={modal.data} onSave={handleSave} onClose={()=>setModal(null)} inp={inp} btn={btn}/>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({setPage}) {
  return (
    <footer style={{background:"#120e03",borderTop:`1px solid ${Y[900]}40`,padding:"80px 24px 36px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:48,marginBottom:60}}>
          <div>
            <div style={{marginBottom:18}}><SolarisLogo onClick={()=>setPage("home")}/></div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.24)",lineHeight:1.85,maxWidth:240,fontWeight:500}}>Engineering next-generation solar and renewable energy systems for a sustainable planet.</p>
          </div>
          <div>
            <h5 style={{fontSize:9,fontWeight:900,color:Y[500],letterSpacing:"0.4em",textTransform:"uppercase",marginBottom:22}}>Navigation</h5>
            <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:10}}>
              {NAV_ITEMS.filter(i=>i.id!=="admin").map(item=>(
                <li key={item.id}><button onClick={()=>setPage(item.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)",transition:"color 0.2s",padding:0}} onMouseEnter={e=>{e.currentTarget.style.color=Y[400];}} onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.28)";}}>{item.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 style={{fontSize:9,fontWeight:900,color:Y[500],letterSpacing:"0.4em",textTransform:"uppercase",marginBottom:22}}>Contact</h5>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.38)"}}>breehaasim@gmail.com</p>
              <p style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.38)"}}>Sahiwal Jail Road, Punjab</p>
            </div>
          </div>
          <div>
            <h5 style={{fontSize:9,fontWeight:900,color:Y[500],letterSpacing:"0.4em",textTransform:"uppercase",marginBottom:22}}>System Status</h5>
            <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.08)`,borderRadius:12,padding:"14px 18px"}}>
              <span style={{display:"flex",alignItems:"center",gap:8,fontSize:10,fontWeight:900,color:Y[400],textTransform:"uppercase",letterSpacing:"0.28em"}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 10px #4ade8080",display:"inline-block",animation:"pulse 2s infinite"}}/>
                All Systems Online
              </span>
            </div>
          </div>
        </div>
        <div style={{borderTop:`1px solid rgba(255,255,255,0.06)`,paddingTop:26,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.16)",fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase"}}>© 2026 Solaris Studio Technologies. All rights reserved.</span>
          <span style={{fontSize:9,color:Y[600],fontWeight:700,letterSpacing:"0.3em",textTransform:"uppercase",textShadow:`0 0 8px ${Y[600]}`}}>Golden Protocol Active</span>
        </div>
      </div>
    </footer>
  );
}

// ─── 404 PAGE ─────────────────────────────────────────────────────────────────
function NotFoundPage({setPage}) {
  return (
    <div style={{paddingTop:120,minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#050400",textAlign:"center",padding:"120px 24px"}}>
      <motion.div {...fadeUp}>
        <div style={{fontSize:80,fontWeight:900,color:Y[800],fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>404</div>
        <h2 className="neon-heading" style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:900,color:"#fff",fontFamily:"'Playfair Display',Georgia,serif",fontStyle:"italic",margin:"16px 0 12px"}}>Page Not Found</h2>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginBottom:32}}>The page you're looking for doesn't exist.</p>
        <button className="neon-btn" onClick={()=>setPage("home")} style={{background:`linear-gradient(135deg,${Y[400]},${Y[600]})`,border:"none",cursor:"pointer",padding:"13px 32px",borderRadius:999,fontSize:11,fontWeight:900,letterSpacing:"0.28em",textTransform:"uppercase",color:"#000"}}>Go Home →</button>
      </motion.div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page,setPage]=useState("home");
  const [scrolled,setScrolled]=useState(false);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[page]);

  const pages={
    home:<HomePage setPage={setPage}/>,
    services:<ServicesPage setPage={setPage}/>,
    about:<AboutPage/>,
    team:<TeamPage/>,
    faq:<FAQPage/>,
    pricing:<PricingPage setPage={setPage}/>,
    contact:<ContactPage/>,
    admin:<AdminPage/>,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar active={page} setActive={setPage} scrolled={scrolled}/>
      <AnimatePresence mode="wait">
        <motion.main key={page} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:0.4,ease:[0.22,1,0.36,1]}}>
          {pages[page]??<NotFoundPage setPage={setPage}/>}
        </motion.main>
      </AnimatePresence>
      <Footer setPage={setPage}/>
    </>
  );
}