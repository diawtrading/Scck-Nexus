# SCCK ERP NEXUS - Guide de Déploiement en Production (Français)

## Aperçu
SCCK ERP NEXUS est un système complet de Planification des Ressources Entreprise (ERP) conçu pour les coopératives de cacao. Ce guide couvre le déploiement, la configuration et l'exploitation en environnement de production.

## Structure du Projet
```
.
├── src/                    # Fichiers Frontend
│   ├── index.html         # Application principale (Traduite en Français)
│   └── translations-fr.js # Traductions Françaises Complètes
├── api/                   # Points de terminaison API Backend
├── db/                    # Gestion de base de données
├── server.js             # Serveur Express
├── package.json          # Dépendances
└── README_FR.md          # Ce guide
```

## 🇫🇷 Traduction Complète

L'interface SCCK ERP NEXUS est entièrement disponible en français:

### Modules Traduits
- ✅ Tableau de Bord
- ✅ Gestion des Producteurs
- ✅ Collections et Suivi
- ✅ Comptabilité Financière
- ✅ Gestion d'Inventaire
- ✅ Ressources Humaines
- ✅ Relations Clients
- ✅ Gestion des Fournisseurs
- ✅ Gestion de Projets
- ✅ Rapports et Analyses

### Fichiers de Traduction
- `src/translations-fr.js` - Dictionnaire complet des traductions
- `src/index.html` - Interface with French labels

## Déploiement Vercel

Pour deployer sur Vercel avec traductions françaises:

1. Suivre les étapes dans `DEPLOY_GUIDE.md`
2. Ajouter les variables d'environnement
3. L'interface chargera automatiquement en français

## Configuration Locale

Pour tester les traductions en local:

```bash
npm install
npm run dev
```

Accès: `http://localhost:3000`
Interface: Français (traduite)

## Modules ERP Détaillés

### 📊 Tableau de Bord
Indicateurs clés:
- Producteurs Actifs
- Revenu du Mois
- Tonnes Collectées
- Qualité Moyenne

### 👥 Gestion des Producteurs
- Enregistrement
- Suivi de production
- Gestion des zones
- Historique de contact

### 💰 Finances
- Comptes et transactions
- Revenus et dépenses
- Déclarations
- Flux de trésorerie

### 📦 Inventaire
- Suivi des stocks
- Alertes
- Mouvements
- Évaluation

### 👨‍💼 Ressources Humaines
- Dossiers employés
- Gestion congés
- Paies
- Évaluations

### 🤝 Clients et Fournisseurs
- Gestion commerciale
- Historique commandes
- Suivi ventes
- Acomptes

### 📋 Projets
- Planification
- Suivi progression
- Gestion budgétaire
- Ressources

### 📈 Rapports
- Rapports de ventes
- Rapports de production
- Rapports financiers
- Rapports inventaire
- Exports PDF/Excel

## Variables d'Environnement

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<clé-sécurisée>
SESSION_SECRET=<clé-sécurisée>
ALLOWED_ORIGINS=https://votre-domaine.com
DB_PATH=./data/scck_erp.db
```

## Sécurité

- ✅ JWT authentication (24h)
- ✅ Chiffrage des mots de passe
- ✅ Rate limiting
- ✅ CORS configuré
- ✅ HTTPS en production

## Support et Documentation

- [README Principal](README.md)
- [Guide de Déploiement](DEPLOY_GUIDE.md)
- [Configuration Vercel](VERCEL_DEPLOYMENT.md)

## Changelog - Français

### Version 1.0.0 (Février 2026)
- ✅ Interface complètement traduite en français
- ✅ Fichier de traductions centralisé
- ✅ Support multi-module
- ✅ Déploiement Vercel configuré
- ✅ Documentation en français

## License
MIT License - 2026 SCCK Cooperative
