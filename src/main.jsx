import React,{useEffect,useState,useRef,useId}from'react';
import{createRoot}from'react-dom/client';
import{createPortal}from'react-dom';
import{BrowserRouter,Routes,Route,Link,NavLink,useNavigate,useLocation}from'react-router-dom';
import{ArrowRight,BookOpen,ChevronLeft,ChevronRight,Database,Image as ImageIcon,LogIn,Menu,Shield,UserRound,X,Save,Trash2,Plus,Upload,RefreshCw,Lock,Terminal,Images,Edit3,Eye,EyeOff,Download,FileJson,ExternalLink,ArrowUp,ArrowDown,ClipboardPaste,Undo2,Search,Check,AlertTriangle}from'lucide-react';
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
const ADMIN_EMAIL=import.meta.env.VITE_ADMIN_EMAIL||'';
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

const isEditableTarget=target=>!!target?.closest?.('input,textarea,select,[contenteditable="true"],[contenteditable=""]');

// Storage URL может быть публичным URL, URL с query string или уже относительным путём.
// Единая функция используется при удалении записей и отмене незавершённой загрузки.
async function cleanupStorageUrl(url){
  if(!supabase||!url)return;
  try{
    const marker=`/${STORAGE_BUCKET}/`;
    const raw=String(url);
    const at=raw.indexOf(marker);
    const path=at>=0?decodeURIComponent(raw.slice(at+marker.length).split('?')[0]):(raw.startsWith(`${STORAGE_BUCKET}/`)?raw.slice(STORAGE_BUCKET.length+1):'');
    if(path)await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  }catch(e){console.warn('[archive] storage cleanup:',e?.message||e)}
}

function SafeImage({src,alt='',className='',...props}){
  const[bad,setBad]=useState(false);
  useEffect(()=>setBad(false),[src]);
  if(!src||bad)return<div className="image-error" role="img" aria-label="URL изображения недоступен"><AlertTriangle size={15}/> URL ИЗОБРАЖЕНИЯ НЕДОСТУПЕН</div>;
  return<img className={className} src={src} alt={alt} onError={()=>setBad(true)} {...props}/>;
}

async function compressImage(file,max=1600,quality=.82){
  if(!file?.type?.startsWith('image/')||typeof document==='undefined')return file;
  try{
    const bitmap=await createImageBitmap(file);
    const ratio=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*ratio));
    canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
    bitmap.close?.();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
    if(!blob)return file;
    return new File([blob],`${file.name.replace(/\.[^.]+$/,'')}.webp`,{type:'image/webp',lastModified:Date.now()});
  }catch{return file}
}

const formEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const draftStorageKey=(kind,id)=>`archive-draft:${kind==='relations'?'relationships':kind}:${id||'new'}`;

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
  useEffect(()=>{
    load();
    if(!supabase)return;
    let timer=0;
    const refresh=()=>{clearTimeout(timer);timer=setTimeout(load,120)};
    const visible=()=>{if(document.visibilityState==='visible')refresh()};
    window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',visible);
    const channel=supabase.channel('archive-live-updates')
      .on('postgres_changes',{event:'*',schema:'public',table:'character'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'chapters'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'relationships'},refresh)
      .on('postgres_changes',{event:'*',schema:'public',table:'gallery'},refresh)
      .subscribe();
    return()=>{clearTimeout(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',visible);supabase.removeChannel(channel)};
  },[]);
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
    const key=e=>{
      // Шорткаты никогда не должны вмешиваться в текст, select и числовые стрелки.
      if(isEditableTarget(e.target))return;
      if(e.key==='t'||e.key==='T'){
        setTheme(v=>{const n=v==='jedi'?'imperial':'jedi';localStorage.setItem('archive-theme',n);return n});
        return;
      }
      if(!konami.includes(e.key)){keys.length=0;return}
      keys.push(e.key);
      if(keys.slice(-konami.length).join()===konami.join()){setForceMode(v=>!v);keys.length=0}
    };
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

function Holo({children,className='',innerRef}){
  return<div ref={innerRef} className={`holo-panel ${className}`}>
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
      <Frame holo><SafeImage src={item.src} alt={item.alt||''}/></Frame>
      <figcaption><span>{item.caption}</span><span>{index+1} / {items.length}</span></figcaption><div className="lb-thumbs">{items.map((x,i)=><button key={i} className={i===index?'active':''} onClick={e=>{e.stopPropagation();onStep(i-index)}}><SafeImage src={x.src} alt=""/></button>)}</div>
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
            ?<SafeImage src={c.image_url} alt={c.name}/>
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
              ?<SafeImage src={c.image_url} alt={c.name} onClick={()=>setLb(0)}/>
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
  const[lb,setLb]=useState(-1);const[open,setOpen]=useState(0);const location=useLocation();
  const visible=[...ch].filter(x=>x.published!==false).sort((a,b)=>(a.chapter_number??0)-(b.chapter_number??0));
  const covers=visible.filter(x=>x.cover_image);
  useEffect(()=>{
    const id=new URLSearchParams(location.search).get('chapter');
    const index=id?visible.findIndex(x=>String(x.id)===String(id)):-1;
    if(index>=0){setOpen(index);requestAnimationFrame(()=>document.getElementById(`chapter-${id}`)?.scrollIntoView({behavior:'smooth',block:'center'}))}
  },[location.search,visible.length]);
  return<Page title="История" sub="ХРОНОЛОГИЯ // РАННИЕ ГОДЫ">
    {visible.length===0
      ?<Holo className="empty"><BookOpen/><p>Опубликованных глав пока нет. Добавьте их через админ-панель.</p></Holo>
      :<div className="timeline">
        {visible.map((x,i)=><article id={`chapter-${x.id}`} className={`chapter ${open===i?'chapter-open':''}`} key={x.id}>
          <div className="marker">{x.chapter_number!=null?String(x.chapter_number).padStart(2,'0'):String(i+1).padStart(2,'0')}</div>
          <Holo className="chapter-panel">
            <p className="kicker">ГЛАВА {x.chapter_number??i+1}</p>
            <button className="chapter-toggle" onClick={()=>setOpen(open===i?-1:i)}>{open===i?'СВЕРНУТЬ':'ОТКРЫТЬ'} ЗАПИСЬ</button>{open===i&&<span className="chapter-nav">{i>0&&<button onClick={()=>setOpen(i-1)}>← ПРЕД.</button>}{i<visible.length-1&&<button onClick={()=>setOpen(i+1)}>СЛЕД. →</button>}</span>}
            <h2>{x.title}</h2>
            <div className="section-line"/>
            {x.cover_image&&<Frame holo={x.holo_effect!==false} className="cover zoomable" onClick={()=>setLb(covers.findIndex(cv=>cv.id===x.id))}><SafeImage src={x.cover_image} alt={x.title||''} loading="lazy"/></Frame>}
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
            ?<Frame holo={x.holo_effect!==false} className="photo"><SafeImage src={x.image_url} alt={x.name} loading="lazy"/></Frame>
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
          <Frame holo={x.holo_effect!==false}><SafeImage src={x.image_url||x.url} alt={x.caption||x.title||'Архивный снимок'} loading="lazy"/></Frame>
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
  const[email,setEmail]=useState(ADMIN_EMAIL),[password,setPassword]=useState(''),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[showPassword,setShowPassword]=useState(false);
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
        <label htmlFor="admin-email">ЛОГИН<input id="admin-email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tenkara" autoComplete="username" autoFocus required/></label>
        <label htmlFor="admin-password">ПАРОЛЬ<div className="password-field"><input id="admin-password" type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/><button type="button" className="password-toggle" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Скрыть пароль':'Показать пароль'}>{showPassword?<EyeOff size={15}/>:<Eye size={15}/>}</button></div></label>
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
const EMPTY_CHAPTER={id:null,chapter_number:'',title:'',content:'',cover_image:'',published:true,holo_effect:true};
const EMPTY_RELATION={id:null,name:'',role:'',relation:'',quote:'',image_url:'',holo_effect:true};
const EMPTY_GALLERY={id:null,title:'',caption:'',image_url:'',sort_order:0,holo_effect:true};

function ImagePicker({folder,onSelect,onClose}){
  const[items,setItems]=useState([]),[busy,setBusy]=useState(true),[error,setError]=useState('');
  useEffect(()=>{
    let alive=true;
    (async()=>{
      if(!supabase){setBusy(false);return}
      const{data,error}=await supabase.storage.from(STORAGE_BUCKET).list(folder,{limit:100,sortBy:{column:'created_at',order:'desc'}});
      if(!alive)return;
      if(error)setError(error.message);else setItems((data||[]).filter(x=>x.name).map(x=>({name:x.name,url:supabase.storage.from(STORAGE_BUCKET).getPublicUrl(`${folder}/${x.name}`).data.publicUrl})));
      setBusy(false);
    })();
    return()=>{alive=false};
  },[folder]);
  return<PortalOverlay onClose={onClose}>
    <div className="picker holo-panel" role="dialog" aria-modal="true" aria-label="Выбрать загруженное изображение">
      <div className="picker-head"><div><p className="kicker">STORAGE // {folder.toUpperCase()}</p><h2>ВЫБРАТЬ ИЗ ЗАГРУЖЕННЫХ</h2></div><button className="ghost" onClick={onClose} aria-label="Закрыть"><X size={16}/></button></div>
      {busy&&<div className="loading">СКАНИРОВАНИЕ BUCKET…</div>}
      {error&&<div className="inline-error">{error}</div>}
      {!busy&&!error&&!items.length&&<div className="empty slim"><Images/><p>В этой папке пока нет изображений.</p></div>}
      <div className="picker-grid">{items.map(x=><button type="button" className="picker-item" key={x.name} onClick={()=>{onSelect(x.url);onClose()}}><SafeImage src={x.url} alt={x.name}/><small>{x.name}</small></button>)}</div>
    </div>
  </PortalOverlay>;
}
function PortalOverlay({children,onClose}){return createPortal(<div className="modal-backdrop" onMouseDown={onClose}>{<div onMouseDown={e=>e.stopPropagation()}>{children}</div>}</div>,document.body)}
function UploadField({value,onChange,folder,formKey,onUpload}){
  const[pick,setPick]=useState(false),[drag,setDrag]=useState(false);
  const choose=file=>file&&onUpload(file,folder,onChange,formKey,value);
  const drop=e=>{e.preventDefault();setDrag(false);choose(e.dataTransfer.files?.[0])};
  const paste=e=>{const file=[...(e.clipboardData?.files||[])].find(x=>x.type.startsWith('image/'));if(file){e.preventDefault();choose(file)}};
  return<>
    <div className={`upload ${drag?'drag-active':''}`} tabIndex="0" onDrop={drop} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onPaste={paste}>
      <input value={value||''} onChange={e=>onChange(e.target.value)} placeholder="URL изображения"/>
      <div className="upload-buttons"><button type="button" className="upload-btn" onClick={()=>setPick(true)}><Images size={14}/> ВЫБРАТЬ</button><label className="upload-btn"><Upload size={14}/> ЗАГРУЗИТЬ<input type="file" accept="image/*" onChange={e=>{choose(e.target.files?.[0]);e.target.value=''}}/></label></div>
      <small className="drop-hint"><ClipboardPaste size={12}/> Вставьте из буфера или перетащите файл сюда</small>
    </div>
    {pick&&<ImagePicker folder={folder} onSelect={onChange} onClose={()=>setPick(false)}/>}
  </>;
}
function ChapterPreview({chapter}){
  const text=String(chapter.content||'');
  return<div className="chapter-preview holo-panel"><div className="preview-head"><span className="kicker">LIVE PREVIEW // {text.length} ЗНАКОВ</span><small>Пустая строка = новый абзац</small></div><h3>{chapter.title||'Без названия'}</h3><div className="section-line"/>{text.split(/\n+/).filter(Boolean).map((x,i)=><p key={i}>{x}</p>)}{!text&&<p className="muted">Предпросмотр появится здесь после ввода текста.</p>}</div>;
}
function DraftBanner({info,onRestore,onDelete}){if(!info)return null;return<div className="draft-banner" role="status"><AlertTriangle size={15}/><span>Найден несохранённый черновик от {new Date(info.savedAt).toLocaleString('ru-RU')}</span><button className="ghost" onClick={onRestore}>ВОССТАНОВИТЬ</button><button className="ghost" onClick={onDelete}>УДАЛИТЬ</button></div>}
function SaveBar({dirty,onSave}){return<div className={`save-bar ${dirty?'is-dirty':''}`}><span><span className="save-indicator">●</span>{dirty?'Есть несохранённые изменения':'Все изменения сохранены'}</span>{dirty&&<button type="button" className="ghost" onClick={onSave}><Save size={14}/> СОХРАНИТЬ</button>}</div>}

const CHAR_FIELDS=['name','species','age','height','homeworld','status','callsign','summary','appearance','personality','preferences','dislikes','motivation','image_url','holo_effect'];
const CH_FIELDS=['chapter_number','title','content','cover_image','published','holo_effect'];
const REL_FIELDS=['name','role','relation','quote','image_url','holo_effect'];
const GAL_FIELDS=['title','caption','image_url','sort_order','holo_effect'];
const only=(x,fields)=>fields.reduce((o,k)=>(o[k]=x?.[k]??(k==='holo_effect'?true:''),o),{});

function AdminPanel({archive}){
  const{character,chapters,relationships,gallery,reload}=archive;
  const nav=useNavigate(),location=useLocation();
  const initialTab=new URLSearchParams(location.search).get('tab');
  const[tab,setTab]=useState(['character','chapters','relations','gallery'].includes(initialTab)?initialTab:'character');
  const[busy,setBusy]=useState(false),[msg,setMsg]=useState(null),[confirmState,setConfirmState]=useState(null),[pendingTab,setPendingTab]=useState('');
  const[form,setForm]=useState({...EMPTY_CHARACTER});
  const[chForm,setChForm]=useState({...EMPTY_CHAPTER});
  const[relForm,setRelForm]=useState({...EMPTY_RELATION});
  const[galForm,setGalForm]=useState({...EMPTY_GALLERY});
  const[userEmail,setUserEmail]=useState('');
  const[search,setSearch]=useState({chapters:'',relations:'',gallery:''});
  const[visibility,setVisibility]=useState('all');
  const[noPhoto,setNoPhoto]=useState(false);
  const[editTarget,setEditTarget]=useState(null),[dragGallery,setDragGallery]=useState(null);
  const[serverDrafts,setServerDrafts]=useState({}),[draftsReady,setDraftsReady]=useState(false),dismissedDrafts=useRef(new Set());
  const[pendingUploads]=useState(()=>new Map()),editorRef=useRef(null),listRef=useRef(null);

  useEffect(()=>{if(supabase)supabase.auth.getUser().then(({data})=>setUserEmail(data.user?.email||''))},[]);
  useEffect(()=>{const t=new URLSearchParams(location.search).get('tab');if(t&&['character','chapters','relations','gallery'].includes(t))setTab(t)},[location.search]);
  useEffect(()=>{
    const found={};
    ['character','chapters','relations','gallery'].forEach(kind=>{
      const prefix=`archive-draft:${kind==='relations'?'relationships':kind}:`;
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);if(!key?.startsWith(prefix))continue;
        try{const x=JSON.parse(localStorage.getItem(key)||'null');if(x?.data&&x.savedAt)found[key]=x}catch{}
      }
    });
    setServerDrafts(found);setDraftsReady(true);
  },[]);
  const characterBase=character?{...EMPTY_CHARACTER,...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER};
  const chapterBase=chForm.id?({...EMPTY_CHAPTER,...(chapters.find(x=>x.id===chForm.id)||{}),holo_effect:chapters.find(x=>x.id===chForm.id)?.holo_effect!==false}):EMPTY_CHAPTER;
  const relationBase=relForm.id?({...EMPTY_RELATION,...(relationships.find(x=>x.id===relForm.id)||{}),holo_effect:relationships.find(x=>x.id===relForm.id)?.holo_effect!==false}):EMPTY_RELATION;
  const galleryBase=galForm.id?({...EMPTY_GALLERY,...(gallery.find(x=>x.id===galForm.id)||{}),holo_effect:gallery.find(x=>x.id===galForm.id)?.holo_effect!==false}):EMPTY_GALLERY;
  const dirty={character:!formEqual(only(form,CHAR_FIELDS),only(characterBase,CHAR_FIELDS)),chapters:!formEqual(only(chForm,CH_FIELDS),only(chapterBase,CH_FIELDS)),relations:!formEqual(only(relForm,REL_FIELDS),only(relationBase,REL_FIELDS)),gallery:!formEqual(only(galForm,GAL_FIELDS),only(galleryBase,GAL_FIELDS))};
  const anyDirty=Object.values(dirty).some(Boolean);

  // Внешний reload не стирает начатое редактирование персонажа.
  useEffect(()=>{if(!dirty.character)setForm(character?{...EMPTY_CHARACTER,...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER})},[character]);
  useEffect(()=>{
    if(!draftsReady)return;
    const timers=[];
    const all={character:form,chapters:chForm,relations:relForm,gallery:galForm};
    Object.entries(all).forEach(([key,data])=>{
      if(!dirty[key])return;
      timers.push(setTimeout(()=>{const storageKey=draftStorageKey(key,data.id||formId(key));const record={savedAt:Date.now(),data};localStorage.setItem(storageKey,JSON.stringify(record));setServerDrafts(x=>({...x,[storageKey]:record}))},1000));
    });
    return()=>timers.forEach(clearTimeout);
  },[form,chForm,relForm,galForm,draftsReady,dirty.character,dirty.chapters,dirty.relations,dirty.gallery]);
  useEffect(()=>{
    const before=e=>{if(anyDirty){e.preventDefault();e.returnValue='Есть несохранённые изменения.'}};
    window.addEventListener('beforeunload',before);return()=>window.removeEventListener('beforeunload',before);
  },[anyDirty]);
  useEffect(()=>{
    const guard=e=>{
      if(!anyDirty)return;
      const link=e.target.closest?.('a[href]');
      const href=link?.getAttribute('href');
      if(!href||!href.startsWith('/')||href.startsWith('/admin'))return;
      e.preventDefault();e.stopPropagation();
      const target=href.startsWith(basename)?(href.slice(basename.length)||'/'):href;
      setConfirmState({label:'В форме есть несохранённые изменения. Покинуть редактор?',action:()=>{resetActive();nav(target)}});
    };
    document.addEventListener('click',guard,true);return()=>document.removeEventListener('click',guard,true);
  },[anyDirty,nav]);
  useEffect(()=>{
    const key=e=>{
      if(e.ctrlKey&&e.key.toLowerCase()==='s'){e.preventDefault();document.querySelector('.editor form')?.requestSubmit()}
      if(e.key==='Escape'&&!isEditableTarget(e.target)&&anyDirty)resetActive();
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[anyDirty,tab]);
  useEffect(()=>{if(msg?.kind==='ok'){const t=setTimeout(()=>setMsg(null),msg.undo?7000:4500);return()=>clearTimeout(t)}},[msg]);

  const notify=(text,kind='ok',detail='',undo)=>setMsg({text,kind,detail,undo});
  const run=async(fn,success)=>{
    setBusy(true);
    try{const res=await fn();if(res?.error)throw res.error;if(Array.isArray(res?.data)&&res.data.length===0)throw new Error('Запись не найдена или изменение заблокировано RLS.');notify(success);await reload();return res||true}
    catch(e){notify('Ошибка: '+(e.message||e),'err',e.message||String(e));return false}
    finally{setBusy(false)}
  };
  const formId=key=>key==='character'?character?.id:(key==='chapters'?chForm.id:key==='relations'?relForm.id:galForm.id);
  const currentDraftKey=key=>draftStorageKey(key,formId(key));
  const clearDraft=key=>{const storageKey=currentDraftKey(key);localStorage.removeItem(storageKey);dismissedDrafts.current.delete(storageKey);setServerDrafts(x=>{const n={...x};delete n[storageKey];return n})};
  const draft=key=>{const storageKey=currentDraftKey(key);return serverDrafts[storageKey]&&!dismissedDrafts.current.has(storageKey)?serverDrafts[storageKey]:null};
  const restoreDraft=key=>{const storageKey=currentDraftKey(key),data=serverDrafts[storageKey]?.data;if(!data)return;dismissedDrafts.current.add(storageKey);if(key==='character')setForm({...EMPTY_CHARACTER,...data});if(key==='chapters')setChForm({...EMPTY_CHAPTER,...data});if(key==='relations')setRelForm({...EMPTY_RELATION,...data});if(key==='gallery')setGalForm({...EMPTY_GALLERY,...data});setTab(key);nav(`/admin/panel?tab=${key}`,{replace:true})};
  const removeDraft=key=>{const storageKey=currentDraftKey(key);clearDraft(key);dismissedDrafts.current.add(storageKey)};
  const requestConfirm=(label,action)=>setConfirmState({label,action});
  const acceptConfirm=async()=>{const x=confirmState;setConfirmState(null);await x?.action?.()};
  const switchTab=next=>{if(next===tab)return;if(dirty[tab]){setPendingTab(next);requestConfirm('В форме есть несохранённые изменения. Перейти и потерять их?',()=>{resetActive();setTab(next);nav(`/admin/panel?tab=${next}`,{replace:true});setPendingTab('')})}else{setTab(next);nav(`/admin/panel?tab=${next}`,{replace:true})}};
  const rememberUpload=(key,url)=>{if(!pendingUploads.has(key))pendingUploads.set(key,new Set());pendingUploads.get(key).add(url)};
  const forgetUpload=(key,url)=>{pendingUploads.get(key)?.delete(url)};
  const cancelUploads=key=>{const urls=[...(pendingUploads.get(key)||[])];pendingUploads.delete(key);urls.forEach(cleanupStorageUrl)};
  const uploadFile=async(file,folder)=>{
    const compressed=await compressImage(file);
    const ext=compressed.type==='image/webp'?'webp':(compressed.name.split('.').pop()?.toLowerCase()||'jpg');
    const path=`${folder}/${Date.now()}-${Math.random().toString(36).slice(2,7)}.${ext}`;
    const up=await supabase.storage.from(STORAGE_BUCKET).upload(path,compressed,{upsert:false,contentType:compressed.type||file.type});
    if(up.error)throw up.error;
    return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  };
  const handleUpload=async(file,folder,apply,key,oldUrl)=>{
    setBusy(true);try{const url=await uploadFile(file,folder);if(oldUrl&&pendingUploads.get(key)?.has(oldUrl)){forgetUpload(key,oldUrl);cleanupStorageUrl(oldUrl)}rememberUpload(key,url);apply(url);notify('Файл сжат и загружен в Storage. Нажмите «Сохранить».')}catch(e){notify('Ошибка Storage: '+(e.message||e),'err',e.message||String(e))}finally{setBusy(false)}};
  const finishUpload=(key,currentUrl)=>{const urls=[...(pendingUploads.get(key)||[])];urls.filter(x=>x!==currentUrl).forEach(cleanupStorageUrl);pendingUploads.delete(key)};
  const saveAndCleanupOld=(oldUrl,newUrl)=>{if(oldUrl&&oldUrl!==newUrl)cleanupStorageUrl(oldUrl)};

  const saveCharacter=async e=>{e.preventDefault();if(!supabase)return notify('Supabase не подключён. Проверьте .env.','err');const name=String(form.name||'').trim();const payload={name,first_name:name.split(/\s+/)[0]||'',last_name:name.split(/\s+/).slice(1).join(' '),species:form.species||'',age:Number(form.age)||0,height:Number(form.height)||0,homeworld:form.homeworld||'',status:form.status||'',callsign:form.callsign||'',summary:form.summary||'',appearance:form.appearance||'',personality:form.personality||'',preferences:form.preferences||'',dislikes:form.dislikes||'',motivation:form.motivation||'',image_url:form.image_url||'',holo_effect:form.holo_effect!==false};const old=character?.image_url;const res=await run(()=>writeResilient(p=>character?.id?supabase.from('character').update(p).eq('id',character.id).select():supabase.from('character').insert(p).select(),payload).then(x=>{if(x.error)throw x.error;if(!x.data?.length)throw new Error('Запись character не найдена или изменение заблокировано RLS.');return x}), 'Данные персонажа сохранены в Supabase.');if(res){saveAndCleanupOld(old,payload.image_url);finishUpload('character',payload.image_url);clearDraft('character')}};
  const nextChapterNumber=Math.max(0,...chapters.map(x=>Number(x.chapter_number)||0))+1;
  const duplicateChapter=!!chForm.chapter_number&&chapters.some(x=>Number(x.chapter_number)===Number(chForm.chapter_number)&&x.id!==chForm.id);
  const saveChapter=async e=>{e.preventDefault();const number=Number(chForm.chapter_number)||nextChapterNumber;if(duplicateChapter)return notify(`Номер главы ${number} уже используется. Выберите другой.`,`err`);const payload={chapter_number:number,title:chForm.title||'',content:chForm.content||'',cover_image:chForm.cover_image||'',published:!!chForm.published,holo_effect:chForm.holo_effect!==false};const old=chapters.find(x=>x.id===chForm.id);const res=await run(()=>writeResilient(p=>chForm.id?supabase.from('chapters').update(p).eq('id',chForm.id).select():supabase.from('chapters').insert(p).select(),payload).then(x=>{if(x.error)throw x.error;if(!x.data?.length)throw new Error('Глава не найдена или изменение заблокировано RLS.');return x}),chForm.id?'Глава обновлена.':'Глава добавлена.');if(res){saveAndCleanupOld(old?.cover_image,payload.cover_image);finishUpload('chapters',payload.cover_image);clearDraft('chapters');if(!chForm.id)setChForm({...EMPTY_CHAPTER})}};
  const togglePublish=x=>run(()=>supabase.from('chapters').update({published:!(x.published!==false)}).eq('id',x.id).select().then(r=>{if(r.error)throw r.error;if(!r.data?.length)throw new Error('Глава не найдена или изменение заблокировано RLS.');return r}),x.published!==false?'Глава скрыта из истории.':'Глава снова опубликована.');
  const saveRelation=async e=>{e.preventDefault();const payload={name:relForm.name||'',role:relForm.role||'',relation:relForm.relation||'',quote:relForm.quote||'',image_url:relForm.image_url||'',holo_effect:relForm.holo_effect!==false};const old=relationships.find(x=>x.id===relForm.id);const res=await run(()=>writeResilient(p=>relForm.id?supabase.from('relationships').update(p).eq('id',relForm.id).select():supabase.from('relationships').insert(p).select(),payload).then(x=>{if(x.error)throw x.error;if(!x.data?.length)throw new Error('Связь не найдена или изменение заблокировано RLS.');return x}),relForm.id?'Связь обновлена.':'Связь добавлена.');if(res){saveAndCleanupOld(old?.image_url,payload.image_url);finishUpload('relations',payload.image_url);clearDraft('relations');if(!relForm.id)setRelForm({...EMPTY_RELATION})}};
  const saveGallery=async e=>{e.preventDefault();const payload={title:galForm.title||'',caption:galForm.caption||'',image_url:galForm.image_url||'',sort_order:Number(galForm.sort_order)||0,holo_effect:galForm.holo_effect!==false};const old=gallery.find(x=>x.id===galForm.id);const res=await run(()=>writeResilient(p=>galForm.id?supabase.from('gallery').update(p).eq('id',galForm.id).select():supabase.from('gallery').insert(p).select(),payload).then(x=>{if(x.error)throw x.error;if(!x.data?.length)throw new Error('Изображение не найдено или изменение заблокировано RLS.');return x}),galForm.id?'Изображение обновлено.':'Изображение добавлено.');if(res){saveAndCleanupOld(old?.image_url,payload.image_url);finishUpload('gallery',payload.image_url);clearDraft('gallery');if(!galForm.id)setGalForm({...EMPTY_GALLERY})}};

  const remove=(table,id,label,item)=>requestConfirm(`Точно удалить ${label}? Данные можно вернуть в течение нескольких секунд.`,async()=>{const res=await run(()=>supabase.from(table).delete().eq('id',id).select(),`${label[0].toUpperCase()+label.slice(1)} удалена.`);if(res){const timer=setTimeout(()=>cleanupStorageUrl(item?.image_url||item?.cover_image),7000);notify(`${label[0].toUpperCase()+label.slice(1)} удалена.`, 'ok','',async()=>{clearTimeout(timer);const restored={...item};delete restored.created_at;const back=await run(()=>supabase.from(table).insert(restored).select(),`${label[0].toUpperCase()+label.slice(1)} восстановлена.`);if(back)await reload()})}});
  const moveGallery=async(id,direction)=>{const list=[...gallery].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));const i=list.findIndex(x=>x.id===id),j=i+direction;if(i<0||j<0||j>=list.length)return;const a=list[i],b=list[j];setBusy(true);try{const results=await Promise.all([supabase.from('gallery').update({sort_order:b.sort_order??j}).eq('id',a.id).select(),supabase.from('gallery').update({sort_order:a.sort_order??i}).eq('id',b.id).select()]);const bad=results.find(x=>x.error||!x.data?.length);if(bad)throw bad.error||new Error('Порядок галереи не изменён.');notify('Порядок галереи обновлён.');await reload()}catch(e){notify('Ошибка сортировки: '+(e.message||e),'err',e.message||String(e))}finally{setBusy(false)}};
  const reorderGallery=async(id,targetId)=>{const list=[...gallery].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));const from=list.findIndex(x=>x.id===id),to=list.findIndex(x=>x.id===targetId);if(from<0||to<0||from===to)return;const moved=list.splice(from,1)[0];list.splice(to,0,moved);const changed=list.filter((x,i)=>x.sort_order!==i);setBusy(true);try{const results=await Promise.all(changed.map((x,i)=>supabase.from('gallery').update({sort_order:i}).eq('id',x.id).select()));const bad=results.find(x=>x.error||!x.data?.length);if(bad)throw bad.error||new Error('Порядок галереи не изменён.');notify('Порядок галереи обновлён.');await reload()}catch(e){notify('Ошибка сортировки: '+(e.message||e),'err',e.message||String(e))}finally{setBusy(false)}};
  const resetCharacter=()=>{cancelUploads('character');setForm(character?{...EMPTY_CHARACTER,...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER});clearDraft('character');};
  const resetChapter=()=>{cancelUploads('chapters');setChForm({...EMPTY_CHAPTER});clearDraft('chapters');setEditTarget(null)};
  const resetRelation=()=>{cancelUploads('relations');setRelForm({...EMPTY_RELATION});clearDraft('relations');setEditTarget(null)};
  const resetGallery=()=>{cancelUploads('gallery');setGalForm({...EMPTY_GALLERY});clearDraft('gallery');setEditTarget(null)};
  const resetActive=()=>tab==='character'?resetCharacter():tab==='chapters'?resetChapter():tab==='relations'?resetRelation():resetGallery();
  const editChapter=x=>{setChForm({id:x.id,chapter_number:x.chapter_number??'',title:x.title||'',content:x.content||'',cover_image:x.cover_image||'',published:x.published!==false,holo_effect:x.holo_effect!==false});setEditTarget(x.id);requestAnimationFrame(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const editRelation=x=>{setRelForm({id:x.id,name:x.name||'',role:x.role||'',relation:x.relation||'',quote:x.quote||'',image_url:x.image_url||'',holo_effect:x.holo_effect!==false});setEditTarget(x.id);requestAnimationFrame(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const editGallery=x=>{setGalForm({id:x.id,title:x.title||'',caption:x.caption||x.description||'',image_url:x.image_url||'',sort_order:x.sort_order??0,holo_effect:x.holo_effect!==false});setEditTarget(x.id);requestAnimationFrame(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const goList=()=>listRef.current?.scrollIntoView({behavior:'smooth',block:'start'});
  const exportData=()=>{const data={exportedAt:new Date().toISOString(),character:character?[character]:[],chapters,relationships, gallery};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`archive-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);notify('JSON-резервная копия скачана.')};
  const importData=async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{const data=JSON.parse(await file.text());const tables=[['chapters',data.chapters],['relationships',data.relationships],['gallery',data.gallery]];if(data.character?.length)tables.unshift(['character',data.character]);for(const [table,rows] of tables){if(!Array.isArray(rows)||!rows.length)continue;const r=await supabase.from(table).upsert(rows);if(r.error)throw r.error}notify('JSON импортирован в Supabase.');await reload()}catch(e){notify('Ошибка импорта: '+(e.message||e),'err',e.message||String(e))}};

  const sortedChapters=[...chapters].sort((a,b)=>(a.chapter_number??0)-(b.chapter_number??0));
  const filteredChapters=sortedChapters.filter(x=>(!search.chapters||`${x.title||''} ${x.content||''} ${x.chapter_number||''}`.toLowerCase().includes(search.chapters.toLowerCase()))&&(visibility==='all'||(visibility==='published'?x.published!==false:x.published===false)));
  const filteredRelations=relationships.filter(x=>(!search.relations||`${x.name||''} ${x.role||''} ${x.relation||''}`.toLowerCase().includes(search.relations.toLowerCase()))&&(!noPhoto||!x.image_url));
  const sortedGallery=[...gallery].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));
  const filteredGallery=sortedGallery.filter(x=>!search.gallery||`${x.title||''} ${x.caption||x.description||''}`.toLowerCase().includes(search.gallery.toLowerCase()));
  const tabs=[['character','ПЕРСОНАЖ',<UserRound size={15}/>,null],['chapters','ГЛАВЫ',<BookOpen size={15}/>,filteredChapters.length],['relations','СВЯЗИ',<Database size={15}/>,filteredRelations.length],['gallery','ГАЛЕРЕЯ',<Images size={15}/>,filteredGallery.length]];
  const draftBanner=<DraftBanner info={draft(tab)} onRestore={()=>restoreDraft(tab)} onDelete={()=>removeDraft(tab)}/>;
  const editorProps={innerRef:editorRef};

  return<Page title="Панель управления" sub="АДМИНИСТРАТОР // ДОСТУП РАЗРЕШЁН">
    <div className="admin-top"><span><span className="pulse">●</span> ДОСТУП РАЗРЕШЁН{userEmail?` // ${userEmail}`:''}</span><div><button className="ghost" onClick={reload}><RefreshCw size={14}/> ОБНОВИТЬ</button><button className="ghost" onClick={exportData}><Download size={14}/> ЭКСПОРТ JSON</button><label className="ghost import-label"><Upload size={14}/> ИМПОРТ JSON<input type="file" accept="application/json" onChange={importData}/></label><button className="ghost" onClick={async()=>{await supabase.auth.signOut();nav('/admin')}}><Lock size={14}/> ВЫЙТИ</button></div></div>
    <div className="admin-tabs">{tabs.map(([id,label,icon,count])=><button key={id} className={tab===id?'active':''} onClick={()=>switchTab(id)}>{icon} {label}{count!=null&&<i className="count">{count}</i>}</button>)}</div>
    {msg&&<div key={msg.text+String(msg.kind)} className={`toast ${msg.kind}`} aria-live="polite" onClick={()=>setMsg(null)}>{msg.text}{msg.detail&&<details onClick={e=>e.stopPropagation()}><summary>Техническая ошибка</summary><code>{msg.detail}</code></details>}{msg.undo&&<button className="undo" onClick={e=>{e.stopPropagation();msg.undo();setMsg(null)}}><Undo2 size={13}/> ОТМЕНИТЬ</button>}</div>}
    {confirmState&&<div className="inline-confirm" role="alert"><AlertTriangle size={15}/><span>{confirmState.label}</span><button className="ghost" onClick={acceptConfirm}>ДА</button><button className="ghost" onClick={()=>{setConfirmState(null);setPendingTab('')}}>ОТМЕНА</button></div>}
    {draftBanner}

    {tab==='character'&&<Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">PERSONNEL RECORD // SA-001</p><h2>{character?.id?'РЕДАКТИРОВАНИЕ ЗАПИСИ':'НОВАЯ ЗАПИСЬ ПЕРСОНАЖА'}</h2></div><Save/></div><form onSubmit={saveCharacter}><div className="form-grid"><Field label="Имя и фамилия" required value={form.name} onChange={v=>setForm({...form,name:v})}/><Field label="Раса" value={form.species} onChange={v=>setForm({...form,species:v})}/><Field label="Возраст (число)" type="number" min="0" value={form.age} onChange={v=>setForm({...form,age:v})}/><Field label="Рост (см)" type="number" min="0" value={form.height} onChange={v=>setForm({...form,height:v})}/><Field label="Родной мир" value={form.homeworld} onChange={v=>setForm({...form,homeworld:v})}/><Field label="Статус" value={form.status} onChange={v=>setForm({...form,status:v})}/><Field label="Позывной" value={form.callsign} onChange={v=>setForm({...form,callsign:v})}/><div className="field"><label>Основная фотография</label><UploadField value={form.image_url} onChange={v=>setForm({...form,image_url:v})} folder="character" formKey="character" onUpload={handleUpload}/></div></div>{form.image_url&&<Frame holo={form.holo_effect!==false} className="preview"><SafeImage src={form.image_url} alt="Предпросмотр"/></Frame>}<label className="check"><input type="checkbox" checked={form.holo_effect!==false} onChange={e=>setForm({...form,holo_effect:e.target.checked})}/> Голопроекция портрета</label><TextField label="Краткое описание" value={form.summary} onChange={v=>setForm({...form,summary:v})}/><TextField label="Внешность" value={form.appearance} onChange={v=>setForm({...form,appearance:v})}/><TextField label="Характер" value={form.personality} onChange={v=>setForm({...form,personality:v})}/><TextField label="Предпочтения и симпатии" value={form.preferences} onChange={v=>setForm({...form,preferences:v})}/><TextField label="Антипатии и избегания" value={form.dislikes} onChange={v=>setForm({...form,dislikes:v})}/><TextField label="Мотивация" value={form.motivation} onChange={v=>setForm({...form,motivation:v})}/><SaveBar dirty={dirty.character} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><button className="btn" disabled={busy}><Save size={16}/> СОХРАНИТЬ В БАЗУ</button>{dirty.character&&<button type="button" className="ghost" onClick={resetCharacter}>ОТМЕНА</button>}</form></Holo>}

    {tab==='chapters'&&<div className="admin-columns"><Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">CONTENT MANAGEMENT</p><h2>{chForm.id?'РЕДАКТИРОВАНИЕ ГЛАВЫ':'НОВАЯ ГЛАВА'}</h2></div>{chForm.id?<Edit3/>:<Plus/>}</div><form onSubmit={saveChapter}><div className="form-grid"><Field label="Номер главы" type="number" min="0" required value={chForm.chapter_number||nextChapterNumber} onChange={v=>setChForm({...chForm,chapter_number:v})}/><Field label="Название" required value={chForm.title} onChange={v=>setChForm({...chForm,title:v})}/></div>{duplicateChapter&&<div className="inline-error"><AlertTriangle size={14}/> Этот номер главы уже используется.</div>}<TextField label="Текст главы" value={chForm.content} onChange={v=>setChForm({...chForm,content:v})}/><ChapterPreview chapter={chForm}/><div className="field"><label>Обложка главы</label><UploadField value={chForm.cover_image} onChange={v=>setChForm({...chForm,cover_image:v})} folder="chapters" formKey="chapters" onUpload={handleUpload}/></div>{chForm.cover_image&&<Frame holo={chForm.holo_effect!==false} className="preview"><SafeImage src={chForm.cover_image} alt="Обложка"/></Frame>}<label className="check"><input type="checkbox" checked={chForm.holo_effect!==false} onChange={e=>setChForm({...chForm,holo_effect:e.target.checked})}/> Голопроекция обложки</label><label className="check"><input type="checkbox" checked={chForm.published} onChange={e=>setChForm({...chForm,published:e.target.checked})}/> Публиковать главу</label><SaveBar dirty={dirty.chapters} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><div className="editor-actions"><button className="btn" disabled={busy}>{chForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ ГЛАВУ</>}</button>{chForm.id&&<button type="button" className="ghost" onClick={resetChapter}>ОТМЕНА</button>}{chForm.id&&<button type="button" className="ghost mobile-only" onClick={goList}>К СПИСКУ</button>}</div></form></Holo><div className="list" ref={listRef}>{filteredChapters.map(x=><Holo className={`list-item ${editTarget===x.id?'edit-highlight':''}`} key={x.id}><div><span className="list-number">{x.chapter_number!=null?String(x.chapter_number).padStart(2,'0'):'—'}</span><div><b>{x.title||'Без названия'}</b><small className={x.published===false?'st-hidden':'st-on'}>{x.published===false?'СКРЫТА':'ОПУБЛИКОВАНА'}</small></div></div><div className="item-actions"><Link className="ghost" title="Открыть на публичной странице" to={`/history?chapter=${encodeURIComponent(x.id)}#chapter-${x.id}`}><ExternalLink size={14}/> ОТКРЫТЬ</Link><button className="ghost" title={x.published===false?'Опубликовать':'Скрыть'} onClick={()=>togglePublish(x)}>{x.published===false?<EyeOff size={14}/>:<Eye size={14}/>}</button><button className="ghost" title="Редактировать" onClick={()=>editChapter(x)}><Edit3 size={14}/></button><button className="danger" title="Удалить" onClick={()=>remove('chapters',x.id,'главу',x)}><Trash2 size={15}/></button></div></Holo>)}{!filteredChapters.length&&<Holo className="empty slim"><BookOpen/><p>По этому фильтру глав нет.</p></Holo>}</div></div>}

    {tab==='relations'&&<div className="admin-columns"><Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">RELATIONSHIP DATABASE</p><h2>{relForm.id?'РЕДАКТИРОВАНИЕ СВЯЗИ':'НОВАЯ СВЯЗЬ'}</h2></div>{relForm.id?<Edit3/>:<Plus/>}</div><form onSubmit={saveRelation}><div className="form-grid"><Field label="Имя" required value={relForm.name} onChange={v=>setRelForm({...relForm,name:v})}/><Field label="Роль" value={relForm.role} onChange={v=>setRelForm({...relForm,role:v})}/></div><Field label="Отношение" value={relForm.relation} onChange={v=>setRelForm({...relForm,relation:v})}/><TextField label="Цитата" rows="3" value={relForm.quote} onChange={v=>setRelForm({...relForm,quote:v})}/><div className="field"><label>Фотография связи</label><UploadField value={relForm.image_url} onChange={v=>setRelForm({...relForm,image_url:v})} folder="relationships" formKey="relations" onUpload={handleUpload}/></div>{relForm.image_url&&<Frame holo={relForm.holo_effect!==false} className="preview"><SafeImage src={relForm.image_url} alt="Предпросмотр"/></Frame>}<label className="check"><input type="checkbox" checked={relForm.holo_effect!==false} onChange={e=>setRelForm({...relForm,holo_effect:e.target.checked})}/> Голопроекция</label><SaveBar dirty={dirty.relations} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><div className="editor-actions"><button className="btn" disabled={busy}>{relForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ СВЯЗЬ</>}</button>{relForm.id&&<><button type="button" className="ghost" onClick={resetRelation}>ОТМЕНА</button><button type="button" className="ghost mobile-only" onClick={goList}>К СПИСКУ</button></>}</div></form></Holo><div className="list" ref={listRef}>{filteredRelations.map(x=><Holo className={`list-item ${editTarget===x.id?'edit-highlight':''}`} key={x.id}><div>{x.image_url?<Frame holo={x.holo_effect!==false} className="thumb"><SafeImage src={x.image_url} alt=""/></Frame>:<span className="avatar mini">{String(x.name||'?')[0]}</span>}<div><b>{x.name}</b><small>{x.role} // {x.relation}</small></div></div><div className="item-actions"><button className="ghost" title="Редактировать" onClick={()=>editRelation(x)}><Edit3 size={14}/></button><button className="danger" title="Удалить" onClick={()=>remove('relationships',x.id,'связь',x)}><Trash2 size={15}/></button></div></Holo>)}{!filteredRelations.length&&<Holo className="empty slim"><UserRound/><p>По этому фильтру связей нет.</p></Holo>}</div></div>}

    {tab==='gallery'&&<div className="admin-columns"><Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">VISUAL DATABASE</p><h2>{galForm.id?'РЕДАКТИРОВАНИЕ ИЗОБРАЖЕНИЯ':'НОВОЕ ИЗОБРАЖЕНИЕ'}</h2></div>{galForm.id?<Edit3/>:<Images/>}</div><form onSubmit={saveGallery}><div className="form-grid"><Field label="Название" value={galForm.title} onChange={v=>setGalForm({...galForm,title:v})}/><Field label="Подпись (caption)" value={galForm.caption} onChange={v=>setGalForm({...galForm,caption:v})}/></div><Field label="Порядок сортировки" type="number" value={galForm.sort_order} onChange={v=>setGalForm({...galForm,sort_order:v})}/><div className="field"><label>Изображение</label><UploadField value={galForm.image_url} onChange={v=>setGalForm({...galForm,image_url:v})} folder="gallery" formKey="gallery" onUpload={handleUpload}/></div>{galForm.image_url&&<Frame holo={galForm.holo_effect!==false} className="preview"><SafeImage src={galForm.image_url} alt="Предпросмотр"/></Frame>}<label className="check"><input type="checkbox" checked={galForm.holo_effect!==false} onChange={e=>setGalForm({...galForm,holo_effect:e.target.checked})}/> Голопроекция</label><SaveBar dirty={dirty.gallery} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><div className="editor-actions"><button className="btn" disabled={busy}>{galForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ</>}</button>{(galForm.id||galForm.image_url||galForm.title)&&<button type="button" className="ghost" onClick={resetGallery}>ОТМЕНА</button>}{galForm.id&&<button type="button" className="ghost mobile-only" onClick={goList}>К СПИСКУ</button>}</div></form></Holo><div className="list" ref={listRef}>{filteredGallery.map((x,i)=><Holo className={`list-item gallery-list-item ${editTarget===x.id?'edit-highlight':''}`} key={x.id} draggable onDragStart={()=>setDragGallery(x.id)} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragGallery&&dragGallery!==x.id)reorderGallery(dragGallery,x.id);setDragGallery(null)}}><div>{x.image_url&&<Frame holo={x.holo_effect!==false} className="thumb"><SafeImage src={x.image_url} alt=""/></Frame>}<div><b>{x.title||'Без названия'}</b><small>{x.caption||x.description||''} // ПОРЯДОК {x.sort_order??0}</small></div></div><div className="item-actions"><button className="ghost" title="Выше" onClick={()=>moveGallery(x.id,-1)}><ArrowUp size={14}/></button><button className="ghost" title="Ниже" onClick={()=>moveGallery(x.id,1)}><ArrowDown size={14}/></button><button className="ghost" title="Редактировать" onClick={()=>editGallery(x)}><Edit3 size={14}/></button><button className="danger" title="Удалить" onClick={()=>remove('gallery',x.id,'изображение',x)}><Trash2 size={15}/></button></div></Holo>)}{!filteredGallery.length&&<Holo className="empty slim"><Images/><p>По этому фильтру изображений нет.</p></Holo>}</div></div>}
    <div className="list-filters">{tab==='chapters'&&<><Search size={15}/><input type="search" placeholder="Поиск по главам…" value={search.chapters} onChange={e=>setSearch(x=>({...x,chapters:e.target.value}))}/><select value={visibility} onChange={e=>setVisibility(e.target.value)}><option value="all">ВСЕ</option><option value="published">ОПУБЛИКОВАННЫЕ</option><option value="hidden">СКРЫТЫЕ</option></select></>}{tab==='relations'&&<><Search size={15}/><input type="search" placeholder="Поиск по связям…" value={search.relations} onChange={e=>setSearch(x=>({...x,relations:e.target.value}))}/><label className="check"><input type="checkbox" checked={noPhoto} onChange={e=>setNoPhoto(e.target.checked)}/> БЕЗ ФОТО</label></>}{tab==='gallery'&&<><Search size={15}/><input type="search" placeholder="Поиск по галерее…" value={search.gallery} onChange={e=>setSearch(x=>({...x,gallery:e.target.value}))}/></>}</div>
    <div className="admin-foot"><Terminal size={14}/> ИСТОЧНИК ДАННЫХ: SUPABASE // Автосохранение черновиков: 1 секунда. Ctrl+S — сохранить, Esc — отменить редактирование.</div>
  </Page>;
}

function Field({label,value,onChange,type='text',required,min}){
  const id=useId();
  return<div className="field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type={type} min={min} required={required} value={value??''} onChange={e=>onChange(e.target.value)}/>
  </div>;
}
function TextField({label,value,onChange,rows='5'}){
  const id=useId();
  return<div className="field">
    <label htmlFor={id}>{label}</label>
    <textarea id={id} rows={rows} value={value??''} onChange={e=>onChange(e.target.value)}/>
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
