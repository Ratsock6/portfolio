# 💻 Antoine --- Developer Portfolio

Portfolio personnel développé en **React + Vite + TypeScript**, avec un
thème inspiré d'un environnement terminal.

## 🛠 Stack Technique

-   React
-   TypeScript
-   Vite
-   React Router
-   React Markdown
-   CSS Modules
-   import.meta.glob pour le chargement automatique des fichiers
    Markdown

------------------------------------------------------------------------

## 📦 Installation

``` bash
git clone <repo>
cd portfolio
npm install
npm run dev
```

Application disponible sur : http://localhost:5173

------------------------------------------------------------------------

## 🚀 Build Production

``` bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

------------------------------------------------------------------------

## 📁 Structure du projet

src/ ├── app/ ├── components/ ├── content/ ├── data/ ├── pages/ └──
styles/

------------------------------------------------------------------------

## 📝 Ajouter un nouveau projet

1.  Créer un fichier Markdown dans : src/content/dev/mon-projet.md

2.  Ajouter l'entrée dans devProjects.ts :

``` ts
{
  slug: "mon-projet",
  title: "Mon Projet",
  shortDescription: "Description courte",
  contentMd: devMd["mon-projet"],
  tags: ["React", "TypeScript"],
  period: "2026",
  role: "Développement",
  highlights: ["Point fort 1", "Point fort 2"],
  logo: { src: "/logos/react.png" }
}
```

------------------------------------------------------------------------

## 🖼 Logos

-   Logos personnalisés : public/logos/
-   Logo par défaut : public/logos/default.png
-   Fallback automatique si image invalide

------------------------------------------------------------------------

## 🌗 Thème Terminal

-   Typographie monospace
-   Cartes style fenêtres CLI
-   Input type prompt `>`
-   Couleurs vertes accentuées
-   Thème persisté via localStorage

------------------------------------------------------------------------

## 📦 Déploiement

Compatible avec Vercel, Netlify, GitHub Pages ou serveur classique.

Exemple Vercel :

``` bash
vercel --prod
```

------------------------------------------------------------------------

## 📄 Licence

Projet personnel.
