// lancé par le test « local » de NeoDex (profil de test) : un budget d'exemple, le graphique des dépenses par catégorie du mois, une dépense ajoutée avec sa catégorie ; rien ne déborde
module.exports = async ({ pj, sleep }) => {
  await sleep(1000);
  const r = await pj(`(async () => {
    const v = document.querySelector('.appWrap').parentElement, m = new Date().toISOString().slice(0, 7), op = (d, amount, label, x = {}) => ({ id: crypto.randomUUID(), date: m + '-' + d, acc: 'courant', label, amount, ...x });
    v.__bd.load({ accounts: [{ id: 'courant', name: 'Compte courant', balance: 842.3 }, { id: 'livretA', name: 'Livret A', balance: 3200, cap: 22950, saving: true, rate: 2.4, per: 'an' }], plan: { monthly: 100, to: 'livretA', target: 5000 },
      ops: [op('01', -620, 'Loyer'), op('02', -54.2, 'Lidl'), op('03', -31.9, 'Carrefour'), op('04', -12, 'Cinéma'), op('05', -45, 'Essence'), op('06', -18.5, 'Pizza'), op('06', -100, 'Virement vers Livret A', { group: 'g' }), op('07', 1500, 'Salaire'), op('08', -9.99, 'Abonnement : Netflix', { sub: 's' })] });
    await new Promise(r => setTimeout(r, 200));
    const rows = () => [...document.querySelectorAll('#bdCats .bdCatRow')].map(e => e.dataset.cat);
    const before = rows();
    document.getElementById('bdKind').value = 'depense'; document.getElementById('bdKind').onchange();
    document.getElementById('bdCat').value = 'sante'; document.getElementById('bdAmount').value = '23,40'; document.getElementById('bdLabel').value = 'Rendez-vous'; document.getElementById('bdAdd').click();
    await new Promise(r => setTimeout(r, 200));
    return { before, after: rows(), tot: document.querySelector('.bdCatTot b')?.textContent, catShown: getComputedStyle(document.getElementById('bdCat')).display,
      over: [...document.querySelectorAll('.appWrap *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length, who: [...document.querySelectorAll('.appWrap *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 6).map(e => e.tagName + (e.id ? '#' + e.id : '') + '.' + e.className + ' ' + Math.round(e.getBoundingClientRect().right)).join(', ') };
  })()`);
  if (r.before.join() !== 'logement,courses,transport,resto,loisirs,abonnements') throw new Error('catégories : ' + JSON.stringify(r));
  if (!r.after.includes('sante') || r.catShown === 'none') throw new Error('dépense avec catégorie : ' + JSON.stringify(r));
  if (r.over) throw new Error(r.over + ' élément(s) débordent à droite : ' + r.who);
  // import d'un relevé : un CSV « Crédit Agricole » (débit et crédit séparés, en-tête après deux lignes), un doublon, une opération déjà saisie à la main, puis un OFX avec son solde
  const im = await pj(`(async () => {
    const v = document.querySelector('.appWrap').parentElement, m = new Date().toISOString().slice(0, 7), d = n => n + '/' + m.slice(5) + '/' + m.slice(0, 4), wait = () => new Promise(r => setTimeout(r, 250));
    v.__bd.load({ accounts: [{ id: 'courant', name: 'Compte courant', balance: 842.3 }, { id: 'livretA', name: 'Livret A', balance: 3200, cap: 22950, saving: true }], plan: { monthly: 100, to: 'livretA', target: 0 },
      ops: [{ id: 'a', date: m + '-02', acc: 'courant', label: 'Lidl', amount: -54.2, cat: 'courses' }, { id: 'b', date: m + '-07', acc: 'courant', label: 'Abonnement : Netflix', amount: -9.99, sub: 's' }, { id: 'c', date: m + '-01', acc: 'courant', label: 'Boulangerie du coin', amount: -4.1, cat: 'loisirs' }] });
    await wait();
    const csv = 'Téléchargement du ' + d('09') + ';;;\\r\\nCompte de Dépôt carte n° 12345;;;\\r\\n\\r\\nDate;Libellé;Débit euros;Crédit euros;\\r\\n' + d('03') + ';"PAIEMENT PAR CARTE \\r\\nCARREFOUR LENS ' + d('02').slice(0, 5) + '";23,40;;\\r\\n'
      + d('04') + ';VIREMENT EN VOTRE FAVEUR SALAIRE;;1 500,00;\\r\\n' + d('08') + ';PRLV SEPA NETFLIX.COM;9,99;;\\r\\n' + d('02') + ';CARTE ' + d('02').slice(0, 5) + ' LIDL 4521;54,20;;\\r\\n' + d('05') + ';CB BOULANGERIE DU COIN;3,80;;\\r\\n';
    v.__bd.imp(csv, 'releve.csv'); await wait();
    const box = document.getElementById('bdImpBox'), rows = [...box.querySelectorAll('.bdImpRow')];
    const one = { shown: box.style.display !== 'none', n: rows.length, checked: rows.filter(r => r.querySelector('input').checked).length, dupe: box.querySelectorAll('.bdImpRow.dupe').length,
      labels: rows.map(r => r.querySelector('.tn').firstChild.textContent).join('|'), cats: rows.map(r => r.querySelector('select')?.value || '-').join('|'), sum: box.querySelector('.bdForm .hint:last-child')?.textContent, go: document.getElementById('bdImpGo').textContent };
    document.getElementById('bdImpGo').click(); await wait();
    const B = v.__bd.data(), imp = B.ops.filter(o => o.nobal);
    one.after = { ops: B.ops.length, bal: B.accounts[0].balance, imp: imp.length, hidden: box.style.display === 'none', carrefour: imp.find(o => o.amount === -23.4)?.label };
    const ofx = '<OFX><BANKTRANLIST><STMTTRN><DTPOSTED>' + m.replace('-', '') + '06<TRNAMT>-45.00<FITID>Z1<NAME>TOTALENERGIES LENS</STMTTRN></BANKTRANLIST><LEDGERBAL><BALAMT>1000.00</LEDGERBAL></OFX>';
    v.__bd.imp(ofx, 'releve.ofx'); await wait();
    one.ofxBal = box.querySelector('.bdForm select:nth-of-type(2)')?.value; one.ofxCat = box.querySelector('.bdImpRow select')?.value;
    document.getElementById('bdImpGo').click(); await wait();
    one.ofxAfter = { bal: v.__bd.data().accounts[0].balance, fit: v.__bd.data().ops.some(o => o.fit === 'Z1') };
    v.__bd.imp(ofx, 'releve.ofx'); await wait(); one.again = box.querySelectorAll('.bdImpRow.dupe').length + '/' + document.getElementById('bdImpGo').disabled;
    // pour la capture : un relevé du mois avec plusieurs commerçants
    v.__bd.imp('Date;Libellé;Montant\\n' + [['10', 'CB MONOPRIX LENS', '-32,15'], ['11', 'CB UBER EATS', '-18,90'], ['12', 'PRLV SEPA FREE MOBILE', '-15,99'], ['13', 'VIR SEPA RECU REMBOURSEMENT JEAN MARTIN', '25,00'], ['14', 'CB PHARMACIE DE LA GARE', '-8,60'], ['15', 'CB SNCF INTERNET', '-42,00']].map(r => d(r[0]) + ';' + r[1] + ';' + r[2]).join('\\n'), 'releve-novembre.csv');
    await wait(); box.scrollIntoView({ block: 'start' });
    one.over = [...document.querySelectorAll('.appWrap *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length;
    return one;
  })()`);
  if (!im.shown || im.n !== 5 || im.checked !== 3 || im.dupe !== 1 || !/Carrefour Lens/.test(im.labels) || !/^3 à importer · 1 déjà dans ton budget · 1 peut-être déjà saisie à la main/.test(im.sum || '')) throw new Error('aperçu du relevé : ' + JSON.stringify(im));
  if (!/courses/.test(im.cats) || !im.cats.split('|').includes('loisirs')) throw new Error('catégories devinées (Carrefour → courses, la boulangerie → loisirs comme avant) : ' + im.cats);
  if (im.after.ops !== 6 || im.after.bal !== 842.3 || im.after.imp !== 3 || !im.after.hidden || im.after.carrefour !== 'Carrefour Lens') throw new Error('import du relevé : ' + JSON.stringify(im.after));
  if (im.ofxBal !== 'set' || im.ofxCat !== 'transport' || im.ofxAfter.bal !== 1000 || !im.ofxAfter.fit || im.again !== '1/true') throw new Error('relevé OFX : ' + JSON.stringify(im));
  if (im.over) throw new Error(im.over + ' élément(s) de l’import débordent à droite');
  await sleep(2000);  // le temps de la capture d'écran
  return '7 catégories du mois (dont la santé ajoutée), total ' + r.tot + ' · relevé CSV : ' + im.n + ' lignes, 3 importées sans toucher au solde, 1 doublon écarté, 1 « déjà saisie ? » décochée, catégories ' + im.cats + ' · OFX : solde du relevé repris, réimport refusé';
};
