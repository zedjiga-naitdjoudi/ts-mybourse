# ts-mybourse

Application web permettant de comparer l'évolution du cours de deux actions boursières sous forme de graphique interactif.

---

## Installation

```bash
npm i
```
 **Note :** Assurez-vous que `chartjs-adapter-date-fns` et `date-fns` sont installés (requis pour les échelles de temps des graphiques) :
```bash
npm install chartjs-adapter-date-fns date-fns
```

## Lancement

```bash
npm run dev
```

---

## Fonctionnalités

- Comparaison de deux actions boursières sur un même graphique
- Choix de la période : 1 semaine, 1 mois, 1 an
- Changement du type de graphique : courbe ou barres
- Affichage des stats (prix actuel, variation en %)
- Gestion des erreurs réseau et utilisateur

---

## Choix techniques

**Chart.js** — On a choisi Chart.js pour sa simplicité et sa documentation. On utilise l'adaptateur `chartjs-adapter-date-fns` pour gérer l'axe temporel proprement.

**Architecture** — On a séparé le code en plusieurs dossiers :

- `api/` : appels à l'API REST
- `models/` : interfaces TypeScript
- `ui/` : manipulation du DOM
- `charts/` : logique du graphique

---

## Structure du projet

```
src/
├── api/
│   └── stockApi.ts
├── charts/
│   └── chartManager.ts
├── models/
│   └── stock.ts
├── ui/
│   └── domManager.ts
└── main.ts
```
