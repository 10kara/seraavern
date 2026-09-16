import React,{useEffect,useState,useRef,useId}from'react';
import{createRoot}from'react-dom/client';
import{createPortal}from'react-dom';
import{BrowserRouter,Routes,Route,Link,NavLink,useNavigate,useLocation}from'react-router-dom';
import{ArrowRight,BookOpen,ChevronLeft,ChevronRight,Database,Image as ImageIcon,LogIn,Menu,Shield,UserRound,X,Save,Trash2,Plus,Upload,RefreshCw,Lock,Terminal,Images,Edit3,Eye,EyeOff,Download,FileJson,ExternalLink,ArrowUp,ArrowDown,ClipboardPaste,Undo2,Search,Check,AlertTriangle,Activity,Radio,Orbit,Crosshair,ShieldCheck,Move,GitBranch,Unlink,Link2,RotateCcw}from'lucide-react';
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
const IMG=(import.meta.env.BASE_URL||'/')+'img/';

/* ============================================================
   ЛОКАЛЬНЫЙ ФОЛБЭК (используется только когда Supabase не
   подключён; пустая база никогда не подменяется этими данными)
   ============================================================ */
const fallback={id:1,name:'Тенкара',first_name:'Тенкара',last_name:'CT-6977',species:'Человек (клон)',age:12,height:183,homeworld:'Камино, Типока-Сити',status:'Капрал ГАР // зам. командира ОСН «Мантикора», 91-й РК',callsign:'«Тенкара»',summary:'Клон-пехотинец Гранд Армии Республики. Капрал 91-го разведывательного корпуса и заместитель командира отряда ОСН «Мантикора», ARC-боец с опытом службы на Анаксисе и в 69-м полку. Несёт службу на Акулоруме.',appearance:'Стандартные черты линии Джанга Фетта: короткая стрижка, шрам над левой бровью. Лёгкая разведывательная броня без лишних пластин, шлем с расширенным визором. На наплечнике — выцарапанный знак позывного «Тенкара» и отметки 69-го полка, ОСН «Мантикора» и 91-го корпуса.',personality:'Наблюдательный, немногословный, дисциплинированный. Привык работать малой группой вдали от основных сил: сначала считает, потом говорит и только затем стреляет. Молодых бойцов учит не геройству, а терпению и точным докладам.',preferences:'Ценит исправную оптику, чистые маршруты и тишину перед выходом на дозор. Любит ночи на Акулоруме, когда двигатель BARC-спидера слышно за километр, и карту, где отмечен каждый обход.',dislikes:'Не переносит небрежность с оружием, игнорирование разведданных и пустую браваду. Вопрос «сколько вас было в капсуле?» считает глупым: сколько было — столько и братьев.',motivation:'Довести своё звено до конца войны и остаться тем, кем решил быть сам: разведчиком, который возвращается не один.',image_url:IMG+'tenkara-portrait.jpg',holo_effect:true};
const fallbackChapters=[{id:'local-1',chapter_number:1,title:'Камино. Выросшие под дождём',content:'Тенкара вырос на Камино — в мире, где не бывает суши, только платформы над бесконечным штормом. Здесь же, в стерильных залах Типока-Сити, он получил первые обозначения: номер CT-6977, белую броню и одинаковые лица братьев вокруг.\n\nИнструкторы называли их «продуктом». Тенкара рано начал замечать, что одинаковые лица совсем не означают одинаковых людей: кто-то шутил на марше, кто-то молчал неделями, а кто-то запоминал карту города лучше любого дроида.\n\nК выпускной проверке он знал свой взвод до последнего бойца — и именно эта внимательность, а не только меткость, стала первой отметкой в его личном деле.',cover_image:IMG+'ch1-kamino.jpg',published:true},{id:'local-2',chapter_number:2,title:'Анаксис. Линия обороны',content:'Сразу после выпуска Тенкара был определён в БСО — подразделение прикрытия, отвечавшее за внешние подступы к анаксисским верфям. Анаксис был кузницей флота Республики, и сепаратисты били по нему, не жалея войск.\n\nСвой первый настоящий бой он принял на подступах к фортам: недели обороны, дозорные выходы в туман, подвоз боеприпасов под огнём. Там он научился главному — читать местность раньше, чем её прочитает противник.\n\nКогда восточную линию дважды прорывало, именно группа Тенкары удерживала обходную тропу и выводила из мешка соседние отделы. В его личном деле появилась первая боевая отметка, а среди братьев — имя, которое он выбрал сам: Тенкара.',cover_image:IMG+'ch2-anaxis.jpg',published:true},{id:'local-3',chapter_number:3,title:'69-й полк. ARC',content:'За Анаксис Тенкара получил сержанта и перевод в 69-й полк. Отбор там был жёстким: полк формировал собственные штурмовые группы и искал бойцов, умеющих работать малыми силами. Тенкара подошёл — и был направлен на подготовку ARC, в отряды усовершенствованных разведкоммандос.\n\nПодготовка сломала привычку к строю: работа в тылу противника, рейды по коммуникациям, диверсии и уход от преследования. ARC-броня, шлем с рангоутом и право принимать решения там, куда приказ уже не долетает.\n\nВо время одного из рейдов погиб лейтенант Клаус — старший офицер полка и его наставник. Тенкара вывел группу из окружения и с тех пор носил знаки ARC молча: это была не награда, а долг перед теми, кто их не дожил.',cover_image:IMG+'ch3-69th.jpg',published:true},{id:'local-4',chapter_number:4,title:'Акулорум. 91-й разведывательный корпус',content:'Когда 91-й разведывательный корпус отбирал бойцов с полевой подготовкой и опытом дальних рейдов, Тенкара подал рапорт добровольцем. Перевод на Акулорум обнулял привычную жизнь: в 91-м звания начинались с капрала, независимо от прошлой службы.\n\nОн принял это без сожаления. Разведкорпус работал иначе, чем штурмовые полки: BARC-спидеры, дозоры на дальних подступах, карты маршрутов, слежение за передвижениями сепаратистов. Служба — под началом маршал-коммандера Нейо и генерала Стасс Алли.\n\nСейчас капрал CT-6977 — заместитель командира отряда ОСН «Мантикора» 91-го разведывательного корпуса на Акулоруме. ARC-квалификация осталась при нём — как и знак отряда, выцарапанный на наплечнике. Отряд должен знать: его помнят, а дозор вернётся.',cover_image:IMG+'ch4-akulorum.jpg',published:true}];
const fallbackRelations=[{id:'local-r1',name:'Рок Куарри',role:'Радист БСО, брат по выпуску',relation:'Лучшие друзья, доверие',quote:'Связь чистая, командир. Слышу вас даже сквозь грозу.',pos_x:null,pos_y:null,group_tag:'family'},{id:'local-r2',name:'Ветвила',role:'Пулемётчик, CT-3390 // 69-й полк',relation:'Дружба',quote:'Броня помята — значит, сегодня выжили.',pos_x:null,pos_y:null,group_tag:'family'},{id:'local-r3',name:'Клаус',role:'Лейтенант 69-го полка',relation:'Погиб, уважение',quote:'Мы учимся быстрее, чем нас успевают убивать.',pos_x:null,pos_y:null,group_tag:'family'},{id:'local-r4',name:'Нейо',role:'Маршал-коммандер 91-го корпуса, CC-8823',relation:'Уважение',quote:'Разведка не ищет славы. Она ищет правду о противнике.',pos_x:null,pos_y:null,group_tag:'jedi'},{id:'local-r5',name:'Стасс Алли',role:'Генерал-джедай 91-го корпуса',relation:'Уважение, преданность',quote:'Хорошая разведка спасает больше жизней, чем самый смелый штурм.',pos_x:null,pos_y:null,group_tag:'jedi'},{id:'local-r6',name:'Скай',role:'BARC-разведчик 91-го корпуса',relation:'Дружба, единомышленник',quote:'Кто быстрый — тот живой. Кто тихий — тот ещё и возвращается.',pos_x:null,pos_y:null,group_tag:'family'},{id:'local-r7',name:'Орикс',role:'Командир ОСН «Мантикора»',relation:'Уважение, доверие',quote:'Отряд — это шесть выставленных спин. Остальное — детали.',pos_x:null,pos_y:null,group_tag:'family'}];
const fallbackGallery=[{id:'local-g1',title:'Учётный снимок',caption:'ОСН «Мантикора» // полевая броня капрала',image_url:IMG+'tenkara-record.jpg',sort_order:1,holo_effect:false}];
const fallbackLinks=[{id:'local-l1',from_id:'local-r1',to_id:'local-r3',link_type:'connection'},{id:'local-l2',from_id:'local-r4',to_id:'local-r5',link_type:'connection'},{id:'local-l3',from_id:'local-r1',to_id:'local-r2',link_type:'connection'},{id:'local-l4',from_id:'local-r6',to_id:'local-r7',link_type:'connection'}];

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

const RELATION_TYPES=[
  ['СЕМЬЯ','family'],['ЛЮБОВЬ','love'],['ПРЕДАННОСТЬ','devotion'],['ВОСХИЩЕНИЕ','admiration'],['ЛУЧШИЕ ДРУЗЬЯ','best-friends'],['ДРУЖБА','friendship'],['БЛАГОДАРНОСТЬ','gratitude'],['УВАЖЕНИЕ','respect'],['СИМПАТИЯ','sympathy'],['ЕДИНОМЫШЛЕННИК','kindred'],['ИНТЕРЕС','interest'],['НЕОПРЕДЕЛЕННОСТЬ','uncertainty'],['РАВНОДУШИЕ','indifference'],['НЕДОВЕРИЕ','distrust'],['РАЗОЧАРОВАНИЕ','disappointment'],['БОЯЗНЬ','fear'],['ПРЕЗРЕНИЕ','contempt'],['ЗАВИСТЬ','envy'],['ОБИДА','resentment'],['НЕПРИЯЗНЬ','dislike'],['НЕНАВИСТЬ','hate'],['ПОГИБ','lost']
];
const relationLabels=value=>String(value||'').split(',').map(x=>x.trim()).filter(Boolean);
const relationMeta=label=>RELATION_TYPES.find(([name])=>name.toLowerCase()===String(label).toLowerCase());
// Группы/сектора для карты связей. Определяют сектор на круговой раскладке,
// если у узла не заданы ручные pos_x/pos_y.
const RELATION_GROUPS=[
  ['jedi','КОМАНДОВАНИЕ','#8e2f24'],
  ['family','ОТРЯД','#33518c'],
  ['ally','СОЮЗНИКИ','#4e7a4e'],
  ['sith','ВРАГИ','#3b3733'],
  ['other','ПРОЧИЕ','#6d6d6d']
];
// Нормализуем старое значение `allied` из ранней версии схемы к ключу,
// который использует интерфейс (`ally`). Иначе такие узлы попадали в
// «прочие» и исчезали из фильтра «Союзники».
const normalizeGroup=g=>{
  const key=String(g||'').trim().toLowerCase();
  if(key==='allied'||key==='allies'||key==='allieds')return'ally';
  return RELATION_GROUPS.some(([k])=>k===key)?key:'other';
};
const groupMeta=g=>RELATION_GROUPS.find(([k])=>k===normalizeGroup(g))||RELATION_GROUPS[4];
const relationGroup=x=>{
  const raw=String(x?.group_tag||'').trim();
  if(raw)return normalizeGroup(raw);
  if(/джедай/i.test(x?.role||''))return'jedi';
  if(/семь|отец|мать|брат|сестр/i.test(x?.role||''))return'family';
  if(/союз|союзник|друж|друг/i.test(`${x?.role||''} ${x?.relation||''}`))return'ally';
  return'other';
};

function RelationTags({value,compact=false}){
  const labels=relationLabels(value);
  if(!labels.length)return<span className="relation-empty">ТИП НЕ УКАЗАН</span>;
  return<div className={`relation-tags ${compact?'compact':''}`}>{labels.map((label,index)=>{const meta=relationMeta(label);return<React.Fragment key={label}><span className={`relation-tag ${meta?.[1]||'custom'}`}>{meta?.[0]||label}</span>{index<labels.length-1&&<i className="relation-separator">,</i>}</React.Fragment>})}</div>;
}

function RelationTypePicker({value,onChange}){
  const selected=relationLabels(value).map(x=>x.toLowerCase());
  const toggle=label=>{const next=selected.includes(label.toLowerCase())?selected.filter(x=>x!==label.toLowerCase()):[...selected,label.toLowerCase()];onChange(RELATION_TYPES.filter(([name])=>next.includes(name.toLowerCase())).map(([name])=>name).join(', '))};
  return<div className="field relation-picker"><span className="field-label">Тип связи</span><small>Можно выбрать несколько вариантов</small><div className="relation-options">{RELATION_TYPES.map(([label,color])=><label className={`relation-option ${color}`} key={label}><input type="checkbox" checked={selected.includes(label.toLowerCase())} onChange={()=>toggle(label)}/><span>{label}</span></label>)}</div><RelationTags value={value}/></div>;
}

function displayCharacter(row){
  if(!row)return fallback;
  let name=String(row.name||'').trim();
  const first=String(row.first_name||'').trim(),last=String(row.last_name||'').trim();
  if((!name||name.toLowerCase()==='тенкара')&&first&&last)name=`${first} ${last}`;
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
const ARCHIVE_REQUEST_TIMEOUT=12000;

// Supabase fetch по умолчанию может ждать ответ бесконечно, если запрос
// блокируется расширением, DNS, сетью или зависшим proxy. Такой запрос не
// должен оставлять приложение на экране «УСТАНОВКА СВЯЗИ» навсегда.
function archiveRequest(query,label,timeout=ARCHIVE_REQUEST_TIMEOUT){
  const controller=typeof AbortController==='function'?new AbortController():null;
  const request=controller&&typeof query.abortSignal==='function'
    ?query.abortSignal(controller.signal)
    :query;
  let timer=0;
  const deadline=new Promise((_,reject)=>{
    timer=setTimeout(()=>{
      controller?.abort();
      reject(new Error(`${label}: превышено время ожидания подключения (${Math.round(timeout/1000)} с).`));
    },timeout);
  });
  return Promise.race([Promise.resolve(request),deadline]).finally(()=>clearTimeout(timer));
}

const archiveError=e=>{
  const message=e?.message||String(e||'Не удалось загрузить архив.');
  return message==='Failed to fetch'
    ?'Не удалось подключиться к серверу архива. Проверьте сеть или настройки Supabase.'
    :message;
};

function useArchive(){
  const[c,setC]=useState(supabase?null:fallback),
        [ch,setCh]=useState(supabase?[]:fallbackChapters),
        [r,setR]=useState(supabase?[]:fallbackRelations),
        [g,setG]=useState(supabase?[]:fallbackGallery),
        [lk,setLk]=useState(supabase?[]:fallbackLinks),
        [loading,setLoading]=useState(!!supabase),
        [loaded,setLoaded]=useState(!supabase),
        [error,setError]=useState('');
  const same=(p,n)=>p===n||(p!=null&&n!=null&&JSON.stringify(p)===JSON.stringify(n));
  const load=async()=>{
    if(!supabase){setLoading(false);setLoaded(true);return}
    setLoading(true);setError('');
    let primaryLoaded=false;
    try{
      // Character, chapters and relationships are critical for the first
      // render. Gallery and links are optional and are loaded afterwards so
      // a missing/blocked optional table cannot hold the whole application.
      const[a,b,d]=await Promise.all([
        archiveRequest(supabase.from('character').select('*').order('id').limit(1),'character'),
        archiveRequest(supabase.from('chapters').select('*').order('chapter_number'),'chapters'),
        archiveRequest(supabase.from('relationships').select('*').order('id'),'relationships')
      ]);
      if(a.error)throw a.error;
      if(b.error)throw b.error;
      if(d.error)throw d.error;
      const nextC=a.data?.[0]?displayCharacter(a.data[0]):null;
      const nextCh=Array.isArray(b.data)?b.data:[];
      const nextR=Array.isArray(d.data)?d.data:[];
      setC(prev=>same(prev,nextC)?prev:nextC);
      setCh(prev=>same(prev,nextCh)?prev:nextCh);
      setR(prev=>same(prev,nextR)?prev:nextR);
      primaryLoaded=true;
    }catch(e){setError(archiveError(e))}
    finally{setLoading(false);setLoaded(true)}

    if(!primaryLoaded)return;
    // Не задерживаем первый экран из-за gallery/character_links. Эти данные
    // появятся сразу после ответа и не влияют на открытие основных страниц.
    Promise.all([
      archiveRequest(supabase.from('gallery').select('*').order('sort_order').order('created_at',{ascending:false}),'gallery').catch(error=>({error})),
      archiveRequest(supabase.from('character_links').select('*').order('id'),'character_links').catch(error=>({error}))
    ]).then(([gal,ln])=>{
      // Отсутствие таблицы gallery не должно ломать архив и не должно
      // стирать уже показанные данные при временной сетевой ошибке.
      if(gal.error)console.warn('[archive] gallery:',gal.error.message||gal.error);
      else{const nextG=Array.isArray(gal.data)?gal.data:[];setG(prev=>same(prev,nextG)?prev:nextG)}
      // character_links может отсутствовать в старых БД — это необязательный
      // модуль, поэтому основная страница всё равно остаётся доступной.
      if(ln.error)console.warn('[archive] character_links:',ln.error.message||ln.error);
      else{const nextLk=Array.isArray(ln.data)?ln.data:[];setLk(prev=>same(prev,nextLk)?prev:nextLk)}
    });
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
      .on('postgres_changes',{event:'*',schema:'public',table:'character_links'},refresh)
      .subscribe();
    return()=>{clearTimeout(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',visible);supabase.removeChannel(channel)};
  },[]);
  return{character:c,chapters:ch,relationships:r,gallery:g,links:lk,loading,loaded,error,reload:load,setCharacter:setC,setChapters:setCh,setRelationships:setR,setGallery:setG,setLinks:setLk};
}

/* ============================================================
   БАЗОВЫЕ КОМПОНЕНТЫ
   ============================================================ */
function Cog({size=20,className=''}){return<svg className={className} width={size} height={size} viewBox='0 0 100 100' fill='currentColor' aria-hidden='true'><circle cx='50' cy='50' r='46' fill='none' stroke='currentColor' strokeWidth='5'/>{Array.from({length:8},(_,i)=><path key={i} d='M39 10 L61 10 L53 34 L47 34 Z' transform={`rotate(${i*45} 50 50)`}/>)}<circle cx='50' cy='50' r='14' fill='none' stroke='currentColor' strokeWidth='6'/></svg>}
function RoundStamp({size=110,className='',ring='ГРАНД АРМИЯ РЕСПУБЛИКИ • АРХИВ ЛИЧНОГО СОСТАВА',center='91 РК',sub='CT-6977'}){const id=useId();return<svg className={className} width={size} height={size} viewBox='0 0 120 120' aria-hidden='true'><defs><path id={id} d='M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0'/></defs><circle cx='60' cy='60' r='57' fill='none' stroke='currentColor' strokeWidth='2.5'/><circle cx='60' cy='60' r='52' fill='none' stroke='currentColor' strokeWidth='1'/><circle cx='60' cy='60' r='28' fill='none' stroke='currentColor' strokeWidth='1'/><text fontSize='9' letterSpacing='1.4' fill='currentColor' fontFamily='Oswald,sans-serif'><textPath href={`#${id}`}>{ring} •</textPath></text><text x='60' y='63' textAnchor='middle' fontSize='14' fill='currentColor' fontFamily='Oswald,sans-serif' fontWeight='600'>{center}</text><text x='60' y='74' textAnchor='middle' fontSize='7.5' letterSpacing='1.5' fill='currentColor' fontFamily='Oswald,sans-serif'>{sub}</text></svg>}
function Paperclip({className=''}){return<svg className={className} viewBox='0 0 22 46' aria-hidden='true'><path d='M6.5 14 v19 a4.5 4.5 0 0 0 9 0 V12 a8 8 0 0 0 -16 0 v23 a11.5 11.5 0 0 0 23 0 V15'/></svg>}
function HandNote({children,className='',r='-2deg'}){return<span className={`hand-note ${className}`} style={{'--r':r}}>{children}</span>}
function Background(){return<><div className="desk"/><div className="desk-fibers"/><div className="desk-vignette"/></>}

// Один общий AudioContext: создание нового контекста на каждый клик
// исчерпывает лимит браузера (16 шт. на страницу) и удерживает память.
let audioCtx=null;
function playBlip(){
  try{
    const A=window.AudioContext||window.webkitAudioContext;
    if(!A)return;
    if(!audioCtx)audioCtx=new A();
    if(audioCtx.state==='suspended')audioCtx.resume();
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.frequency.value=520;
    g.gain.setValueAtTime(.025,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.06);
    o.connect(g).connect(audioCtx.destination);
    o.start();o.stop(audioCtx.currentTime+.06);
  }catch{}
}

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
function TerminalTicker(){const messages=['ДЕЛО №6977-К // ЛИСТ 1','ГАРНИЗОН ТИПОКА-СИТИ // ПАЛУБА 25','СЛУЖБА // 91-й РАЗВЕДКОРПУС','АРХИВ // ДОПУСК СОВ. СЕКРЕТНО'];const[i,setI]=useState(0);useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%messages.length),4200);return()=>clearInterval(t)},[]);return<div className="terminal-ticker"><span>ДЕЛО//</span><TypeLine text={messages[i]}/></div>}

function Layout({error='',onRetry,children}){
  const[open,setOpen]=useState(false);
  const[forceMode,setForceMode]=useState(false);const[theme,setTheme]=useState(()=>localStorage.getItem('archive-theme')||'republic');
  const{pathname}=useLocation();
  useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});document.body.dataset.page=pathname},[pathname]);
  // Тема зеркалится на <html>, чтобы курсор (портал в body) тоже перекрашивался.
  useEffect(()=>{document.documentElement.classList.toggle('theme-empire',theme==='empire')},[theme]);
  useEffect(()=>{
    const move=e=>{document.documentElement.style.setProperty('--mx',`${(e.clientX/window.innerWidth-.5)*2}`);document.documentElement.style.setProperty('--my',`${(e.clientY/window.innerHeight-.5)*2}`)};
    const keys=[]; const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
    const key=e=>{
      // Шорткаты никогда не должны вмешиваться в текст, select и числовые стрелки.
      if(isEditableTarget(e.target))return;
      if(e.key==='t'||e.key==='T'){
        setTheme(v=>{const n=v==='republic'?'empire':'republic';localStorage.setItem('archive-theme',n);return n});
        return;
      }
      if(!konami.includes(e.key)){keys.length=0;return}
      keys.push(e.key);
      if(keys.slice(-konami.length).join()===konami.join()){setForceMode(v=>!v);keys.length=0}
    };
    let progressRaf=0,scrollStopTimer=0;
    const paintProgress=()=>{
      progressRaf=0;
      const d=document.documentElement;
      const max=d.scrollHeight-window.innerHeight;
      const progress=max>0?Math.min(100,Math.max(0,(window.scrollY/max)*100)):0;
      d.style.setProperty('--read',`${progress}%`);
    };
    const scroll=()=>{
      // Не пересчитываем layout на каждое событие wheel/touchmove и
      // временно ставим декоративные анимации на паузу — контент остаётся
      // плавным даже на длинных страницах админки.
      document.documentElement.classList.add('is-scrolling');
      if(!progressRaf)progressRaf=requestAnimationFrame(paintProgress);
      clearTimeout(scrollStopTimer);
      scrollStopTimer=setTimeout(()=>document.documentElement.classList.remove('is-scrolling'),140);
    };
    const click=playBlip;
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('keydown',key);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('click',click);paintProgress();
    return()=>{
      window.removeEventListener('pointermove',move);window.removeEventListener('keydown',key);window.removeEventListener('scroll',scroll);document.removeEventListener('click',click);
      if(progressRaf)cancelAnimationFrame(progressRaf);
      clearTimeout(scrollStopTimer);
      document.documentElement.classList.remove('is-scrolling');
    };
  },[]);
  const links=[['/','Дело'],['/character','Досье'],['/history','История службы'],['/relationships','Связи'],['/gallery','Фотографии']];
  return<div className={`shell ${forceMode?'force-mode':''} theme-${theme}`}>
    <Background/><Cursor/><div className="reading-progress" aria-hidden="true"/><TerminalTicker/>
    <header className="topbar">
      <Link className="brand" to="/"><Cog size={19} className="brand-cog"/> GAR ARCHIVES</Link>
      <button className="mobile" aria-label="Меню" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      <nav className={open?'open':''}>{links.map(([to,l])=><NavLink key={to} to={to} onClick={()=>setOpen(false)}>{l}</NavLink>)}</nav>
    </header>
    <main>
      {error&&<div className="db-error"><Terminal size={14}/><span>ОШИБКА БАЗЫ ДАННЫХ // {error}</span>{onRetry&&<button type="button" className="ghost" onClick={onRetry}><RefreshCw size={13}/> ПОВТОРИТЬ</button>}</div>}
      <div className="route-stage" key={pathname}>{children}</div>
    </main>
    <footer>
      <span className="foot-cog"><Cog size={12}/> ГРАНД АРМИЯ РЕСПУБЛИКИ // АРХИВ</span>
      <span>ID ДЕЛА // CT-6977</span>
      <span className="barcode" aria-hidden="true"/>
      <Link to="/admin">СЛУЖЕБНЫЙ ДОСТУП</Link>
    </footer>
  </div>;
}

function Page({title,sub,children}){
  useEffect(()=>{document.title=`${title} — GAR Archives`},[title]);
  return<section className="page">
    <div className="heading holo-panel">
      <i className="head-hazard" aria-hidden="true"/><i className="coffee head-coffee" aria-hidden="true"/><div><p className="kicker">{sub}</p><h1 className="glitch" data-text={title}>{title}</h1></div>
      <span className="chip">● ДЕЛО ОТКРЫТО</span><RoundStamp size={86} className="heading-stamp"/>
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
function SignalDashboard({ch,r,g,links=[]}){
  const published=ch.filter(x=>x.published!==false).length;
  const peerLinks=Array.isArray(links)?links.length:0;
  const values=[
    ['ГЛАВЫ',published,String(published).padStart(2,'0'),'cyan'],
    ['СВЯЗИ',r.length,String(r.length).padStart(2,'0'),'amber'],
    ['ЛИНИИ СЕТИ',peerLinks,String(peerLinks).padStart(2,'0'),'violet']
  ];
  return<section className="signal-dashboard holo-panel">
    <div className="signal-copy"><p className="kicker">УЧЁТНАЯ КАРТОЧКА // CT-6977</p><h2>СИГНАЛ ЗАПИСИ</h2><p>Разделы дела сшиты и пронумерованы. Обновления появляются после подключения к базе Гранд Армии.</p><div className="signal-readout"><Radio size={14}/><span>LIVE LINK</span><b>СТАБИЛЕН</b></div></div>
    <div className="signal-orb" aria-label="Сигнал архива стабилен"><div className="orb-ring ring-one"/><div className="orb-ring ring-two"/><div className="orb-core"><span>CT</span><small>6977</small></div><i className="orb-cross cross-a"/><i className="orb-cross cross-b"/></div>
    <div className="signal-metrics">{values.map(([label,value,code,color])=><div className={`signal-metric ${color}`} key={label}><span>{label}</span><b>{code}</b><i><em style={{'--metric':`${Math.min(100,25+value*12)}%`}}/></i><small>{value?`${value} INDEXED`:'NO DATA'}</small></div>)}</div>
    <div className="signal-footer"><span><Activity size={13}/> ARCHIVE INTEGRITY</span><b>98.4%</b><span className="signal-bars"><i/><i/><i/><i/><i/><i/></span></div>
  </section>;
}

// Вычисляет координаты узлов на карте. Если у узла заданы pos_x/pos_y —
// берёт их, иначе раскладывает по кругу с учётом группы (group_tag).
function computeNodePositions(relations){
  const groups={jedi:[],family:[],ally:[],other:[]};
  relations.forEach(x=>{
    const group=relationGroup(x);
    groups[group].push(x);
  });
  // Раскладка по секторам:
  //  - отряд — вверху (угол -90°),
  //  - джедаи — справа (0°),
  //  - союзники — внизу (+90°),
  //  - остальные — слева (180°).
  const sectors={family:{start:-110,span:40},jedi:{start:-50,span:100},ally:{start:70,span:40},other:{start:130,span:100}};
  const placed=new Map();
  Object.entries(groups).forEach(([key,list])=>{
    const s=sectors[key]||sectors.other;
    const radius=37;
    list.forEach((x,i)=>{
      const px=Number(x.pos_x),py=Number(x.pos_y);
      const hasManualPosition=x.pos_x!==null&&x.pos_x!==undefined&&x.pos_x!==''&&x.pos_y!==null&&x.pos_y!==undefined&&x.pos_y!==''&&Number.isFinite(px)&&Number.isFinite(py)&&px>=0&&px<=100&&py>=0&&py<=100;
      if(hasManualPosition){placed.set(x.id,{...x,group_tag:key,x:px,y:py});return}
      const angle=(s.start+(list.length===1?s.span/2:(s.span/(list.length-1||1))*i))*Math.PI/180;
      placed.set(x.id,{...x,group_tag:key,x:50+radius*Math.cos(angle),y:50+radius*Math.sin(angle)});
    });
  });
  return Array.from(placed.values());
}
// Таблица character_links хранит неориентированные связи в одном порядке.
// Сравниваем числовые id как числа, иначе строковая сортировка ставит 10
// перед 2 и нарушает ограничение from_id < to_id в Supabase.
function canonicalLinkPair(a,b){
  const left=String(a),right=String(b);
  const leftNumber=Number(a),rightNumber=Number(b);
  if(Number.isFinite(leftNumber)&&Number.isFinite(rightNumber)){
    if(leftNumber<rightNumber)return[left,right];
    if(leftNumber>rightNumber)return[right,left];
  }
  return left.localeCompare(right,undefined,{numeric:true,sensitivity:'base'})<=0?[left,right]:[right,left];
}
function sameLinkPair(a,b,c,d){
  const first=canonicalLinkPair(a,b),second=canonicalLinkPair(c,d);
  return first[0]===second[0]&&first[1]===second[1];
}

// Строит список рёбер карты: Тенкара связан со всеми + рёбра из character_links.
function buildEdges(nodes,links=[]){
  const edges=[];
  const seen=new Set();
  const add=(a,b,kind)=>{
    if(String(a)===String(b))return;
    const pair=canonicalLinkPair(a,b),k=pair.join('|');
    if(seen.has(k))return;
    seen.add(k);edges.push({from:a,to:b,kind});
  };
  nodes.forEach(n=>add('core',n.id,'sera'));
  const byId=new Map(nodes.map(n=>[String(n.id),n]));
  links.forEach(l=>{
    const f=String(l.from_id),t=String(l.to_id);
    if(byId.has(f)&&byId.has(t))add(f,t,'link');
  });
  return edges;
}
function RelationshipConstellation({r,links=[]}){
  const nodes=computeNodePositions(r);
  const edges=buildEdges(nodes,links);
  return<section className="constellation holo-panel" aria-label="Карта взаимоотношений"><div className="constellation-head"><div><p className="kicker">СХЕМА СВЯЗЕЙ // ГРАФ ДЕЛА</p><h2>СЕТЬ СВЯЗЕЙ</h2></div><span><Crosshair size={13}/> {nodes.length} УЗЛОВ // {edges.length} СВЯЗЕЙ</span></div><div className="constellation-stage"><svg viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none"><defs><radialGradient id="gridGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(51,81,140,.12)"/><stop offset="100%" stopColor="transparent"/></radialGradient><linearGradient id="linkGlow" x1="0" x2="1"><stop stopColor="#33518c" stopOpacity=".15"/><stop offset=".5" stopColor="#33518c" stopOpacity=".85"/><stop offset="1" stopColor="#b23c2e" stopOpacity=".15"/></linearGradient><linearGradient id="peerGlow" x1="0" x2="1"><stop stopColor="#b23c2e" stopOpacity=".25"/><stop offset=".5" stopColor="#b23c2e" stopOpacity=".8"/><stop offset="1" stopColor="#33518c" stopOpacity=".25"/></linearGradient></defs><circle cx="50" cy="50" r="37" fill="url(#gridGlow)" stroke="rgba(51,81,140,.18)" strokeDasharray="1.5 1.5"/><circle cx="50" cy="50" r="25" fill="none" stroke="rgba(51,81,140,.1)" strokeDasharray="1 1"/>{edges.map(e=>e.from==='core'
    ?<line key={`l-${e.from}-${e.to}`} x1="50" y1="50" x2={nodes.find(n=>String(n.id)===String(e.to))?.x} y2={nodes.find(n=>String(n.id)===String(e.to))?.y} className="link-sera"/>
    :<line key={`l-${e.from}-${e.to}`} x1={nodes.find(n=>String(n.id)===String(e.from))?.x} y1={nodes.find(n=>String(n.id)===String(e.from))?.y} x2={nodes.find(n=>String(n.id)===String(e.to))?.x} y2={nodes.find(n=>String(n.id)===String(e.to))?.y} className="link-peer"/>
  )}</svg><div className="constellation-center"><span className="constellation-core"><Cog size={15}/></span><b>ТЕНКАРА</b><small>CT-6977</small></div>{nodes.map(x=><div className="constellation-node" style={{left:`${x.x}%`,top:`${x.y}%`}} key={x.id} data-group={String(x.group_tag||'other')}><span>{String(x.name||'?')[0]}</span><b>{x.name}</b><small>{relationLabels(x.relation).slice(0,2).join(' • ')||x.role||'СВЯЗЬ'}</small></div>)}</div><div className="constellation-legend"><span><i className="legend-dot cyan"/> ТЕНКАРА ↔ УЗЕЛ</span><span><i className="legend-dot violet"/> МЕЖДУ ПЕРСОНАЖАМИ</span><span><ShieldCheck size={13}/> ДЕЛО ПРОВЕРЕНО</span></div></section>;
}

function Home({c,ch,r=[],g=[],links=[]}){
  useEffect(()=>{document.title='GAR Archives — капрал «Тенкара» // CT-6977'},[]);
  if(!c)return<Page title="Архив пуст" sub="DATABASE // NO RECORD">
    <Holo className="empty"><Database/><p>В таблице character нет записи. Добавьте персонажа через админ-панель.</p></Holo>
  </Page>;
  const parts=String(c.name||'').trim().split(/\s+/);
  const first=parts[0]||'Тенкара',last=parts.slice(1).join(' ')||'CT-6977';
  const holo=c.holo_effect!==false;
  return<>
    <section className="hero">
      <Holo className="hero-copy">
        <div className="headerline"><span className="gar-line"><Cog size={13}/> GRAND ARMY OF THE REPUBLIC</span><span className="status">ЗАПИСЬ АКТИВНА</span></div>
        <span className="stamp">ДОПУСК УТВЕРЖДЁН // 91 РК</span>
        <p className="kicker">ЛИЧНОЕ ДЕЛО</p>
        <h1>{first}<small>{last}</small></h1>
        <div className="line"/>
        <p className="lead">{c.summary}</p>
        <div className="griddata">
          <Data label="ТИП" value={c.species}/>
          <Data label="ВОЗРАСТ" value={ageText(c.age)}/>
          <Data label="РОСТ" value={heightText(c.height)}/>
          <Data label="РОДНОЙ МИР" value={c.homeworld}/>
          <Data label="СТАТУС" value={c.status}/>
          <Data label="ПОЗЫВНОЙ" value={c.callsign}/>
        </div>
        <Link className="btn" to="/character">ОТКРЫТЬ ДОСЬЕ <ArrowRight size={17}/></Link><HandNote r="-2.5deg" className="hero-note">листы сшиты, проверено писарем</HandNote><i className="coffee hero-coffee" aria-hidden="true"/>
        <div className="panel-footer"><span>ЛИСТ ДЕЛА // CT-6977</span><span>АРХИВ ГРАНД АРМИИ</span></div>
      </Holo>
      <Holo className="hero-photo">
        <Frame holo={holo} className="hero-frame">
          {c.image_url
            ?<SafeImage src={c.image_url} alt={c.name}/>
            :<div className="placeholder"><ImageIcon/><span>ИЗОБРАЖЕНИЕ НЕ ЗАГРУЖЕНО</span></div>}
        <Paperclip className="clip tr"/></Frame>
        <RoundStamp size={124} className="hero-stamp"/><span className="hero-stencil" aria-hidden="true">91</span><small>КАМИНО // АРХИВ ГРАНД АРМИИ</small>
      </Holo>
    </section>
    <SignalDashboard ch={ch} r={r} g={g} links={links}/>
    <section className="archive-updates holo-panel"><p className="kicker">ПОСЛЕДНИЕ ЗАПИСИ // LIVE FEED</p><h2>ХРОНОЛОГИЯ СЛУЖБЫ</h2><div className="home-timeline">{ch.slice(0,4).map((x,i)=><div key={x.id}><b>{String(x.chapter_number||i+1).padStart(2,'0')}</b><span>{x.title}</span><small>ЗАПИСЬ ДОБАВЛЕНА В АРХИВ</small></div>)}</div><Link to="/history" className="btn">ОТКРЫТЬ ИСТОРИЮ <ArrowRight size={16}/></Link></section>
    <section className="cards">
      <Card icon={<Images/>} meta="VISUAL ARCHIVE // 01" title="Галерея" text="Фотографии и материалы, подшитые в личное дело." to="/gallery"/>
      <Card icon={<UserRound/>} meta="CONNECTIONS // 02" title="Взаимоотношения" text="Отряд, командование и важные связи Тенкары." to="/relationships"/>
      <Card icon={<Database/>} meta="PERSONNEL FILE // 03" title="Личное досье" text="Параметры, характер и листы личного дела." to="/character"/>
    </section>
  </>;
}

function Character({c}){
  const[lb,setLb]=useState(-1);
  if(!c)return<Page title="Досье" sub="ЛИЧНОЕ ДЕЛО"><Holo className="empty"><Database/><p>Запись персонажа отсутствует в базе данных.</p></Holo></Page>;
  const sections=[['Внешность',c.appearance],['Характер',c.personality],['Предпочтения и симпатии',c.preferences],['Антипатии и избегания',c.dislikes],['Мотивация',c.motivation]];
  const holo=c.holo_effect!==false;
  return<Page title="Досье" sub="ЛИЧНОЕ ДЕЛО // CT-6977">
    <div className="profile">
      <Holo className="profile-card">
        <Paperclip className="clip tl"/><span className="stamp stamp-sm">ОЗНАКОМЛЕНО</span>
        <div className="portrait">
          <Frame holo={holo} className={c.image_url?'zoomable':''}>
            {c.image_url
              ?<SafeImage src={c.image_url} alt={c.name} onClick={()=>setLb(0)}/>
              :<div className="placeholder"><ImageIcon/></div>}
          </Frame>
        </div>
        <div className="bio">
          <p className="kicker">ЛИСТ ЛИЧНОГО ДЕЛА // ГРАНД АРМИЯ РЕСПУБЛИКИ</p>
          <h2>{c.name}</h2>
          <div className="data-block">
            <Data label="ТИП" value={c.species}/>
            <Data label="ВОЗРАСТ" value={ageText(c.age)}/>
            <Data label="РОСТ" value={heightText(c.height)}/>
            <Data label="РОДНОЙ МИР" value={c.homeworld}/>
            <Data label="СТАТУС" value={c.status}/>
            <Data label="ПОЗЫВНОЙ" value={c.callsign}/>
          </div>
          <div className="redacted"><span>ГРАФА 14-Б</span><i/><i/><i/><small>ЧАСТЬ МАТЕРИАЛА ЗАСЕКРЕЧЕНА</small></div><HandNote r="-3deg" className="redacted-note">запросить в 3-м отделе</HandNote>
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
  return<Page title="История" sub="СЛУЖЕБНЫЕ ЗАПИСИ // КАМИНО — АКУЛОРУМ">
    {visible.length===0
      ?<Holo className="empty"><BookOpen/><p>Опубликованных глав пока нет. Добавьте их через админ-панель.</p></Holo>
      :<div className="timeline">
        {visible.map((x,i)=><article id={`chapter-${x.id}`} className={`chapter ${open===i?'chapter-open':''}`} key={x.id}>
          <div className="marker">{x.chapter_number!=null?String(x.chapter_number).padStart(2,'0'):String(i+1).padStart(2,'0')}</div>
          <Holo className="chapter-panel">
            <div className="chapter-stamp"><span>CHAPTER // {String(x.chapter_number??i+1).padStart(2,'0')}</span><span>{String(x.content||'').length} ЗНАКОВ</span></div><p className="kicker">ГЛАВА {x.chapter_number??i+1}</p>
            <button className="chapter-toggle" onClick={()=>setOpen(open===i?-1:i)}>{open===i?'СВЕРНУТЬ':'ОТКРЫТЬ'} ЗАПИСЬ</button>{open===i&&<span className="chapter-nav">{i>0&&<button onClick={()=>setOpen(i-1)}>← ПРЕД.</button>}{i<visible.length-1&&<button onClick={()=>setOpen(i+1)}>СЛЕД. →</button>}</span>}
            <h2>{x.title}</h2>
            <div className="section-line"/>
            {x.cover_image&&<Frame holo={x.holo_effect!==false} className="cover zoomable" onClick={()=>setLb(covers.findIndex(cv=>cv.id===x.id))}><SafeImage src={x.cover_image} alt={x.title||''} loading="lazy"/><Paperclip className="clip tr"/></Frame>}
            {String(x.content||'').split(/\n+/).filter(Boolean).map((p,j)=><p key={j}>{p}</p>)}
          </Holo>
        </article>)}
      </div>}
    {lb>=0&&covers.length>0&&<Lightbox
      items={covers.map(x=>({src:x.cover_image,alt:x.title||'',caption:x.title?`ГЛАВА ${x.chapter_number} // ${x.title}`:'ОБЛОЖКА ГЛАВЫ'}))}
      index={Math.max(0,lb)} onClose={()=>setLb(-1)} onStep={d=>setLb(i=>(i+d+covers.length)%covers.length)}/>}
  </Page>;
}

function Relationships({r,links=[]}){
  return<Page title="Взаимоотношения" sub="ПОКАЗАНИЯ СОСЛУЖИВЦЕВ // ЛИЧНЫЕ СВЯЗИ">
    {r.length===0
      ?<Holo className="empty"><UserRound/><p>Записей о личных связях пока нет.</p></Holo>
      :<><RelationshipConstellation r={r} links={links}/><div className="relations">
        {r.map(x=><Holo className="relation" key={x.id}>
          {x.image_url
            ?<Frame holo={x.holo_effect!==false} className="photo"><SafeImage src={x.image_url} alt={x.name} loading="lazy"/></Frame>
            :<div className="avatar">{String(x.name||'?')[0]}</div>}
          <div>
            <p className="kicker">{x.role}</p>
            <h2>{x.name}</h2>
            <RelationTags value={x.relation}/>
            {x.quote&&<blockquote>«{x.quote}»</blockquote>}
          </div>
        </Holo>)}
      </div></>}
  </Page>;
}

function EventLog(){const events=['Личное дело открыто в архиве ГАР','Фотографии учтены и подшиты','Досье капрала CT-6977 выдано для чтения','Печать 91-го корпуса проставлена'];return<Page title="Журнал событий" sub="RESTRICTED // DEV LOG"><Holo className="event-log">{events.map((x,i)=><div className="event-row" key={x}><b>0{i+1}</b><span>{x}</span><time>91-0{i+1}</time></div>)}</Holo></Page>}
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
        {items.map((x,i)=><figure className="holo-panel g-item" key={x.id} onClick={()=>setLb(i)}><Paperclip className={i%2?'clip tl':'clip tr'}/>
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
    const normalized=email.trim().includes('@')?email.trim():email.trim()+'@gar-archives.local';
    const{error}=await supabase.auth.signInWithPassword({email:normalized,password});
    if(error)setErr('Не удалось войти. Проверьте логин и пароль.');
    else nav('/admin/panel');
    setBusy(false);
  };
  return<Page title="Админ-панель" sub="ЗАЩИЩЁННЫЙ ДОСТУП">
    <Holo className="login">
      <i className="coffee login-coffee" aria-hidden="true"/><Cog size={40} className="login-cog"/>
      <p className="kicker">SECURITY GATE // LEVEL 5</p>
      <h2>ЗАКРЫТЫЙ АРХИВ</h2>
      <p>Доступ к редактированию базы разрешён только авторизованному пользователю.</p><HandNote r="-2deg" className="login-note">допуск — только офицеры гарнизона</HandNote>
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
const EMPTY_RELATION={id:null,name:'',role:'',relation:'',quote:'',image_url:'',holo_effect:true,pos_x:null,pos_y:null,group_tag:'ally'};
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
const REL_FIELDS=['name','role','relation','quote','image_url','holo_effect','pos_x','pos_y','group_tag'];
const GAL_FIELDS=['title','caption','image_url','sort_order','holo_effect'];
const only=(x,fields)=>fields.reduce((o,k)=>(o[k]=x?.[k]??(k==='holo_effect'?true:''),o),{});

function NetworkEditor({relationships,links,isLinked,toggleLink,onNodeDragStart,stageRef,networkFilter,setNetworkFilter,busy,autoArrange,resetPositions}){
  const nodes=computeNodePositions(relationships);
  const edges=buildEdges(nodes,links);
  const shown=networkFilter==='all'?nodes:nodes.filter(n=>(n.group_tag||'other')===networkFilter);
  const shownIds=new Set(shown.map(n=>String(n.id)));
  return<><Holo className="network-editor">
    <div className="editor-head">
      <div><p className="kicker">FORCE NETWORK // CONNECTION MAP</p><h2>СЕТЬ СВЯЗЕЙ</h2></div>
      <div className="network-actions">
        <button type="button" className="ghost" disabled={busy} onClick={()=>autoArrange(networkFilter)}><Orbit size={14}/> ПО КРУГУ</button>
        <button type="button" className="ghost" disabled={busy} onClick={()=>resetPositions(networkFilter)}><RotateCcw size={14}/> АВТО</button>
      </div>
    </div>
    <p className="network-hint">Перетаскивайте узлы мышью, чтобы расставить их вручную. Тенкара автоматически связан со всеми (синим карандашом). Дополнительные связи между персонажами (красным карандашом) настраиваются в матрице ниже.</p>
    <div className="network-stage" ref={stageRef}>
      <svg viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
        <defs><radialGradient id="gridGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(51,81,140,.12)"/><stop offset="100%" stopColor="transparent"/></radialGradient><linearGradient id="linkGlow" x1="0" x2="1"><stop stopColor="#33518c" stopOpacity=".15"/><stop offset=".5" stopColor="#33518c" stopOpacity=".85"/><stop offset="1" stopColor="#b23c2e" stopOpacity=".15"/></linearGradient><linearGradient id="peerGlow" x1="0" x2="1"><stop stopColor="#b23c2e" stopOpacity=".25"/><stop offset=".5" stopColor="#b23c2e" stopOpacity=".8"/><stop offset="1" stopColor="#33518c" stopOpacity=".25"/></linearGradient></defs>
        <circle cx="50" cy="50" r="37" fill="url(#gridGlow)" stroke="rgba(51,81,140,.18)" strokeDasharray="1.5 1.5"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(51,81,140,.1)" strokeDasharray="1 1"/>
        {edges.map(e=>{
          const a=e.from==='core'?{x:50,y:50}:nodes.find(n=>String(n.id)===String(e.from));
          const b=e.to==='core'?{x:50,y:50}:nodes.find(n=>String(n.id)===String(e.to));
          if(!a||!b)return null;
          const dim=e.from!=='core'&&e.to!=='core'&&(!shownIds.has(String(e.from))||!shownIds.has(String(e.to)));
          return<line key={`e-${e.from}-${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={e.from==='core'?'link-sera':'link-peer'} style={dim?{opacity:.15}:undefined}/>;
        })}
      </svg>
      <div className="network-center"><span className="constellation-core"><Cog size={15}/></span><b>ТЕНКАРА</b><small>АВТОСВЯЗЬ</small></div>
      {shown.map(n=><div className={`network-node ${n.group_tag||'other'}`} key={n.id} style={{left:`${n.x}%`,top:`${n.y}%`}} onPointerDown={e=>onNodeDragStart(e,n.id)} title="Перетащите, чтобы переместить"><span>{String(n.name||'?')[0]}</span><b>{n.name}</b></div>)}
    </div>
    <div className="network-legend">
      <span><i className="legend-dot cyan"/> ТЕНКАРА ↔ ВСЕ (автоматически)</span>
      <span><i className="legend-dot violet"/> СВЯЗИ МЕЖДУ ПЕРСОНАЖАМИ</span>
      <span><Move size={13}/> ПЕРЕТАСКИВАНИЕ МЫШЬЮ</span>
    </div>
  </Holo>
  <Holo className="network-matrix">
    <div className="editor-head"><div><p className="kicker">CONNECTION MATRIX</p><h2>КТО С КЕМ СВЯЗАН</h2></div><span className="chip">{links.length} ЛИНИЙ</span></div>
    <p className="network-hint">Поставьте галочку, чтобы соединить двух персонажей напрямую (джедай ↔ джедай и т.п.). Связь с Тенкарой добавляется автоматически и в этой таблице не показана.</p>
    <div className="network-filters">
      <button className={networkFilter==='all'?'active':''} onClick={()=>setNetworkFilter('all')}>ВСЕ</button>
      {RELATION_GROUPS.map(([k,label,col])=><button key={k} className={networkFilter===k?'active':''} onClick={()=>setNetworkFilter(k)} style={{'--gcol':col}}>{label}</button>)}
    </div>
    {shown.length<2?<div className="empty slim"><Unlink size={18}/><p>В этой группе меньше двух персонажей — соединять некого.</p></div>
      :<div className="matrix-wrap"><table className="matrix"><thead><tr><th/><th>ТЕН ✓</th>{shown.map(n=><th key={n.id}><span title={n.name}>{String(n.name||'?')[0]}</span></th>)}</tr></thead><tbody>
        {shown.map((a,i)=><tr key={a.id}><th><b>{a.name}</b><small>{a.role}</small></th><td className="sera-cell" title="Тенкара связан со всеми автоматически"><Check size={14}/></td>
          {shown.map((b,j)=>{
            if(j<=i)return<td key={b.id} className="matrix-empty"/>;
            const on=isLinked(a.id,b.id);
            return<td key={b.id} className={on?'on':''}><label title={`${a.name} ↔ ${b.name}`}><input type="checkbox" checked={on} disabled={busy} onChange={()=>toggleLink(a.id,b.id)}/><span>{on?<Link2 size={12}/>:<Unlink size={12}/>}</span></label></td>;
          })}
        </tr>)}
      </tbody></table></div>}
  </Holo></>;
}

function AdminPanel({archive}){
  const{character,chapters,relationships,gallery,reload,setRelationships}=archive;
  const nav=useNavigate(),location=useLocation();
  const initialTab=new URLSearchParams(location.search).get('tab');
  const[tab,setTab]=useState(['character','chapters','relations','network','gallery'].includes(initialTab)?initialTab:'character');
  const[networkFilter,setNetworkFilter]=useState('all');
  const[draggingNode,setDraggingNode]=useState(null); // id
  const networkStageRef=useRef(null);
  const dragPointerRef=useRef(null);
  const dragPositionRef=useRef(null);
  const[busy,setBusy]=useState(false),[msg,setMsg]=useState(null),[confirmState,setConfirmState]=useState(null),[pendingTab,setPendingTab]=useState('');
  // Панель монтируется уже после загрузки архива, поэтому существующую
  // запись персонажа можно сразу положить в форму. Раньше форма всегда
  // начиналась пустой и считалась «грязной», из-за чего эффект синхронизации
  // сам себя блокировал до ручного перехода на другую вкладку.
  const[form,setForm]=useState(()=>character?{...EMPTY_CHARACTER,...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER});
  const characterHydrationRef=useRef(character?.id??null);
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
  useEffect(()=>{const t=new URLSearchParams(location.search).get('tab');if(t&&['character','chapters','relations','network','gallery'].includes(t))setTab(t)},[location.search]);
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

  // Внешний reload не стирает начатое редактирование персонажа, но
  // подхватывает запись, если она появилась после первого рендера.
  useEffect(()=>{
    const id=character?.id??null;
    const next=character?{...EMPTY_CHARACTER,...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER};
    if(characterHydrationRef.current!==id){
      characterHydrationRef.current=id;
      setForm(next);
      return;
    }
    if(!dirty.character)setForm(next);
  },[character,dirty.character]);
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
  const saveRelation=async e=>{e.preventDefault();const payload={name:relForm.name||'',role:relForm.role||'',relation:relForm.relation||'',quote:relForm.quote||'',image_url:relForm.image_url||'',holo_effect:relForm.holo_effect!==false,group_tag:normalizeGroup(relForm.group_tag||'ally'),pos_x:relForm.pos_x===''||relForm.pos_x==null?null:Number(relForm.pos_x),pos_y:relForm.pos_y===''||relForm.pos_y==null?null:Number(relForm.pos_y)};const old=relationships.find(x=>x.id===relForm.id);const res=await run(()=>writeResilient(p=>relForm.id?supabase.from('relationships').update(p).eq('id',relForm.id).select():supabase.from('relationships').insert(p).select(),payload).then(x=>{if(x.error)throw x.error;if(!x.data?.length)throw new Error('Связь не найдена или изменение заблокировано RLS.');return x}),relForm.id?'Связь обновлена.':'Связь добавлена.');if(res){saveAndCleanupOld(old?.image_url,payload.image_url);finishUpload('relations',payload.image_url);clearDraft('relations');if(!relForm.id)setRelForm({...EMPTY_RELATION})}};
  const saveGallery=async e=>{e.preventDefault();const payload={title:galForm.title||'',caption:galForm.caption||'',image_url:galForm.image_url||'',sort_order:Number(galForm.sort_order)||0,holo_effect:galForm.holo_effect!==false};const old=gallery.find(x=>x.id===galForm.id);const res=await run(()=>writeResilient(p=>galForm.id?supabase.from('gallery').update(p).eq('id',galForm.id).select():supabase.from('gallery').insert(p).select(),payload).then(x=>{if(x.error)throw x.error;if(!x.data?.length)throw new Error('Изображение не найдено или изменение заблокировано RLS.');return x}),galForm.id?'Изображение обновлено.':'Изображение добавлено.');if(res){saveAndCleanupOld(old?.image_url,payload.image_url);finishUpload('gallery',payload.image_url);clearDraft('gallery');if(!galForm.id)setGalForm({...EMPTY_GALLERY})}};

  const remove=(table,id,label,item)=>requestConfirm(`Точно удалить ${label}? Данные можно вернуть в течение нескольких секунд.`,async()=>{const res=await run(()=>supabase.from(table).delete().eq('id',id).select(),`${label[0].toUpperCase()+label.slice(1)} удалена.`);if(res){const timer=setTimeout(()=>cleanupStorageUrl(item?.image_url||item?.cover_image),7000);notify(`${label[0].toUpperCase()+label.slice(1)} удалена.`, 'ok','',async()=>{clearTimeout(timer);const restored={...item};delete restored.created_at;const back=await run(()=>supabase.from(table).insert(restored).select(),`${label[0].toUpperCase()+label.slice(1)} восстановлена.`);if(back)await reload()})}});
  const moveGallery=async(id,direction)=>{const list=[...gallery].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));const i=list.findIndex(x=>x.id===id),j=i+direction;if(i<0||j<0||j>=list.length)return;const a=list[i],b=list[j];setBusy(true);try{const results=await Promise.all([supabase.from('gallery').update({sort_order:b.sort_order??j}).eq('id',a.id).select(),supabase.from('gallery').update({sort_order:a.sort_order??i}).eq('id',b.id).select()]);const bad=results.find(x=>x.error||!x.data?.length);if(bad)throw bad.error||new Error('Порядок галереи не изменён.');notify('Порядок галереи обновлён.');await reload()}catch(e){notify('Ошибка сортировки: '+(e.message||e),'err',e.message||String(e))}finally{setBusy(false)}};
  const reorderGallery=async(id,targetId)=>{const list=[...gallery].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));const from=list.findIndex(x=>x.id===id),to=list.findIndex(x=>x.id===targetId);if(from<0||to<0||from===to)return;const moved=list.splice(from,1)[0];list.splice(to,0,moved);const changed=list.filter((x,i)=>x.sort_order!==i);setBusy(true);try{const results=await Promise.all(changed.map((x,i)=>supabase.from('gallery').update({sort_order:i}).eq('id',x.id).select()));const bad=results.find(x=>x.error||!x.data?.length);if(bad)throw bad.error||new Error('Порядок галереи не изменён.');notify('Порядок галереи обновлён.');await reload()}catch(e){notify('Ошибка сортировки: '+(e.message||e),'err',e.message||String(e))}finally{setBusy(false)}};
  const resetCharacter=()=>{cancelUploads('character');setForm(character?{...EMPTY_CHARACTER,...character,holo_effect:character.holo_effect!==false}:{...EMPTY_CHARACTER});clearDraft('character');};
  const resetChapter=()=>{cancelUploads('chapters');setChForm({...EMPTY_CHAPTER});clearDraft('chapters');setEditTarget(null)};
  const resetRelation=()=>{cancelUploads('relations');setRelForm({...EMPTY_RELATION});clearDraft('relations');setEditTarget(null)};
  const resetGallery=()=>{cancelUploads('gallery');setGalForm({...EMPTY_GALLERY});clearDraft('gallery');setEditTarget(null)};
  const resetActive=()=>{if(tab==='character')resetCharacter();else if(tab==='chapters')resetChapter();else if(tab==='relations')resetRelation();else if(tab==='gallery')resetGallery()};
  const editChapter=x=>{setChForm({id:x.id,chapter_number:x.chapter_number??'',title:x.title||'',content:x.content||'',cover_image:x.cover_image||'',published:x.published!==false,holo_effect:x.holo_effect!==false});setEditTarget(x.id);requestAnimationFrame(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const editRelation=x=>{setRelForm({id:x.id,name:x.name||'',role:x.role||'',relation:x.relation||'',quote:x.quote||'',image_url:x.image_url||'',holo_effect:x.holo_effect!==false,pos_x:x.pos_x??null,pos_y:x.pos_y??null,group_tag:relationGroup(x)});setEditTarget(x.id);requestAnimationFrame(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const editGallery=x=>{setGalForm({id:x.id,title:x.title||'',caption:x.caption||x.description||'',image_url:x.image_url||'',sort_order:x.sort_order??0,holo_effect:x.holo_effect!==false});setEditTarget(x.id);requestAnimationFrame(()=>editorRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const goList=()=>listRef.current?.scrollIntoView({behavior:'smooth',block:'start'});
  const exportData=()=>{const data={exportedAt:new Date().toISOString(),character:character?[character]:[],chapters,relationships, gallery,character_links:links};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`archive-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);notify('JSON-резервная копия скачана.')};
  const importData=async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{const data=JSON.parse(await file.text());const tables=[['chapters',data.chapters],['relationships',data.relationships],['gallery',data.gallery],['character_links',data.character_links]];if(data.character?.length)tables.unshift(['character',data.character]);for(const [table,rows] of tables){if(!Array.isArray(rows)||!rows.length)continue;const r=await supabase.from(table).upsert(rows);if(r.error)throw r.error}notify('JSON импортирован в Supabase.');await reload()}catch(e){notify('Ошибка импорта: '+(e.message||e),'err',e.message||String(e))}};

  const sortedChapters=[...chapters].sort((a,b)=>(a.chapter_number??0)-(b.chapter_number??0));
  const filteredChapters=sortedChapters.filter(x=>(!search.chapters||`${x.title||''} ${x.content||''} ${x.chapter_number||''}`.toLowerCase().includes(search.chapters.toLowerCase()))&&(visibility==='all'||(visibility==='published'?x.published!==false:x.published===false)));
  const filteredRelations=relationships.filter(x=>(!search.relations||`${x.name||''} ${x.role||''} ${x.relation||''}`.toLowerCase().includes(search.relations.toLowerCase()))&&(!noPhoto||!x.image_url));
  const sortedGallery=[...gallery].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0));
  const filteredGallery=sortedGallery.filter(x=>!search.gallery||`${x.title||''} ${x.caption||x.description||''}`.toLowerCase().includes(search.gallery.toLowerCase()));

  // -------- Сеть связей --------
  const{links}=archive;
  const isLinked=(a,b)=>{
    if(String(a)===String(b))return false;
    return links.some(l=>sameLinkPair(l.from_id,l.to_id,a,b));
  };
  const toggleLink=async(a,b)=>{
    if(!supabase)return notify('Supabase не подключён.','err');
    const[lo,hi]=canonicalLinkPair(a,b);
    if(lo===hi)return;
    // Учитываем и старую запись в обратном порядке, чтобы интерфейс не
    // создавал дубликат при миграции данных из другой версии схемы.
    const existing=links.find(l=>sameLinkPair(l.from_id,l.to_id,lo,hi));
    setBusy(true);
    try{
      if(existing){
        const r=await supabase.from('character_links').delete().eq('id',existing.id).select();
        if(r.error)throw r.error;
        notify('Связь между персонажами удалена.');
      }else{
        const r=await supabase.from('character_links').insert({from_id:lo,to_id:hi,link_type:'connection'}).select();
        if(r.error)throw r.error;
        if(!r.data?.length)throw new Error('Не удалось создать связь (RLS/поле).');
        notify('Связь между персонажами добавлена.');
      }
      await reload();
    }catch(e){notify('Ошибка сети: '+(e.message||e),'err',e.message||String(e))}
    finally{setBusy(false)}
  };
  const saveNodePosition=async(id,x,y)=>{
    if(!supabase)return;
    setBusy(true);
    try{
      const payload={pos_x:Math.max(0,Math.min(100,Number(x))),pos_y:Math.max(0,Math.min(100,Number(y)))};
      const r=await supabase.from('relationships').update(payload).eq('id',id).select();
      if(r.error)throw r.error;
      if(!r.data?.length)throw new Error('Узел не найден или координаты заблокированы RLS.');
      notify('Позиция узла сохранена.');
      await reload();
    }catch(e){notify('Ошибка сохранения позиции: '+(e.message||e),'err',e.message||String(e))}
    finally{setBusy(false)}
  };
  const autoArrange=async(groupKey)=>{
    if(!supabase)return notify('Supabase не подключён.','err');
    const list=groupKey==='all'?relationships:relationships.filter(x=>normalizeGroup(x.group_tag)===groupKey);
    if(!list.length)return notify('Нет узлов для расстановки.','err');
    setBusy(true);
    try{
      // Раскладываем по кругу радиусом 37 от центра.
      const results=await Promise.all(list.map((x,i)=>{
        const angle=(-90+(360/list.length)*i)*Math.PI/180;
        return supabase.from('relationships').update({pos_x:Number((50+37*Math.cos(angle)).toFixed(2)),pos_y:Number((50+37*Math.sin(angle)).toFixed(2))}).eq('id',x.id).select();
      }));
      const bad=results.find(r=>r.error);
      if(bad)throw bad.error;
      notify('Узлы расставлены по кругу.');await reload();
    }catch(e){notify('Ошибка авто-раскладки: '+(e.message||e),'err')}
    finally{setBusy(false)}
  };
  const resetPositions=async(groupKey)=>{
    if(!supabase)return notify('Supabase не подключён.','err');
    const list=groupKey==='all'?relationships:relationships.filter(x=>normalizeGroup(x.group_tag)===groupKey);
    if(!list.length)return;
    setBusy(true);
    try{
      const results=await Promise.all(list.map(x=>supabase.from('relationships').update({pos_x:null,pos_y:null}).eq('id',x.id).select()));
      const bad=results.find(r=>r.error);
      if(bad)throw bad.error;
      notify('Координаты сброшены (авто-раскладка).');await reload();
    }catch(e){notify('Ошибка сброса: '+(e.message||e),'err')}
    finally{setBusy(false)}
  };
  const positionFromPointer=(event,stage)=>{
    const rect=stage.getBoundingClientRect();
    if(!rect.width||!rect.height)return null;
    return{
      x:Number(Math.max(0,Math.min(100,((event.clientX-rect.left)/rect.width)*100)).toFixed(2)),
      y:Number(Math.max(0,Math.min(100,((event.clientY-rect.top)/rect.height)*100)).toFixed(2))
    };
  };
  const onNodeDragStart=(e,id)=>{
    // PointerEvent.button is 0 for the primary mouse button and touch.
    if(e.button!==0||busy)return;
    const stage=networkStageRef.current;
    if(!stage)return;
    e.preventDefault();
    e.stopPropagation();
    dragPointerRef.current=e.pointerId;
    const position=positionFromPointer(e,stage);
    if(position){
      dragPositionRef.current={id:String(id),...position};
      // Сразу показываем точку на месте нажатия, а не ждём первого move.
      setRelationships(list=>list.map(n=>String(n.id)===String(id)?{...n,pos_x:position.x,pos_y:position.y}:n));
    }
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDraggingNode(String(id));
  };
  useEffect(()=>{
    if(draggingNode===null)return;
    const stage=networkStageRef.current;
    if(!stage)return;
    const move=ev=>{
      if(dragPointerRef.current!==null&&ev.pointerId!==dragPointerRef.current)return;
      ev.preventDefault();
      const position=positionFromPointer(ev,stage);
      if(!position)return;
      dragPositionRef.current={id:String(draggingNode),...position};
      // Оптимистично обновляем позицию в relationships для живого предпросмотра.
      setRelationships(list=>list.map(n=>String(n.id)===String(draggingNode)?{...n,pos_x:position.x,pos_y:position.y}:n));
    };
    const finish=ev=>{
      if(ev&&dragPointerRef.current!==null&&ev.pointerId!==dragPointerRef.current)return;
      const position=dragPositionRef.current;
      dragPointerRef.current=null;
      dragPositionRef.current=null;
      setDraggingNode(null);
      if(position)saveNodePosition(position.id,position.x,position.y);
    };
    window.addEventListener('pointermove',move,{passive:false});
    window.addEventListener('pointerup',finish);
    window.addEventListener('pointercancel',finish);
    return()=>{
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',finish);
      window.removeEventListener('pointercancel',finish);
    };
  },[draggingNode]);

  const peerLinkCount=links.length;

  const tabs=[['character','ПЕРСОНАЖ',<UserRound size={15}/>,null],['chapters','ГЛАВЫ',<BookOpen size={15}/>,filteredChapters.length],['relations','СВЯЗИ',<Database size={15}/>,filteredRelations.length],['network','СЕТЬ СВЯЗЕЙ',<GitBranch size={15}/>,peerLinkCount],['gallery','ГАЛЕРЕЯ',<Images size={15}/>,filteredGallery.length]];
  const draftBanner=<DraftBanner info={draft(tab)} onRestore={()=>restoreDraft(tab)} onDelete={()=>removeDraft(tab)}/>;
  const editorProps={innerRef:editorRef};

  return<Page title="Панель управления" sub="АДМИНИСТРАТОР // ДОСТУП РАЗРЕШЁН">
    <div className="admin-top"><span><span className="pulse">●</span> ДОСТУП РАЗРЕШЁН{userEmail?` // ${userEmail}`:''}</span><div><button className="ghost" onClick={reload}><RefreshCw size={14}/> ОБНОВИТЬ</button><button className="ghost" onClick={exportData}><Download size={14}/> ЭКСПОРТ JSON</button><label className="ghost import-label"><Upload size={14}/> ИМПОРТ JSON<input type="file" accept="application/json" onChange={importData}/></label><button className="ghost" onClick={async()=>{await supabase.auth.signOut();nav('/admin')}}><Lock size={14}/> ВЫЙТИ</button></div></div>
    <div className="admin-tabs">{tabs.map(([id,label,icon,count])=><button key={id} className={tab===id?'active':''} onClick={()=>switchTab(id)}>{icon} {label}{count!=null&&<i className="count">{count}</i>}</button>)}</div>
    {msg&&<div key={msg.text+String(msg.kind)} className={`toast ${msg.kind}`} aria-live="polite" onClick={()=>setMsg(null)}>{msg.text}{msg.detail&&<details onClick={e=>e.stopPropagation()}><summary>Техническая ошибка</summary><code>{msg.detail}</code></details>}{msg.undo&&<button className="undo" onClick={e=>{e.stopPropagation();msg.undo();setMsg(null)}}><Undo2 size={13}/> ОТМЕНИТЬ</button>}</div>}
    {confirmState&&<div className="inline-confirm" role="alert"><AlertTriangle size={15}/><span>{confirmState.label}</span><button className="ghost" onClick={acceptConfirm}>ДА</button><button className="ghost" onClick={()=>{setConfirmState(null);setPendingTab('')}}>ОТМЕНА</button></div>}
    {draftBanner}

    {tab==='character'&&<Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">ЛИСТ ДЕЛА // CT-6977</p><h2>{character?.id?'РЕДАКТИРОВАНИЕ ЗАПИСИ':'НОВАЯ ЗАПИСЬ ПЕРСОНАЖА'}</h2></div><Save/></div><form onSubmit={saveCharacter}><div className="form-grid"><Field label="Имя и фамилия" required value={form.name} onChange={v=>setForm({...form,name:v})}/><Field label="Тип" value={form.species} onChange={v=>setForm({...form,species:v})}/><Field label="Возраст (число)" type="number" min="0" value={form.age} onChange={v=>setForm({...form,age:v})}/><Field label="Рост (см)" type="number" min="0" value={form.height} onChange={v=>setForm({...form,height:v})}/><Field label="Родной мир" value={form.homeworld} onChange={v=>setForm({...form,homeworld:v})}/><Field label="Статус" value={form.status} onChange={v=>setForm({...form,status:v})}/><Field label="Позывной" value={form.callsign} onChange={v=>setForm({...form,callsign:v})}/><div className="field"><label>Основная фотография</label><UploadField value={form.image_url} onChange={v=>setForm({...form,image_url:v})} folder="character" formKey="character" onUpload={handleUpload}/></div></div>{form.image_url&&<Frame holo={form.holo_effect!==false} className="preview"><SafeImage src={form.image_url} alt="Предпросмотр"/></Frame>}<label className="check"><input type="checkbox" checked={form.holo_effect!==false} onChange={e=>setForm({...form,holo_effect:e.target.checked})}/> Архивный снимок (сепия)</label><TextField label="Краткое описание" value={form.summary} onChange={v=>setForm({...form,summary:v})}/><TextField label="Внешность" value={form.appearance} onChange={v=>setForm({...form,appearance:v})}/><TextField label="Характер" value={form.personality} onChange={v=>setForm({...form,personality:v})}/><TextField label="Предпочтения и симпатии" value={form.preferences} onChange={v=>setForm({...form,preferences:v})}/><TextField label="Антипатии и избегания" value={form.dislikes} onChange={v=>setForm({...form,dislikes:v})}/><TextField label="Мотивация" value={form.motivation} onChange={v=>setForm({...form,motivation:v})}/><SaveBar dirty={dirty.character} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><button className="btn" disabled={busy}><Save size={16}/> СОХРАНИТЬ В БАЗУ</button>{dirty.character&&<button type="button" className="ghost" onClick={resetCharacter}>ОТМЕНА</button>}</form></Holo>}

    {tab==='chapters'&&<div className="admin-columns"><Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">CONTENT MANAGEMENT</p><h2>{chForm.id?'РЕДАКТИРОВАНИЕ ГЛАВЫ':'НОВАЯ ГЛАВА'}</h2></div>{chForm.id?<Edit3/>:<Plus/>}</div><form onSubmit={saveChapter}><div className="form-grid"><Field label="Номер главы" type="number" min="0" required value={chForm.chapter_number||nextChapterNumber} onChange={v=>setChForm({...chForm,chapter_number:v})}/><Field label="Название" required value={chForm.title} onChange={v=>setChForm({...chForm,title:v})}/></div>{duplicateChapter&&<div className="inline-error"><AlertTriangle size={14}/> Этот номер главы уже используется.</div>}<TextField label="Текст главы" value={chForm.content} onChange={v=>setChForm({...chForm,content:v})}/><ChapterPreview chapter={chForm}/><div className="field"><label>Обложка главы</label><UploadField value={chForm.cover_image} onChange={v=>setChForm({...chForm,cover_image:v})} folder="chapters" formKey="chapters" onUpload={handleUpload}/></div>{chForm.cover_image&&<Frame holo={chForm.holo_effect!==false} className="preview"><SafeImage src={chForm.cover_image} alt="Обложка"/></Frame>}<label className="check"><input type="checkbox" checked={chForm.holo_effect!==false} onChange={e=>setChForm({...chForm,holo_effect:e.target.checked})}/> Архивный снимок (сепия)</label><label className="check"><input type="checkbox" checked={chForm.published} onChange={e=>setChForm({...chForm,published:e.target.checked})}/> Публиковать главу</label><SaveBar dirty={dirty.chapters} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><div className="editor-actions"><button className="btn" disabled={busy}>{chForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ ГЛАВУ</>}</button>{chForm.id&&<button type="button" className="ghost" onClick={resetChapter}>ОТМЕНА</button>}{chForm.id&&<button type="button" className="ghost mobile-only" onClick={goList}>К СПИСКУ</button>}</div></form></Holo><div className="list" ref={listRef}>{filteredChapters.map(x=><Holo className={`list-item ${editTarget===x.id?'edit-highlight':''}`} key={x.id}><div><span className="list-number">{x.chapter_number!=null?String(x.chapter_number).padStart(2,'0'):'—'}</span><div><b>{x.title||'Без названия'}</b><small className={x.published===false?'st-hidden':'st-on'}>{x.published===false?'СКРЫТА':'ОПУБЛИКОВАНА'}</small></div></div><div className="item-actions"><Link className="ghost" title="Открыть на публичной странице" to={`/history?chapter=${encodeURIComponent(x.id)}#chapter-${x.id}`}><ExternalLink size={14}/> ОТКРЫТЬ</Link><button className="ghost" title={x.published===false?'Опубликовать':'Скрыть'} onClick={()=>togglePublish(x)}>{x.published===false?<EyeOff size={14}/>:<Eye size={14}/>}</button><button className="ghost" title="Редактировать" onClick={()=>editChapter(x)}><Edit3 size={14}/></button><button className="danger" title="Удалить" onClick={()=>remove('chapters',x.id,'главу',x)}><Trash2 size={15}/></button></div></Holo>)}{!filteredChapters.length&&<Holo className="empty slim"><BookOpen/><p>По этому фильтру глав нет.</p></Holo>}</div></div>}

    {tab==='relations'&&<div className="admin-columns"><Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">RELATIONSHIP DATABASE</p><h2>{relForm.id?'РЕДАКТИРОВАНИЕ СВЯЗИ':'НОВАЯ СВЯЗЬ'}</h2></div>{relForm.id?<Edit3/>:<Plus/>}</div><form onSubmit={saveRelation}><div className="form-grid"><Field label="Имя" required value={relForm.name} onChange={v=>setRelForm({...relForm,name:v})}/><Field label="Роль" value={relForm.role} onChange={v=>setRelForm({...relForm,role:v})}/></div><div className="field"><label>Группа (сектор на карте)</label><select className="group-select" value={relForm.group_tag||'ally'} onChange={e=>setRelForm({...relForm,group_tag:e.target.value})}>{RELATION_GROUPS.map(([k,label])=><option key={k} value={k}>{label}</option>)}</select></div><RelationTypePicker value={relForm.relation} onChange={v=>setRelForm({...relForm,relation:v})}/><div className="form-grid"><Field label="X-координата на карте (0–100)" type="number" min="0" max="100" value={relForm.pos_x==null?'':relForm.pos_x} onChange={v=>setRelForm({...relForm,pos_x:v})}/><Field label="Y-координата на карте (0–100)" type="number" min="0" max="100" value={relForm.pos_y==null?'':relForm.pos_y} onChange={v=>setRelForm({...relForm,pos_y:v})}/></div><small className="field-hint">Оставьте пустыми для автоматической раскладки по сектору группы. Или расставьте вручную на вкладке «Сеть связей» перетаскиванием.</small><TextField label="Цитата" rows="3" value={relForm.quote} onChange={v=>setRelForm({...relForm,quote:v})}/><div className="field"><label>Фотография связи</label><UploadField value={relForm.image_url} onChange={v=>setRelForm({...relForm,image_url:v})} folder="relationships" formKey="relations" onUpload={handleUpload}/></div>{relForm.image_url&&<Frame holo={relForm.holo_effect!==false} className="preview"><SafeImage src={relForm.image_url} alt="Предпросмотр"/></Frame>}<label className="check"><input type="checkbox" checked={relForm.holo_effect!==false} onChange={e=>setRelForm({...relForm,holo_effect:e.target.checked})}/> Архивный снимок</label><SaveBar dirty={dirty.relations} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><div className="editor-actions"><button className="btn" disabled={busy}>{relForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ СВЯЗЬ</>}</button>{relForm.id&&<><button type="button" className="ghost" onClick={resetRelation}>ОТМЕНА</button><button type="button" className="ghost mobile-only" onClick={goList}>К СПИСКУ</button></>}</div></form></Holo><div className="list" ref={listRef}>{filteredRelations.map(x=><Holo className={`list-item ${editTarget===x.id?'edit-highlight':''}`} key={x.id}><div>{x.image_url?<Frame holo={x.holo_effect!==false} className="thumb"><SafeImage src={x.image_url} alt=""/></Frame>:<span className="avatar mini">{String(x.name||'?')[0]}</span>}<div><b>{x.name}</b><small>{x.role} • <span className="group-chip" data-group={relationGroup(x)}>{groupMeta(x.group_tag)[1]}</span></small><RelationTags value={x.relation} compact/></div></div><div className="item-actions"><button className="ghost" title="Редактировать" onClick={()=>editRelation(x)}><Edit3 size={14}/></button><button className="danger" title="Удалить" onClick={()=>remove('relationships',x.id,'связь',x)}><Trash2 size={15}/></button></div></Holo>)}{!filteredRelations.length&&<Holo className="empty slim"><UserRound/><p>По этому фильтру связей нет.</p></Holo>}</div></div>}

    {tab==='network'&&<NetworkEditor relationships={relationships} links={links} isLinked={isLinked} toggleLink={toggleLink} onNodeDragStart={onNodeDragStart} stageRef={networkStageRef} networkFilter={networkFilter} setNetworkFilter={setNetworkFilter} busy={busy} autoArrange={autoArrange} resetPositions={resetPositions}/>}

    {tab==='gallery'&&<div className="admin-columns"><Holo className="editor" {...editorProps}><div className="editor-head"><div><p className="kicker">VISUAL DATABASE</p><h2>{galForm.id?'РЕДАКТИРОВАНИЕ ИЗОБРАЖЕНИЯ':'НОВОЕ ИЗОБРАЖЕНИЕ'}</h2></div>{galForm.id?<Edit3/>:<Images/>}</div><form onSubmit={saveGallery}><div className="form-grid"><Field label="Название" value={galForm.title} onChange={v=>setGalForm({...galForm,title:v})}/><Field label="Подпись (caption)" value={galForm.caption} onChange={v=>setGalForm({...galForm,caption:v})}/></div><Field label="Порядок сортировки" type="number" value={galForm.sort_order} onChange={v=>setGalForm({...galForm,sort_order:v})}/><div className="field"><label>Изображение</label><UploadField value={galForm.image_url} onChange={v=>setGalForm({...galForm,image_url:v})} folder="gallery" formKey="gallery" onUpload={handleUpload}/></div>{galForm.image_url&&<Frame holo={galForm.holo_effect!==false} className="preview"><SafeImage src={galForm.image_url} alt="Предпросмотр"/></Frame>}<label className="check"><input type="checkbox" checked={galForm.holo_effect!==false} onChange={e=>setGalForm({...galForm,holo_effect:e.target.checked})}/> Архивный снимок</label><SaveBar dirty={dirty.gallery} onSave={()=>document.querySelector('.editor form')?.requestSubmit()}/><div className="editor-actions"><button className="btn" disabled={busy}>{galForm.id?<><Save size={16}/> СОХРАНИТЬ ИЗМЕНЕНИЯ</>:<><Plus size={16}/> ДОБАВИТЬ</>}</button>{(galForm.id||galForm.image_url||galForm.title)&&<button type="button" className="ghost" onClick={resetGallery}>ОТМЕНА</button>}{galForm.id&&<button type="button" className="ghost mobile-only" onClick={goList}>К СПИСКУ</button>}</div></form></Holo><div className="list" ref={listRef}>{filteredGallery.map((x,i)=><Holo className={`list-item gallery-list-item ${editTarget===x.id?'edit-highlight':''}`} key={x.id} draggable onDragStart={()=>setDragGallery(x.id)} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragGallery&&dragGallery!==x.id)reorderGallery(dragGallery,x.id);setDragGallery(null)}}><div>{x.image_url&&<Frame holo={x.holo_effect!==false} className="thumb"><SafeImage src={x.image_url} alt=""/></Frame>}<div><b>{x.title||'Без названия'}</b><small>{x.caption||x.description||''} // ПОРЯДОК {x.sort_order??0}</small></div></div><div className="item-actions"><button className="ghost" title="Выше" onClick={()=>moveGallery(x.id,-1)}><ArrowUp size={14}/></button><button className="ghost" title="Ниже" onClick={()=>moveGallery(x.id,1)}><ArrowDown size={14}/></button><button className="ghost" title="Редактировать" onClick={()=>editGallery(x)}><Edit3 size={14}/></button><button className="danger" title="Удалить" onClick={()=>remove('gallery',x.id,'изображение',x)}><Trash2 size={15}/></button></div></Holo>)}{!filteredGallery.length&&<Holo className="empty slim"><Images/><p>По этому фильтру изображений нет.</p></Holo>}</div></div>}
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
    <Page title="GAR Archives" sub="ПОДШИВКА ДЕЛА"><div className="loading skeleton-loading"><Cog size={44} className="loading-cog"/><Cog size={44} className="loading-cog"/><div className="skeleton sk-title"/><div className="skeleton sk-panel"/><div className="skeleton sk-panel"/><p>ПОДШИВКА ДЕЛА…</p></div></Page>
  </Layout>;
  return<Layout error={archive.error} onRetry={archive.reload}>
    <Routes>
      <Route path="/" element={<Home c={archive.character} ch={archive.chapters} r={archive.relationships} g={archive.gallery} links={archive.links}/>}/>
      <Route path="/character" element={<Character c={archive.character}/>}/>
      <Route path="/history" element={<History ch={archive.chapters}/>}/>
      <Route path="/relationships" element={<Relationships r={archive.relationships} links={archive.links}/>}/>
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
