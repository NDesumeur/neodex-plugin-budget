# Budget

Suis l'argent de tes comptes et de tes livrets : soldes, dépenses, rentrées, virements et abonnements, puis une prévision de ton épargne sur 12 mois, intérêts et plafonds compris.

*English version: [README.en.md](README.en.md)*

## Tes comptes

- Au départ : un **compte principal**, un **Livret A** (plafond 22 950 €) et un **Livret Jeune** (plafond 1 600 €).
- **+ Nouveau compte** : un nom, le type (**compte courant** ou **épargne** : livret, PEL…), un plafond si tu veux, et un taux d'intérêt **par an** ou **par mois**. **Modifier** change tout cela ou supprime le compte avec ses opérations.
- **Clic sur un solde** : tape directement le montant affiché par ta banque (**Entrée** ou clic ailleurs pour garder, **Échap** pour annuler). C'est la façon la plus simple de rester juste.
- Un compte avec plafond montre une barre de remplissage, et « plein » quand il est atteint.

## Les opérations

- **Ajouter une opération** : une **dépense**, une **rentrée d'argent** ou un **virement** d'un compte à un autre, avec un montant et un libellé facultatif (courses, salaire…). Le solde change tout de suite.
- **Dernières opérations** : la liste des plus récentes. Supprimer une opération remet le solde comme avant ; pour un virement, les deux côtés sont annulés.

## Les abonnements

Ajoute tes prélèvements réguliers (Netflix, Spotify, téléphone…) : un nom, un montant, une fréquence (**par semaine**, **par mois** ou **par an**), la date du prochain prélèvement et le compte prélevé. Le jour venu, la dépense « Abonnement : … » s'ajoute toute seule au compte, et la date suivante est calculée. Si NeoDex est resté fermé, chaque prélèvement manqué est ajouté à sa propre date.

## Prévoir mon épargne

- Indique combien tu mets de côté **chaque mois** et sur quel livret, avec un **objectif** facultatif.
- Le plugin calcule mois par mois sur 12 mois : d'abord les intérêts de chaque livret (un taux annuel est converti en taux mensuel équivalent, donc 12 % par an font bien 12 % au bout d'un an), puis ton versement.
- Quand un livret atteint son plafond, la suite va automatiquement sur l'autre ; si tous sont pleins, le plugin te le dit.
- Il affiche ce que tu auras dans 3 mois, 6 mois et 1 an, les intérêts prévus sur un an, le mois où un livret sera plein et la date à laquelle tu atteindras ton objectif (ou « plus de 10 ans à ce rythme »). Un graphique en barres montre le total des livrets pour chacun des 12 prochains mois (le détail par livret au survol), et marque les mois où l'objectif est atteint.

## Données et synchronisation

Comptes, opérations, abonnements et plan d'épargne sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Rien n'est relié à ta banque : tout est saisi par toi. Au premier lancement, le plugin reprend ce que tu avais déjà dans NeoDex.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Budget → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
