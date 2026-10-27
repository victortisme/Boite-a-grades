/* ---------- galons de poitrine (dessinés en SVG) ----------
   Spécification : {bg, diag:[couleurs], bars:[{c, f:filet rouge, thin, cut}], stars:n,
                    los:{n, c}, oak, lace, sprig, border:'simple'|'double'|'or'|'brod', none:'texte'}
   Couleurs : a = argent, o = or, b = bleu GAV, w = blanc. */
const CH_COL = {a:'#e4e7ec', o:'#e2b737', b:'#3355e0', w:'#f4f6f8'};
const CH_BG = {noir:'#17191e', marine:'#1c2a5e', bleu:'#2b4cb9', ciel:'#a8c3e6'};
function chStar(cx, cy, r){
  let d = '';
  for(let k=0;k<10;k++){
    const a = -Math.PI/2 + k*Math.PI/5, rr = k%2 ? r*0.42 : r;
    d += (k?'L':'M') + (cx + rr*Math.cos(a)).toFixed(1) + ' ' + (cy + rr*Math.sin(a)).toFixed(1);
  }
  return '<path d="' + d + 'Z" fill="#e4e7ec"/>';
}
function chLos(cx, cy, c){
  const s = 10;
  return '<path d="M' + cx + ' ' + (cy-s) + 'L' + (cx+s) + ' ' + cy + 'L' + cx + ' ' + (cy+s) + 'L' + (cx-s) + ' ' + cy + 'Z" fill="' + CH_COL[c] + '"/>'
    + '<path d="M' + cx + ' ' + (cy-s+2) + 'V' + (cy+s-2) + 'M' + (cx-s+2) + ' ' + cy + 'H' + (cx+s-2) + '" stroke="#1c2a5e" stroke-width="1.6"/>';
}
const CH_STARS = {2:[[30,50],[70,50]], 3:[[50,30],[30,66],[70,66]], 4:[[50,24],[28,50],[72,50],[50,76]], 5:[[50,18],[50,40],[28,58],[72,58],[50,80]]};
const CH_LOS = {1:[[50,22]], 2:[[37,50],[63,50]], 3:[[50,36],[36,62],[64,62]], 4:[[50,28],[33,50],[67,50],[50,72]], 5:[[50,20],[50,44],[35,60],[65,60],[50,76]]};
function chestSVG(p){
  let s = '<rect width="100" height="100" rx="4" fill="' + CH_BG[p.bg || 'noir'] + '"/>';
  if(p.diag){
    const n = p.diag.length, w = 11, gap = 9, tot = n*w + (n-1)*gap, x0 = 50 - tot/2;
    p.diag.forEach((c, k)=>{
      const x = x0 + k*(w+gap);
      s += '<rect x="' + x.toFixed(1) + '" y="16" width="' + w + '" height="68" fill="' + CH_COL[c] + '" transform="rotate(28 ' + (x + w/2).toFixed(1) + ' 50)"/>';
    });
  }
  if(p.bars){
    const big = p.los ? 9 : 12, hs = p.bars.map(b=>b.thin ? 4 : big), gap = p.los ? 5 : 6;
    const tot = hs.reduce((a,b)=>a+b,0) + gap*(hs.length-1);
    let y = (p.los ? 62 : 50) - tot/2;
    p.bars.forEach((b, k)=>{
      const h = hs[k];
      s += '<rect x="14" y="' + y.toFixed(1) + '" width="72" height="' + h + '" fill="' + CH_COL[b.c] + '"/>';
      if(b.f) s += '<rect x="14" y="' + (y + h/2 - 0.9).toFixed(1) + '" width="72" height="1.8" fill="#c8202a"/>';
      if(b.cut) [34, 64].forEach(cx=>{ s += '<rect x="' + cx + '" y="' + y.toFixed(1) + '" width="3" height="' + h + '" fill="#17191e"/>'; });
      y += h + gap;
    });
  }
  if(p.stars) CH_STARS[p.stars].forEach(([x,y])=>{ s += chStar(x, y, 11); });
  if(p.los) CH_LOS[p.los.n].forEach(([x,y])=>{ s += chLos(x, y, p.los.c); });
  if(p.oak){
    s += '<path d="M24 80 L76 22" stroke="#e4e7ec" stroke-width="2.6" stroke-linecap="round"/>';
    [0.22, 0.38, 0.54, 0.70, 0.86].forEach((t, k)=>{
      const x = 24 + 52*t, y = 80 - 58*t;
      [-1, 1].forEach(side=>{
        const r = -48 + side*42;
        const cx = x + side*7, cy = y + side*5;
        s += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="8" ry="4" fill="#e4e7ec" transform="rotate(' + r + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>';
      });
    });
  }
  if(p.lace) s += '<path d="M14 82 Q40 74 46 50 Q50 24 60 30 Q70 38 56 58 Q50 70 86 82" stroke="#f4f6f8" stroke-width="5" fill="none" stroke-linecap="round"/>';
  if(p.sprig) s += '<path d="M24 66 Q48 62 62 40 Q56 58 76 52" stroke="#f4f6f8" stroke-width="6" fill="none" stroke-linecap="round"/>'
    + '<path d="M40 64 Q62 72 80 62" stroke="#f4f6f8" stroke-width="5" fill="none" stroke-linecap="round"/>';
  if(p.border === 'simple') s += '<rect x="6" y="6" width="88" height="88" rx="3" fill="none" stroke="#e4e7ec" stroke-width="3"/>';
  if(p.border === 'double') s += '<rect x="5" y="5" width="90" height="90" rx="3" fill="none" stroke="#e4e7ec" stroke-width="2.5"/><rect x="10" y="10" width="80" height="80" rx="2" fill="none" stroke="#e4e7ec" stroke-width="2"/>';
  if(p.border === 'brod') s += '<rect x="5" y="5" width="90" height="90" rx="3" fill="none" stroke="#e4e7ec" stroke-width="5"/>';
  if(p.border === 'or') s += '<rect x="3" y="3" width="94" height="94" rx="3" fill="none" stroke="#e2b737" stroke-width="5"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Galon de poitrine">' + s + '</svg>';
}
function chestNode(p){
  const box = document.createElement('div');
  box.className = 'gbox chest';
  if(!p || p.none){ box.innerHTML = '<div class="status">' + escapeHtml(p && p.none || 'Non documenté') + '</div>'; return box; }
  box.innerHTML = chestSVG(p);
  return box;
}
