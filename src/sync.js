/* ---------- difficulté des grades : ND (par défaut) / facile / difficile ---------- */
let diffMap = {};
try{
  diffMap = JSON.parse(localStorage.getItem('bag_diff')||'null') || {};
}catch(e){}
/* filet de sécurité : si bag_diff est vide ou illisible mais qu'une sauvegarde
   existe, on repart de la sauvegarde plutôt que d'une liste vide. */
try{
  if(!Object.keys(diffMap).length){
    const bak = JSON.parse(localStorage.getItem('bag_diff_bak')||'null');
    if(bak && typeof bak === 'object' && Object.keys(bak).length) diffMap = bak;
  }
}catch(e){}
function purgeImageCache(){
  const kill = [];
  for(let i=0;i<localStorage.length;i++){ const k = localStorage.key(i); if(k && k.startsWith('bag_img_')) kill.push(k); }
  kill.forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
  return kill.length;
}
function saveDiff(){
  const payload = JSON.stringify(diffMap);
  try{
    localStorage.setItem('bag_diff', payload);
    if(Object.keys(diffMap).length) localStorage.setItem('bag_diff_bak', payload);
  }catch(e){
    // quota dépassé : le cache d'images est le seul poste sacrifiable
    purgeImageCache();
    try{
      localStorage.setItem('bag_diff', payload);
      if(Object.keys(diffMap).length) localStorage.setItem('bag_diff_bak', payload);
    }catch(e2){
      setSyncStatus('⚠️ Stockage local saturé — classements non enregistrés sur l\'appareil');
    }
  }
}
function getDiff(w){ return diffMap[w.toLowerCase()] || 'ND'; }
function isDiff(w){ return getDiff(w) === 'difficile'; }
function nbDiff(){ return Object.values(diffMap).filter(v=>v==='difficile').length; }
function nbFac(){ return Object.values(diffMap).filter(v=>v==='facile').length; }
function setDiffState(w, s){
  const k = w.toLowerCase();
  if(s === 'ND') delete diffMap[k]; else diffMap[k] = s;
  diffRev++;
  saveDiff();
  document.querySelectorAll('[data-diff]').forEach(el=>{ if(el.getAttribute('data-diff')===k) paintDiff(el, k); });
  updateRevCount();
  scheduleGhSave();
}
function refreshDiffUI(){
  document.querySelectorAll('[data-diff]').forEach(el=>paintDiff(el, el.getAttribute('data-diff')));
  updateRevCount();
}

/* ---------- synchronisation GitHub ---------- */
const GH_API = 'https://api.github.com/repos/victortisme/Boite-a-grades/contents/grades-difficiles.json';
let ghSha = null, syncTimer = null;
/* diffRev augmente à chaque modification locale. Une fusion calculée avant une
   modification ne doit jamais être réappliquée après : c'est ce qui faisait
   « revenir » le bouton de difficulté à sa valeur précédente. */
let diffRev = 0, ghSaving = false;
let ghToken = localStorage.getItem('bag_gh_token') || '';
function b64enc(s){ return btoa(unescape(encodeURIComponent(s))); }
function b64dec(s){ return decodeURIComponent(escape(atob(s.replace(/\s/g,'')))); }
function setSyncStatus(t){ const el = $('syncstatus'); if(el) el.textContent = t; }
function toggleSyncSetup(){
  const p = $('syncsetup');
  const open = p.style.display === 'none';
  p.style.display = open ? 'flex' : 'none';
  if(open){ $('ghtoken').value = ghToken; setTimeout(()=>$('ghtoken').focus(), 50); }
}
async function pasteToken(){
  try{
    const t = await navigator.clipboard.readText();
    if(t) $('ghtoken').value = t.trim();
    else alert('Presse-papiers vide.');
  }catch(e){
    alert('Collage automatique refusé par le navigateur : appuyez longuement dans le champ puis choisissez « Coller ».');
    $('ghtoken').focus();
  }
}
function saveGhToken(){
  ghToken = $('ghtoken').value.replace(/\s+/g,'').trim();
  if(ghToken && !/^gh[pousr]_|^github_pat_/.test(ghToken)){
    if(!confirm('Ce texte ne ressemble pas à un jeton GitHub. L\'enregistrer quand même ?')) return;
  }
  try{ localStorage.setItem('bag_gh_token', ghToken); }catch(e){}
  $('syncsetup').style.display = 'none';
  if(ghToken){ setSyncStatus('☁️ Jeton enregistré — connexion…'); ghLoad(); }
  else setSyncStatus('☁️ Jeton effacé — liste locale uniquement');
}
async function ghLoad(){
  const rev0 = diffRev;
  try{
    const headers = ghToken ? {Authorization: 'Bearer ' + ghToken} : {};
    const r = await fetch(GH_API + '?ref=main&t=' + Date.now(), {cache: 'no-store', headers: headers});
    if(!r.ok) throw 0;
    const j = await r.json();
    ghSha = j.sha;
    const remote = parseDiffPayload(JSON.parse(b64dec(j.content)));
    if(diffRev !== rev0){
      // l'utilisateur a modifié une difficulté pendant le chargement : on fusionne
      const e0 = localEdits();
      if(e0){ diffMap = applyEdits(remote, e0); saveDiff(); refreshDiffUI(); }
      if(ghToken) scheduleGhSave();
      return;
    }
    const edits = localEdits();
    if(edits === null){
      resetFromRemote(remote, '☁️ Liste locale incohérente — rechargée depuis GitHub (aucune suppression envoyée)');
    } else if(Object.keys(edits).length){
      // éditions locales non envoyées : on les applique sur l'état distant
      diffMap = applyEdits(remote, edits);
      saveDiff(); refreshDiffUI();
      if(ghToken) scheduleGhSave();
      else setSyncStatus('☁️ Modifications locales non envoyées — jeton requis');
    } else {
      diffMap = remote;
      saveDiff(); writeBase(remote); refreshDiffUI();
      setSyncStatus(ghToken ? '☁️ Synchronisé (' + nbDiff() + ' difficiles · ' + nbFac() + ' faciles)' : '☁️ Liste partagée chargée — lecture seule sans jeton');
    }
  }catch(e){
    setSyncStatus(ghToken ? '☁️ Connexion impossible — liste locale utilisée' : '☁️ Liste locale — configurez le jeton pour synchroniser');
  }
}
/* état de la dernière synchronisation réussie, pour ne pousser que les vraies éditions locales */
function readBase(){ try{ return JSON.parse(localStorage.getItem('bag_base')||'{}') || {}; }catch(e){ return {}; } }
function writeBase(m){ try{ localStorage.setItem('bag_base', JSON.stringify(m)); }catch(e){} }
function parseDiffPayload(raw){
  const out = {};
  if(Array.isArray(raw)) raw.forEach(x=>{ out[String(x).toLowerCase()] = 'difficile'; });
  else if(raw && typeof raw === 'object') for(const k in raw){ const v = String(raw[k]); if(v==='facile'||v==='difficile') out[k.toLowerCase()] = v; }
  return out;
}
/* Nombre maximal de retours à « ND » transmissibles en une synchronisation.
   Au-delà, il ne s'agit plus d'une édition mais d'une perte du stockage local. */
const MAX_SUPPR = 5;
function countSuppr(edits){ let n = 0; for(const k in edits){ if(edits[k] === 'ND') n++; } return n; }
/* Renvoie les éditions locales, ou null si l'état local est jugé non fiable.
   null = « ne rien envoyer, recharger depuis GitHub ». */
function localEdits(){
  const base = readBase(), edits = {};
  // Cas 1 : liste locale vide alors que la base ne l'est pas.
  // C'est une perte de données, jamais une suppression volontaire.
  if(!Object.keys(diffMap).length && Object.keys(base).length) return null;
  new Set([...Object.keys(diffMap), ...Object.keys(base)]).forEach(k=>{
    const now = diffMap[k] || 'ND', before = base[k] || 'ND';
    if(now !== before) edits[k] = now;
  });
  // Cas 2 : suppression de masse.
  if(countSuppr(edits) > MAX_SUPPR) return null;
  return edits;
}
function resetFromRemote(remote, msg){
  diffMap = remote;
  saveDiff(); writeBase(remote); refreshDiffUI();
  setSyncStatus(msg);
}
function applyEdits(remote, edits){
  const merged = Object.assign({}, remote);
  for(const k in edits){ if(edits[k]==='ND') delete merged[k]; else merged[k] = edits[k]; }
  return merged;
}
function scheduleGhSave(){
  if(!ghToken){ setSyncStatus('☁️ Modifié localement — jeton requis pour synchroniser'); return; }
  setSyncStatus('☁️ Enregistrement…');
  clearTimeout(syncTimer);
  syncTimer = setTimeout(()=>ghSave(false), 1500);
}
async function ghSave(isRetry){
  if(ghSaving){ clearTimeout(syncTimer); syncTimer = setTimeout(()=>ghSave(false), 700); return; }
  ghSaving = true;
  try{
    // 1. relire l'état distant pour ne rien écraser (fusion, pas remplacement)
    let remote = null;
    try{
      const r0 = await fetch(GH_API + '?ref=main&t=' + Date.now(), {cache:'no-store', headers:{Authorization:'Bearer '+ghToken}});
      if(r0.ok){ const j0 = await r0.json(); ghSha = j0.sha; remote = parseDiffPayload(JSON.parse(b64dec(j0.content))); }
    }catch(e){}
    if(remote === null){
      // relecture impossible : écrire maintenant écraserait la liste distante
      setSyncStatus('☁️ Lecture GitHub impossible — enregistrement reporté');
      clearTimeout(syncTimer); syncTimer = setTimeout(()=>ghSave(false), 6000);
      return;
    }
    // 2. appliquer uniquement les éditions locales sur cet état
    const rev = diffRev;            // instantané : toute modification ultérieure invalide cette fusion
    const edits = localEdits();
    if(edits === null){
      resetFromRemote(remote, '⚠️ Suppression massive bloquée — liste rechargée depuis GitHub');
      return;
    }
    const merged = applyEdits(remote, edits);
    // 3. garde-fou final : ne jamais publier un fichier vide ou brutalement amputé
    const nRemote = Object.keys(remote).length, nMerged = Object.keys(merged).length;
    if(nRemote && (!nMerged || nMerged < nRemote - MAX_SUPPR)){
      resetFromRemote(remote, '⚠️ Enregistrement annulé : perte anormale de grades — liste rechargée');
      return;
    }
    const sorted = {};
    Object.keys(merged).sort().forEach(k=>{ sorted[k] = merged[k]; });
    const body = {
      message: 'Mise à jour des difficultés',
      content: b64enc(JSON.stringify(sorted, null, 1)),
      branch: 'main'
    };
    if(ghSha) body.sha = ghSha;
    const r = await fetch(GH_API, {
      method: 'PUT',
      headers: {Authorization: 'Bearer ' + ghToken, 'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if((r.status === 409 || r.status === 422) && !isRetry){
      clearTimeout(syncTimer); syncTimer = setTimeout(()=>ghSave(true), 400);
      return;
    }
    if(!r.ok) throw 0;
    const j = await r.json();
    ghSha = j.content.sha;
    if(diffRev === rev){
      diffMap = merged;
      saveDiff(); writeBase(merged); refreshDiffUI();
      setSyncStatus('☁️ Synchronisé (' + nbDiff() + ' difficiles · ' + nbFac() + ' faciles)');
    }else{
      // modifié pendant l'envoi : on garde l'état local et on renvoie
      setSyncStatus('☁️ Enregistrement…');
      clearTimeout(syncTimer); syncTimer = setTimeout(()=>ghSave(false), 900);
    }
  }catch(e){
    setSyncStatus('☁️ Échec de l\'enregistrement — vérifiez le jeton et la connexion');
  }finally{
    ghSaving = false;
  }
}
