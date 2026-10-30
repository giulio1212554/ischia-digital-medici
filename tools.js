const FMT=d=>new Date(d+'T12:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'}),T=()=>new Date().toLocaleTimeString('it-IT');
const st=a=>`<div class="st">${a.map(([t,d])=>`<span class="${d?'d':''}">${t}</span>`).join('')}</div>`;
const SL=['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30'],TK=['09:30','11:00'],taken={};
let R=[{id:1,t:'r',label:'Metformina 500 mg',paz:'Mario B.',s:'rev'}],uid=1,cb=null,cr=null,cur=null,ss=null;
/* 01 prenotazioni */
const d0=new Date(Date.now()+864e5);$('bd').value=d0.toISOString().slice(0,10);$('bd').min=new Date().toISOString().slice(0,10);
function dsl(){const k=$('bd').value,t=taken[k]||[];$('sl').innerHTML=SL.map(s=>`<button ${TK.includes(s)||t.includes(s)?'disabled':''} onclick="pk('${s}')">${s}</button>`).join('')}
function pk(s){const k=$('bd').value;(taken[k]=taken[k]||[]).push(s);const r={id:++uid,t:'v',label:$('bt').value,date:k,time:s,s:'a'};R.push(r);cb=r.id;dsl();rb();pn()}
function rb(){const r=R.find(x=>x.id==cb);if(!r)return;$('bk').innerHTML=r.s=='a'?st([['Richiesta inviata',0],['In attesa del medico',0]])+'<p class="sub" style="margin:0">Demo: conferma dal pannello dello studio ↓</p>':r.s=='ok'?st([['Confermata',1]])+`<div class="doc">${E(r.label)} · <b>${FMT(r.date)} alle ${r.time}</b>. Promemoria via SMS o email 24 ore prima.</div>`:st([['Non disponibile',0]])+'<div class="doc">Il medico non può a quell’ora: scegli un altro orario.</div>'}
$('bd').onchange=dsl;dsl();
/* 02 ricette */
function rx(){const r={id:++uid,t:'r',label:$('rf').value.trim()||'Farmaco',s:'a'};R.push(r);cr=r.id;rr();pn();setTimeout(()=>{if(r.s=='a'){r.s='rev';rr();pn()}},900)}
function rr(){const r=R.find(x=>x.id==cr);if(!r)return;const e=r.s=='e';$('rr').innerHTML=st([['Ricevuta',1],['In revisione',r.s!='a'],['Emessa',e]])+(e?`<div class="doc"><b>Ricetta · ${E(r.label)}</b><br>Codice NRE (esempio) ${r.nre}<img class="sig" alt="Firma del medico" src="${r.sig}"><small>Firmata alle ${r.at} · inviata via SMS ed email</small></div>`:'<p class="sub" style="margin:0">Demo: firma la ricetta dal pannello dello studio ↓</p>')}
/* pannello studio */
function pn(){const q=R.filter(r=>r.s=='a'||r.s=='rev');$('pq').innerHTML=q.length?q.map(r=>r.t=='v'?`<div class="pi"><div><b>Visita</b> · ${E(r.label)}<br><small>${FMT(r.date)} alle ${r.time}</small></div><div class="ac"><button class="btn s" onclick="cv(${r.id},1)">Conferma</button><button class="btn s o" onclick="cv(${r.id},0)">Rifiuta</button></div></div>`:`<div class="pi"><div><b>Ricetta</b> · ${E(r.label)}<br><small>${r.paz?E(r.paz)+' · ':''}in attesa di firma</small></div><div class="ac"><button class="btn s" onclick="op(${r.id})">Rivedi e firma</button></div></div>`).join(''):'<p class="sub" style="margin:8px 0 0">Nessuna richiesta in attesa. Inviane una dai moduli paziente qui sopra.</p>'}
function cv(id,ok){const r=R.find(x=>x.id==id);r.s=ok?'ok':'no';if(!ok)taken[r.date]=(taken[r.date]||[]).filter(x=>x!=r.time);dsl();rb();pn()}
const cvs=$('cv'),gx=cvs.getContext&&cvs.getContext('2d');let dn=false,drawn=false;
const pt=e=>{const b=cvs.getBoundingClientRect();return[(e.clientX-b.left)*cvs.width/(b.width||cvs.width),(e.clientY-b.top)*cvs.height/(b.height||cvs.height)]};
function clr(){drawn=false;$('sb').disabled=true;if(gx){gx.fillStyle='#fff';gx.fillRect(0,0,cvs.width,cvs.height);gx.strokeStyle='#0f2a30';gx.lineWidth=3;gx.lineCap='round';gx.lineJoin='round'}}
cvs.addEventListener('pointerdown',e=>{dn=true;if(gx){const[x,y]=pt(e);gx.beginPath();gx.moveTo(x,y)}cvs.setPointerCapture&&cvs.setPointerCapture(e.pointerId)});
cvs.addEventListener('pointermove',e=>{if(!dn||!gx)return;const[x,y]=pt(e);gx.lineTo(x,y);gx.stroke();drawn=true;$('sb').disabled=false});
['pointerup','pointercancel','pointerleave'].forEach(n=>cvs.addEventListener(n,()=>dn=false));
function op(id){cur=R.find(r=>r.id==id);$('pm').innerHTML='';$('sg').hidden=false;$('sgt').textContent='Ricetta · '+cur.label;clr();$('sg').scrollIntoView&&$('sg').scrollIntoView({behavior:'smooth',block:'nearest'})}
function sgn(){if(!cur||!drawn)return;cur.s='e';cur.nre='NRE'+Math.random().toString(36).slice(2,14).toUpperCase();cur.sig=cvs.toDataURL?cvs.toDataURL('image/png'):'';cur.at=T();$('sg').hidden=true;
const label=cur.label,nre=cur.nre,at=cur.at,sig=cur.sig;
$('pm').innerHTML=`<div class="doc"><b>Ricetta firmata e inviata</b><br>${E(label)} · codice NRE (esempio) ${nre}<br>Il paziente riceve il PDF via SMS ed email.<br><button class="btn s" style="margin-top:10px" onclick="dlRicetta('${label.replace(/'/g,"\\'")}','${nre}','${at}',this)">Scarica PDF ricetta</button></div>`;
rr();pn();cur=null}
function dlRicetta(label,nre,at,btn){
  if(!window.jspdf){alert('Libreria PDF non caricata');return}
  const {jsPDF}=window.jspdf,doc=new jsPDF(),W=doc.internal.pageSize.getWidth();
  doc.setFillColor(15,42,48);doc.rect(0,0,W,26,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(13);doc.setFont(undefined,'bold');
  doc.text('Studio Medico Dr.ssa Giulia Bianchi',14,11);
  doc.setFontSize(8);doc.setFont(undefined,'normal');
  doc.text('Via Roma 12 · 80077 Ischia (NA) · P.IVA 01234567890',14,19);
  doc.setTextColor(15,42,48);doc.setFontSize(15);doc.setFont(undefined,'bold');
  doc.text('RICETTA MEDICA',14,38);
  doc.setFontSize(8);doc.setFont(undefined,'normal');doc.setTextColor(90);
  doc.text('Documento dimostrativo — dati fittizi',14,44);
  doc.setTextColor(15,42,48);doc.setDrawColor(11,122,117);doc.setLineWidth(.4);
  doc.roundedRect(14,50,W-28,42,2,2,'S');doc.setFontSize(10);
  doc.text('Paziente: Mario Bianchi',18,60);
  doc.text('CF: BNCMRA80A01H501X (esempio)',18,67);
  doc.text('Data: '+new Date().toLocaleDateString('it-IT')+'  ·  NRE: '+nre,18,74);
  doc.text('Firmata alle: '+at,18,81);
  doc.setFont(undefined,'bold');doc.setFontSize(11);doc.text('Prescrizione',14,104);
  doc.setFont(undefined,'normal');doc.text(label,14,112);
  doc.setFontSize(8);doc.setTextColor(90);doc.text('Posologia secondo indicazioni del medico.',14,119);
  try{const img=document.querySelector('#rr .sig')||document.querySelector('img.sig');
    if(img&&img.src&&img.src.startsWith('data:'))doc.addImage(img.src,'PNG',W-78,140,48,16)}catch(e){}
  doc.setTextColor(15,42,48);doc.setFontSize(8);doc.text('Firma del medico',W-78,160);
  doc.setDrawColor(180);doc.line(W-78,158,W-20,158);
  doc.setTextColor(130);doc.setFontSize(7);
  doc.text('Demo Ischia Digital · Le ricette ufficiali restano emesse dal sistema abilitato del medico.',14,285);
  doc.save('ricetta-'+nre+'.pdf');if(btn)btn.textContent='PDF scaricato';
}
clr();pn();
/* 03 fatture */
let fn=41;function inv(){const s=$('fs'),n=++fn;const desc=s.options[s.selectedIndex].text.split(' · ')[0];const euro=s.value;
$('fr').innerHTML=`<div class="doc"><b>Fattura n. ${n}/2026</b><br>${E(desc)} · €${euro},00<br>Esente IVA · inviata al paziente<div class="st"><span id="pg">Da pagare</span></div><button class="btn s" onclick="pay()">Paga ora</button> <button class="btn s o" onclick="dlFattura(${n},'${desc.replace(/'/g,"\\'")}',${euro})">Scarica PDF</button></div>`}
function pay(){const p=$('pg');if(p){p.className='d';p.textContent='Pagata'}}
function dlFattura(n,desc,euro){
  if(!window.jspdf){alert('Libreria PDF non caricata');return}
  const {jsPDF}=window.jspdf,doc=new jsPDF(),W=doc.internal.pageSize.getWidth();
  const d=new Date().toLocaleDateString('it-IT');
  doc.setFillColor(15,42,48);doc.rect(0,0,W,26,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(13);doc.setFont(undefined,'bold');
  doc.text('Studio Medico Dr.ssa Giulia Bianchi',14,11);
  doc.setFontSize(8);doc.setFont(undefined,'normal');
  doc.text('Via Roma 12 · 80077 Ischia (NA) · P.IVA 01234567890',14,19);
  doc.setTextColor(15,42,48);doc.setFontSize(15);doc.setFont(undefined,'bold');
  doc.text('FATTURA n. '+n+'/2026',14,38);
  doc.setFontSize(10);doc.setFont(undefined,'normal');doc.text('Data: '+d,14,46);
  doc.setDrawColor(11,122,117);doc.setLineWidth(.4);
  doc.roundedRect(14,52,W-28,24,2,2,'S');
  doc.text('Cliente: Mario Bianchi',18,62);
  doc.text('CF: BNCMRA80A01H501X (esempio)',18,69);
  doc.setFillColor(223,241,239);doc.rect(14,86,W-28,9,'F');
  doc.setFont(undefined,'bold');doc.setFontSize(9);
  doc.text('Descrizione',18,92);doc.text('Importo',W-42,92);
  doc.setFont(undefined,'normal');doc.setFontSize(10);
  doc.text(desc,18,106);doc.text('€ '+Number(euro).toFixed(2),W-42,106);
  doc.setDrawColor(200);doc.line(14,112,W-14,112);
  doc.setFont(undefined,'bold');doc.text('Totale',18,124);doc.text('€ '+Number(euro).toFixed(2),W-42,124);
  doc.setFont(undefined,'normal');doc.setFontSize(8);doc.setTextColor(90);
  doc.text('Esente IVA art. 10 DPR 633/72',18,132);
  doc.setTextColor(130);doc.setFontSize(7);
  doc.text('Demo Ischia Digital · Documento fittizio a scopo dimostrativo.',14,285);
  doc.save('fattura-'+n+'-2026.pdf');
}
/* 04 pdf */
let pv=0;
function pdf(){
  pv++;
  const titolo=$('pt').value||'Documento dello studio';
  $('pp').innerHTML=`<div class="doc"><b>${E(titolo)} · layout dello studio</b><br>Generato dai dati · versione ${pv}<br>Aggiornato alle ${T()}<br>
  <button class="btn s" style="margin-top:8px" onclick="pdf()">Rigenera</button>
  <button class="btn s o" style="margin-top:8px;margin-left:8px" onclick="dlDoc('${titolo.replace(/'/g,"\\'")}',${pv})">Scarica PDF</button></div>`;
}
function dlDoc(titolo,ver){
  if(!window.jspdf){alert('Libreria PDF non caricata');return}
  const {jsPDF}=window.jspdf,doc=new jsPDF(),W=doc.internal.pageSize.getWidth();
  const d=new Date().toLocaleString('it-IT');
  doc.setFillColor(15,42,48);doc.rect(0,0,W,26,'F');
  doc.setTextColor(255,255,255);doc.setFontSize(13);doc.setFont(undefined,'bold');
  doc.text('Studio Medico Dr.ssa Giulia Bianchi',14,11);
  doc.setFontSize(8);doc.setFont(undefined,'normal');
  doc.text('Via Roma 12 · 80077 Ischia (NA) · P.IVA 01234567890',14,19);
  doc.setTextColor(15,42,48);doc.setFontSize(14);doc.setFont(undefined,'bold');
  doc.text(titolo,14,40);
  doc.setFontSize(8);doc.setFont(undefined,'normal');doc.setTextColor(90);
  doc.text('Versione '+ver+' · Generato il '+d,14,47);
  doc.setTextColor(15,42,48);doc.setDrawColor(11,122,117);doc.setLineWidth(.4);
  doc.roundedRect(14,54,W-28,70,2,2,'S');doc.setFontSize(10);
  const lines=doc.splitTextToSize('Documento di esempio con il layout dello studio. In produzione i dati vengono presi dal gestionale e dal profilo dello studio: paziente, data, contenuto clinico e firma digitale dove previsto.',W-40);
  doc.text(lines,18,66);
  doc.setFontSize(8);doc.setTextColor(90);
  doc.text('Può essere rigenerato in qualsiasi momento dai dati aggiornati.',18,110);
  doc.setTextColor(130);doc.setFontSize(7);
  doc.text('Ischia Digital — demo · Documento fittizio a scopo dimostrativo.',14,285);
  doc.save('documento-studio-v'+ver+'.pdf');
}
/* 05 assistente */
const FQ=[[/orar|apert/,'Riceviamo lun–ven 9:00–13:00 e 15:00–18:00 su appuntamento.'],[/cost|prezz|quanto/,'Visita €80, ECG €50, certificato €40. Pagamento online o in studio.'],[/ricet/,'Invia la richiesta dall’area ricette: il medico risponde entro 24 ore.'],[/fattur/,'Le fatture sono in area paziente, scaricabili in PDF.'],[/urgen/,'Per urgenze chiama il 112. Questo servizio non gestisce emergenze.']];
function ask(q){const c=$('ch'),f=FQ.find(x=>x[0].test(q.toLowerCase()));c.innerHTML+=`<div class="m u">${E(q)}</div><div class="m">${f?f[1]:'Non so rispondere: ho inoltrato la domanda alla segreteria, che ti risponde appena possibile.'}</div>`;c.scrollTop=c.scrollHeight}
function askT(){const v=$('cq').value.trim();if(v){ask(v);$('cq').value=''}}$('cq').addEventListener('keydown',e=>{if(e.key=='Enter')askT()});
/* 06 calcolatore e quiz */
function calc(){const a=+$('a1').value,b=+$('a2').value,c=+$('a3').value;$('v1').textContent=a;$('v2').textContent=b;$('v3').textContent=c;const h=a*b*22/60,cost=h*c,sav=Math.round(cost*.8),mesi=Math.max(1,Math.ceil(490/Math.max(sav-89,1)));
$('cr').innerHTML=`€${sav}/mese<small>risparmio stimato (${Math.round(h*.8)} ore di segreteria liberate). Con setup €490 e canone €89, ti ripaghi in ~${mesi} mesi. Valori indicativi.</small>`}calc();
const ans={};function qz(q,i){ans[q]=i;[...$('q'+q).children].forEach((b,j)=>b.className=j==i?'on':'');if(ans[1]!=null&&ans[2]!=null){const s=ans[1]+ans[2],p=s<=1?['Essenziale','prenotazioni, ricette e fatture per un medico']:s<=3?['Studio','agenda multi-medico, assistente e incassi online']:['Clinica','più sedi, reportistica e ruoli del personale'];
$('qr').innerHTML=`<div class="doc"><b>Piano ${p[0]}</b><br>${p[1]}.<br><a href="demo.html#richiedi" class="btn s" style="margin-top:8px">Richiedi la demo</a></div>`}}
