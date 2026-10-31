(function(){
  const KEY='ischia_studio_brand';
  const $id=id=>document.getElementById(id);

  function read(){
    return {
      nome:($id('pNome')&&$id('pNome').value.trim())||'',
      doc:($id('pDoc')&&$id('pDoc').value.trim())||'',
      spec:($id('pSpec')&&$id('pSpec').value)||'Medico di base',
      citta:($id('pCitta')&&$id('pCitta').value.trim())||'Ischia',
      tel:($id('pTel')&&$id('pTel').value.trim())||''
    };
  }

  function save(d){
    try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}
  }

  function load(){
    try{
      const raw=localStorage.getItem(KEY);
      if(!raw)return null;
      return JSON.parse(raw);
    }catch(e){return null}
  }

  function apply(d){
    const nome=d.nome||'Studio Medico Demo';
    const citta=d.citta||'Ischia';
    const spec=d.spec||'Medicina generale';
    const doc=d.doc;
    const tel=d.tel;

    const logo=$id('pvLogo');
    const specEl=$id('pvSpec');
    const title=$id('pvTitle');
    const lead=$id('pvLead');
    const foot=$id('pvFoot');
    const telEl=$id('pvTel');

    if(logo){
      logo.childNodes[0].textContent=nome+' ';
    }
    if(specEl)specEl.textContent=spec+' · '+citta;
    if(title)title.textContent='Benvenuti'+(doc?', '+doc:'')+' — '+nome;
    if(lead)lead.textContent='Prenota online, richiedi ricette e documenti presso '+nome+'. Assistenza 24/7.';
    if(foot)foot.textContent='© '+nome+' · '+citta;
    if(telEl)telEl.textContent=tel?('Tel. '+tel):'Tel. —';

    const fStudio=$id('fStudio');
    const fSpec=$id('fSpec');
    if(fStudio&&d.nome)fStudio.value=d.nome;
    if(fSpec&&d.spec){
      for(const o of fSpec.options){
        if(o.value===d.spec||o.text===d.spec){fSpec.value=o.value||o.text;break}
      }
    }
    save(d);
  }

  function onInput(){apply(read())}

  ['pNome','pDoc','pSpec','pCitta','pTel'].forEach(id=>{
    const el=$id(id);
    if(!el)return;
    el.addEventListener('input',onInput);
    el.addEventListener('change',onInput);
  });

  const prev=load();
  if(prev){
    if($id('pNome')&&prev.nome)$id('pNome').value=prev.nome;
    if($id('pDoc')&&prev.doc)$id('pDoc').value=prev.doc;
    if($id('pSpec')&&prev.spec)$id('pSpec').value=prev.spec;
    if($id('pCitta')&&prev.citta)$id('pCitta').value=prev.citta;
    if($id('pTel')&&prev.tel)$id('pTel').value=prev.tel;
  }
  apply(read());

  const reset=$id('btnReset');
  if(reset)reset.addEventListener('click',()=>{
    ['pNome','pDoc','pTel'].forEach(id=>{if($id(id))$id(id).value=''});
    if($id('pCitta'))$id('pCitta').value='Ischia';
    if($id('pSpec'))$id('pSpec').selectedIndex=0;
    try{localStorage.removeItem(KEY)}catch(e){}
    apply(read());
  });
})();

async function inviaDemo(ev){
  ev.preventDefault();
  try{track('form_demo_submit',{studio:(new FormData(ev.target)).get('studio')})}catch(e){}
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
