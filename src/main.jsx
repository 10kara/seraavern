import React,{useEffect,useState,useRef}from'react';
import{createRoot}from'react-dom/client';
import{createPortal}from'react-dom';
import{BrowserRouter,Routes,Route,Link,NavLink,useNavigate,useLocation}from'react-router-dom';
import{ArrowRight,BookOpen,ChevronLeft,ChevronRight,Database,Image as ImageIcon,LogIn,Menu,Shield,UserRound,X,Save,Trash2,Plus,Upload,RefreshCw,Lock,Terminal,Images,Edit3,Eye,EyeOff}from'lucide-react';
import{createClient}from'@supabase/supabase-js';
import'./styles.css';

/* ============================================================
   ОКРУЖЕНИЕ / SUPABASE
   Ключ может задаваться под любым из двух имён —
   VITE_SUPABASE_PUBLISHABLE_KEY или VITE_SUPABASE_ANON_KEY.
   ============================================================ */
const SUPA_URL=import.meta.env.VITE_SUPABASE_URL;
const SUPA_KEY=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY;
const STORAGE_BUCKET=import.meta.env.VITE_SUPABASE_STORAGE_BUCKET||'archive';
const supabase=SUPA_URL&&SUPA_KEY?createClient(SUPA_URL,SUPA_KEY):null;

/* ============================================================
   ЛОКАЛЬНЫЙ ФОЛБЭК (используется только когда Supabase не
   подключён; пустая база никогда не подменяется этими данными)
   ============================================================ */
const fallback={id:1,name:'Сера Аверн',first_name:'Сера',last_name:'Аверн',species:'Сквиб',age:3,height:72,homeworld:'Скор II',status:'Джедай-юнлинг',callsign:'—',summary:'Чувствительный к Силе сквиб, происходящий со Скор II. В настоящее время проходит раннее обучение в Ордене Джедаев.',appearance:'Тело покрыто густой, мягкой шерстью почти угольно-чёрного окраса. Крупные чуткие уши значительно выделяются даже для его вида, а большие янтарно-золотистые глаза постоянно выдают любопытство и настороженность.',personality:'Любопытный, активный и эмоциональный ребёнок. Сера легко идёт на контакт, любит наблюдать за окружающими и плохо переносит скуку. Он не тихий и не замкнутый: если ему что-то интересно, об этом быстро узнают все вокруг.',preferences:'Нравятся животные, механизмы, новые места, игры и всё, что можно исследовать. Особенно любит занятия, где разрешено двигаться и что-нибудь делать своими лапами.',dislikes:'Не любит долго сидеть без дела, резкие звуки, грубость и ситуации, в которых взрослые намеренно скрывают от него что-то важное.',motivation:'Понять окружающий мир, научиться управлять своей чувствительностью к Силе и доказать себе, что он способен стать настоящим джедаем.',image_url:'',holo_effect:true};
const fallbackChapters=[{id:'local-1',chapter_number:1,title:'Ребёнок со Скор II',content:'Сера Аверн родился на Скор II, среди лесов и поселений, где жизнь была гораздо спокойнее, чем на большинстве крупных миров Республики. Его семья жила простой жизнью, стараясь дать ребёнку возможность расти без лишних забот. С ранних лет Сера отличался необычной внимательностью: он замечал звуки раньше других, чувствовал приближение людей и иногда реагировал на события ещё до того, как они происходили.\n\nОн рос активным и любопытным ребёнком. Его интересовало практически всё вокруг — от животных и растений до механизмов и работы взрослых. Сера не любил просто наблюдать издалека: если что-то привлекало его внимание, он стремился подойти ближе и разобраться самостоятельно.\n\nПостепенно родители начали замечать, что некоторые особенности сына невозможно объяснить одной лишь детской наблюдательностью.',cover_image:'',published:true},{id:'local-2',chapter_number:2,title:'Когда пришёл джедай',content:'Когда Сере исполнилось три года, на Скор II прибыл джедай Кайрен Валь. Его визит не был случайностью: Орден получил сведения о ребёнке, чья связь с Силой могла проявляться необычным образом.\n\nКайрен не спешил забирать Серу силой или пугать его рассказами об Ордене. Он сначала познакомился с семьёй, наблюдал за ребёнком и позволил ему самому проявить интерес. Сера быстро начал рассматривать незнакомого джедая с таким же любопытством, с каким обычно изучал новые механизмы.\n\nПосле проверки стало ясно, что чувствительность Серы к Силе действительно достаточно сильна, чтобы Орден предложил ему обучение. Вскоре Сера покинул Скор II вместе с Кайреном Валь.',cover_image:'',published:true}];
const fallbackRelations=[{id:'local-r1',name:'Рен Аверн',role:'Отец',relation:'Любовь',quote:'Сначала разберёмся, что сломалось. Потом решим, как это чинить.'},{id:'local-r2',name:'Лира Аверн',role:'Мать',relation:'Любовь',quote:'Не обязательно всё понимать сразу. Главное — не переставай задавать вопросы.'},{id:'local-r3',name:'Кайрен Валь',role:'Джедай, забравший Серу',relation:'Уважение',quote:'Сила не делает тебя взрослым. Она лишь учит внимательнее слушать мир.'}];

/* ============================================================
   ХЕЛПЕРЫ
   ============================================================ */
const clean=v=>v===null||v===undefined||v===''?'—':v;

// Правильные русские формы: 1 год, 2 года, 5 лет, 22 года, 12 лет…
const plural=(n,one,few,many)=>{
  const m10=Math.abs(n)%10,m100=Math.abs(n)%100;
  if(m10===1&&m100!==11)return one;
  if(m10>=2&&m10<=4&&(m100<12||m100>14))return few;
  return many;
};
const ageText=v=>{
  const n=Number(v);
  if(!Number.isFinite(n))return clean(v);
  return `${n} ${plural(n,'стандартный год','стандартных года','стандартных лет')}`;
};
const heightText=v=>{
  const n=Number(v);
  return Number.isFinite(n)?`${n} см`:clean(v);
};
const chapterCount=n=>`${n} ${plural(n,'глава','главы','глав')}`;

function displayCharacter(row){
  if(!row)return fallback;
  let name=String(row.name||'').trim();
  const first=String(row.first_name||'').trim(),last=String(row.last_name||'').trim();
  if((!name||name.toLowerCase()==='сера')&&first&&last)name=`${first} ${last}`;
  if(!name)name=fallback.name;
  return{...fallback,...row,name};
}

// Отправляет запись в Supabase и, если схема не содержит какую-то
// колонку (PGRST204), повторяет запрос без неё. Так формы работают
// и с полной схемой, и со старыми таблицами без новых колонок.
async function writeResilient(build,payload){
  let res=await build(payload),guard=0;
  while(res.error&&guard<8){
    const m=/'([a-zA-Z_0-9]+)' column/.exec(res.error.message||'');
    if(!m||!(m[1] in payload))break;
    const rest={...payload};
    delete rest[m[1]];
    payload=rest;
    res=await build(payload);
    guard++;
  }
  return res;
}

/* ============================================================
   ЗАГРУЗКА АРХИВА
   ============================================================ */
function useArchive(){
  const[c,setC]=useState(supabase?null:fallback),
        [ch,setCh]=useState(supabase?[]:fallbackChapters),
        [r,setR]=useState(supabase?[]:fallbackRelations),
        [g,setG]=useState([]),
        [loading,setLoading]=useState(!!supabase),
        [loaded,setLoaded]=useState(!supabase),
        [error,setError]=useState('');
  const load=async()=>{
    if(!supabase){setLoading(false);setLoaded(true);return}
    setLoading(true);setError('');
    try{
      const[a,b,d,gal]=await Promise.all([
        supabase.from('character').select('*').order('id').limit(1),
        supabase.from('chapters').select('*').order('chapter_number'),
        supabase.from('relationships').select('*').order('id'),
        supabase.from('gallery').select('*').order('sort_order').order('created_at',{ascending:false})
      ]);
      if(a.error)throw a.error;
      if(b.error)throw b.error;
      if(d.error)throw d.error;
      setC(a.data?.[0]?displayCharacter(a.data[0]):null);
      setCh(Array.isArray(b.data)?b.data:[]);
      setR(Array.isArray(d.data)?d.data:[]);
      // Отсутствие таблицы gallery не должно ломать весь архив.
      if(gal.error){console.warn('[archive] gallery:',gal.error.message);setG([])}
      else setG(Array.isArray(gal.data)?gal.data:[]);
    }catch(e){setError(e.message||'Не удалось загрузить архив.')}
    finally{setLoading(false);setLoaded(true)}
  };
  useEffect(()=>{load()},[]);
  return{character:c,chapters:ch,relationships:r,gallery:g,loading,loaded,error,reload:load,setCharacter:setC,setChapters:setCh,setRelationships:setR,setGallery:setG};
}

/* ============================================================
   БАЗОВЫЕ КОМПОНЕНТЫ
   ============================================================ */
function Background(){return<><div className="hud-grid"/><div className="hud-bars"><i/><i/><i/><i/></div><div className="holo-ambient"><i/><i/><i/></div><div className="holo-particles">{Array.from({length:18},(_,i)=><i key={i}/>)}</div><div className="scanline"/></>}

/* ============================================================
   ГОЛО-КУРСОР
   Системный курсор полностью скрыт (html.cursor-custom),
   рисуется собственный орб из styles.css. Мышь отслеживается
   напрямую через transform + rAF, поэтому орб идёт под
   указателем без задержки. Тач-устройства не трогаем: там
   голо-курсора нет и системный курсор не прячется.
   ============================================================ */
const CURSOR_HOT='a,button,input[type=file],.check,.card,.g-item,.zoomable,.chapter-toggle,.chapter-nav button,.gallery-filters button,.lb-btn,.upload-btn,.admin-tabs button';
const CURSOR_TEXT='textarea,input[type=text],input[type=number],input[type=email],input[type=password],input[type=search],input[type=url],select';
function Cursor(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current,root=document.documentElement;
    if(!el||!window.matchMedia)return;
    const fine=window.matchMedia('(hover:hover) and (pointer:fine)');
    let active=false,raf=0,live=false,x=-100,y=-100;
    const paint=()=>{raf=0;el.style.transform=`translate3d(${x}px,${y}px,0)`};
    const move=e=>{
      x=e.clientX;y=e.clientY;
      if(!active)return;
      // Первый кадр пишем синхронно, иначе орб на миг мелькнет в левом верхнем углу.
      if(!live){live=true;el.style.transform=`translate3d(${x}px,${y}px,0)`;el.classList.add('is-live');return}
      if(!raf)raf=requestAnimationFrame(paint);
    };
    const over=e=>{
      if(!active||!e.target||!e.target.closest)return;
      const text=!!e.target.closest(CURSOR_TEXT);
      el.classList.toggle('is-text',text);
      el.classList.toggle('is-hot',!text&&!!e.target.closest(CURSOR_HOT));
    };
    const down=()=>{if(active)el.classList.add('is-down')};
    const up=()=>el.classList.remove('is-down');
    const leave=()=>el.classList.remove('is-live');
    const enter=()=>{if(active&&x>=0)el.classList.add('is-live')};
    const sync=()=>{
      active=fine.matches;
      root.classList.toggle('cursor-custom',active);
      if(!active){el.classList.remove('is-live','is-hot','is-text','is-down')}
      else if(x>=0)el.classList.add('is-live');
    };
    sync();
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerover',over,{passive:true});
    window.addEventListener('pointerdown',down);
    window.addEventListener('pointerup',up);
    window.addEventListener('pointercancel',up);
    document.addEventListener('mouseleave',leave);
    document.addEventListener('mouseenter',enter);
    if(fine.addEventListener)fine.addEventListener('change',sync);
    return()=>{
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerover',over);
      window.removeEventListener('pointerdown',down);
      window.removeEventListener('pointerup',up);
      window.removeEventListener('pointercancel',up);
      document.removeEventListener('mouseleave',leave);
      document.removeEventListener('mouseenter',enter);
      if(fine.removeEventListener)fine.removeEventListener('change',sync);
      if(raf)cancelAnimationFrame(raf);
    };
  },[]);
  // Портал в body: .shell имеет overflow:hidden и filter в force-mode,
  // из-за чего position:fixed у курсора считался бы от .shell, а не от вьюпорта.
  return createPortal(<div className="cursor-orb" ref={ref} aria-hidden="true"><i/></div>,document.body);
}

function TypeLine({text,delay=0}){const[out,setOut]=useState('');useEffect(()=>{let i=0;const t=setTimeout(()=>{const id=setInterval(()=>{setOut(text.slice(0,++i));if(i>=text.length)clearInterval(id)},28)},delay);return()=>clearTimeout(t)},[text,delay]);return<span>{out}<i className="type-caret">▌</i></span>}
function TerminalTicker(){const messages=['ARCHIVE LINK STABLE','FORCE SIGNATURE // LOW INTENSITY','JEDI TEMPLE DATABASE // SA-001','VISUAL RECORDS INDEXED'];const[i,setI]=useState(0);useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%messages.length),4200);return()=>clearInterval(t)},[]);return<div className="terminal-ticker"><span>SYS://</span><TypeLine text={messages[i]}/></div>}

function Layout({error='',children}){
  const[open,setOpen]=useState(false);
  const[forceMode,setForceMode]=useState(false);const[theme,setTheme]=useState(()=>localStorage.getItem('archive-theme')||'jedi');
  const{pathname}=useLocation();
  useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});document.body.dataset.page=pathname},[pathname]);
  // Тема зеркалится на <html>, чтобы курсор (портал в body) тоже перекрашивался.
  useEffect(()=>{document.documentElement.classList.toggle('theme-imperial',theme==='imperial')},[theme]);
  useEffect(()=>{
    const move=e=>{document.documentElement.style.setProperty('--mx',`${(e.clientX/window.innerWidth-.5)*2}`);document.documentElement.style.setProperty('--my',`${(e.clientY/window.innerHeight-.5)*2}`)};
    const keys=[]; const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
    const key=e=>{keys.push(e.key);if(keys.slice(-konami.length).join()===konami.join()){setForceMode(v=>!v);keys.length=0}if(e.key.toLowerCase()==='t'){setTheme(v=>{const n=v==='jedi'?'imperial':'jedi';localStorage.setItem('archive-theme',n);return n})}};
    const scroll=()=>{const d=document.documentElement;document.documentElement.style.setProperty('--read',`${Math.min(100,Math.max(0,scrollY/(d.scrollHeight-innerHeight||1)*100))}%`)};
    const click=()=>{try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();o.frequency.value=520;g.gain.setValueAtTime(.025,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.06);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.06)}catch{}};
    window.addEventListener('pointermove',move);window.addEventListener('keydown',key);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('click',click);scroll();
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('keydown',key);window.removeEventListener('scroll',scroll);document.removeEventListener('click',click)};
  },[]);
  const links=[['/','Главная'],['/character','Персонаж'],['/history','История'],['/relationships','Взаимоотношения'],['/gallery','Галерея']];
  return<div className={`shell ${forceMode?'force-mode':''} theme-${theme}`}>
    <Background/><Cursor/><div className="reading-progress" aria-hidden="true"/><TerminalTicker/>
    <header className="topbar">
      <Link className="brand" to="/"><b>✦</b> JEDI ARCHIVES</Link>
      <button className="mobile" aria-label="Меню" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      <nav className={open?'open':''}>{links.map(([to,l])=><NavLink key={to} to={to} onClick={()=>setOpen(false)}>{l}</NavLink>)}</nav>
    </header>
    <main>
      {error&&<div className="db-error"><Terminal size={14}/> ОШИБКА БАЗЫ ДАННЫХ // {error}</div>}
      {children}
    </main>
    <footer>
      <span>ОРДЕН ДЖЕДАЕВ // АРХИВ</span>
      <span>ID АРХИВА // SA-001</span>
      <Link to="/admin">СЛУЖЕБНЫЙ ДОСТУП</Link>
    </footer>
  </div>;
}

function Page({title,sub,children}){
  useEffect(()=>{document.title=`${title} — Jedi Archives`},[title]);
  return<section className="page">
    <div className="heading holo-panel">
      <div><p className="kicker">{sub}</p><h1 className="glitch" data-text={title}>{title}</h1></div>
      <span className="chip">● АРХИВ АКТИВЕН</span>
    </div>
    {children}
  </section>;
}

function Holo({children,className=''}){
  return<div className={`holo-panel ${className}`}>
    <i className="corner tl" aria-hidden="true"/><i className="corner br" aria-hidden="true"/>
    {children}
  </div>;
}

// Рамка изображения: holo-on — эффект голопроекции, holo-off — обычное фото.
function Frame({holo=true,className='',children}){
  return<div className={`frame ${holo?'holo-on':'holo-off'} ${className}`}>{children}</div>;
}

function Data({label,value}){return<div className="data-row"><span>{label}</span><strong>{clean(value)}</strong></div>}
function Card({icon,title,text,to,meta}){return<Link className="card" to={to}><div className="card-icon">{icon}</div><span><em>{meta||'ARCHIVE MODULE'}</em><b>{title}</b><small>{text}</small></span><ChevronRight/></Link>}

/* ============================================================
   ЛАЙТБОКС
   ============================================================ */
function Lightbox({items,index,onClose,onStep}){
  const item=items[index];
  const touch=useRef(null);
  useEffect(()=>{
    const h=e=>{
      if(e.key==='Escape')onClose();
      else if(e.key==='ArrowRight')onStep(1);
      else if(e.key==='ArrowLeft')onStep(-1);
    };
    window.addEventListener('keydown',h);
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{window.removeEventListener('keydown',h);document.body.style.overflow=prev};
  },[onClose,onStep]);
  if(!item)return null;
  return<div className="lightbox" role="dialog" aria-modal="true" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current!==null){const d=e.changedTouches[0].clientX-touch.current;if(Math.abs(d)>45)onStep(d<0?1:-1);touch.current=null}}} onClick={onClose}>
    <button className="lb-btn lb-close" aria-label="Закрыть" onClick={onClose}><X size={20}/></button>
    {items.length>1&&<button className="lb-btn lb-prev" aria-label="Предыдущее" onClick={e=>{e.stopPropagation();onStep(-1)}}><ChevronLeft size={26}/></button>}
    <figure onClick={e=>e.stopPropagation()}>
      <Frame holo><img src={item.src} alt={item.alt||''}/></Frame>
      <figcaption><span>{item.caption}</span><span>{index+1} / {items.length}</span></figcaption><div className="lb-thumbs">{items.map((x,i)=><button key={i} className={i===index?'active':''} onClick={e=>{e.stopPropagation();onStep(i-index)}}><img src={x.src} alt=""/></button>)}</div>
    </figure>
    {items.length>1&&<button className="lb-btn lb-next" aria-label="Следующее" onClick={e=>{e.stopPropagation();onStep(1)}}><ChevronRight size={26}/></button>}
  </div>;
}

/* ============================================================
   ПУБЛИЧНЫЕ СТРАНИЦЫ
   ============================================================ */
function Home({c,ch}){
  useEffect(()=>{document.title='Jedi Archives — Сера Аверн'},[]);
  if(!c)return<Page title="Архив пуст" sub="DATABASE // NO RECORD">
    <Holo className="empty"><Database/><p>В таблице character нет записи. Добавьте персонажа через админ-панель.</p></Holo>
  </Page>;
  const parts=String(c.name||'').trim().split(/\s+/);
  const first=parts[0]||'Сера',last=parts.slice(1).join(' ')||'Аверн';
  const holo=c.holo_effect!==false;
  return<>
    <section className="hero">
      <Holo className="hero-copy">
        <div className="headerline"><span>JEDI ORDER // ARCHIVES</span><span className="status">ЗАПИСЬ АКТИВНА</span></div>
        <p className="kicker">ЛИЧНОЕ ДЕЛО</p>
        <h1>{first}<small>{last}</small></h1>
        <div className="line"/>
        <p className="lead">{c.summary}</p>
        <div className="griddata">
          <Data label="РАСА" value={c.species}/>
          <Data label="ВОЗРАСТ" value={ageText(c.age)}/>
          <Data label="РОСТ" value={heightText(c.height)}/>
          <Data label="РОДНОЙ МИР" value={c.homeworld}/>
          <Data label="СТАТУС" value={c.status}/>
          <Data label="ПОЗЫВНОЙ" value={c.callsign}/>
        </div>
        <Link className="btn" to="/character">ОТКРЫТЬ ДОСЬЕ <ArrowRight size={17}/></Link>
        <div className="panel-footer"><span>ARCHIVE ID // SA-001</span><span>JEDI TEMPLE DATABASE</span></div>
      </Holo>
      <Holo className="hero-photo">
        <Frame holo={holo} className="hero-frame">
          {c.image_url
            ?<img src={c.image_url} alt={c.name}/>
            :<div className="placeholder"><ImageIcon/><span>ИЗОБРАЖЕНИЕ НЕ ЗАГРУЖЕНО</span></div>}
        </Frame>
        <small>БЕЛАЯ ЗВЕЗДА // АРХИВ ХРАМА ДЖЕДАЕВ</small>
      </Holo>
    </section>
    <section className="archive-updates holo-panel"><p className="kicker">ПОСЛЕДНИЕ ЗАПИСИ // LIVE FEED</p><h2>ХРОНОЛОГИЯ СИЛЫ</h2><div className="home-timeline">{ch.slice(0,4).map((x,i)=><div key={x.id}><b>{String(x.chapter_number||i+1).padStart(2,'0')}</b><span>{x.title}</span><small>ЗАПИСЬ ДОБАВЛЕНА В АРХИВ</small></div>)}</div><Link to="/history" className="btn">ОТКРЫТЬ ИСТОРИЮ <ArrowRight size={16}/></Link></section>
    <section className="cards">
      <Card icon={<Images/>} meta="VISUAL ARCHIVE // 01" title="Галерея" text="Портреты и визуальные записи из архива Ордена." to="/gallery"/>
      <Card icon={<UserRound/>} meta="CONNECTIONS // 02" title="Взаимоотношения" text="Семья, наставники и важные связи Серы." to="/relationships"/>
      <Card icon={<Database/>} meta="PERSONNEL FILE // 03" title="Личное досье" text="Параметры, характер и архивная запись персонажа." to="/character"/>
    </section>
  </>;
}

function Character({c}){
  const[lb,setLb]=useState(-1);
  if(!c)return<Page title="Персонаж" sub="ЛИЧНОЕ ДЕЛО"><Holo className="empty"><Database/><p>Запись персонажа отсутствует в базе данных.</p></Holo></Page>;
  const sections=[['Внешность',c.appearance],['Характер',c.personality],['Предпочтения и симпатии',c.preferences],['Антипатии и избегания',c.dislikes],['Мотивация',c.motivation]];
  const holo=c.holo_effect!==false;
  return<Page title="Персонаж" sub="ЛИЧНОЕ ДЕЛО // SA-001">
    <div className="profile">
      <Holo className="profile-card">
        <div className="portrait">
          <Frame holo={holo} className={c.image_url?'zoomable':''}>
            {c.image_url
              ?<img src={c.image_url} alt={c.name} onClick={()=>setLb(0)}/>
              :<div className="placeholder"><ImageIcon/></div>}
          </Frame>
        </div>
        <div className="bio">
          <p className="kicker">АРХИВ ОРДЕНА ДЖЕДАЕВ</p>
          <h2>{c.name}</h2>
          <div className="data-block">
            <Data label="РАСА" value={c.species}/>
            <Data label="ВОЗРАСТ" value={ageText(c.age)}/>
            <Data label="РОСТ" value={heightText(c.height)}/>
            <Data label="РОДНОЙ МИР" value={c.homeworld}/>
            <Data label="СТАТУС" value={c.status}/>
            <Data label="ПОЗЫВНОЙ" value={c.callsign}/>
          </div>
        </div>
      </Holo>
      <div className="texts">
        {sections.map(([a,b])=><Holo className="text-panel" key={a}><h2>{a}</h2><div className="section-line"/><p>{b||'Запись отсутствует.'}</p></Holo>)}
      </div>
    </div>
    {lb>=0&&c.image_url&&<Lightbox items={[{src:c.image_url,alt:c.name,caption:`PERSONNEL // ${c.name}`}]} index={lb} onClose={()=>setLb(-1)} onStep={()=>{}}/>}
  </Page>;
}

function History({ch}){
  const[lb,setLb]=useState(-1);const[open,setOpen]=useState(0);
  const visible=[...ch].filter(x=>x.published!==false).sort((a,b)=>(a.chapter_number??0)-(b.chapter_number??0));
  const covers=visible.filter(x=>x.cover_image);
  return<Page title="История" sub="ХРОНОЛОГИЯ // РАННИЕ ГОДЫ">
    {visible.length===0
      ?<Holo className="empty"><BookOpen/><p>Опубликованных глав пока нет. Добавьте их через админ-панель.</p></Holo>
      :<div className="timeline">
        {visible.map((x,i)=><article className={`chapter ${open===i?'chapter-open':''}`} key={x.id}>
          <div className="marker">{x.chapter_number!=null?String(x.chapter_number).padStart(2,'0'):String(i+1).padStart(2,'0')}</div>
          <Holo className="chapter-panel">
            <p className="kicker">ГЛАВА {x.chapter_number??i+1}</p>
            <button className="chapter-toggle" onClick={()=>setOpen(open===i?-1:i)}>{open===i?'СВЕРНУТЬ':'ОТКРЫТЬ'} ЗАПИСЬ</button>{open===i&&<span className="chapter-nav">{i>0&&<button onClick={()=>setOpen(i-1)}>← ПРЕД.</button>}{i<visible.length-1&&<button onClick={()=>setOpen(i+1)}>СЛЕД. →</button>}</span>}
            <h2>{x.title}</h2>
            <div className="section-line"/>
            {x.cover_image&&<Frame holo={x.holo_effect!==false} className="cover zoomable" onClick={()=>setLb(covers.findIndex(cv=>cv.id===x.id))}><img src={x.cover_image} alt={x.title||''} loading="lazy"/></Frame>}
            {String(x.content||'').split(/\n+/).filter(Boolean).map((p,j)=><p key={j}>{p}</p>)}
          </Holo>
        </article>)}
      </div>}
    {lb>=0&&covers.length>0&&<Lightbox
      items={covers.map(x=>({src:x.cover_image,alt:x.title||'',caption:x.title?`ГЛАВА ${x.chapter_number} // ${x.title}`:'ОБЛОЖКА ГЛАВЫ'}))}
      index={Math.max(0,lb)} onClose={()=>setLb(-1)} onStep={d=>setLb(i=>(i+d+covers.length)%covers.length)}/>}
  </Page>;
}

function Relationships({r}){
  return<Page title="Взаимоотношения" sub="ЛИЧНЫЕ СВЯЗИ // РАННИЙ ПЕРИОД">
    {r.length===0
      ?<Holo className="empty"><UserRound/><p>Записей о личных связях пока нет.</p></Holo>
      :<div className="relations">
        {r.map(x=><Holo className="relation" key={x.id}>
          {x.image_url
            ?<Frame holo={x.holo_effect!==false} className="photo"><img src={x.image_url} alt={x.name} loading="lazy"/></Frame>
            :<div className="avatar">{String(x.name||'?')[0]}</div>}
          <div>
            <p className="kicker">{x.role}</p>
            <h2>{x.name}</h2>
            <span>{x.relation}</span>
            {x.quote&&<blockquote>«{x.quote}»</blockquote>}
          </div>
        </Holo>)}
      </div>}
  </Page>;
}

function EventLog(){const events=['Архивная система активирована','Синхронизация визуальных записей завершена','Профиль Серы Аверн открыт для чтения','Голографический протокол подключён'];return<Page title="Журнал событий" sub="RESTRICTED // DEV LOG"><Holo className="event-log">{events.map((x,i)=><div className="event-row" key={x}><b>0{i+1}</b><span>{x}</span><time>SA-00{i+1}</time></div>)}</Holo></Page>}
function NotFound(){return<Page title="Запись не найдена" sub="ERROR // ARCHIVE CORRUPTED"><Holo className="empty"><Terminal/><p>Запрошенный сектор архива отсутствует или был перемещён.</p><Link className="btn" to="/">ВЕРНУТЬСЯ В АРХИВ <ArrowRight size={16}/></Link></Holo></Page>}

function Gallery({c,gallery}){
  const[lb,setLb]=useState(-1);const[filter,setFilter]=useState('all');
  const raw=gallery.length?gallery:(c?.image_url?[{id:'main',image_url:c.image_url,title:'Основной портрет',caption:`PERSONNEL // ${c.name}`}]:[]);
  const items=filter==='all'?raw:raw.filter(x=>(x.type||x.category||'archive').toLowerCase()===filter);
  const lightboxItems=items.map(x=>({src:x.image_url||x.url,alt:x.caption||x.title||'',caption:x.caption||x.title||'АРХИВНЫЙ МАТЕРИАЛ'}));
  return<Page title="Галерея" sub="ВИЗУАЛЬНЫЙ АРХИВ">
    {items.length===0
      ?<Holo className="empty"><Images/><p>Изображения появятся здесь после загрузки.</p></Holo>
      :<><div className="gallery-filters"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>ВСЕ</button><button className={filter==='portrait'?'active':''} onClick={()=>setFilter('portrait')}>ПОРТРЕТЫ</button><button className={filter==='archive'?'active':''} onClick={()=>setFilter('archive')}>АРХИВ</button></div><div className="gallery">
        {items.map((x,i)=><figure className="holo-panel g-item" key={x.id} onClick={()=>setLb(i)}>
          <Frame holo={x.holo_effect!==false}><img src={x.image_url||x.url} alt={x.caption||x.title||'Архивный снимок'} loading="lazy"/></Frame>
          <span className="zoom"><ImageIcon size={16}/></span>
          <figcaption>{x.caption||x.title||'АРХИВНЫЙ МАТЕРИАЛ'}</figcaption>
        </figure>)}
      </div></>}
    {lb>=0&&<Lightbox items={lightboxItems} index={lb} onClose={()=>setLb(-1)} onStep={d=>setLb(i=>(i+d+items.length)%items.length)}/>}
  </Page>;
}

/* ============================================================
   АДМИНКА — ВХОД И ЗАЩИТА
   ============================================================ */
function AdminLogin(){
  const nav=useNavigate();
  const[email,setEmail]=useState(''),[password,setPassword]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
  // Уже авторизованы — сразу в панель.
  useEffect(()=>{if(supabase)supabase.auth.getSession().then(({data})=>{if(data.session)nav('/admin/panel',{replace:true})})},[nav]);
  const login=async e=>{
    e.preventDefault();
    if(!supabase){setErr('Supabase не подключён. Проверьте .env.');return}
    setBusy(true);setErr('');
    const normalized=email.trim().includes('@')?email.trim():email.trim()+'@jedi-archives.local';
    const{error}=await supabase.auth.signInWithPassword({email:normalized,password});
    if(error)setErr('Не удалось войти. Проверьте логин и пароль.');
    else nav('/admin/panel');
    setBusy(false);
  };
  return<Page title="Админ-панель" sub="ЗАЩИЩЁННЫЙ ДОСТУП">
    <Holo className="login">
      <Shield size={28}/>
      <p className="kicker">SECURITY GATE // LEVEL 5</p>
      <h2>ЗАКРЫТЫЙ АРХИВ</h2>
      <p>Доступ к редактированию базы разрешён только авторизованному пользователю.</p>
      <form onSubmit={login}>
        <label>ЛОГИН<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="tenkara" autoComplete="username" required/></label>
        <label>ПАРОЛЬ<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>
        <button className="btn" disabled={busy}><LogIn size={17}/> {busy?'ПРОВЕРКА…':'ВОЙТИ В АРХИВ'}</button>
        {err&&<em>{err}</em>}
      </form>
    </Holo>
  </Page>;
}

function AdminGuard({children}){
  const[s,setS]=useState(undefined);
  useEffect(()=>{
    if(!supabase){setS(null);return}
    supabase.auth.getSession().then(({data})=>setS(data.session));
    const{data}=supabase.auth.onAuthStateChange((_,session)=>setS(session));
    return()=>data.subscription.unsubscribe();
  },[]);
  if(s===undefined)return<Page title="Панель" sub="ПРОВЕРКА ДОСТУПА"><div className="loading">ПРОВЕРКА СЕССИИ…</div></Page>;
  return s?children:<AdminLogin/>;
}

/* ============================================================
   АДМИНКА — ПАНЕЛЬ УПРАВЛЕНИЯ
   ============================================================ */
const EMPTY_CHARACTER={name:'',species:'',age:'',height:'',homeworld:'',status:'',callsign:'',summary:'',appearance:'',personality:'',preferences:'',dislikes:'',motivation:'',image_url:'',holo_effect:true};
const EMPTY_CHAPTER={id:null,chapter_number:'',title:'',content:'',cover_image:'',published:true};
const EMPTY_RELATION={id:null,name:'',role:'',relation:'',quote:'',image_url:'',holo_effect:true};
const EMPTY_GALLERY={id:null,title:'',caption:'',image_url:'',sort_order:0,holo_effect:true};

function AdminPanel({archive}){
  const{character,chapters,relationships,gallery,reload}=archive;
  const nav=useNavigate();
  const[tab,setTab]=useState('character');
  const[busy,setBusy]=useState(false);
  const[msg,setMsg]=useState(null); // {text,kind:'ok'|'err'}
  const[form,setForm]=useState({...EMPTY_CHARACTER});
  const[chForm,setChForm]=useState(EMPTY_CHAPTER);
  const[relForm,setRelForm]=useState(EMPTY_RELATION);
  const[galForm,setGalForm]=useState(EMPTY_GALLERY);
  const[userEmail,setUserEmail]=useState('');
  const lastChar=useRef('');

  useEffect(()=>{if(supabase)supabase.auth.getUser().then(({data})=>setUserEmail(data.user?.email||''))},[]);
  // Синхронизируем форму с базой, но не затираем правки при фоновых обновлениях.
  useEffect(()=>{
    const sig=character?JSON.stringify(character):'none';
    if(sig===lastChar.current)return;
    lastChar.current=sig;
    setForm(character?{...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER});
  },[character]);
  useEffect(()=>{
    if(!msg)return;
    const t=setTimeout(()=>setMsg(null),4500);
    return()=>clearTimeout(t);
  },[msg]);

  const notify=(text,kind='ok')=>setMsg({text,kind});
  const run=async(fn,success)=>{
    setBusy(true);
    try{
      const{error}=await fn();
      if(error)throw error;
      notify(success);
      await reload();
      return true;
    }catch(e){notify('Ошибка: '+(e.message||e),'err');return false}
    finally{setBusy(false)}
  };

  /* --- Персонаж --- */
  const saveCharacter=async e=>{
    e.preventDefault();
    if(!supabase){notify('Supabase не подключён. Проверьте .env.','err');return}
    const name=String(form.name||'').trim();
    const payload={
      name,
      first_name:name.split(/\s+/)[0]||'',
      last_name:name.split(/\s+/).slice(1).join(' '),
      species:form.species||'',
      age:Number(form.age)||0,
      height:Number(form.height)||0,
      homeworld:form.homeworld||'',
      status:form.status||'',
      callsign:form.callsign||'',
      summary:form.summary||'',
      appearance:form.appearance||'',
      personality:form.personality||'',
      preferences:form.preferences||'',
      dislikes:form.dislikes||'',
      motivation:form.motivation||'',
      image_url:form.image_url||'',
      holo_effect:form.holo_effect!==false,
    };
    return run(async()=>{
      const res=await writeResilient(
        p=>character?.id
          ?supabase.from('character').update(p).eq('id',character.id).select()
          :supabase.from('character').insert(p).select(),
        payload
      );
      if(res.error)throw res.error;
      if(!res.data?.length)throw new Error('Запись character не найдена или изменение заблокировано RLS.');
    },'Данные персонажа сохранены в Supabase.');
  };

  /* --- Главы --- */
  const saveChapter=async e=>{
    e.preventDefault();
    const payload={
      chapter_number:Number(chForm.chapter_number)||0,
      title:chForm.title||'',
      content:chForm.content||'',
      cover_image:chForm.cover_image||'',
      published:!!chForm.published,
    };
    const ok=await run(()=>writeResilient(
      p=>chForm.id?supabase.from('chapters').update(p).eq('id',chForm.id):supabase.from('chapters').insert(p),
      payload
    ),chForm.id?'Глава обновлена.':'Глава добавлена.');
    if(ok&&!chForm.id)setChForm({...EMPTY_CHAPTER});
  };
  const togglePublish=x=>run(
    ()=>supabase.from('chapters').update({published:!(x.published!==false)}).eq('id',x.id),
    x.published!==false?'Глава скрыта из истории.':'Глава снова опубликована.'
  );

  /* --- Связи --- */
  const saveRelation=async e=>{
    e.preventDefault();
    const payload={
      name:relForm.name||'',
      role:relForm.role||'',
      relation:relForm.relation||'',
      quote:relForm.quote||'',
      image_url:relForm.image_url||'',
      holo_effect:relForm.holo_effect!==false,
    };
    const ok=await run(()=>writeResilient(
      p=>relForm.id?supabase.from('relationships').update(p).eq('id',relForm.id):supabase.from('relationships').insert(p),
      payload
    ),relForm.id?'Связь обновлена.':'Связь добавлена.');
    if(ok&&!relForm.id)setRelForm({...EMPTY_RELATION});
  };

  /* --- Галерея --- */
  const saveGallery=async e=>{
    e.preventDefault();
    const payload={
      title:galForm.title||'',
      caption:galForm.caption||'',
      image_url:galForm.image_url||'',
      sort_order:Number(galForm.sort_order)||0,
      holo_effect:galForm.holo_effect!==false,
    };
    const ok=await run(()=>writeResilient(
      p=>galForm.id?supabase.from('gallery').update(p).eq('id',galForm.id):supabase.from('gallery').insert(p),
      payload
    ),galForm.id?'Изображение обновлено.':'Изображение добавлено.');
    if(ok&&!galForm.id)setGalForm({...EMPTY_GALLERY});
  };
  const deleteGallery=async item=>{
    if(!confirm('Удалить изображение?'))return;
    setBusy(true);
    try{
      const path=item.image_url?.split('/'+STORAGE_BUCKET+'/')[1];
      if(path)await supabase.storage.from(STORAGE_BUCKET).remove([path]).catch(()=>{});
      const{error}=await supabase.from('gallery').delete().eq('id',item.id);
      if(error)throw error;
      notify('Изображение удалено.');
      await reload();
    }catch(e){notify('Ошибка удаления: '+(e.message||e),'err')}
    finally{setBusy(false)}
  };

  /* --- Общее --- */
  const remove=(table,id,label)=>{if(!confirm(`Удалить ${label}?`))return;return run(()=>supabase.from(table).delete().eq('id',id),`${label[0].toUpperCase()+label.slice(1)} удалена.`)};
  const uploadFile=async(file,folder='archive')=>{
    const ext=file.name.split('.').pop()?.toLowerCase()||'jpg';
    const path=`${folder||'archive'}/${Date.now()}.${ext}`;
    const up=await supabase.storage.from(STORAGE_BUCKET).upload(path,file,{upsert:false,contentType:file.type});
    if(up.error)throw up.error;
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  };
  const upload=async(e,folder,apply)=>{
    const file=e.target.files?.[0];
    e.target.value='';
    if(!file)return;
    setBusy(true);
    try{const url=await uploadFile(file,folder);apply(url);notify('Файл загружен в Storage. Нажмите «Сохранить».')}
    catch(err){notify('Ошибка Storage: '+(err.message||err),'err')}
    finally{setBusy(false)}
  };
  const logout=async()=>{await supabase.auth.signOut();nav('/admin')};
  const resetChapter=()=>setChForm({...EMPTY_CHAPTER});
  const resetRelation=()=>setRelForm({...EMPTY_RELATION});
  const resetGallery=()=>setGalForm({...EMPTY_GALLERY});

  const sortedChapters=[...chapters].sort((a,b)=>(a.chapter_number??0)-(b.chapter_number??0));
  const tabs=[
    ['character','ПЕРСОНАЖ',<UserRound size={15}/>,null],
    ['chapters','ГЛАВЫ',<BookOpen size={15}/>,chapters.length],
    ['relations','СВЯЗИ',<Database size={15}/>,relationships.length],
    ['gallery','ГАЛЕРЕЯ',<Images size={15}/>,gallery.length],
  ];

  return<Page title="Панель управления" sub="АДМИНИСТРАТОР // ДОСТУП РАЗРЕШЁН">
    <div className="admin-top">
      <span><span className="pulse">●</span> ДОСТУП РАЗРЕШЁН{userEmail?` // ${userEmail}`:''}</span>
      <div>
        <button className="ghost" onClick={reload}><RefreshCw size={14}/> ОБНОВИТЬ</button>
        <button className="ghost" onClick={logout}><Lock size={14}/> ВЫЙТИ</button>
      </div>
    </div>
    <div className="admin-tabs">
      {tabs.map(([id,label,icon,count])=>
        <button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{icon} {label}{count!=null&&<i className="count">{count}</i>}</button>)}
    </div>
    {msg&&<div key={msg.text+String(busy)} className={`toast ${msg.kind}`}>{msg.text}</div>}

    {tab==='character'&&<Holo className="editor">
      <div className="editor-head"><div><p className="kicker">PERSONNEL RECORD // SA-001</p><h2>{character?.id?'РЕДАКТИРОВАНИЕ ЗАПИСИ':'НОВАЯ ЗАПИСЬ ПЕРСОНАЖА'}</h2></div><Save/></div>
      <form onSubmit={saveCharacter}>
        <div className="form-grid">
          <Field label="Имя и фамилия" required value={form.name} onChange={v=>setForm({...form,name:v})}/>
          <Field label="Раса" value={form.species} onChange={v=>setForm({...form,species:v})}/>
          <Field label="Возраст (число)" type="number" min="0" value={form.age} onChange={v=>setForm({...form,age:v})}/>
          <Field label="Рост (см)" type="number" min="0" value={form.height} onChange={v=>setForm({...form,height:v})}/>
          <Field label="Родной мир" value={form.homeworld} onChange={v=>setForm({...form,homeworld:v})}/>
          <Field label="Статус" value={form.status} onChange={v=>setForm({...form,status:v})}/>
          <Field label="Позывной" value={form.callsign} onChange={v=>setForm({...form,callsign:v})}/>
          <div className="field">
            <label>Основная фотография</label>
            <div className="upload">
              <input value={form.image_url||''} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="URL изображения"/>
              <label className="upload-btn"><Upload size={14}/> ЗАГРУЗИТЬ<input type="file" accept="image/*" onChange={e=>upload(e,'character',url=>setForm(f=>({...f,image_url:url})))}/></label>
            </div>
          </div>
        </div>
        {form.image_url&&<Frame holo={form.holo_effect!==false} className="preview"><img src={form.image_url} alt="Предпросмотр"/></Frame>}
        <label className="check"><input type="checkbox" checked={form.holo_effect!==false} onChange={e=>setForm({...form,holo_effect:e.target.checked})}/> Голопроекция портрета</label>
        <TextField label="Краткое описание" value={form.summary} onChange={v=>setForm({...form,summary:v})}/>
        <TextField label="Внешность" value={form.appearance} onChange={v=>setForm({...form,appearance:v})}/>
        <TextField label="Характер" value={form.personality} onChange={v=>setForm({...form,personality:v})}/>
        <TextField label="Предпочтения и симпатии" value={form.preferences} onChange={v=>setForm({...form,preferences:v})}/>
        <TextField label="Антипатии и избегания" value={form.dislikes} onChange={v=>setForm({...form,dislikes:v})}/>
        <TextField label="Мотивация" value={form.motivation} onChange={v=>setForm({...form,motivation:v})}/>
        <button className="btn" disabled={busy}><Save size={16}/> СОХРАНИТЬ В БАЗУ</button>
      </form>
    </Holo>}

    {tab==='chapters'&&<div className="admin-columns">
      <Holo className="editor">
        <div className="editor-head"><div><p className="kicker">CONTENT MANAGEMENT</p><h2>{chForm.id?'РЕДАКТИРОВАНИЕ ГЛАВЫ':'НОВАЯ ГЛАВА'}</h2></div>{chForm.id?<Edit3/>:<Plus/>}</div>
        <form onSubmit={saveChapter}>
          <div className="form-grid">
            <Field label="Номер главы" type="number" min="0" required value={chForm.chapter_number} onChange={v=>setChForm({...chForm,chapter_number:v})}/>
            <Field label="Название" required value={chForm.title} onChange={v=>setChForm({...chForm,title:v})}/>
          </div>
          <TextField label="Текст главы" value={chForm.content} onChange={v=>setChForm({...chForm,content:v})}/>
          <div className="field">
            <label>Обложка главы</label>
            <div className="upload">
              <input value={chForm.cover_image||''} onChange={e=>setChForm({...chForm,cover_image:e.target.value})} placeholder="URL обложки"/>
              <label className="upload-btn"><Upload size={14}/> ЗАГРУЗИТЬ<input type="file" accept="image/*" onChange={e=>upload(e,'chapters',url=>setChForm(f=>({...f,cover_image:url})))}/></label>
            </div>
          </div>
          {chForm.cover_image&&<Frame holo className="preview"><img src={chForm.cover_image} alt="Обложка"/></Frame>}
          <label className="check"><input type="checkbox" checked={chForm.published} onChange={e=>setChForm({...chForm,published:e.target.checked})}/> Публиковать главу</label>
          <div className="editor-actions">
            <button className="btn" disabled={busy}>{chForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ ГЛАВУ</>}</button>
            {chForm.id&&<button type="button" className="ghost" onClick={resetChapter}>ОТМЕНА</button>}
          </div>
        </form>
      </Holo>
      <div className="list">
        {sortedChapters.map(x=><Holo className="list-item" key={x.id}>
          <div>
            <span className="list-number">{x.chapter_number!=null?String(x.chapter_number).padStart(2,'0'):'—'}</span>
            <div><b>{x.title||'Без названия'}</b><small className={x.published===false?'st-hidden':'st-on'}>{x.published===false?'СКРЫТА':'ОПУБЛИКОВАНА'}</small></div>
          </div>
          <div className="item-actions">
            <button className="ghost" title={x.published===false?'Опубликовать':'Скрыть'} onClick={()=>togglePublish(x)}>{x.published===false?<EyeOff size={14}/>:<Eye size={14}/>}</button>
            <button className="ghost" title="Редактировать" onClick={()=>setChForm({id:x.id,chapter_number:x.chapter_number??'',title:x.title||'',content:x.content||'',cover_image:x.cover_image||'',published:x.published!==false})}><Edit3 size={14}/></button>
            <button className="danger" title="Удалить" onClick={()=>remove('chapters',x.id,'главу')}><Trash2 size={15}/></button>
          </div>
        </Holo>)}
        {chapters.length===0&&<Holo className="empty slim"><BookOpen/><p>Глав пока нет. Добавьте первую слева.</p></Holo>}
      </div>
    </div>}

    {tab==='relations'&&<div className="admin-columns">
      <Holo className="editor">
        <div className="editor-head"><div><p className="kicker">RELATIONSHIP DATABASE</p><h2>{relForm.id?'РЕДАКТИРОВАНИЕ СВЯЗИ':'НОВАЯ СВЯЗЬ'}</h2></div>{relForm.id?<Edit3/>:<Plus/>}</div>
        <form onSubmit={saveRelation}>
          <div className="form-grid">
            <Field label="Имя" required value={relForm.name} onChange={v=>setRelForm({...relForm,name:v})}/>
            <Field label="Роль" value={relForm.role} onChange={v=>setRelForm({...relForm,role:v})}/>
          </div>
          <Field label="Отношение" value={relForm.relation} onChange={v=>setRelForm({...relForm,relation:v})}/>
          <TextField label="Цитата" rows="3" value={relForm.quote} onChange={v=>setRelForm({...relForm,quote:v})}/>
          <div className="field">
            <label>Фотография связи</label>
            <div className="upload">
              <input value={relForm.image_url||''} onChange={e=>setRelForm({...relForm,image_url:e.target.value})} placeholder="URL изображения"/>
              <label className="upload-btn"><Upload size={14}/> ЗАГРУЗИТЬ<input type="file" accept="image/*" onChange={e=>upload(e,'relationships',url=>setRelForm(f=>({...f,image_url:url})))}/></label>
            </div>
          </div>
          {relForm.image_url&&<Frame holo={relForm.holo_effect!==false} className="preview"><img src={relForm.image_url} alt="Предпросмотр"/></Frame>}
          <label className="check"><input type="checkbox" checked={relForm.holo_effect!==false} onChange={e=>setRelForm({...relForm,holo_effect:e.target.checked})}/> Голопроекция</label>
          <div className="editor-actions">
            <button className="btn" disabled={busy}>{relForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ СВЯЗЬ</>}</button>
            {relForm.id&&<button type="button" className="ghost" onClick={resetRelation}>ОТМЕНА</button>}
          </div>
        </form>
      </Holo>
      <div className="list">
        {relationships.map(x=><Holo className="list-item" key={x.id}>
          <div>
            {x.image_url?<Frame holo={x.holo_effect!==false} className="thumb"><img src={x.image_url} alt=""/></Frame>:<span className="avatar mini">{String(x.name||'?')[0]}</span>}
            <div><b>{x.name}</b><small>{x.role} // {x.relation}</small></div>
          </div>
          <div className="item-actions">
            <button className="ghost" title="Редактировать" onClick={()=>setRelForm({id:x.id,name:x.name||'',role:x.role||'',relation:x.relation||'',quote:x.quote||'',image_url:x.image_url||'',holo_effect:x.holo_effect!==false})}><Edit3 size={14}/></button>
            <button className="danger" title="Удалить" onClick={()=>remove('relationships',x.id,'связь')}><Trash2 size={15}/></button>
          </div>
        </Holo>)}
        {relationships.length===0&&<Holo className="empty slim"><UserRound/><p>Связей пока нет. Добавьте первую слева.</p></Holo>}
      </div>
    </div>}

    {tab==='gallery'&&<div className="admin-columns">
      <Holo className="editor">
        <div className="editor-head"><div><p className="kicker">VISUAL DATABASE</p><h2>{galForm.id?'РЕДАКТИРОВАНИЕ ИЗОБРАЖЕНИЯ':'НОВОЕ ИЗОБРАЖЕНИЕ'}</h2></div>{galForm.id?<Edit3/>:<Images/>}</div>
        <form onSubmit={saveGallery}>
          <div className="form-grid">
            <Field label="Название" value={galForm.title} onChange={v=>setGalForm({...galForm,title:v})}/>
            <Field label="Подпись (caption)" value={galForm.caption} onChange={v=>setGalForm({...galForm,caption:v})}/>
          </div>
          <Field label="Порядок сортировки" type="number" value={galForm.sort_order} onChange={v=>setGalForm({...galForm,sort_order:v})}/>
          <div className="field">
            <label>Изображение</label>
            <div className="upload">
              <input value={galForm.image_url||''} onChange={e=>setGalForm({...galForm,image_url:e.target.value})} placeholder="URL изображения"/>
              <label className="upload-btn"><Upload size={14}/> ЗАГРУЗИТЬ<input type="file" accept="image/*" onChange={e=>upload(e,'gallery',url=>setGalForm(f=>({...f,image_url:url})))}/></label>
            </div>
          </div>
          {galForm.image_url&&<Frame holo={galForm.holo_effect!==false} className="preview"><img src={galForm.image_url} alt="Предпросмотр"/></Frame>}
          <label className="check"><input type="checkbox" checked={galForm.holo_effect!==false} onChange={e=>setGalForm({...galForm,holo_effect:e.target.checked})}/> Голопроекция</label>
          <div className="editor-actions">
            <button className="btn" disabled={busy}>{galForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ</>}</button>
            {(galForm.id||galForm.image_url||galForm.title)&&<button type="button" className="ghost" onClick={resetGallery}>ОТМЕНА</button>}
          </div>
        </form>
      </Holo>
      <div className="list">
        {gallery.map(x=><Holo className="list-item" key={x.id}>
          <div>
            {x.image_url&&<Frame holo={x.holo_effect!==false} className="thumb"><img src={x.image_url} alt=""/></Frame>}
            <div><b>{x.title||'Без названия'}</b><small>{x.caption||x.description||''} {x.sort_order!=null?`// ПОРЯДОК ${x.sort_order}`:''}</small></div>
          </div>
          <div className="item-actions">
            <button className="ghost" title="Редактировать" onClick={()=>setGalForm({id:x.id,title:x.title||'',caption:x.caption||x.description||'',image_url:x.image_url||'',sort_order:x.sort_order??0,holo_effect:x.holo_effect!==false})}><Edit3 size={14}/></button>
            <button className="danger" title="Удалить" onClick={()=>deleteGallery(x)}><Trash2 size={15}/></button>
          </div>
        </Holo>)}
        {gallery.length===0&&<Holo className="empty slim"><Images/><p>Галерея пуста. Добавьте изображение слева.</p></Holo>}
      </div>
    </div>}

    <div className="admin-foot"><Terminal size={14}/> ИСТОЧНИК ДАННЫХ: SUPABASE // Данные отображаются напрямую из Supabase. Возраст и рост хранятся числами и форматируются интерфейсом.</div>
  </Page>;
}

function Field({label,value,onChange,type='text',required,min}){
  return<div className="field">
    <label>{label}</label>
    <input type={type} min={min} required={required} value={value??''} onChange={e=>onChange(e.target.value)}/>
  </div>;
}
function TextField({label,value,onChange,rows='5'}){
  return<div className="field">
    <label>{label}</label>
    <textarea rows={rows} value={value??''} onChange={e=>onChange(e.target.value)}/>
  </div>;
}

/* ============================================================
   ПРИЛОЖЕНИЕ
   ============================================================ */
function App(){
  const archive=useArchive();
  if(!archive.loaded)return<Layout>
    <Page title="Jedi Archives" sub="УСТАНОВКА СВЯЗИ"><div className="loading skeleton-loading"><div className="skeleton sk-title"/><div className="skeleton sk-panel"/><div className="skeleton sk-panel"/><p>ПОДКЛЮЧЕНИЕ К АРХИВУ…</p></div></Page>
  </Layout>;
  return<Layout error={archive.error}>
    <Routes>
      <Route path="/" element={<Home c={archive.character} ch={archive.chapters}/>}/>
      <Route path="/character" element={<Character c={archive.character}/>}/>
      <Route path="/history" element={<History ch={archive.chapters}/>}/>
      <Route path="/relationships" element={<Relationships r={archive.relationships}/>}/>
      <Route path="/gallery" element={<Gallery c={archive.character} gallery={archive.gallery}/>}/>
      <Route path="/events" element={<EventLog/>}/><Route path="/admin" element={<AdminLogin/>}/>
      <Route path="/admin/panel" element={<AdminGuard><AdminPanel archive={archive}/></AdminGuard>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </Layout>;
}

const basename=import.meta.env.BASE_URL.replace(/\/$/,'');
createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}><App/></BrowserRouter>
);
