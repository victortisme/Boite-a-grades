/* ---------- données ----------
   Images : Wikimedia Commons. Gendarmerie : Mangouste35 (CC BY-SA 3.0), Poussah (CC BY-SA 4.0).
   Police : planches Minotaure75018 (CC BY-SA 4.0), Arzhur44 (CC BY-SA 4.0).
   i : liste d'images. {f, l} = fichier entier ; {f, b:[x0,x1,y0,y1], W, H, l} = recadrage d'une planche. */
const GD = 'Départementale', GM = 'Mobile', OC = 'OCTA', CS = 'CSTAGN';
const CEA = {f:'Galons CEA.svg', W:1444, H:881};
const CC  = {f:'Galons CC.svg', W:1722, H:585};
const CCD = {f:'Galons Commissaires.svg', W:923, H:460};
const EMP = {f:'Galons emploi direction.svg', W:930, H:463};
function crop(p, x0, x1, y0, y1, pad){ return {f:p.f, W:p.W, H:p.H, b:[x0, x1, y0, y1], p:pad}; }

/* galons de poitrine (voir chest.js) */
const N = 'noir', M = 'marine';
const dg = (c, n)=>({bg:N, diag:Array(n).fill(c)});
const bs = (arr, bg)=>({bg:bg||N, bars:arr});
const nb = (c, n, bg)=>bs(Array.from({length:n}, ()=>({c})), bg);
const alt = (m, i)=>bs([{c:m},{c:i},{c:m},{c:i},{c:m}]);
const pair = f=>[f('a','o'), f('o','a')];   // [départementale, mobile] : (métal, métal inverse)
function gdgm(code){ return [{f:code+' gd.svg', l:GD}, {f:code+' gm.svg', l:GM}]; }

const DATA = {
cats: [
  {l:'Gendarmerie — GAV et militaires du rang', g:'G'},
  {l:'Gendarmerie — Sous-officiers (SOG)', g:'G'},
  {l:'Gendarmerie — Officiers', g:'G'},
  {l:'Gendarmerie — Officiers généraux', g:'G'},
  {l:'Police — Corps d\'encadrement et d\'application (CEA)', g:'P'},
  {l:'Police — Corps de commandement (officiers)', g:'P'},
  {l:'Police — Corps de conception et de direction (commissaires)', g:'P'},
  {l:'Police — Emplois de direction', g:'P'},
  {l:'Police — Anciens grades', g:'P'}
],
words: [
/* ===== Gendarmerie — GAV et militaires du rang ===== */
{w:'Gendarme adjoint volontaire (GAV)', c:0, x:'« Gendarme »', d:'Fourreau bleu, sans chevron.',
 p:[{bg:N}],
 i:[{f:'Gav gav.svg'}]},
{w:'Gendarme adjoint de 1re classe', c:0, x:'« Gendarme »', d:'Fourreau bleu, un chevron bleu.',
 p:[dg('b',1)],
 i:[{f:'Gav 1cl.svg'}]},
{w:'Brigadier (GAV)', c:0, x:'« Brigadier »', d:'Fourreau bleu, deux chevrons bleus.',
 p:[dg('b',2)],
 i:[{f:'Gav bri.svg'}]},
{w:'Brigadier-chef (GAV)', c:0, x:'« Brigadier-chef »', d:'Fourreau bleu, deux chevrons bleus sous un chevron argent.',
 p:[{bg:N, diag:['b','b','a']}],
 i:[{f:'Gav bch.svg'}]},

/* ===== Gendarmerie — Sous-officiers (avec le CSTAGN, corps de soutien) ===== */
{w:'Gendarme sous contrat', c:1, x:'« Gendarme » ; CSTAGN et GAV : « Maréchal des logis »\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : CSTAGN.\nFourreau bleu : GAV (volontaire, pas sous-officier).', d:'Un chevron.',
 p:pair(m=>dg(m,1)).concat([dg('a',1), dg('a',1)]),
 i:[{f:'Gend sc gd.svg', l:GD}, {f:'Gend sc gm.svg', l:GM}, {f:'Mdl sc cstag.svg', l:'CSTAGN — Maréchal des logis sous contrat'}, {f:'Gav mdl.svg', l:'GAV — Maréchal des logis'}]},
{w:'Gendarme de carrière', c:1, x:'« Gendarme » ; CSTAGN : « Maréchal des logis »\nRang situé entre sergent et sergent-chef des armées.\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : CSTAGN.', d:'Deux chevrons.',
 p:pair(m=>dg(m,2)).concat([dg('a',2)]),
 i:gdgm('Gend').concat([{f:'Mdl carriere cstag.svg', l:'CSTAGN — Maréchal des logis de carrière'}])},
{w:'Maréchal des logis-chef', c:1, x:'« Maréchal des logis-chef » (couramment « Chef »)\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : CSTAGN.', d:'Trois chevrons.',
 p:pair(m=>dg(m,3)).concat([dg('a',3)]),
 i:gdgm('Mdc').concat([{f:'Mdc cstag.svg', l:CS}])},
{w:'Adjudant', c:1, x:'« Mon adjudant » (femme : « Adjudant »)\nMétal inversé : galon or en départementale et au CSTAGN, argent en mobile.\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : CSTAGN.', d:'Un galon à filet rouge, de métal inversé : or en départementale, argent en mobile.',
 p:pair((m,i)=>bs([{c:i,f:1}])).concat([bs([{c:'o',f:1}])]),
 i:gdgm('Adj').concat([{f:'Adj cstag.svg', l:CS}])},
{w:'Adjudant-chef', c:1, x:'« Mon adjudant-chef » (femme : « Adjudant-chef »)\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : CSTAGN.', d:'Un galon à filet rouge, du métal de la subdivision : argent en départementale, or en mobile.',
 p:pair(m=>bs([{c:m,f:1}])).concat([bs([{c:'a',f:1}])]),
 i:gdgm('Adc').concat([{f:'Adc cstag.svg', l:CS}])},
{w:'Major', c:1, x:'« Major »\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : CSTAGN.', d:'Un galon large à filet rouge, du métal de la subdivision.',
 p:pair(m=>bs([{c:m,thin:1},{c:m,f:1}])).concat([bs([{c:'a',thin:1},{c:'a',f:1}])]),
 i:gdgm('Major').concat([{f:'Major cstag.svg', l:CS}])},

/* ===== Gendarmerie — Officiers (avec l'OCTA, corps technique et administratif) ===== */
{w:'Aspirant', c:2, x:'« Mon lieutenant » (femme : « Aspirant »)\nÉlève officier.', d:'Un galon argent coupé de deux traits noirs.',
 p:[bs([{c:'o',cut:1}])],
 i:[{f:'Aspirant gendarmerie départementale.svg', l:GD}]},
{w:'Sous-lieutenant', c:2, x:'« Mon lieutenant » (femme : « Lieutenant »)\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : OCTA.', d:'Un galon.',
 p:pair(m=>nb(m,1)).concat([nb('a',1)]),
 i:gdgm('Slt').concat([{f:'Slt cta.svg', l:OC}])},
{w:'Lieutenant', c:2, x:'« Mon lieutenant » (femme : « Lieutenant »)\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : OCTA.', d:'Deux galons.',
 p:pair(m=>nb(m,2)).concat([nb('a',2)]),
 i:gdgm('Ltn').concat([{f:'Ltn cta.svg', l:OC}])},
{w:'Capitaine', c:2, x:'« Mon capitaine » (femme : « Capitaine »)\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : OCTA.', d:'Trois galons.',
 p:pair(m=>nb(m,3)).concat([nb('a',3)]),
 i:gdgm('Cne').concat([{f:'Cne cta.svg', l:OC}])},
{w:'Chef d\'escadron', c:2, x:'« Mon commandant » (femme : « Commandant »)\nÀ l\'OCTA, le grade s\'appelle « commandant ».\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : OCTA.', d:'Quatre galons.',
 p:pair(m=>nb(m,4)).concat([nb('a',4)]),
 i:gdgm('Cen').concat([{f:'Cdt cta.svg', l:'OCTA — Commandant'}])},
{w:'Lieutenant-colonel', c:2, x:'« Mon colonel » (femme : « Colonel »)\nGalons alternés : trois du métal de la subdivision, deux de l\'autre.\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : OCTA.', d:'Cinq galons alternés.',
 p:pair((m,i)=>alt(m,i)).concat([alt('a','o')]),
 i:gdgm('Lcl').concat([{f:'Lcl cta.svg', l:OC}])},
{w:'Colonel', c:2, x:'« Mon colonel » (femme : « Colonel »)\nGrenade sans soutaches (les deux traits au-dessus de la flamme) : OCTA.', d:'Cinq galons du même métal.',
 p:pair(m=>nb(m,5)).concat([nb('a',5)]),
 i:gdgm('Col').concat([{f:'Col cta.svg', l:OC}])},

/* ===== Gendarmerie — Officiers généraux ===== */
{w:'Général de brigade', c:3, x:'« Mon général » (femme : « Général »)', d:'Deux étoiles.',
 p:[{bg:N, stars:2}],
 i:[{f:'Général brigade gend.svg'}]},
{w:'Général de division', c:3, x:'« Mon général » (femme : « Général »)', d:'Trois étoiles.',
 p:[{bg:N, stars:3}],
 i:[{f:'Général division gend.svg'}]},
{w:'Général de corps d\'armée', c:3, x:'« Mon général » (femme : « Général »)', d:'Quatre étoiles.',
 p:[{bg:N, stars:4}],
 i:[{f:'Général corps d\'armée gend.svg'}]},
{w:'Général d\'armée', c:3, x:'« Mon général » (femme : « Général »)', d:'Cinq étoiles.',
 p:[{bg:N, stars:5}],
 i:[{f:'Général armée gend.svg'}]},

/* ===== Police — CEA ===== */
{w:'Policier adjoint', c:4, x:'« Monsieur » / « Madame »\nContractuel, anciennement « adjoint de sécurité » (ADS).', d:'Fourreau bleu clair, sans galon.',
 p:[{bg:'bleu'}],
 i:[crop(CEA, 284, 432, 86, 405)]},
{w:'Gardien de la paix stagiaire', c:4, x:'« Gardien »', d:'Un chevron blanc.',
 p:[{bg:M, diag:['w']}],
 i:[crop(CEA, 529, 677, 86, 405)]},
{w:'Gardien de la paix', c:4, x:'« Gardien »', d:'Un chevron blanc et un chevron fin.',
 p:[{bg:M, diag:['w','w']}],
 i:[crop(CEA, 768, 915, 86, 405)]},
{w:'Brigadier-chef de police', c:4, x:'« Brigadier-chef »', d:'Deux filets fins : blanc et rouge.',
 p:[bs([{c:'w',f:1}])],
 i:[crop(CEA, 653, 792, 484, 752, 2)]},
{w:'Major de police', c:4, x:'« Major »', d:'Une barrette blanche au-dessus des filets blanc et rouge.',
 p:[bs([{c:'w',thin:1},{c:'w',f:1}])],
 i:[crop(CEA, 892, 1031, 484, 752, 2)]},
{w:'Major RULP', c:4, x:'« Major »\nResponsable d\'unité locale de police.', d:'Galons de major et un losange argent.',
 p:[bs([{c:'w',thin:1},{c:'w',f:1}])],
 i:[{f:'MajorRULP.png'}]},
{w:'Major à l\'échelon exceptionnel', c:4, x:'« Major »', d:'Galons de major et un losange or.',
 p:[bs([{c:'w',thin:1},{c:'w',f:1}])],
 i:[{f:'MajorEX.png'}]},

/* ===== Police — Corps de commandement ===== */
{w:'Élève officier de police', c:5, x:'« Monsieur » / « Madame »', d:'Une boucle (lacet) blanche.',
 p:[{bg:M, lace:1}],
 i:[crop(CC, 45, 193, 79, 400)]},
{w:'Lieutenant stagiaire', c:5, x:'« Lieutenant »', d:'Une large barrette blanche.',
 p:[nb('w',1,M)],
 i:[crop(CC, 276, 423, 79, 400)]},
{w:'Lieutenant de police', c:5, x:'« Lieutenant »\nAppellation du capitaine pendant ses premières années après la formation.', d:'Deux barrettes blanches.',
 p:[nb('w',2,M)],
 i:[crop(CC, 520, 668, 79, 400)]},
{w:'Capitaine de police', c:5, x:'« Capitaine »', d:'Trois barrettes blanches.',
 p:[nb('w',3,M)],
 i:[crop(CC, 759, 907, 79, 400)]},
{w:'Commandant de police', c:5, x:'« Commandant »', d:'Quatre barrettes blanches.',
 p:[nb('w',4,M)],
 i:[crop(CC, 998, 1145, 79, 400)]},
{w:'Commandant divisionnaire', c:5, x:'« Commandant »', d:'Barrettes de commandant et un motif de feuillage or.',
 p:[Object.assign(nb('w',4,M), {los:{n:1,c:'o'}, border:'or'})],
 i:[crop(CC, 1221, 1368, 79, 400)]},
{w:'Commandant divisionnaire à l\'emploi fonctionnel', c:5, x:'« Commandant »', d:'Barrettes de commandant et un motif de feuillage argent.',
 p:[Object.assign(nb('w',4,M), {los:{n:1,c:'a'}})],
 i:[crop(CC, 1442, 1589, 79, 400)]},

/* ===== Police — Commissaires ===== */
{w:'Commissaire de police', c:6, x:'« Monsieur le commissaire » / « Madame la commissaire »', d:'Feuilles de chêne brodées, sans barrette.',
 p:[{bg:M, oak:1, border:'simple'}],
 i:[crop(CCD, 36, 180, 43, 359)]},
{w:'Commissaire divisionnaire', c:6, x:'« Monsieur le commissaire » / « Madame la commissaire »', d:'Feuilles de chêne et deux barrettes.',
 p:[{bg:M, oak:1, border:'double'}],
 i:[crop(CCD, 512, 655, 43, 359)]},
{w:'Commissaire général', c:6, x:'« Monsieur le commissaire général » / « Madame la commissaire générale »', d:'Fourreau bordé de broderie argent, feuilles de chêne et deux losanges or.',
 p:[{bg:M, los:{n:2,c:'o'}, border:'double'}],
 i:[crop(CCD, 750, 894, 43, 359)]},

/* ===== Police — Emplois de direction ===== */
{w:'Contrôleur général', c:7, x:'« Monsieur le contrôleur général » / « Madame la contrôleuse générale »', d:'Broderie argent et deux losanges argent.',
 p:[{bg:M, los:{n:2,c:'a'}, border:'brod'}],
 i:[crop(EMP, 31, 175, 29, 345)]},
{w:'Inspecteur général', c:7, x:'« Monsieur l\'inspecteur général » / « Madame l\'inspectrice générale »', d:'Broderie argent et trois losanges argent.',
 p:[{bg:M, los:{n:3,c:'a'}, border:'brod'}],
 i:[crop(EMP, 269, 414, 29, 345)]},
{w:'Directeur des services actifs', c:7, x:'« Monsieur le directeur » / « Madame la directrice »', d:'Broderie argent et quatre losanges argent.',
 p:[{bg:M, los:{n:4,c:'a'}, border:'double'}],
 i:[crop(EMP, 507, 651, 29, 345)]},
{w:'Directeur général de la police nationale', c:7, x:'« Monsieur le directeur général » / « Madame la directrice générale »', d:'Broderie argent et cinq losanges argent.',
 p:[{bg:M, los:{n:5,c:'a'}, border:'brod'}],
 i:[crop(EMP, 744, 888, 29, 345)]},

/* ===== Police — Anciens grades ===== */
{w:'Sous-brigadier de police', c:8, x:'« Sous-brigadier »\nGrade supprimé.', d:'Deux chevrons blancs et un chevron fin.',
 p:[{bg:M, diag:['w','w','w']}],
 i:[crop(CEA, 1007, 1154, 86, 405)]},
{w:'Brigadier de police', c:8, x:'« Brigadier »\nGrade fusionné dans brigadier-chef.', d:'Une barrette or.',
 p:[bs([{c:'o'}])],
 i:[crop(CEA, 409, 548, 484, 752, 2)]},
{w:'Commissaire principal', c:8, x:'« Monsieur le commissaire » / « Madame la commissaire »\nGrade supprimé.', d:'Feuilles de chêne et une barrette.',
 p:[{none:'Non documenté'}],
 i:[crop(CCD, 267, 410, 43, 359)]}
]
};
DATA.words.forEach((w, k)=>{ w.o = k; });  // ordre hiérarchique d'origine
