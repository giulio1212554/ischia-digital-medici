(function(){const u=CONFIG.demoUrl;if(u){$('df').src=u;$('do').href=u}else{$('dn').hidden=false;$('do').hidden=true}})();
async function inviaDemo(ev){ev.preventDefault();const d=Object.fromEntries(new FormData(ev.target));
const msg=`Ciao, vorrei una demo personalizzata di Ischia Digital.\nNome: ${d.nome}\nStudio: ${d.studio}\nSpecialità: ${d.spec||'-'}\nMedici: ${d.medici}\nContatto: ${d.contatto}`;
const wa='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(msg);let ok=false;
if(CONFIG.formEndpoint){try{ok=(await fetch(CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})).ok}catch(e){}}
$('fm').innerHTML=ok?`<div class="doc"><b>Grazie ${E(d.nome)}!</b><br>Ti contattiamo entro 24 ore per fissare la demo.</div>`
:`<div class="doc"><b>Quasi fatto, ${E(d.nome)}.</b><br>Conferma la richiesta su WhatsApp e ti rispondiamo entro 24 ore.<br><a class="btn s" style="margin-top:8px" target="_blank" rel="noopener" href="${wa}">Invia su WhatsApp</a></div>`}