# homepage

Une start page personnelle, dans **un seul fichier HTML**. Pas de build, pas de
dépendances à installer, pas de backend.

**→ [g0nni.github.io/homepage](https://g0nni.github.io/homepage/)**

Horloge, recherche web avec bangs, raccourcis clavier, thèmes, image de fond
dont la couleur dominante devient l'accent de l'interface. Toute la
configuration vit dans le `localStorage` du navigateur.

---

## Utilisation

### Clavier

| Touche | Effet |
|---|---|
| `/` | Placer le curseur dans la barre |
| deux lettres | Ouvrir directement un lien (`gh` → GitHub, `yt` → YouTube) |
| `↓` `↑` | Parcourir les résultats |
| `Entrée` | Ouvrir le résultat sélectionné, ou lancer la recherche web |
| `?` | Ouvrir les réglages |
| `Échap` | Vider la barre, ou fermer les réglages |

Les raccourcis à deux lettres fonctionnent sur **tous** les liens, y compris
ceux qui ne sont pas affichés au repos.

### La barre

Elle sert à deux choses à la fois. En tapant, les liens correspondants
remontent — la recherche porte sur le nom **et** sur le domaine, donc `git`
trouve aussi CyberChef, hébergé sur `gchq.github.io`. Une dernière ligne
propose toujours la recherche web, pour ne jamais rester bloqué.

Un domaine tapé directement (`lobste.rs`) est ouvert tel quel plutôt que
recherché.

### Bangs

`!g` Google · `!d` DuckDuckGo · `!y` YouTube · `!gh` GitHub · `!n` npm
· `!w` Wikipédia · `!r` Reddit · `!so` Stack Overflow · `!mdn` MDN
· `!m` Maps · `!ai` Claude

Exemple : `!yt lofi` lance la recherche sur YouTube.

---

## Configuration

Tout se règle dans le panneau `?` : nom affiché, thème, moteur de recherche
par défaut, image de fond, et les liens au format JSON.

```json
[
  {
    "name": "dev",
    "links": [
      { "name": "GitHub", "url": "https://github.com/G0nni", "key": "gh", "pin": true }
    ]
  }
]
```

- `key` — les deux lettres du raccourci. Laissé vide, il est généré
  automatiquement, avec unicité garantie.
- `pin` — le lien apparaît dans sa carte au repos. Sans épingle, il reste
  trouvable en tapant. Une catégorie sans aucun épinglé ne s'affiche pas.

Si aucun lien de la configuration n'a d'épingle, toutes les catégories sont
affichées en entier.

### Thèmes

catppuccin mocha · catppuccin latte · tokyo night · gruvbox · nord · rosé pine

### Image de fond

Au choix une URL ou un fichier local. Les fichiers locaux sont redimensionnés
(1920px max) et réencodés en JPEG avant stockage, pour tenir dans le quota du
navigateur. Un curseur règle l'assombrissement.

L'option « couleur dominante » échantillonne l'image dans un canvas et en tire
l'accent de toute l'interface. Une image distante servie **sans en-têtes CORS**
ne peut pas être analysée : elle s'affiche quand même, l'accent du thème est
conservé, et l'interface le signale. Un fichier local n'a jamais ce problème.

### Sauvegarde

La configuration est stockée sous la clé `startpage.config.v3`. Elle ne quitte
jamais le navigateur : il n'y a ni compte, ni serveur, ni synchronisation.

Pour la transporter d'une machine à l'autre, `?` → **Exporter** produit un
fichier JSON que **Importer** relit.

---

## Déploiement

GitHub Pages sert `index.html` depuis la racine de `main`. Un `git push` suffit,
la mise en ligne prend moins d'une minute.

Le fichier fonctionne aussi bien en local : il suffit de l'ouvrir dans un
navigateur. Sa seule ressource externe est la police JetBrains Mono servie par
Google Fonts, avec un repli sur les polices système.

---

## À propos du reste du dépôt

Ce projet a d'abord été une application Next.js (stack T3 : tRPC, Prisma,
NextAuth, Tailwind) qui faisait la même chose avec un compte utilisateur et une
synchronisation en base.

Son code est toujours présent dans `src/` et `prisma/`, mais **il n'est plus
utilisé ni maintenu** : le site publié est uniquement `index.html`. L'app ne
démarrerait pas telle quelle, faute de `.env` et de base de données.

Elle est conservée pour mémoire. Le passage à un fichier statique tenait à une
raison simple : la valeur du projet tenait entièrement dans un objet de
configuration de quelques kilo-octets, et faire porter à ça une authentification,
un ORM et une couche RPC coûtait cinq fichiers à modifier pour ajouter un widget.
