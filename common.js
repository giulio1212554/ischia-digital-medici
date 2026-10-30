/* ===== CONFIGURAZIONE: compila questi 3 valori ===== */
const CONFIG={demoUrl:'https://studiomedico-six.vercel.app/',whatsapp:'393791453413',formEndpoint:''};
const $=i=>document.getElementById(i),E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const io=new IntersectionObserver(a=>a.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
function rvInit(){document.querySelectorAll('.rv:not(.in),.sx:not(.in)').forEach(e=>io.observe(e))}rvInit();

/* Scroll: evita salti orribili e gestisce meglio i link interni */
(function(){
  // Preferisci scroll restoration automatica del browser (back/forward)
  if('scrollRestoration' in history){history.scrollRestoration='auto'}

  // Link interni con hash: scroll fluido senza saltare in cima prima
  document.addEventListener('click',function(e){
    const a=e.target.closest('a[href]');
    if(!a)return;
    const href=a.getAttribute('href')||'';
    // stesso file + hash
    if(href.startsWith('#')){
      const el=document.querySelector(href);
      if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});history.pushState(null,'',href)}
      return;
    }
    // link a pagina corrente con hash (es. demo.html#richiedi dalla stessa pagina)
    try{
      const u=new URL(a.href,location.href);
      if(u.pathname===location.pathname && u.hash){
        const el=document.querySelector(u.hash);
        if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});history.pushState(null,'',u.hash)}
      }
    }catch(_){}
  });

  // All'apertura con hash: aspetta un frame e poi scrolla (evita flash in cima)
  if(location.hash){
    const el=document.querySelector(location.hash);
    if(el){
      // evita il salto immediato del browser
      if('scrollRestoration' in history)history.scrollRestoration='manual';
      window.scrollTo(0,0);
      requestAnimationFrame(function(){
        el.scrollIntoView({behavior:'smooth',block:'start'});
        setTimeout(function(){if('scrollRestoration' in history)history.scrollRestoration='auto'},600);
      });
    }
  }
})();
