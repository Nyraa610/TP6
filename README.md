# CineTrack — Déploiement Vercel

## Local
```bash
cp .env.example .env       # puis colle ta clé TMDB
npm install
npm run dev
```

## Déploiement Vercel

1. Pousse le projet sur GitHub.
2. Sur https://vercel.com → New Project → importe le repo.
3. Framework Preset : **Other** (Vercel détecte automatiquement la sortie `.vercel/output`).
4. Build Command : `npm run build` (par défaut)
5. Output : laisser vide (TanStack Start écrit dans `.vercel/output`).
6. **Environment Variables** : ajoute `TMDB_API_KEY` = ta clé v3 TMDB.
7. Deploy.

Aucun `vercel.json` n'est nécessaire — TanStack Start (target `vercel`) génère
le Build Output v3 directement.

## Variables d'env
- `TMDB_API_KEY` — clé v3 depuis https://www.themoviedb.org/settings/api
