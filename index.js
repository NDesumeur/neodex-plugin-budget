// Budget : ton appli d'origine (HTML et code inchangés), livrée en plugin.
// Ses données sont dans le dossier du plugin, que NeoDex sauvegarde (synchro cloud et sauvegardes) ; à la première ouverture elle reprend ce que tu avais dans NeoDex.
// Elle tourne dans le bac à sable de NeoDex, avec ses outils d'interface (ctx.host) et seulement les autorisations de son plugin.json.
const HTML = "<div class=\"appWrap wide\">\n      <div class=\"agHead\"><span class=\"label\">Budget</span><span class=\"hint\">clic sur un montant : écrire le solde de ta banque</span><div class=\"agNav\"><button class=\"btn main px\" id=\"bdNewAcc\">+ NOUVEAU COMPTE</button><button class=\"btn px\" id=\"bdImp\" title=\"Un fichier CSV ou OFX téléchargé sur le site de ta banque\">IMPORTER UN RELEVÉ</button></div></div>\n      <div class=\"sysGrid\" id=\"bdTiles\"></div>\n      <div class=\"sysCard px\" id=\"bdAccBox\" style=\"display:none\"><span class=\"label\" id=\"bdAccTitle\">Nouveau compte</span>\n        <div class=\"bdForm\">\n          <input class=\"f\" id=\"bdAccName\" placeholder=\"Nom (ex : Livret Jeune, PEL…)\" spellcheck=\"false\">\n          <select class=\"f\" id=\"bdAccType\"><option value=\"epargne\">Épargne (livret, PEL…)</option><option value=\"courant\">Compte courant</option></select>\n          <input class=\"f\" id=\"bdAccBal\" placeholder=\"Solde €\" inputmode=\"decimal\">\n          <input class=\"f\" id=\"bdAccCap\" placeholder=\"Plafond € (facultatif)\" inputmode=\"decimal\">\n          <input class=\"f\" id=\"bdAccRate\" placeholder=\"Intérêts %\" inputmode=\"decimal\">\n          <select class=\"f\" id=\"bdAccPer\"><option value=\"an\">par an</option><option value=\"mois\">par mois</option></select>\n          <button class=\"btn main px\" id=\"bdAccSave\">Enregistrer</button><button class=\"btn px\" id=\"bdAccCancel\">Annuler</button><button class=\"btn px\" id=\"bdAccDel\">Supprimer le compte</button>\n        </div>\n        <div class=\"hint\">Les intérêts sont ajoutés chaque mois dans la prévision (un taux annuel est converti en taux mensuel équivalent). Tu peux les changer quand tu veux.</div>\n      </div>\n      <div class=\"sysCard px\"><span class=\"label\">Ajouter une opération</span>\n        <div class=\"bdForm\">\n          <select class=\"f\" id=\"bdKind\"><option value=\"depense\">Dépense</option><option value=\"rentree\">Rentrée d'argent</option><option value=\"virement\">Virement</option></select>\n          <select class=\"f\" id=\"bdCat\" aria-label=\"Catégorie\" title=\"Catégorie de la dépense\"></select>\n          <select class=\"f\" id=\"bdAcc\" title=\"Compte\"></select>\n          <select class=\"f\" id=\"bdTo\" title=\"Compte qui reçoit\"></select>\n          <input class=\"f\" id=\"bdLabel\" placeholder=\"Libellé (facultatif : courses, salaire…)\" spellcheck=\"false\">\n          <input class=\"f\" id=\"bdAmount\" placeholder=\"Montant €\" inputmode=\"decimal\">\n          <button class=\"btn main px\" id=\"bdAdd\">Ajouter</button>\n        </div>\n      </div>\n      <div class=\"sysCard px\"><span class=\"label\">Abonnements</span><span class=\"hint\" id=\"bdSubSum\"></span>\n        <div class=\"bdForm\">\n          <input class=\"f\" id=\"bdSubName\" placeholder=\"Nom (Netflix, Spotify, téléphone…)\" spellcheck=\"false\" aria-label=\"Nom de l'abonnement\">\n          <input class=\"f\" id=\"bdSubAmount\" placeholder=\"Montant €\" inputmode=\"decimal\" aria-label=\"Montant\">\n          <select class=\"f\" id=\"bdSubEvery\" aria-label=\"Tous les\"><option value=\"mois\">par mois</option><option value=\"an\">par an</option><option value=\"semaine\">par semaine</option></select>\n          <input class=\"f\" id=\"bdSubNext\" type=\"date\" aria-label=\"Prochain prélèvement\">\n          <select class=\"f\" id=\"bdSubAcc\" title=\"Compte prélevé\" aria-label=\"Compte prélevé\"></select>\n          <button class=\"btn main px\" id=\"bdSubAdd\">Ajouter</button>\n        </div>\n        <div id=\"bdSubs\"></div>\n        <div class=\"hint\">Le jour du prélèvement, la dépense s'ajoute toute seule au compte choisi.</div>\n      </div>\n      <div class=\"stCols\">\n        <div class=\"sysCard px\"><span class=\"label\">Dernières opérations</span><div id=\"bdTx\"></div></div>\n        <div class=\"sysCard px\"><div class=\"bdCatHead\"><span class=\"label\">Dépenses par catégorie</span><button class=\"btn px\" id=\"bdCatPrev\" title=\"Mois précédent\">‹</button><b id=\"bdCatMonth\"></b><button class=\"btn px\" id=\"bdCatNext\" title=\"Mois suivant\">›</button></div><div id=\"bdCats\"></div></div>\n        <div class=\"sysCard px\"><span class=\"label\">Prévoir mon épargne</span>\n          <div class=\"bdPlan\">Je mets de côté <input class=\"f\" id=\"bdPlanMonthly\" inputmode=\"decimal\" placeholder=\"150\"> € par mois sur le <select class=\"f\" id=\"bdPlanTo\"></select></div>\n          <div class=\"bdPlan\">Objectif (facultatif) <input class=\"f\" id=\"bdPlanTarget\" inputmode=\"decimal\" placeholder=\"ex : 3000\"> €</div>\n          <div id=\"bdPlanOut\"></div>\n          <span class=\"label\" style=\"margin-top:6px\">Livrets · 12 prochains mois</span>\n          <div id=\"bdChart\" class=\"colChart\"></div>\n        </div>\n      </div>\n    </div>";
/*CSS-MOVED*/ const CSS = `.bdForm{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
#bdKind{width:170px} #bdCat{width:170px}
.bdCatHead{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}.bdCatHead .label{flex:0 0 100%;margin:0}.bdCatHead b{font:clamp(11px,.8vw,14px) var(--title);color:#fff;min-width:9em;text-align:center;text-transform:capitalize}.bdCatHead .btn{height:32px;padding:0 10px}
.bdCatRow{display:grid;grid-template-columns:clamp(96px,7vw,140px) minmax(50px,1fr) clamp(80px,6vw,110px) 40px;gap:10px;align-items:center;padding:5px 0;font-size:clamp(14px,1vw,17px);color:var(--lilac)}
.bdCatRow .tr{height:clamp(14px,1.1vw,20px);background:rgba(255,255,255,.05)}.bdCatRow .tr i{display:block;height:100%;background:var(--pink);border-radius:0 4px 4px 0}
.bdCatRow b{color:#fff;font-weight:600;text-align:right}.bdCatRow span:last-child{text-align:right;color:var(--muted)}
.bdCatTot{display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.08);font-size:clamp(14px,1vw,17px);color:var(--lilac)}.bdCatTot b{color:#fff}
#bdAcc,#bdTo{width:190px}
#bdLabel{flex:1;min-width:200px}
#bdAmount{width:120px}
#bdSubName{flex:1;min-width:180px} #bdSubAmount{width:110px} #bdSubEvery{width:130px} #bdSubNext{width:160px} #bdSubAcc{width:180px}
.bdSub{display:grid;grid-template-columns:minmax(0,1fr) auto auto auto;gap:12px;align-items:center;padding:6px 0;border-top:1px solid rgba(255,255,255,.06)} .bdSub small{display:block;color:var(--muted);font-size:13px} .bdSub .soon{color:var(--pink)}
#bdAccName{flex:1;min-width:200px}
#bdAccType{width:210px}
#bdAccBal,#bdAccCap,#bdAccRate{width:150px}
#bdAccPer{width:110px}
.bdEdit{position:absolute;top:8px;right:8px;width:auto;min-width:0;font-size:10px;padding:4px 8px}
.bdBal{cursor:text}
.bdBal:hover{color:var(--pink)}
#bdTiles{grid-template-columns:repeat(auto-fill,minmax(clamp(220px,16vw,300px),1fr))}
.bdBalInput{font:20px var(--title);padding:6px 10px}
.bdPlan{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:16px;color:var(--lilac)}
.bdPlan .f{width:110px;font-size:15px;padding:7px 10px}
.bdPlan select.f{width:160px}
#bdPlanOut .advice{display:block}
.bdForm .f{font-size:15px;padding:9px 12px}
.bdForm .btn{height:40px}
.advice{display:flex;gap:12px;align-items:baseline;padding:7px 0;font-size:clamp(15px,1vw,17px);line-height:1.45;color:var(--lilac)}
.advice+.advice{border-top:1px solid rgba(255,255,255,.06)}
.advice .badge{flex:none;min-width:84px;text-align:center}
.agHead:has(#bdImp) .agNav{flex-wrap:wrap;gap:8px;max-width:100%}.agHead:has(#bdImp) .agNav .btn{max-width:100%;white-space:normal}
.stCols:has(#bdTx){grid-template-columns:repeat(auto-fit,minmax(min(380px,100%),1fr))}
.bdImpList{max-height:min(460px,55vh);overflow:auto;margin:10px 0;border-top:1px solid rgba(255,255,255,.08)}
.bdImpRow{display:grid;grid-template-columns:22px 52px minmax(0,1fr) minmax(110px,170px) minmax(90px,auto);gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:clamp(14px,1vw,16px);color:var(--lilac)}
.bdImpRow .tn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bdImpRow small{display:block;color:var(--pink);font-size:12px}
.bdImpRow select.f{font-size:13px;padding:5px 8px;width:100%}.bdImpRow .amt{text-align:right;color:#fff}
.bdImpRow.dupe{opacity:.45}
#bdImpBox .bdForm select.f{width:auto;max-width:100%}
@media (max-width:640px){.bdImpRow{grid-template-columns:22px 44px minmax(0,1fr) auto}.bdImpRow .amt{order:1}.bdImpRow>:nth-child(4){order:2;grid-column:3/-1}}
`;  // le style de ce plugin (il utilise les variables du thème de NeoDex)
// ---- relevés de banque : CSV (les banques françaises, avec ou sans en-tête, débit et crédit séparés ou non) et OFX/QFX ----
const stDate = v => { const t = String(v || '').trim(); let m = t.match(/^(\d{4})-?(\d{2})-?(\d{2})(?!\d{0,1}[/.])/), y, mo, d;
  if (m) [, y, mo, d] = m; else if ((m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})(?:\s|$)/))) { [, d, mo, y] = m; if (y.length === 2) y = '20' + y; } else return '';
  return +mo >= 1 && +mo <= 12 && +d >= 1 && +d <= 31 ? y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0') : ''; };
const stAmount = v => { let t = String(v ?? '').replace(/[\s\u00a0\u202f€]|EUR/g, '').replace(/[−–]/g, '-').replace(/^\((.*)\)$/, '-$1').replace(/^(\d.*)-$/, '-$1');
  const c = t.lastIndexOf(','), d = t.lastIndexOf('.');
  if (c >= 0 && d >= 0) t = c > d ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
  else if (c >= 0) t = /^[-+]?\d{1,3}(,\d{3})+$/.test(t) ? t.replace(/,/g, '') : t.replace(',', '.');
  else if (/^[-+]?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  return /^[-+]?\d*\.?\d+$/.test(t) ? Math.round(parseFloat(t) * 100) / 100 : NaN; };
// un libellé de banque lisible : sans « CB », « PRLV SEPA », dates ni numéros de carte, et plus tout en majuscules
const ST_SMALL = new Set(['de', 'du', 'la', 'le', 'les', 'des', 'et', 'au', 'aux', 'en', 'sur', 'a', 'pour', 'par']);
const stClean = l => { let t = String(l || '').replace(/\s+/g, ' ').trim()
    .replace(/^(paiement par carte|paiement cb|achat cb|facture carte|carte( bancaire)?|cb|prlv sepa|prlv|pr[ée]l[èe]vement( sepa)?)\b[\s:*.-]*/i, '')
    .replace(/^vir(ement)?( sepa)?( (re[çc]u|[ée]mis|instantan[ée]|en votre faveur))*\b[\s:*.-]*/i, 'VIREMENT ')
    .replace(/(^|\s)\d{1,2}[/.]\d{1,2}([/.]\d{2,4})?(?=\s|$)/g, '$1').replace(/(^|\s)[x*]?\d{4,}(?=\s|$)/gi, '$1').replace(/\s+/g, ' ').trim();
  if (t && t === t.toUpperCase()) t = t.split(' ').map(w => ST_SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w.length <= 3 && /^[A-Z]+$/.test(w) && !ST_SMALL.has(w.toLowerCase()) ? w : w.toLowerCase().replace(/(^|[-'/.&])(\p{L})/gu, (m, a, b) => a + b.toUpperCase())).join(' ').replace(/^\p{Ll}/u, c => c.toUpperCase());
  return t; };
// les lignes d'un CSV (guillemets, retours à la ligne dans un champ)
const stRows = (text, sep) => { const rows = [[]]; let cur = '', q = false;
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (q) { if (ch !== '"') cur += ch; else if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
    else if (ch === '"' && !cur.trim()) { q = true; cur = ''; }
    else if (ch === sep) { rows.at(-1).push(cur); cur = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; rows.at(-1).push(cur); cur = ''; rows.push([]); }
    else cur += ch; }
  rows.at(-1).push(cur); return rows.map(r => r.map(c => c.trim())).filter(r => r.some(c => c)); };
function stCSV(text) {
  const sample = text.slice(0, 6000), sep = [';', '\t', ',', '|'].map(x => [x, stRows(sample, x).filter(r => r.length >= 3).length]).sort((a, b) => b[1] - a[1])[0][0];
  const all = stRows(text, sep), hi = all.findIndex(r => r.some(c => /date/i.test(c)) && r.some(c => /montant|amount|somme|d[ée]bit|cr[ée]dit/i.test(c)));
  let dc = -1, lc = -1, ac = -1, db = -1, cr = -1, data;
  if (hi >= 0) {  // avec en-tête : les colonnes d'après leur nom
    const h = all[hi].map(c => c.toLowerCase()), col = (re, not) => h.findIndex(c => re.test(c) && !(not && not.test(c)));
    dc = col(/date/, /valeur|val$/); if (dc < 0) dc = col(/date/);
    lc = col(/libell|label|intitul|descri/, /date|montant|amount/); if (lc < 0) lc = col(/d[ée]tail|nature|op[ée]ration|memo|b[ée]n[ée]ficiaire|payee|name/, /date|montant|amount|num[ée]ro|n°|type/);
    ac = col(/montant|amount|somme/, /date|solde|balance/); db = col(/d[ée]bit/); cr = col(/cr[ée]dit/);
    data = all.slice(hi + 1);
  } else {  // sans en-tête (LCL…) : la colonne des dates, celle des montants, et le texte le plus long pour le libellé
    data = all.filter(r => r.some(c => stDate(c))); if (!data.length) return { rows: [] };
    const cols = [...Array(Math.max(...data.map(r => r.length))).keys()], most = f => c => data.filter(r => f(r[c] || '')).length >= data.length * 0.8;
    dc = cols.find(most(v => !!stDate(v))) ?? -1;
    ac = cols.find(c => c !== dc && most(v => /\d[.,]\d\d\b/.test(v) && !isNaN(stAmount(v)))(c)) ?? -1;
    const len = c => data.reduce((n, r) => n + (/\p{L}/u.test(r[c] || '') ? r[c].length : 0), 0);
    lc = cols.filter(c => c !== dc && c !== ac).sort((a, b) => len(b) - len(a))[0] ?? -1;
  }
  if (dc < 0 || (ac < 0 && db < 0 && cr < 0)) return { rows: [] };
  const rows = [];
  for (const r of data) {
    const date = stDate(r[dc]); if (!date) continue;
    let amount = ac >= 0 ? stAmount(r[ac]) : NaN;
    if (ac < 0) { const d = stAmount(r[db] ?? ''), c = stAmount(r[cr] ?? ''); amount = c ? Math.abs(c) : d ? -Math.abs(d) : NaN; }
    if (amount) rows.push({ date, amount, label: (lc >= 0 && r[lc]) || '' });
  }
  return { rows };
}
function stOFX(text) {
  const ent = v => v.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  const tag = (b, n) => ent((b.match(new RegExp('<' + n + '>([^<\\r\\n]*)', 'i')) || [])[1]?.trim() || '');
  const rows = [...text.matchAll(/<STMTTRN>([\s\S]*?)(?=<\/STMTTRN>|<STMTTRN>|<\/BANKTRANLIST>|$)/gi)].map(m => {
    const name = tag(m[1], 'NAME'), memo = tag(m[1], 'MEMO');
    return { date: stDate(tag(m[1], 'DTPOSTED')), amount: stAmount(tag(m[1], 'TRNAMT')), label: memo && (!name || memo.startsWith(name)) ? memo : name, fit: tag(m[1], 'FITID') || undefined };
  }).filter(r => r.date && r.amount);
  const bal = stAmount(tag((text.match(/<LEDGERBAL>[\s\S]*?(<\/LEDGERBAL>|<AVAILBAL>|$)/i) || [''])[0], 'BALAMT'));
  return { rows, ...(isNaN(bal) ? {} : { balance: bal }) };
}
const stParse = text => { text = String(text).replace(/^\uFEFF/, ''); return /<OFX>|<STMTTRN>/i.test(text) ? stOFX(text) : stCSV(text); };
const stDecode = buf => { try { return new TextDecoder('utf-8', { fatal: true }).decode(buf); } catch { return new TextDecoder('windows-1252').decode(buf); } };  // les banques françaises écrivent souvent en Windows-1252
// déjà dans le budget (même identifiant OFX, ou même jour, même montant, même libellé) ; peut-être déjà saisie à la main (même montant à 3 jours près)
function stMark(rows, ops, acc) {
  const mine = ops.filter(o => o.acc === acc), used = new Set(), norm = l => stClean(l).toLowerCase().replace(/[^a-z0-9]/g, ''), out = rows.map(r => ({ ...r, st: 'new' }));
  for (const r of out) { const o = mine.find(x => !used.has(x) && (r.fit && x.fit ? x.fit === r.fit : x.date === r.date && x.amount === r.amount && norm(x.label) === norm(r.label))); if (o) { used.add(o); r.st = 'dupe'; } }
  for (const r of out) { if (r.st !== 'new') continue; const t = Date.parse(r.date), o = mine.find(x => !used.has(x) && x.amount === r.amount && Math.abs(Date.parse(x.date) - t) <= 3 * 864e5); if (o) { used.add(o); r.st = 'maybe'; } }
  return out;
}
{  // vérifications : formats de plusieurs banques, montants, dates, libellés, doublons
  console.assert(stAmount('−1 234,56 €') === -1234.56 && stAmount('1,234.56') === 1234.56 && stAmount('12.50') === 12.5 && stAmount('1.234') === 1234 && stAmount('(5,00)') === -5 && stAmount('12,50-') === -12.5 && isNaN(stAmount('abc')) && isNaN(stAmount('')), 'relevé : montants');
  console.assert(stDate('05/11/2026') === '2026-11-05' && stDate('5.11.26') === '2026-11-05' && stDate('20261105120000[+1:CET]') === '2026-11-05' && stDate('2026-11-05') === '2026-11-05' && stDate('13/13/2026') === '' && stDate('Libellé') === '', 'relevé : dates');
  console.assert(stClean('PAIEMENT PAR CARTE CARREFOUR LENS 02/11') === 'Carrefour Lens' && stClean('CARTE 01/11/26 LIDL *1234') === 'Lidl' && stClean('PRLV SEPA EDF CLIENTS') === 'EDF Clients' && stClean('VIR SEPA RECU SALAIRE DE LA SOCIETE') === 'Virement Salaire de la Societe' && stClean('Boulangerie Martin') === 'Boulangerie Martin', 'relevé : libellés', stClean('VIR SEPA RECU SALAIRE DE LA SOCIETE'));
  const ca = stCSV('Téléchargement du 05/11/2026;;;\r\nCompte de Dépôt carte n° 12345;;;\r\n\r\nDate;Libellé;Débit euros;Crédit euros;\r\n03/11/2026;"PAIEMENT PAR CARTE \r\nCARREFOUR LENS 02/11";23,40;;\r\n04/11/2026;VIREMENT EN VOTRE FAVEUR SALAIRE;;1 500,00;\r\n');
  const bo = stCSV('dateOp;dateVal;label;category;categoryParent;supplierFound;amount;comment;accountNum;accountLabel;accountbalance\n2026-11-02;2026-11-03;"CARTE 01/11/26 LIDL 1234";"Alimentation";"Vie quotidienne";"lidl";-54,20;;0001;"Compte";842,30\n');
  const lcl = stCSV('05/11/2026;-12,50;Carte;X1234 STEAM GAMES\n06/11/2026;1200,00;Virement;SALAIRE\n'), en = stCSV('Date,Description,Amount\n2026-11-03,"Coffee, shop",-3.50\n');
  console.assert(ca.rows.length === 2 && ca.rows[0].amount === -23.4 && ca.rows[0].date === '2026-11-03' && stClean(ca.rows[0].label) === 'Carrefour Lens' && ca.rows[1].amount === 1500
    && bo.rows.length === 1 && bo.rows[0].date === '2026-11-02' && bo.rows[0].amount === -54.2 && stClean(bo.rows[0].label) === 'Lidl'
    && lcl.rows.length === 2 && lcl.rows[0].amount === -12.5 && stClean(lcl.rows[0].label) === 'Steam Games' && lcl.rows[1].amount === 1200 && en.rows[0].label === 'Coffee, shop' && en.rows[0].amount === -3.5, 'relevé : CSV', ca, bo, lcl, en);
  const ofx = stParse('OFXHEADER:100\nDATA:OFXSGML\n<OFX><BANKMSGSRSV1><STMTTRNRS><STMTRS><BANKTRANLIST>\n<STMTTRN>\n<TRNTYPE>DEBIT\n<DTPOSTED>20261103\n<TRNAMT>-23.40\n<FITID>A1\n<NAME>CB CARREFOUR\n<MEMO>CB CARREFOUR LENS 02/11\n</STMTTRN>\n<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20261104120000[+1:CET]<TRNAMT>1500,00<FITID>A2<NAME>VIR SALAIRE &amp; PRIME</STMTTRN>\n</BANKTRANLIST><LEDGERBAL><BALAMT>842.30<DTASOF>20261105</LEDGERBAL></STMTRS></STMTTRNRS></BANKMSGSRSV1></OFX>');
  console.assert(ofx.rows.length === 2 && ofx.rows[0].fit === 'A1' && ofx.rows[0].label === 'CB CARREFOUR LENS 02/11' && ofx.rows[1].amount === 1500 && ofx.rows[1].label === 'VIR SALAIRE & PRIME' && ofx.balance === 842.3, 'relevé : OFX', ofx);
  const mk = stMark([{ date: '2026-11-03', amount: -23.4, label: 'CB CARREFOUR LENS', fit: 'A1' }, { date: '2026-11-04', amount: 1500, label: 'x' }, { date: '2026-11-05', amount: -9.99, label: 'NETFLIX' }, { date: '2026-11-02', amount: -54.2, label: 'CARTE LIDL' }],
    [{ acc: 'c', fit: 'A1', date: '2026-11-03', amount: -23.4 }, { acc: 'c', date: '2026-11-03', amount: -9.99, label: 'Abonnement : Netflix' }, { acc: 'l', date: '2026-11-04', amount: 1500 }, { acc: 'c', date: '2026-11-02', amount: -54.2, label: 'Lidl' }], 'c');
  console.assert(mk.map(r => r.st).join() === 'dupe,new,maybe,dupe', 'relevé : doublons', mk);
}
export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const { el, toast, sfx, ask, newTab, pixIcon, PIX, WX } = ctx.host;
  const nbConfirm = ctx.host.confirm;  // la boîte de confirmation de NeoDex, à la place de celle de Windows
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  const $ = id => id === "budgetApp" ? view : view.querySelector('#' + id);  // les identifiants de ta vue, sans toucher à ceux du reste de NeoDex
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const LEGACY_API = ["budget"];
  const api = async (n, data) => {
    if (data !== undefined) { await folder.write(n, data); return true; }
    let v = await doc(n);
    if (v == null && legacy.api && LEGACY_API.includes(n)) { v = await legacy.api(n).catch(() => null); if (v != null) await folder.write(n, v); }  // première ouverture : tu retrouves tes données d'avant
    return v;
  };
  // ---- ton code d'origine ----
  /* ---------- Budget app, kept simple: budget.json = {accounts: [{id, name, balance, cap}], ops: [{id, date, acc, label, amount, group}], plan: {monthly, to, target}}
     balance is the account's current balance: adding an operation changes it right away, deleting the operation undoes it.
     A transfer is two operations sharing a `group` (minus on one account, plus on the other). ---------- */
  // ceilings set by law for these two livrets
  const BD_ACCOUNTS = [{id: 'courant', name: 'Compte principal', balance: 0}, {id: 'livretA', name: 'Livret A', balance: 0, cap: 22950}, {id: 'livretJeune', name: 'Livret Jeune', balance: 0, cap: 1600}];
  let budget = null;
  const saveBudget = () => api('budget', budget).catch(e => toast('Sauvegarde du budget impossible : ' + e.message, true));
  function loadBudget(d) {
    budget = d?.ops ? d : {accounts: BD_ACCOUNTS.map(a => ({...a})), ops: [], plan: {monthly: 150, to: 'livretJeune', target: 0}};  // older formats held no money yet
  }
  api('budget').then(d => { loadBudget(d); if (!(!view.classList.contains('on'))) renderBudget(); }).catch(e => toast('Budget indisponible : ' + e.message, true));
  const eur = v => v.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'});
  const money = s => { const v = parseFloat(String(s).replace(/[\s  €]/g, '').replace(',', '.')); return isFinite(v) ? Math.round(v * 100) / 100 : NaN; };
  const accOf = id => budget.accounts.find(a => a.id === id);
  const livrets = () => budget.accounts.filter(a => a.saving ?? !!a.cap);  // les comptes d'épargne (un compte créé par toi dit s'il en est un)
  const mRate = a => { const r = (a.rate || 0) / 100; return a.per === 'mois' ? r : Math.pow(1 + r, 1 / 12) - 1; };  // taux d'un mois (un taux annuel est converti en taux mensuel équivalent)
  const r2 = v => Math.round(v * 100) / 100;
  // savings forecast: `monthly` € a month on `to`; a full livret overflows into the other one. -> [{m: 'YYYY-MM', bal: {id: €}, total}]
  function forecast(months = 12) {
    const sv = livrets(), bal = Object.fromEntries(sv.map(a => [a.id, a.balance])), out = [], monthly = budget.plan.monthly, d = new Date(), to = sv.some(a => a.id === budget.plan.to) ? budget.plan.to : sv[0]?.id;
    let gained = 0;
    for (let i = 1; i <= months; i++) {
      for (const a of sv) { const g = r2(bal[a.id] * mRate(a)); bal[a.id] = r2(bal[a.id] + g); gained = r2(gained + g); }  // les intérêts du mois, puis le versement
      let left = monthly;
      for (const a of [accOf(to), ...sv.filter(a => a.id !== to)].filter(Boolean)) {
        const put = Math.min(left, a.cap ? Math.max(0, a.cap - bal[a.id]) : left); bal[a.id] = r2(bal[a.id] + put); left = r2(left - put);
      }
      d.setDate(15); d.setMonth(d.getMonth() + 1);
      out.push({m: ymd(d).slice(0, 7), bal: {...bal}, total: r2(Object.values(bal).reduce((s, v) => s + v, 0)), left, gained});
    }
    return out;
  }
  {  // self-check: money parsing and the overflow of a full Livret Jeune into the Livret A
    const keep = budget;
    loadBudget(null); budget.accounts[2].balance = 1500; budget.plan = {monthly: 150, to: 'livretJeune', target: 0};
    const f = forecast(2);
    console.assert(f[0].bal.livretJeune === 1600 && f[0].bal.livretA === 50 && f[1].bal.livretA === 200 && f[1].total === 1800, 'forecast');
    console.assert(money('12,50 €') === 12.5 && money('1 234,5') === 1234.5 && isNaN(money('abc')), 'money');
    budget.accounts.push({id: 'x', name: 'x', balance: 1000, saving: true, rate: 12, per: 'an'}, {id: 'y', name: 'y', balance: 1000, saving: true, rate: 1, per: 'mois'}); budget.plan = {monthly: 0, to: 'x', target: 0};
    const g = forecast(12);
    console.assert(g[0].bal.x === 1009.49 && g[0].bal.y === 1010 && Math.abs(g[11].bal.x - 1120) < 0.1 && g[0].bal.livretJeune === 1500, 'intérêts');  // 12 % par an = 12 % après 12 mois ; 1 % par mois
    budget = keep;
  }
  // les catégories des dépenses ; une ancienne dépense sans catégorie est devinée d'après son libellé
  const CATS = [['courses', 'Courses'], ['logement', 'Logement'], ['transport', 'Transport'], ['resto', 'Restaurants'], ['loisirs', 'Loisirs'], ['shopping', 'Shopping'], ['sante', 'Santé'], ['abonnements', 'Abonnements'], ['autre', 'Autre']];
  const CAT_GUESS = [['courses', /courses|carrefour|leclerc|lidl|auchan|intermarch|super ?u\b|aldi|monoprix|march[ée]/i], ['logement', /loyer|edf|engie|eau\b|électricit|electricit|gaz\b|assurance hab/i], ['transport', /essence|carburant|train|sncf|bus|tadao|péage|peage|parking|uber(?! ?eats)|totalenergies|esso|shell|avia|ratp|navigo|blablacar|ilevia|indigo/i],
    ['resto', /resto|restaurant|mcdo|burger|kebab|pizza|café|cafe|boulang|uber ?eats|deliveroo|just ?eat/i], ['abonnements', /netflix|spotify|deezer|disney|canal\+|prime video|free mobile|bouygues|\bsfr\b|orange|sosh|youtube premium|icloud|apple\.com|xbox game pass|playstation plus/i], ['loisirs', /cin[ée]|jeu|steam|concert|sortie|livre|sport/i], ['shopping', /amazon|vêtement|vetement|zara|fnac|cadeau/i], ['sante', /pharma|médecin|medecin|dentiste|mutuelle/i]];
  const catOf = o => o.cat || (o.sub ? 'abonnements' : (CAT_GUESS.find(([, re]) => re.test(o.label || '')) || ['autre'])[0]);
  // les dépenses d'un mois (« AAAA-MM ») par catégorie, de la plus grosse à la plus petite ; les virements entre tes comptes n'en sont pas
  const bdByCat = (ops, m) => { const t = {}; for (const o of ops) if (o.amount < 0 && !o.group && o.date.startsWith(m)) t[catOf(o)] = r2((t[catOf(o)] || 0) - o.amount); return Object.entries(t).sort((a, c) => c[1] - a[1]); };
  console.assert(JSON.stringify(bdByCat([{date: '2026-11-02', amount: -30, label: 'Lidl'}, {date: '2026-11-03', amount: -12.5, cat: 'loisirs'}, {date: '2026-11-04', amount: -20, label: 'Courses'}, {date: '2026-11-05', amount: -100, group: 'g'}, {date: '2026-10-30', amount: -9}, {date: '2026-11-06', amount: 500}], '2026-11')) === '[["courses",50],["loisirs",12.5]]', 'bdByCat');
  let catMonth = ymd(new Date()).slice(0, 7);
  function renderCats() {
    const list = bdByCat(budget.ops, catMonth), tot = r2(list.reduce((s, x) => s + x[1], 0)), max = list[0]?.[1] || 1;
    $('bdCatMonth').textContent = new Date(catMonth + '-15').toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'});
    $('bdCatNext').disabled = catMonth >= ymd(new Date()).slice(0, 7);
    if (!list.length) return $('bdCats').replaceChildren(el('div', 'hint', 'Aucune dépense ce mois-là.'));
    const tf = el('div', 'bdCatTot'); tf.append(el('span', '', 'Total des dépenses'), el('b', '', eur(tot)));
    $('bdCats').replaceChildren(...list.map(([k, v]) => {
      const r = el('div', 'bdCatRow'), tr = el('div', 'tr'), f = el('i'); f.style.width = Math.max(1, v / max * 100) + '%'; tr.append(f);
      r.append(el('span', '', CATS.find(c => c[0] === k)?.[1] || k), tr, el('b', '', eur(v)), el('span', '', Math.round(v / tot * 100) + ' %')); r.title = (CATS.find(c => c[0] === k)?.[1] || k) + ' : ' + eur(v) + ' sur ' + eur(tot); r.dataset.cat = k; return r;
    }), tf);
  }
  const shiftMonth = n => { const d = new Date(catMonth + '-15'); d.setMonth(d.getMonth() + n); catMonth = ymd(d).slice(0, 7); renderCats(); };
  $('bdCatPrev').onclick = () => shiftMonth(-1); $('bdCatNext').onclick = () => shiftMonth(1);
  $('bdCat').replaceChildren(...CATS.map(([k, n]) => new Option(n, k)));
  const monthLong = m => new Date(m + '-15').toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'});

  var renderBudget = function () {
    if (!budget) return;
    // accounts: click the amount to type the balance shown by the bank, right there (Enter or click elsewhere: saved, Escape: cancelled)
    const tile = a => {
      const c = el('div', 'sysCard px'); c.style.position = 'relative';
      const big = el('div', 'sysBig bdBal', eur(a.balance));
      c.append(el('span', 'label', a.name), big);
      if (a.cap) { const bar = el('div', 'dlBar'), f = el('i'); f.style.width = Math.min(100, a.balance / a.cap * 100) + '%'; bar.append(f); c.append(bar, el('div', 'hint', 'plafond ' + eur(a.cap) + (a.balance >= a.cap ? ' · plein' : ' · encore ' + eur(a.cap - a.balance)))); }
      else c.append(el('div', 'hint', 'clic sur le montant : le modifier'));
      if (a.rate) c.append(el('div', 'hint', 'intérêts ' + String(a.rate).replace('.', ',') + ' % par ' + (a.per === 'mois' ? 'mois' : 'an')));
      const ed = el('button', 'btn px bdEdit', 'MODIFIER'); ed.onclick = () => openAcc(a); c.firstChild.after(ed);
      big.title = 'Clic : écrire le solde affiché par ta banque';
      big.onclick = () => {
        const inp = el('input', 'f bdBalInput');
        inp.value = String(a.balance).replace('.', ','); inp.inputMode = 'decimal';
        big.replaceWith(inp); window.neo?.win('focus'); inp.focus(); inp.select();
        let done = false;
        const end = keep => {
          if (done) return; done = true;
          const v = money(inp.value);
          if (keep && !isNaN(v) && v !== a.balance) { a.balance = v; saveBudget(); }
          renderBudget();
        };
        inp.onkeydown = e => { if (e.key === 'Enter') end(true); if (e.key === 'Escape') end(false); };
        inp.onblur = () => end(true);
      };
      return c;
    };
    const total = budget.accounts.reduce((s, a) => s + a.balance, 0), sum = el('div', 'sysCard px');
    sum.append(el('span', 'label', 'Total'), el('div', 'sysBig', eur(r2(total))), el('div', 'hint', eur(r2(livrets().reduce((s, a) => s + a.balance, 0))) + ' d\'épargne'));
    $('bdTiles').replaceChildren(...budget.accounts.map(tile), sum);
    // operations, newest first
    const ops = [...budget.ops].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 60);
    $('bdTx').replaceChildren(...(ops.length ? ops.map(o => {
      const r = el('div', 'txRow'), n = el('div', 'tn'), del = el('button', 'x', 'X');
      n.append(o.label || (o.amount < 0 ? 'Dépense' : 'Rentrée'), el('small', '', accOf(o.acc)?.name || ''));
      del.title = 'Supprimer (le solde est remis comme avant)';
      del.onclick = async () => {
        const all = budget.ops.filter(x => o.group ? x.group === o.group : x === o);
        if (!await nbConfirm('Supprimer « ' + (o.label || 'cette opération') + ' » ? ' + (all.length > 1 ? 'Les deux côtés du virement sont annulés.' : o.nobal ? 'Le solde du compte ne change pas (elle vient d\'un relevé).' : 'Le solde du compte est remis comme avant.'))) return;
        for (const x of all) { const a = accOf(x.acc); if (a && !x.nobal) a.balance = r2(a.balance - x.amount); }
        budget.ops = budget.ops.filter(x => !all.includes(x)); saveBudget(); renderBudget();
      };
      r.append(el('span', 'd', o.date.slice(8) + '/' + o.date.slice(5, 7)), n, el('span', 'amt' + (o.amount > 0 ? ' in' : ''), (o.amount > 0 ? '+' : '−') + eur(Math.abs(o.amount))), del);
      return r;
    }) : [el('div', 'hint', 'Aucune opération. Ajoute une dépense, une rentrée d\'argent ou un virement vers un livret.')]));
    // form choices
    {  // les choix des formulaires suivent tes comptes
      const keep = [$('bdAcc').value, $('bdTo').value];
      if (!livrets().some(a => a.id === budget.plan.to)) budget.plan.to = livrets()[0]?.id || '';
      $('bdAcc').replaceChildren(...budget.accounts.map(a => new Option(a.name, a.id)));
      $('bdTo').replaceChildren(...budget.accounts.map(a => new Option('vers ' + a.name, a.id)));
      $('bdPlanTo').replaceChildren(...livrets().map(a => new Option(a.name, a.id)));
      if (accOf(keep[0])) $('bdAcc').value = keep[0];
      $('bdTo').value = accOf(keep[1]) ? keep[1] : budget.plan.to;
    }
    $('bdKind').onchange();
    // savings plan
    const p = budget.plan, f = forecast(120), at = k => f[k - 1];
    $('bdPlanMonthly').value = p.monthly ? String(p.monthly).replace('.', ',') : ''; $('bdPlanTo').value = p.to; $('bdPlanTarget').value = p.target ? String(p.target).replace('.', ',') : '';
    const lines = [];
    const now = livrets().reduce((s, a) => s + a.balance, 0);
    if (!livrets().length) lines.push('Crée un compte d\'épargne (bouton + NOUVEAU COMPTE) pour prévoir ton épargne.');
    else if (!p.monthly && !livrets().some(a => a.rate)) lines.push('Indique combien tu veux mettre de côté chaque mois.');
    else {
      lines.push(`Sur tes livrets aujourd'hui : ${eur(r2(now))}. Avec ${eur(p.monthly)} par mois : ${eur(at(3).total)} dans 3 mois, ${eur(at(6).total)} dans 6 mois, ${eur(at(12).total)} dans 1 an.`);
      if (at(12).gained > 0) lines.push(`Intérêts prévus : ${eur(at(12).gained)} sur 1 an.`);
      for (const a of livrets()) {
        const full = a.cap ? f.findIndex(x => x.bal[a.id] >= a.cap) : -1;
        if (a.cap && a.balance < a.cap && full >= 0 && full < 24 && (a.id === p.to || full > 0)) lines.push(`Le ${a.name} sera plein en ${monthLong(f[full].m)} (plafond ${eur(a.cap)}) : la suite ira ${livrets().length > 1 ? 'sur l\'autre livret' : 'nulle part'}.`);
      }
      if (f[0].left > 0) lines.push(`Tes comptes d'épargne sont pleins : ${eur(f[0].left)} par mois ne peuvent plus y aller.`);
      if (p.target) {
        const k = f.findIndex(x => x.total >= p.target);
        lines.push(now >= p.target ? `Objectif de ${eur(p.target)} déjà atteint.` : k >= 0 ? `Objectif de ${eur(p.target)} atteint en ${monthLong(f[k].m)}, dans ${k + 1} mois.` : `Objectif de ${eur(p.target)} : plus de 10 ans à ce rythme.`);
      }
    }
    $('bdPlanOut').replaceChildren(...lines.map(t => el('div', 'advice', t)));
    const year = f.slice(0, 12), max = Math.max(1, ...year.map(x => x.total), p.target || 0);
    $('bdChart').replaceChildren(...year.map((x, i) => {
      const c = el('div', 'col' + (p.target && x.total >= p.target ? ' today' : '')), b = el('div', 'bar');
      b.style.height = x.total / max * 140 + 'px';
      c.title = monthLong(x.m) + ' : ' + eur(x.total) + ' sur les livrets (' + livrets().map(a => a.name + ' ' + eur(x.bal[a.id])).join(', ') + ')';
      c.append(b, el('span', '', new Date(x.m + '-15').toLocaleDateString('fr-FR', {month: 'short'}).replace('.', '').toUpperCase()));
      return c;
    }));
  }
  // créer, modifier ou supprimer un compte
  let editing = null;
  function openAcc(a) {
    editing = a || 'new'; $('bdAccTitle').textContent = a ? 'Modifier « ' + a.name + ' »' : 'Nouveau compte';
    const n = v => v ? String(v).replace('.', ',') : '';
    $('bdAccName').value = a?.name || ''; $('bdAccType').value = a && !livrets().includes(a) ? 'courant' : 'epargne'; $('bdAccBal').value = a ? n(a.balance) || '0' : '';
    $('bdAccCap').value = n(a?.cap); $('bdAccRate').value = n(a?.rate); $('bdAccPer').value = a?.per || 'an';
    $('bdAccDel').style.display = a && a.id !== 'courant' ? '' : 'none'; $('bdAccBox').style.display = ''; $('bdAccName').focus();
  }
  $('bdNewAcc').onclick = () => openAcc(null);
  $('bdAccCancel').onclick = () => { $('bdAccBox').style.display = 'none'; };
  $('bdAccSave').onclick = () => {
    const name = $('bdAccName').value.trim(), bal = $('bdAccBal').value.trim() ? money($('bdAccBal').value) : 0, cap = money($('bdAccCap').value), rate = money($('bdAccRate').value);
    if (!name) return toast('Donne un nom au compte', true);
    if (isNaN(bal)) return toast('Solde invalide (ex : 250,50)', true);
    if ($('bdAccRate').value.trim() && (isNaN(rate) || rate < 0 || rate > 100)) return toast('Intérêts : un pourcentage entre 0 et 100', true);
    const a = editing === 'new' ? {id: 'c' + Date.now().toString(36)} : editing;
    Object.assign(a, {name, balance: bal, saving: $('bdAccType').value === 'epargne', per: $('bdAccPer').value});
    if (cap > 0) a.cap = cap; else delete a.cap;
    if (rate > 0) a.rate = rate; else delete a.rate;
    if (editing === 'new') budget.accounts.push(a);
    $('bdAccBox').style.display = 'none'; saveBudget(); renderBudget();
  };
  $('bdAccDel').onclick = async () => {
    const a = editing; if (!a || a === 'new' || a.id === 'courant') return;
    if (!await nbConfirm('Supprimer le compte « ' + a.name + ' » et ses opérations ?')) return;
    budget.accounts = budget.accounts.filter(x => x !== a); budget.ops = budget.ops.filter(o => o.acc !== a.id);
    $('bdAccBox').style.display = 'none'; saveBudget(); renderBudget();
  };
  $('bdKind').onchange = () => { $('bdTo').style.display = $('bdKind').value === 'virement' ? '' : 'none'; $('bdCat').style.display = $('bdKind').value === 'depense' ? '' : 'none'; };
  $('bdAdd').onclick = () => {
    const amount = money($('bdAmount').value), kind = $('bdKind').value, acc = $('bdAcc').value, to = $('bdTo').value, label = $('bdLabel').value.trim(), date = ymd(new Date());
    if (!(amount > 0)) return toast('Indique un montant (ex : 12,50)', true);
    if (kind === 'virement' && to === acc) return toast('Choisis deux comptes différents', true);
    const add = (a, v, l, group) => { budget.ops.push({id: crypto.randomUUID(), date, acc: a, label: l, amount: v, ...(group ? {group} : {}), ...(v < 0 && !group ? {cat: $('bdCat').value} : {})}); accOf(a).balance = r2(accOf(a).balance + v); };
    if (kind === 'virement') { const g = crypto.randomUUID(); add(acc, -amount, label || 'Virement vers ' + accOf(to).name, g); add(to, amount, label || 'Virement depuis ' + accOf(acc).name, g); }
    else add(acc, kind === 'depense' ? -amount : amount, label);
    $('bdLabel').value = $('bdAmount').value = ''; $('bdAmount').focus();
    saveBudget(); renderBudget();
  };
  $('bdAmount').onkeydown = $('bdLabel').onkeydown = e => { if (e.key === 'Enter') $('bdAdd').click(); };
  $('bdPlanMonthly').onchange = $('bdPlanTo').onchange = $('bdPlanTarget').onchange = () => {
    budget.plan = {monthly: Math.max(0, money($('bdPlanMonthly').value) || 0), to: $('bdPlanTo').value, target: Math.max(0, money($('bdPlanTarget').value) || 0)};
    saveBudget(); renderBudget();
  };
  /* ---------- subscriptions: what comes back every week, month or year; on its day, the expense is added to its account ---------- */
  const subNext = (d, every) => { const x = new Date(d + 'T12:00'); if (every === 'semaine') x.setDate(x.getDate() + 7); else if (every === 'an') x.setFullYear(x.getFullYear() + 1); else { const day = x.getDate(); x.setDate(1); x.setMonth(x.getMonth() + 1); x.setDate(Math.min(day, new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate())); } return ymd(x); };
  const perMonth = s => s.every === 'an' ? s.amount / 12 : s.every === 'semaine' ? s.amount * 52 / 12 : s.amount;
  // the expenses whose day came (NeoDex closed for a while: each missed one is added, with its own date)
  function subsDue(today = ymd(new Date())) {
    let added = 0;
    for (const s of budget.subs || []) {
      for (let n = 0; s.next <= today && n < 60; n++) {
        const a = accOf(s.acc) || budget.accounts[0]; if (!a) break;
        budget.ops.push({id: crypto.randomUUID(), date: s.next, acc: a.id, label: 'Abonnement : ' + s.name, amount: -s.amount, sub: s.id}); a.balance = r2(a.balance - s.amount);
        s.next = subNext(s.next, s.every); added++;
      }
    }
    return added;  // the caller saves (the self-check below must never write)
  }
  {  // self-check: the 31st of a month falls on the last day of a shorter one; a year; a missed month is added once per month
    console.assert(subNext('2026-01-31', 'mois') === '2026-02-28' && subNext('2026-12-15', 'mois') === '2027-01-15' && subNext('2026-03-01', 'an') === '2027-03-01' && subNext('2026-03-01', 'semaine') === '2026-03-08', 'abonnements : dates');
    const keep = budget; loadBudget(null); budget.subs = [{id: 's', name: 'x', amount: 10, every: 'mois', next: '2026-01-05', acc: 'courant'}];
    const ok = subsDue('2026-03-10') === 3 && budget.accounts[0].balance === -30 && budget.subs[0].next === '2026-04-05'; budget = keep;
    console.assert(ok, 'abonnements : prélèvements');
  }
  function renderSubs() {
    const subs = budget.subs || [], today = ymd(new Date());
    $('bdSubAcc').replaceChildren(...budget.accounts.map(a => Object.assign(el('option', '', a.name), {value: a.id})));
    if (!$('bdSubNext').value) $('bdSubNext').value = today;
    const month = r2(subs.reduce((s, x) => s + perMonth(x), 0));
    $('bdSubSum').textContent = subs.length ? eur(month) + ' par mois · ' + eur(r2(month * 12)) + ' par an' : '';
    $('bdSubs').replaceChildren(...[...subs].sort((a, b) => a.next.localeCompare(b.next)).map(s => {
      const r = el('div', 'bdSub'), n = el('div', 'tn'), days = Math.round((new Date(s.next + 'T12:00') - new Date(today + 'T12:00')) / 864e5), del = el('button', 'btn px', 'Supprimer');
      n.append(s.name, el('small', days <= 3 ? 'soon' : '', 'prochain le ' + new Date(s.next + 'T12:00').toLocaleDateString('fr-FR') + (days <= 3 ? ' (dans ' + days + ' j)' : '') + ' · ' + (accOf(s.acc)?.name || '')));
      del.onclick = async () => { if (!await nbConfirm('Supprimer l\'abonnement « ' + s.name + ' » ? Les dépenses déjà ajoutées restent.')) return; budget.subs = budget.subs.filter(x => x !== s); saveBudget(); renderBudget(); };
      r.append(n, el('span', 'v', eur(s.amount)), el('span', 'hint', s.every === 'an' ? 'par an' : s.every === 'semaine' ? 'par semaine' : 'par mois'), del);
      return r;
    }));
  }
  $('bdSubAdd').onclick = () => {
    const name = $('bdSubName').value.trim(), amount = money($('bdSubAmount').value), next = $('bdSubNext').value;
    if (!name) return toast('Donne un nom à l\'abonnement', true);
    if (!(amount > 0)) return toast('Indique un montant (ex : 13,49)', true);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(next)) return toast('Choisis la date du prochain prélèvement', true);
    (budget.subs ||= []).push({id: crypto.randomUUID(), name: name.slice(0, 60), amount, every: $('bdSubEvery').value, next, acc: $('bdSubAcc').value});
    $('bdSubName').value = $('bdSubAmount').value = ''; saveBudget(); renderBudget();
  };
  { const real = renderBudget; renderBudget = function () {
    if (!budget) return;
    const n = subsDue(); if (n) { saveBudget(); toast(n + ' prélèvement' + (n > 1 ? 's' : '') + ' d\'abonnement ajouté' + (n > 1 ? 's' : '')); }
    real(); renderSubs(); renderCats();
  }; }
  /* ---------- import d'un relevé de banque (CSV ou OFX) : un aperçu à cocher, les doublons écartés, les catégories devinées ---------- */
  const impBox = el('div', 'sysCard px'); impBox.id = 'bdImpBox'; impBox.style.display = 'none'; $('bdAccBox').after(impBox);
  const impFile = el('input'); impFile.type = 'file'; impFile.accept = '.csv,.ofx,.qfx,.txt'; impFile.style.display = 'none'; view.append(impFile);
  $('bdImp').onclick = () => { if (!budget) return; impFile.value = ''; impFile.click(); };
  impFile.onchange = async () => {
    const f = impFile.files[0]; if (!f) return;
    if (f.size > 5e6) return toast('Fichier trop gros pour un relevé (5 Mo au plus)', true);
    try { openImport(stParse(stDecode(await f.arrayBuffer())), f.name); } catch (e) { toast('Relevé illisible : ' + e.message, true); }
  };
  // la catégorie : celle que tu as déjà donnée à ce commerçant, sinon devinée d'après le libellé
  const learnKey = l => stClean(l).toLowerCase().replace(/[^a-zà-ÿ ]/g, ' ').split(' ').filter(w => w.length > 1).slice(0, 2).join(' ');
  const guessCat = l => { const k = learnKey(l), o = k && [...budget.ops].reverse().find(x => x.cat && x.amount < 0 && learnKey(x.label) === k); return o ? o.cat : catOf({label: stClean(l)}); };
  function openImport(st, name) {
    if (!st.rows.length) return toast('Aucune opération trouvée dans ce fichier : il faut un relevé CSV ou OFX téléchargé sur le site de ta banque.', true);
    const acc = el('select', 'f'), bal = el('select', 'f'), list = el('div', 'bdImpList'), sum = el('span', 'hint'), go = el('button', 'btn main px', 'IMPORTER'), no = el('button', 'btn px', 'ANNULER');
    acc.append(...budget.accounts.map(a => new Option(a.name, a.id))); acc.value = (budget.accounts.find(a => !livrets().includes(a)) || budget.accounts[0]).id; acc.title = 'Le compte de ce relevé';
    bal.append(new Option('Solde : ne pas le changer (il est déjà celui de ta banque)', 'none'), new Option('Solde : y ajouter ces opérations', 'add'), ...(st.balance != null ? [new Option('Solde : celui du relevé, ' + eur(st.balance), 'set')] : []));
    bal.value = st.balance != null ? 'set' : 'none'; go.id = 'bdImpGo';
    const dates = st.rows.map(r => r.date).sort(), fr = d => d.slice(8) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4);
    let rows = [];
    const count = () => {
      const n = rows.filter(r => r.on).length, d = rows.filter(r => r.st === 'dupe').length, m = rows.filter(r => r.st === 'maybe').length;
      sum.textContent = n + ' à importer' + (d ? ' · ' + d + ' déjà dans ton budget' : '') + (m ? ' · ' + m + ' peut-être déjà saisie' + (m > 1 ? 's' : '') + ' à la main (décochée' + (m > 1 ? 's' : '') + ')' : '');
      go.disabled = !n; go.textContent = 'IMPORTER ' + n + ' OPÉRATION' + (n > 1 ? 'S' : '');
    };
    const fill = () => {
      rows = stMark(st.rows, budget.ops, acc.value).sort((a, b) => b.date.localeCompare(a.date)).map(r => ({...r, label: (stClean(r.label) || (r.amount < 0 ? 'Dépense' : 'Rentrée')).slice(0, 80), on: r.st === 'new', cat: r.amount < 0 ? guessCat(r.label) : null}));
      list.replaceChildren(...rows.map(r => {
        const row = el('div', 'bdImpRow' + (r.st === 'dupe' ? ' dupe' : '')), cb = el('input'), n = el('span', 'tn', r.label);
        cb.type = 'checkbox'; cb.checked = r.on; cb.disabled = r.st === 'dupe'; cb.onchange = () => { r.on = cb.checked; count(); }; cb.setAttribute('aria-label', 'Importer ' + r.label);
        n.title = r.label; if (r.st !== 'new') n.append(el('small', '', r.st === 'dupe' ? 'déjà dans ton budget' : 'déjà saisie à la main ?'));
        let c = el('span');
        if (r.cat) { c = el('select', 'f'); c.append(...CATS.map(([k, t]) => new Option(t, k))); c.value = r.cat; c.onchange = () => { r.cat = c.value; }; c.setAttribute('aria-label', 'Catégorie'); }
        row.append(cb, el('span', 'd', r.date.slice(8) + '/' + r.date.slice(5, 7)), n, c, el('span', 'amt' + (r.amount > 0 ? ' in' : ''), (r.amount > 0 ? '+' : '−') + eur(Math.abs(r.amount))));
        return row;
      }));
      count();
    };
    acc.onchange = fill;
    go.onclick = () => {
      const a = accOf(acc.value), mode = bal.value, pick = rows.filter(r => r.on); if (!a || !pick.length) return;
      for (const r of pick) budget.ops.push({id: crypto.randomUUID(), date: r.date, acc: a.id, label: r.label, amount: r.amount, ...(r.cat ? {cat: r.cat} : {}), ...(r.fit ? {fit: r.fit} : {}), ...(mode === 'add' ? {} : {nobal: 1})});
      if (mode === 'add') a.balance = r2(a.balance + pick.reduce((t, r) => t + r.amount, 0)); else if (mode === 'set') a.balance = st.balance;
      catMonth = pick.map(r => r.date).sort().at(-1).slice(0, 7);
      impBox.style.display = 'none'; saveBudget(); renderBudget();
      toast(pick.length + (pick.length > 1 ? ' opérations importées' : ' opération importée') + ' sur ' + a.name);
    };
    no.onclick = () => { impBox.style.display = 'none'; };
    const head = el('div', 'bdForm'), foot = el('div', 'bdForm');
    head.append(el('span', 'hint', 'Sur le compte'), acc, bal); foot.append(go, no, sum);
    impBox.replaceChildren(el('span', 'label', 'Importer un relevé'), el('div', 'hint', name + ' · ' + st.rows.length + (st.rows.length > 1 ? ' opérations' : ' opération') + ' du ' + fr(dates[0]) + ' au ' + fr(dates.at(-1)) + ' · décoche ce que tu ne veux pas, change une catégorie si besoin'), head, list, foot);
    fill(); impBox.style.display = ''; impBox.scrollIntoView({block: 'start', behavior: 'smooth'});
  }
  // ---- fin ----
  view.__bd = {load: d => { loadBudget(d); renderBudget(); }, byCat: bdByCat, imp: (text, name) => openImport(stParse(text), name), data: () => budget};  // pour l'auto-test
  ctx.onOpen(() => { renderBudget(); });
}
