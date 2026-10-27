let mode = 2, pool = [], idx = 0, currentCard = null, sens = 'g2n', revealed = false;
const $ = id => document.getElementById(id);

/* ---------- images ---------- */
const FP = 'https://commons.wikimedia.org/wiki/Special:FilePath/';
function imgNode(sp){
  const box = document.createElement('div');
  box.className = 'gbox';
  if(sp.b){
    const pad = sp.p == null ? 12 : sp.p, [x0, x1, y0, y1] = sp.b;
    const vb = [x0 - pad, y0 - pad, (x1 - x0) + 2*pad, (y1 - y0) + 2*pad].join(' ');
    box.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet">'
      + '<image href="' + FP + encodeURIComponent(sp.f) + '" width="' + sp.W + '" height="' + sp.H + '"/></svg>';
  }else{
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.src = FP + encodeURIComponent(sp.f) + '?width=500';
    img.onerror = ()=>{ box.innerHTML = '<div class="status">Image indisponible</div>'; };
    box.appendChild(img);
  }
  return box;
}
function imagesEl(item, veiled){
  const wrap = document.createElement('div');
  wrap.className = 'gimgs' + (item.i.length > 1 ? ' pair' : '');
  item.i.forEach((sp, k)=>{
    const fig = document.createElement('figure');
    fig.className = 'gfig';
    if(sp.l){ const cap = document.createElement('figcaption'); cap.textContent = sp.l; fig.appendChild(cap); }
    const row = document.createElement('div');
    row.className = 'grow';
    [imgNode(sp), chestNode(item.p && item.p[k])].forEach((box, j)=>{
      if(veiled){ const v = document.createElement('div'); v.className = 'veil'; v.textContent = '❓'; box.appendChild(v); }
      const cell = document.createElement('div');
      cell.className = 'gcell';
      cell.appendChild(box);
      const t = document.createElement('div');
      t.className = 'gtag';
      t.textContent = j ? 'Poitrine' : 'Épaule';
      cell.appendChild(t);
      row.appendChild(cell);
    });
    fig.appendChild(row);
    wrap.appendChild(fig);
  });
  return wrap;
}
function noteEl(item, hidden){
  if(!item.x) return null;
  const d = document.createElement('div');
  d.className = 'desc' + (hidden ? ' hiddendesc' : '');
  d.textContent = hidden ? '❓ Remarque cachée' : '💡 ' + item.x;
  return d;
}
function catLab(ci, hidden){
  const d = document.createElement('div');
  d.className = 'catlab' + (hidden ? ' hiddenlab' : '');
  d.style.background = hidden ? '' : catColor(ci);
  d.textContent = hidden ? '❓ Catégorie cachée' : DATA.cats[ci].l;
  return d;
}

/* ---------- accueil ---------- */
function setMode(m){
  mode = m;
  [1,2,3,5].forEach(k=>$('mode'+k+'btn').classList.toggle('selected', m===k));
  const ex = m===3, play = m===1 || m===2;
  $('catpanel').style.display = play ? '' : 'none';
  $('startBtn').style.display = play ? '' : 'none';
  $('poolpanel').style.display = m===2 ? '' : 'none';
  $('expanel').style.display = ex ? '' : 'none';
  $('revpanel').style.display = m===5 ? '' : 'none';
  if(ex){ $('exInput').value=''; $('exSug').innerHTML=''; $('exCard').style.display='none'; showCatButtons(); }
  if(m===5) buildReview();
}
function isRevealMode(){ return mode===2; }
let poolFilter = 'tous';
function setPool(p){
  poolFilter = p;
  document.querySelectorAll('#poolpanel .chip[data-p]').forEach(c=>c.classList.toggle('on', c.dataset.p===p));
}
function setSens(s){
  sens = s;
  document.querySelectorAll('#poolpanel .chip[data-s]').forEach(c=>c.classList.toggle('on', c.dataset.s===s));
}
function wkey(w){ return w.toLowerCase(); }

/* ---------- difficulté : boutons ---------- */
function paintDiff(el, k){
  const st = diffMap[k] || 'ND';
  if(!el.classList.contains('diffseg')) return;
  el.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.s === st));
  const row = el.closest('.revitem');
  if(row){ row.classList.toggle('d', st==='difficile'); row.classList.toggle('f', st==='facile'); }
}
function diffBtn(w){
  const k = wkey(w);
  const g = document.createElement('span');
  g.className = 'diffseg';
  g.setAttribute('data-diff', k);
  [['ND','ND'],['facile','😊 Facile'],['difficile','🔥 Difficile']].forEach(p=>{
    const b = document.createElement('button');
    b.dataset.s = p[0];
    b.textContent = p[1];
    b.onclick = e=>{ e.stopPropagation(); e.preventDefault(); setDiffState(w, p[0]); };
    g.appendChild(b);
  });
  paintDiff(g, k);
  return g;
}

/* ---------- révision générale ---------- */
let revBuilt = false;
function buildReview(){
  updateRevCount();
  if(revBuilt) return;
  revBuilt = true;
  const frag = document.createDocumentFragment();
  DATA.cats.forEach((c, ci)=>{
    const h = document.createElement('div');
    h.className = 'revcat';
    h.textContent = c.l;
    frag.appendChild(h);
    DATA.words.filter(w=>w.c===ci).forEach(w=>{
      const row = document.createElement('div');
      row.className = 'revitem';
      const sp = document.createElement('span');
      sp.className = 'revword';
      sp.textContent = w.w;
      row.appendChild(sp);
      row.appendChild(diffBtn(w.w));
      frag.appendChild(row);
    });
  });
  $('revlist').appendChild(frag);
}
function knownKeys(){ return new Set(DATA.words.map(w=>wkey(w.w))); }
function updateRevCount(){
  const el = $('revcount');
  if(!el) return;
  const ks = knownKeys();
  let d = 0, f = 0;
  ks.forEach(k=>{ if(diffMap[k]==='difficile') d++; else if(diffMap[k]==='facile') f++; });
  el.textContent = d + ' difficile(s) · ' + f + ' facile(s) · ' + (ks.size - d - f) + ' ND';
}

/* ---------- catégories ---------- */
function buildCats(){
  const g = $('catgrid');
  let last = '';
  DATA.cats.forEach((c,i)=>{
    if(c.g !== last){
      last = c.g;
      const h = document.createElement('div');
      h.className = 'grouphead';
      h.textContent = c.g === 'G' ? '🟦 Gendarmerie nationale' : '🚓 Police nationale';
      g.appendChild(h);
    }
    const lab = document.createElement('label');
    lab.className = 'catitem';
    const n = DATA.words.filter(w=>w.c===i).length;
    lab.innerHTML = `<input type="checkbox" checked data-i="${i}" onchange="catToggled()"><span class="qm">?</span> ${escapeHtml(c.l.replace(/^(Gendarmerie|Police) — /,''))} <span style="margin-left:auto;color:#9db4cf;font-size:12px">${n}</span>`;
    g.appendChild(lab);
  });
  updateCount();
}
function allCats(v){
  document.querySelectorAll('#catgrid input').forEach(cb=>cb.checked=v);
  $('catgrid').classList.remove('mystery');
  updateCount();
}
function groupCats(gr){
  document.querySelectorAll('#catgrid input').forEach(cb=>{ cb.checked = DATA.cats[+cb.dataset.i].g === gr; });
  $('catgrid').classList.remove('mystery');
  updateCount();
}
function catToggled(){ $('catgrid').classList.remove('mystery'); updateCount(); }
function randomCats(){
  let n = parseInt($('nbRand').value, 10);
  if(isNaN(n)) return;
  if(n < 1) n = 1;
  if(n > DATA.cats.length){ n = DATA.cats.length; $('nbRand').value = n; }
  const idxs = DATA.cats.map((_,i)=>i);
  shuffle(idxs);
  const keep = new Set(idxs.slice(0, n));
  document.querySelectorAll('#catgrid input').forEach(cb=>{ cb.checked = keep.has(+cb.dataset.i); });
  $('catgrid').classList.add('mystery');
  updateCount();
}
function selectedCats(){
  return [...document.querySelectorAll('#catgrid input')].filter(cb=>cb.checked).map(cb=>+cb.dataset.i);
}
function updateCount(){
  const sel = new Set(selectedCats());
  const n = DATA.words.filter(w=>sel.has(w.c)).length;
  $('selcount').textContent = n + ' grades sélectionnés';
}
function startSession(){
  const sel = new Set(selectedCats());
  pool = DATA.words.filter(w=>sel.has(w.c));
  if(!pool.length){ alert('Sélectionnez au moins une catégorie.'); return; }
  if(mode===2 && poolFilter !== 'tous'){
    pool = pool.filter(w=>getDiff(w.w) === poolFilter);
    if(!pool.length){ alert('Aucun grade ne correspond à ce filtre dans les catégories choisies.'); return; }
  }
  if(mode===2) shuffle(pool);           // présentation : ordre hiérarchique
  idx = 0;
  $('home').classList.remove('active');
  $('play').classList.add('active');
  render();
  window.scrollTo(0,0);
}
function goHome(){
  $('play').classList.remove('active');
  $('home').classList.add('active');
}

/* ---------- exploration ---------- */
function norm(s){ return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
function catColor(i){ return 'hsl(' + (i*137.508 % 360).toFixed(0) + ',58%,40%)'; }
function showCatButtons(){
  const sug = $('exSug');
  sug.innerHTML = '';
  DATA.cats.forEach((c, ci)=>{
    const b = document.createElement('button');
    b.className = 'excatbtn';
    b.style.background = catColor(ci);
    b.textContent = '📁 ' + c.l;
    b.onclick = ()=>{ $('exInput').value = c.l; exShowCategory(ci); };
    sug.appendChild(b);
  });
}
function exSearch(){
  const q = norm($('exInput').value.trim());
  const sug = $('exSug');
  $('exCard').style.display = 'none';
  if(!q){ showCatButtons(); return; }
  sug.innerHTML = '';
  const catMatches = [];
  DATA.cats.forEach((c,i)=>{ if(norm(c.l).includes(q)) catMatches.push(i); });
  catMatches.forEach(ci=>{
    const b = document.createElement('button');
    b.className = 'excatbtn';
    b.style.background = catColor(ci);
    b.textContent = '📁 ' + DATA.cats[ci].l;
    b.onclick = ()=>{ $('exInput').value = DATA.cats[ci].l; exShowCategory(ci); };
    sug.appendChild(b);
  });
  const starts = [], contains = [];
  DATA.words.forEach(w=>{
    const n = norm(w.w);
    if(n.startsWith(q)) starts.push(w);
    else if(n.includes(q) || norm(w.d).includes(q)) contains.push(w);
  });
  const list = starts.concat(contains).slice(0, 30);
  if(!list.length && !catMatches.length){
    sug.innerHTML = '<span class="exnone">Aucun grade ni catégorie ne correspond.</span>';
    return;
  }
  list.forEach(w=>{
    const b = document.createElement('button');
    b.style.background = catColor(w.c);
    b.textContent = w.w;
    b.onclick = ()=>{ $('exInput').value = w.w; exShow(w); };
    sug.appendChild(b);
  });
  const exactWord = list.find(w=>norm(w.w)===q);
  if(exactWord) exShow(exactWord, true);
}
function exShow(item, keepSug){
  if(!keepSug) $('exSug').innerHTML = '';
  $('exCard').style.display = '';
  currentCard = item;
  $('exWord').innerHTML = '<span class="wordchip" style="background:' + catColor(item.c) + '">' + escapeHtml(item.w) + '</span>';
  const edr = $('exDiffrow');
  edr.innerHTML = '';
  edr.appendChild(diffBtn(item.w));
  const box = $('exMeanings');
  box.innerHTML = '';
  const cr = $('exCatrow');
  cr.innerHTML = '';
  cr.appendChild(catLab(item.c, false));
  const m = document.createElement('div');
  m.className = 'meaning';
  m.appendChild(imagesEl(item, false));
  const n = noteEl(item, false);
  if(n) m.appendChild(n);
  box.appendChild(m);
}
/* une catégorie = l'échelle des grades, du plus bas au plus haut */
function exShowCategory(ci, keepSug){
  if(!keepSug) $('exSug').innerHTML = '';
  $('exCard').style.display = '';
  currentCard = 'cat:' + ci;
  const words = DATA.words.filter(w=>w.c===ci);
  $('exWord').innerHTML = '<span class="wordchip" style="background:' + catColor(ci) + '">📁 ' + escapeHtml(DATA.cats[ci].l) + '</span>'
    + ' <span class="badge">' + words.length + ' grades</span>';
  $('exDiffrow').innerHTML = '';
  $('exCatrow').innerHTML = '';
  const box = $('exMeanings');
  box.innerHTML = '';
  const lad = document.createElement('div');
  lad.className = 'ladder';
  words.forEach(w=>{
    const row = document.createElement('div');
    row.className = 'ladderrow';
    const pics = document.createElement('div');
    pics.className = 'ladderpics';
    pics.appendChild(imgNode(w.i[0]));
    pics.appendChild(chestNode(w.p && w.p[0]));
    row.appendChild(pics);
    const t = document.createElement('div');
    t.innerHTML = '<div class="laddername">' + escapeHtml(w.w) + '</div>' + (w.x ? '<div class="ladderdesc">💡 ' + escapeHtml(w.x) + '</div>' : '');
    t.appendChild(diffBtn(w.w));
    t.style.cursor = 'pointer';
    t.onclick = e=>{ if(e.target.closest('.diffseg')) return; $('exInput').value = w.w; exShow(w); window.scrollTo(0,0); };
    row.appendChild(t);
    lad.appendChild(row);
  });
  box.appendChild(lad);
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }
function shuffleNow(){ shuffle(pool); idx=0; render(); }

/* ---------- carte ---------- */
function nav(d){
  idx = (idx + d + pool.length) % pool.length;
  render();
}
function render(){
  const item = pool[idx];
  currentCard = item;
  revealed = false;
  $('counter').textContent = (idx+1) + ' / ' + pool.length;
  const quiz = isRevealMode();
  const hideName = quiz && sens === 'g2n';
  const hideImg = quiz && sens === 'n2g';
  const wEl = $('word');
  wEl.classList.toggle('hiddenword', hideName);
  wEl.textContent = hideName ? '❓ Quel grade ?' : item.w;
  const dr = $('diffrow');
  dr.innerHTML = '';
  dr.appendChild(diffBtn(item.w));
  const cr = $('catrow');
  cr.innerHTML = '';
  cr.appendChild(catLab(item.c, hideName));
  const box = $('meanings');
  box.innerHTML = '';
  const m = document.createElement('div');
  m.className = 'meaning';
  m.appendChild(imagesEl(item, hideImg));
  const n = noteEl(item, quiz);
  if(n) m.appendChild(n);
  box.appendChild(m);
  const rb = $('revealBtn'), nb = $('nextBtn');
  if(quiz){ rb.style.display=''; rb.textContent='👁 Révéler'; nb.style.display='none'; }
  else { rb.style.display='none'; nb.style.display=''; }
  window.scrollTo(0,0);
}
function revealOrNext(){
  if(!isRevealMode()) return;
  if(revealed){ nav(1); return; }
  const item = pool[idx];
  const wEl = $('word');
  wEl.classList.remove('hiddenword');
  wEl.textContent = item.w;
  document.querySelectorAll('#meanings .veil').forEach(v=>v.remove());
  const lab = document.querySelector('#catrow .catlab');
  if(lab) lab.replaceWith(catLab(item.c, false));
  const d = document.querySelector('#meanings .desc');
  if(d) d.replaceWith(noteEl(item, false));
  revealed = true;
  $('revealBtn').textContent = 'Suivant ▶';
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* balayage */
(function(){
  let x0=null,y0=null;
  document.addEventListener('touchstart',e=>{ if($('play').classList.contains('active')){ x0=e.touches[0].clientX; y0=e.touches[0].clientY; } },{passive:true});
  document.addEventListener('touchend',e=>{
    if(x0===null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0=null;
    if(Math.abs(dx)>70 && Math.abs(dx)>2*Math.abs(dy)){
      const d = dx<0?1:-1;
      if(isRevealMode() && !revealed && d===1) return;
      nav(d);
    }
  },{passive:true});
})();

/* bord gauche : précédent ; bord droit : suivant ; image : révéler puis suivant */
document.addEventListener('click', e=>{
  if(!$('play').classList.contains('active')) return;
  if(e.target.closest('button, input, a, .diffseg')) return;
  if(e.clientX < window.innerWidth * 0.25){ nav(-1); return; }
  if(e.clientX > window.innerWidth * 0.75){ nav(1); return; }
  const onImage = e.target.closest('.gbox');
  if(onImage){
    if(isRevealMode() && !revealed) revealOrNext();
    else nav(1);
  }
});

/* clavier */
document.addEventListener('keydown',e=>{
  if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if(!$('play').classList.contains('active')) return;
  if(e.key==='ArrowRight'){ if(isRevealMode() && !revealed) revealOrNext(); else nav(1); }
  else if(e.key==='ArrowLeft') nav(-1);
  else if(e.key===' '||e.key==='Enter'){ if(isRevealMode()){ e.preventDefault(); revealOrNext(); } }
  else if(e.key==='f'||e.key==='F'){ if(pool[idx]) setDiffState(pool[idx].w, 'facile'); }
  else if(e.key==='d'||e.key==='D'){ if(pool[idx]) setDiffState(pool[idx].w, 'difficile'); }
  else if(e.key==='n'||e.key==='N'){ if(pool[idx]) setDiffState(pool[idx].w, 'ND'); }
});

buildCats();
setMode(2);
ghLoad();
