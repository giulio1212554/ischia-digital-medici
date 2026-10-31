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

  function brandURL(d){
    const p=new URLSearchParams();
    if(d.nome)p.set('studio',d.nome);
    if(d.doc)p.set('doc',d.doc);
    if(d.spec)p.set('spec',d.spec);
    if(d.citta)p.set('citta',d.citta);
    if(d.tel)p.set('tel',d.tel);
    return location.pathname+'?'+p.toString();
  }

  function save(d){
    try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}
  }

  function load(){
    try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}
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
    const share=$id('shareLink');
    const openFull=$id('openFull');

    if(logo){logo.childNodes[0].textContent=nome+' '}
    if(specEl)specEl.textContent=spec+' · '+citta;
    if(title)title.textContent='Benvenuti'+(doc?', '+doc:'')+' — '+nome;
    if(lead)lead.textContent='Prenota online, richiedi ricette e documenti presso '+nome+'. Assistenza 24/7.';
    if(foot)foot.textContent='© '+nome+' · '+citta;
    if(telEl)telEl.textContent=tel?('Tel. '+tel):'Tel. —';

    if(d.nome){
      const url=brandURL(d);
      const abs=location.origin+url;
      if(share){share.value=abs;share.hidden=false}
      if(openFull){openFull.href=url;openFull.hidden=false}
      const go=$id('goTools');
      if(go)go.href='strumenti.html?'+url.split('?')[1];
    } else {
      if(share)share.hidden=true;
      if(openFull)openFull.hidden=true;
    }

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

  const p=new URLSearchParams(location.search);
  if(p.get('studio')||p.get('nome')){
    if($id('pNome'))$id('pNome').value=p.get('studio')||p.get('nome')||'';
    if($id('pDoc'))$id('pDoc').value=p.get('doc')||p.get('medico')||'';
    if($id('pSpec')&&(p.get('spec')||p.get('specialita')))$id('pSpec').value=p.get('spec')||p.get('specialita');
    if($id('pCitta'))$id('pCitta').value=p.get('citta')||p.get('city')||'Ischia';
    if($id('pTel'))$id('pTel').value=p.get('tel')||'';
  } else {
    const prev=load();
    if(prev){
      if($id('pNome')&&prev.nome)$id('pNome').value=prev.nome;
      if($id('pDoc')&&prev.doc)$id('pDoc').value=prev.doc;
      if($id('pSpec')&&prev.spec)$id('pSpec').value=prev.spec;
      if($id('pCitta')&&prev.citta)$id('pCitta').value=prev.citta;
      if($id('pTel')&&prev.tel)$id('pTel').value=prev.tel;
    }
  }
  apply(read());

  const applyBtn=$id('btnApply');
  if(applyBtn)applyBtn.addEventListener('click',function(){
    const d=read();
    if(!d.nome){alert('Inserisci il nome dello studio');return}
    location.href=brandURL(d);
  });

  const reset=$id('btnReset');
  if(reset)reset.addEventListener('click',()=>{
    try{localStorage.removeItem(KEY)}catch(e){}
    location.href=location.pathname;
  });

  const copyBtn=$id('btnCopy');
  if(copyBtn)copyBtn.addEventListener('click',function(){
    const share=$id('shareLink');
    if(!share||!share.value)return;
    navigator.clipboard.writeText(share.value).then(function(){
      copyBtn.textContent='Copiato!';
      setTimeout(function(){copyBtn.textContent='Copia link'},1500);
    }).catch(function(){
      share.select();document.execCommand('copy');
    });
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
