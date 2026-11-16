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
      over: [...document.querySelectorAll('.appWrap *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length };
  })()`);
  if (r.before.join() !== 'logement,courses,transport,resto,loisirs,abonnements') throw new Error('catégories : ' + JSON.stringify(r));
  if (!r.after.includes('sante') || r.catShown === 'none') throw new Error('dépense avec catégorie : ' + JSON.stringify(r));
  if (r.over) throw new Error(r.over + ' élément(s) débordent à droite');
  await pj(`document.getElementById('bdCats').scrollIntoView({block: 'center'}), 0`);
  await sleep(2000);  // le temps de la capture d'écran
  return '7 catégories du mois (dont la santé ajoutée), total ' + r.tot;
};
