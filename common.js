/* ===== CONFIGURAZIONE ===== */
const CONFIG={demoUrl:'https://studiomedico-six.vercel.app/',whatsapp:'393791453413',formEndpoint:''};
const $=i=>document.getElementById(i),E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const io=new IntersectionObserver(a=>a.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
function rvInit(){document.querySelectorAll('.rv:not(.in),.sx:not(.in)').forEach(e=>io.observe(e))}rvInit();

const BRAND_KEY='ischia_studio_brand';
window.STUDIO_BRAND=null;
(function(){
  function fromURL(){
    const p=new URLSearchParams(location.search);
    const nome=p.get('studio')||p.get('nome')||'';
    if(!nome)return null;
    return {
      nome:nome.trim(),
      doc:(p.get('doc')||p.get('medico')||'').trim(),
      spec:(p.get('spec')||p.get('specialita')||'').trim(),
      citta:(p.get('citta')||p.get('city')||'Ischia').trim(),
      tel:(p.get('tel')||'').trim()
    };
  }
  function load(){
    try{return JSON.parse(localStorage.getItem(BRAND_KEY)||'null')}catch(e){return null}
  }
  function save(b){
    try{localStorage.setItem(BRAND_KEY,JSON.stringify(b))}catch(e){}
  }
  const urlBrand=fromURL();
  if(urlBrand&&urlBrand.nome){save(urlBrand);window.STUDIO_BRAND=urlBrand}
  else{window.STUDIO_BRAND=load()}

  const b=window.STUDIO_BRAND;
  if(!b||!b.nome)return;

  var bar=document.createElement('div');
  bar.setAttribute('role','status');
  bar.style.cssText='background:#121a2b;color:#c8d0e0;font-size:13px;padding:8px 14px;text-align:center;position:relative;z-index:40';
  bar.innerHTML='Sito personalizzato: <strong style="color:#fff">'+E(b.nome)+'</strong>'
    +(b.citta?' · '+E(b.citta):'')
    +' · <a href="demo.html" style="color:#9ec1ff">Modifica</a>'
    +' · <a href="'+location.pathname+'" style="color:#9ec1ff" id="brandClear">Reimposta</a>';
  document.body.insertBefore(bar,document.body.firstChild);
  document.getElementById('brandClear')&&document.getElementById('brandClear').addEventListener('click',function(e){
    e.preventDefault();
    try{localStorage.removeItem(BRAND_KEY)}catch(err){}
    location.href=location.pathname;
  });
  try{
    if(document.title.indexOf('Ischia Digital')!==-1){
      document.title=document.title.replace('Ischia Digital',b.nome);
    }
  }catch(e){}
})();

(function(){
  if('scrollRestoration' in history){history.scrollRestoration='auto'}
  document.addEventListener('click',function(e){
    const a=e.target.closest('a[href]');
    if(!a)return;
    const href=a.getAttribute('href')||'';
    if(href.startsWith('#')){
      const el=document.querySelector(href);
      if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});history.pushState(null,'',href)}
      return;
    }
    try{
      const u=new URL(a.href,location.href);
      if(u.pathname===location.pathname && u.hash){
        const el=document.querySelector(u.hash);
        if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});history.pushState(null,'',u.hash)}
      }
    }catch(_){}
  });
  if(location.hash){
    const el=document.querySelector(location.hash);
    if(el){
      if('scrollRestoration' in history)history.scrollRestoration='manual';
      window.scrollTo(0,0);
      requestAnimationFrame(function(){
        el.scrollIntoView({behavior:'smooth',block:'start'});
        setTimeout(function(){if('scrollRestoration' in history)history.scrollRestoration='auto'},600);
      });
    }
  }
})();

function track(event, props){
  const payload=Object.assign({event:event,ts:Date.now(),path:location.pathname},props||{});
  try{console.info('[track]',payload)}catch(e){}
  try{window.dataLayer=window.dataLayer||[];window.dataLayer.push(payload)}catch(e){}
  try{if(window.gtag)gtag('event',event,props||{})}catch(e){}
}
document.addEventListener('click',function(e){
  const a=e.target.closest('a,button');
  if(!a)return;
  const href=(a.getAttribute('href')||'');
  const txt=(a.textContent||'').trim().toLowerCase();
  if(href.indexOf('demo.html#richiedi')!==-1||txt.indexOf('richiedi demo')!==-1){
    track('click_richiedi_demo',{href:href,label:(a.textContent||'').trim()});
  }
  if(txt.indexOf('scarica pdf')!==-1||(txt.indexOf('pdf')!==-1&&txt.indexOf('scarica')!==-1)){
    track('click_scarica_pdf',{label:(a.textContent||'').trim()});
  }
});
