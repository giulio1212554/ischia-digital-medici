/* ===== CONFIGURAZIONE: compila questi 3 valori ===== */
const CONFIG={demoUrl:'https://studiomedico-six.vercel.app/',whatsapp:'393791453413',formEndpoint:''};
const $=i=>document.getElementById(i),E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&','<':'<','>':'>','"':'"'}[c]));
const io=new IntersectionObserver(a=>a.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
function rvInit(){document.querySelectorAll('.rv:not(.in),.sx:not(.in)').forEach(e=>io.observe(e))}rvInit();

/* Scroll: evita salti orribili e gestisce meglio i link interni */
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

/* Tracking minimo (console + dataLayer se presente) */
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
