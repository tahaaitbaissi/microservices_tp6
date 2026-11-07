Frontend React (Vite) pour l'API étudiants Spring Boot.

Installation et démarrage :

```console
cd frontend
npm install
npm run dev
```

Ouvrir http://localhost:5173. Le proxy Vite renvoie /api vers http://localhost:8080, donc le backend doit tourner sur le port 8080.

Écrans : formulaire d'inscription (POST /students/save), liste avec recherche et suppression (GET /students/all, DELETE /students/delete/{id}), compteur (GET /students/count) et répartition par année de naissance (GET /students/byYear).

Build de production :

```console
npm run build
npm run preview
```

Le build sort dans dist/. En production, servir dist/ derrière un reverse proxy qui route /api vers le backend.
