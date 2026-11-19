# ConjugaES 🌿

Application web pour apprendre la conjugaison espagnole, pensée pour les francophones.
Tout tient dans un seul fichier, `index.html` : aucune installation n'est nécessaire.

## Utilisation

Ouvrez `index.html` dans un navigateur, ou publiez le dépôt avec **GitHub Pages**
(Settings → Pages → *Deploy from a branch*, dossier racine).

## Fonctionnalités

- **Quiz** : choix d'un ou plusieurs temps et du type de verbe ; les accents oubliés sont signalés ;
  indice lettre par lettre ; les erreurs reviennent plus souvent ; série de bonnes réponses et record.
- **Tables** : conjugaison complète de chaque verbe avec la traduction française, recherche
  avec ou sans accents (« ecouter » trouve *escuchar*).
- **Flashcards** : par temps et par type, mélange, navigation au clavier
  (<kbd>Espace</kbd> retourner, <kbd>←</kbd> <kbd>→</kbd> naviguer).
- **Prononciation** 🔊 grâce à la synthèse vocale du navigateur.
- Option **sans *vosotros*** pour l'espagnol d'Amérique latine.
- Mode sombre automatique (ou via le bouton 🌓), score et réglages conservés dans le navigateur.

Contenu : 68 verbes (‑ar, ‑er, ‑ir et irréguliers) × 6 temps : présent, prétérit, imparfait,
futur, conditionnel et subjonctif présent.

## Ajouter ou corriger un verbe

Les verbes sont dans le tableau `VERBS` de `index.html` :

```js
{v:'hablar', t:'Parler', type:'ar',            // type : ar | er | ir | irr
 ch:'e→ie',                                     // facultatif : changement de radical / d'orthographe
 es:{presente:[yo, tú, él, nosotros, vosotros, ellos], preterito:[...], imperfecto:[...],
     futuro:[...], condicional:[...], subjuntivo:[...]},
 fr:{presente:['je parle', ...], ...}}
```

Vérifiez ensuite les données (Node.js requis) :

```sh
node tools/check-verbs.js
```

Le script contrôle que chaque temps a bien 6 formes et 6 traductions, et que les verbes
réguliers suivent exactement les terminaisons régulières.
