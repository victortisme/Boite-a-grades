/* ---------- données ----------
   Images : Wikimedia Commons. Gendarmerie : Mangouste35 (CC BY-SA 3.0), Poussah (CC BY-SA 4.0).
   Police : planches Minotaure75018 (CC BY-SA 4.0), Arzhur44 (CC BY-SA 4.0).
   i : liste d'images. {f, l} = fichier entier ; {f, b:[x0,x1,y0,y1], W, H, l} = recadrage d'une planche. */
const GD = 'Départementale (argent)', GM = 'Mobile (or)';
const CEA = {f:'Galons CEA.svg', W:1444, H:881};
const CC  = {f:'Galons CC.svg', W:1722, H:585};
const CCD = {f:'Galons Commissaires.svg', W:923, H:460};
const EMP = {f:'Galons emploi direction.svg', W:930, H:463};
function crop(p, x0, x1, y0, y1, pad){ return {f:p.f, W:p.W, H:p.H, b:[x0, x1, y0, y1], p:pad}; }
function gdgm(code){ return [{f:code+' gd.svg', l:GD}, {f:code+' gm.svg', l:GM}]; }

const DATA = {
cats: [
  {l:'Gendarmerie — GAV et militaires du rang', g:'G'},
  {l:'Gendarmerie — Sous-officiers (SOG)', g:'G'},
  {l:'Gendarmerie — Officiers', g:'G'},
  {l:'Gendarmerie — Officiers généraux', g:'G'},
  {l:'Gendarmerie — CSTAGN (sous-officiers de soutien)', g:'G'},
  {l:'Gendarmerie — OCTA (officiers techniques et administratifs)', g:'G'},
  {l:'Police — Corps d\'encadrement et d\'application (CEA)', g:'P'},
  {l:'Police — Corps de commandement (officiers)', g:'P'},
  {l:'Police — Corps de conception et de direction (commissaires)', g:'P'},
  {l:'Police — Emplois de direction', g:'P'},
  {l:'Police — Anciens grades', g:'P'}
],
words: [
/* ===== Gendarmerie — GAV et militaires du rang ===== */
{w:'Gendarme adjoint volontaire (GAV)', c:0, d:'Fourreau bleu, sans chevron.', x:'Grade d\'entrée des volontaires.',
 i:[{f:'Gav gav.svg'}]},
{w:'Gendarme adjoint de 1re classe', c:0, d:'Fourreau bleu, un chevron bleu.',
 i:[{f:'Gav 1cl.svg'}]},
{w:'Brigadier (GAV)', c:0, d:'Fourreau bleu, deux chevrons bleus.',
 i:[{f:'Gav bri.svg'}]},
{w:'Brigadier-chef (GAV)', c:0, d:'Fourreau bleu, deux chevrons bleus sous un chevron argent.',
 i:[{f:'Gav bch.svg'}]},
{w:'Maréchal des logis (GAV)', c:0, d:'Fourreau bleu, un seul chevron argent.', x:'Plus haut grade des volontaires.',
 i:[{f:'Gav mdl.svg'}]},

/* ===== Gendarmerie — Sous-officiers ===== */
{w:'Gendarme sous contrat', c:1, d:'Un chevron (argent en départementale, or en mobile).',
 i:[{f:'Gend sc gd.svg', l:GD}, {f:'Gend sc gm.svg', l:GM}]},
{w:'Gendarme de carrière', c:1, d:'Deux chevrons.', x:'Grade situé entre sergent et sergent-chef des armées.',
 i:gdgm('Gend')},
{w:'Maréchal des logis-chef', c:1, d:'Trois chevrons.',
 i:gdgm('Mdc')},
{w:'Adjudant', c:1, d:'Un galon à filet rouge, de métal inversé : or en départementale, argent en mobile.',
 i:gdgm('Adj')},
{w:'Adjudant-chef', c:1, d:'Un galon à filet rouge, du métal de la subdivision : argent en départementale, or en mobile.',
 i:gdgm('Adc')},
{w:'Major', c:1, d:'Un galon large à filet rouge, du métal de la subdivision.', x:'Plus haut grade des sous-officiers.',
 i:gdgm('Major')},

/* ===== Gendarmerie — Officiers ===== */
{w:'Aspirant', c:2, d:'Un galon argent coupé de deux traits noirs.', x:'Élève officier.',
 i:[{f:'Aspirant gendarmerie départementale.svg', l:GD}]},
{w:'Sous-lieutenant', c:2, d:'Un galon.', x:'On dit « mon lieutenant ».',
 i:gdgm('Slt')},
{w:'Lieutenant', c:2, d:'Deux galons.', x:'On dit « mon lieutenant ».',
 i:gdgm('Ltn')},
{w:'Capitaine', c:2, d:'Trois galons.', x:'On dit « mon capitaine ».',
 i:gdgm('Cne')},
{w:'Chef d\'escadron', c:2, d:'Quatre galons.', x:'On dit « mon commandant » : le grade de commandant n\'existe pas en gendarmerie (sauf OCTA).',
 i:gdgm('Cen')},
{w:'Lieutenant-colonel', c:2, d:'Cinq galons alternés : trois argent et deux or (départementale), trois or et deux argent (mobile).', x:'On dit « mon colonel ».',
 i:gdgm('Lcl')},
{w:'Colonel', c:2, d:'Cinq galons du même métal.', x:'On dit « mon colonel ».',
 i:gdgm('Col')},

/* ===== Gendarmerie — Officiers généraux ===== */
{w:'Général de brigade', c:3, d:'Deux étoiles.', x:'On dit « mon général ».',
 i:[{f:'Général brigade gend.svg'}]},
{w:'Général de division', c:3, d:'Trois étoiles.',
 i:[{f:'Général division gend.svg'}]},
{w:'Général de corps d\'armée', c:3, d:'Quatre étoiles.',
 i:[{f:'Général corps d\'armée gend.svg'}]},
{w:'Général d\'armée', c:3, d:'Cinq étoiles.', x:'Plus haut grade de la gendarmerie.',
 i:[{f:'Général armée gend.svg'}]},

/* ===== Gendarmerie — CSTAGN ===== */
{w:'Maréchal des logis sous contrat (CSTAGN)', c:4, d:'Un chevron argent ; grenade sans soutaches.', x:'Au CSTAGN, « maréchal des logis » remplace « gendarme ».',
 i:[{f:'Mdl sc cstag.svg'}]},
{w:'Maréchal des logis de carrière (CSTAGN)', c:4, d:'Deux chevrons argent ; grenade sans soutaches.',
 i:[{f:'Mdl carriere cstag.svg'}]},
{w:'Maréchal des logis-chef (CSTAGN)', c:4, d:'Trois chevrons argent ; grenade sans soutaches.',
 i:[{f:'Mdc cstag.svg'}]},
{w:'Adjudant (CSTAGN)', c:4, d:'Un galon or à filet rouge ; grenade sans soutaches.',
 i:[{f:'Adj cstag.svg'}]},
{w:'Adjudant-chef (CSTAGN)', c:4, d:'Un galon argent à filet rouge ; grenade sans soutaches.',
 i:[{f:'Adc cstag.svg'}]},
{w:'Major (CSTAGN)', c:4, d:'Un galon large argent à filet rouge ; grenade sans soutaches.',
 i:[{f:'Major cstag.svg'}]},

/* ===== Gendarmerie — OCTA ===== */
{w:'Sous-lieutenant (OCTA)', c:5, d:'Un galon argent ; grenade sans soutaches.',
 i:[{f:'Slt cta.svg'}]},
{w:'Lieutenant (OCTA)', c:5, d:'Deux galons argent ; grenade sans soutaches.',
 i:[{f:'Ltn cta.svg'}]},
{w:'Capitaine (OCTA)', c:5, d:'Trois galons argent ; grenade sans soutaches.',
 i:[{f:'Cne cta.svg'}]},
{w:'Commandant (OCTA)', c:5, d:'Quatre galons argent ; grenade sans soutaches.', x:'Seul corps de la gendarmerie où le grade s\'appelle « commandant » (ailleurs : chef d\'escadron).',
 i:[{f:'Cdt cta.svg'}]},
{w:'Lieutenant-colonel (OCTA)', c:5, d:'Cinq galons : trois argent et deux or alternés ; grenade sans soutaches.',
 i:[{f:'Lcl cta.svg'}]},
{w:'Colonel (OCTA)', c:5, d:'Cinq galons argent ; grenade sans soutaches.',
 i:[{f:'Col cta.svg'}]},

/* ===== Police — CEA ===== */
{w:'Policier adjoint', c:6, d:'Fourreau bleu clair, sans galon.', x:'Contractuel, anciennement « adjoint de sécurité » (ADS).',
 i:[crop(CEA, 284, 432, 86, 405)]},
{w:'Gardien de la paix stagiaire', c:6, d:'Un chevron blanc.',
 i:[crop(CEA, 529, 677, 86, 405)]},
{w:'Gardien de la paix', c:6, d:'Un chevron blanc et un chevron fin.', x:'Premier grade du CEA.',
 i:[crop(CEA, 768, 915, 86, 405)]},
{w:'Brigadier-chef de police', c:6, d:'Deux filets fins : blanc et rouge.',
 i:[crop(CEA, 653, 792, 484, 752, 2)]},
{w:'Major de police', c:6, d:'Une barrette blanche au-dessus des filets blanc et rouge.', x:'Plus haut grade du CEA.',
 i:[crop(CEA, 892, 1031, 484, 752, 2)]},
{w:'Major RULP', c:6, d:'Galons de major et un losange argent.', x:'Responsable d\'unité locale de police.',
 i:[{f:'MajorRULP.png'}]},
{w:'Major à l\'échelon exceptionnel', c:6, d:'Galons de major et un losange or.',
 i:[{f:'MajorEX.png'}]},

/* ===== Police — Corps de commandement ===== */
{w:'Élève officier de police', c:7, d:'Une boucle (lacet) blanche.',
 i:[crop(CC, 45, 193, 79, 400)]},
{w:'Lieutenant stagiaire', c:7, d:'Une large barrette blanche.',
 i:[crop(CC, 276, 423, 79, 400)]},
{w:'Lieutenant de police', c:7, d:'Deux barrettes blanches.', x:'Appellation du capitaine pendant ses premières années après la formation.',
 i:[crop(CC, 520, 668, 79, 400)]},
{w:'Capitaine de police', c:7, d:'Trois barrettes blanches.', x:'On dit « capitaine ».',
 i:[crop(CC, 759, 907, 79, 400)]},
{w:'Commandant de police', c:7, d:'Quatre barrettes blanches.',
 i:[crop(CC, 998, 1145, 79, 400)]},
{w:'Commandant divisionnaire', c:7, d:'Barrettes de commandant et un motif de feuillage or.',
 i:[crop(CC, 1221, 1368, 79, 400)]},
{w:'Commandant divisionnaire à l\'emploi fonctionnel', c:7, d:'Barrettes de commandant et un motif de feuillage argent.',
 i:[crop(CC, 1442, 1589, 79, 400)]},

/* ===== Police — Commissaires ===== */
{w:'Commissaire de police', c:8, d:'Feuilles de chêne brodées, sans barrette.', x:'On dit « monsieur / madame le commissaire ».',
 i:[crop(CCD, 36, 180, 43, 359)]},
{w:'Commissaire divisionnaire', c:8, d:'Feuilles de chêne et deux barrettes.',
 i:[crop(CCD, 512, 655, 43, 359)]},
{w:'Commissaire général', c:8, d:'Fourreau bordé de broderie argent, feuilles de chêne et deux losanges or.',
 i:[crop(CCD, 750, 894, 43, 359)]},

/* ===== Police — Emplois de direction ===== */
{w:'Contrôleur général', c:9, d:'Broderie argent et deux losanges argent.',
 i:[crop(EMP, 31, 175, 29, 345)]},
{w:'Inspecteur général', c:9, d:'Broderie argent et trois losanges argent.',
 i:[crop(EMP, 269, 414, 29, 345)]},
{w:'Directeur des services actifs', c:9, d:'Broderie argent et quatre losanges argent.',
 i:[crop(EMP, 507, 651, 29, 345)]},
{w:'Directeur général de la police nationale', c:9, d:'Broderie argent et cinq losanges argent.',
 i:[crop(EMP, 744, 888, 29, 345)]},

/* ===== Police — Anciens grades ===== */
{w:'Sous-brigadier de police', c:10, d:'Deux chevrons blancs et un chevron fin.', x:'Grade supprimé.',
 i:[crop(CEA, 1007, 1154, 86, 405)]},
{w:'Brigadier de police', c:10, d:'Une barrette or.', x:'Grade fusionné dans brigadier-chef.',
 i:[crop(CEA, 409, 548, 484, 752, 2)]},
{w:'Commissaire principal', c:10, d:'Feuilles de chêne et une barrette.', x:'Grade supprimé.',
 i:[crop(CCD, 267, 410, 43, 359)]}
]
};
DATA.words.forEach((w, k)=>{ w.o = k; });  // ordre hiérarchique d'origine
