(function(){
  const u=CONFIG.demoUrl;
  const frame=$('df'), note=$('dn'), open=$('do');
  if(!u){
    if(note)note.hidden=false;
    if(open)open.hidden=true;
    return;
  }
  if(open)open.href=u;
  if(!frame)return;
  let loaded=false;
  frame.addEventListener('load',function(){loaded=true;if(note)note.hidden=true});
  frame.src=u;
  setTimeout(function(){
    if(loaded)return;
    if(note){
      note.hidden=false;
      note.innerHTML='La demo non è disponibile in anteprima. <a href="'+u+'" target="_blank" rel="noopener">Apri in una nuova scheda</a>.';
    }
  },6000);
})();
async function inviaDemo(ev){
  ev.preventDefault();try{track('form_demo_submit',{studio:(new FormData(ev.target)).get('studio')})}catch(e){}
  const d=Object.fromEntries(new FormData(ev.target));
  const msg=`Ciao, vorrei una demo personalizzata di Ischia Digital.\nNome: ${d.nome}\nStudio: ${d.studio}\nSpecialità: ${d.spec||'-'}\nMedici: ${d.medici}\nContatto: ${d.contatto}`;
  const wa='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(msg);
  let ok=false;
  if(CONFIG.formEndpoint){
    try{ok=(await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})).ok}catch(e){}
  }
  $('fm').innerHTML=ok
    ?`<div class="doc"><b>Grazie ${E(d.nome)}!</b><br>Ti contattiamo entro 24 ore per fissare la demo.</div>`
    :`<div class="doc"><b>Quasi fatto, ${E(d.nome)}.</b><br>Conferma la richiesta su WhatsApp e ti rispondiamo entro 24 ore.<br><a class="btn s" style="margin-top:8px" target="_blank" rel="noopener" href="${wa}">Invia su WhatsApp</a></div>`;
}
