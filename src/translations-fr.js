//French Language Translation for SCCK ERP NEXUS
const translations = {
    fr: {
        // Login
        login: {
            title: "SCCK ERP NEXUS",
            subtitle: "Système de Planification des Ressources Entreprise",
            email: "Adresse Email",
            password: "Mot de passe",
            login: "Connexion",
            demoAccounts: "Comptes de Démonstration",
            loading: "Chargement en cours...",
            invalidCredentials: "Identifiants invalides",
            loginSuccess: "Connexion réussie"
        },

        // Navigation
        nav: {
            dashboard: "Tableau de Bord",
            producers: "Producteurs",
            collections: "Collections",
            finance: "Finances",
            inventory: "Inventaire",
            employees: "Employés",
            customers: "Clients",
            suppliers: "Fournisseurs",
            projects: "Projets",
            reports: "Rapports",
            settings: "Paramètres",
            logout: "Déconnexion",
            operationsManagement: "Gestion des Opérations",
            reportsAnalytics: "Rapports et Analyses"
        },

        // Dashboard
        dashboard: {
            title: "Tableau de Bord",
            activeProducers: "Producteurs Actifs",
            totalCollections: "Collections Totales",
            monthlyRevenue: "Revenu du Mois",
            pendingOrders: "Commandes en Attente",
            keyMetrics: "Indicateurs Clés",
            recentActivity: "Activité Récente",
            productionStatus: "État de la Production",
            systemStatus: "État du Système",
            online: "En ligne",
            offline: "Hors ligne"
        },

        // Producers
        producers: {
            title: "Gestion des Producteurs",
            addProducer: "+ Ajouter un Producteur",
            name: "Nom",
            zone: "Zone",
            phone: "Téléphone",
            email: "Email",
            address: "Adresse",
            status: "Statut",
            joinDate: "Date d'adhésion",
            totalProduction: "Production Totale",
            actions: "Actions",
            edit: "Modifier",
            delete: "Supprimer",
            view: "Voir",
            active: "Actif",
            inactive: "Inactif"
        },

        // Collections
        collections: {
            title: "Gestion des Collections",
            addCollection: "+ Ajouter une Collection",
            date: "Date",
            producer: "Producteur",
            quantity: "Quantité",
            qualityGrade: "Qualité",
            location: "Localisation",
            status: "Statut",
            amount: "Montant",
            received: "Reçu",
            pending: "En attente",
            rejected: "Rejeté"
        },

        // Finance
        finance: {
            title: "Gestion Financière",
            addTransaction: "+ Nouvelle Transaction",
            account: "Compte",
            type: "Type",
            amount: "Montant",
            date: "Date",
            description: "Description",
            balance: "Solde",
            income: "Revenu",
            expense: "Dépense",
            profit: "Bénéfice",
            loss: "Perte",
            cashFlow: "Flux de Trésorerie",
            accountStatement: "État des Comptes"
        },

        // Inventory
        inventory: {
            title: "Gestion de l'Inventaire",
            addItem: "+ Ajouter un Article",
            itemName: "Nom de l'Article",
            itemCode: "Code Article",
            quantity: "Quantité",
            unitPrice: "Prix Unitaire",
            totalValue: "Valeur Totale",
            warehouse: "Entrepôt",
            lastUpdated: "Dernière Mise à Jour",
            lowStock: "Stock Faible",
            inStock: "En Stock",
            outOfStock: "Rupture de Stock"
        },

        // Employees
        employees: {
            title: "Gestion des Ressources Humaines",
            addEmployee: "+ Ajouter un Employé",
            firstName: "Prénom",
            lastName: "Nom",
            email: "Email",
            phone: "Téléphone",
            position: "Poste",
            department: "Département",
            hireDate: "Date d'Embauche",
            salary: "Salaire",
            status: "Statut",
            active: "Actif",
            inactive: "Inactif",
            onLeave: "En Congé"
        },

        // Customers
        customers: {
            title: "Gestion des Clients",
            addCustomer: "+ Ajouter un Client",
            companyName: "Nom de l'Entreprise",
            contactPerson: "Personne de Contact",
            email: "Email",
            phone: "Téléphone",
            address: "Adresse",
            city: "Ville",
            totalSales: "Ventes Totales",
            lastOrder: "Dernière Commande",
            status: "Statut"
        },

        // Suppliers
        suppliers: {
            title: "Gestion des Fournisseurs",
            addSupplier: "+ Ajouter un Fournisseur",
            companyName: "Nom de l'Entreprise",
            contactPerson: "Personne de Contact",
            email: "Email",
            phone: "Téléphone",
            address: "Adresse",
            category: "Catégorie",
            rating: "Évaluation",
            status: "Statut"
        },

        // Projects
        projects: {
            title: "Gestion des Projets",
            addProject: "+ Nouveau Projet",
            projectName: "Nom du Projet",
            description: "Description",
            startDate: "Date de Début",
            endDate: "Date de Fin",
            manager: "Chef de Projet",
            budget: "Budget",
            spent: "Dépensé",
            progress: "Progression",
            status: "Statut",
            active: "Actif",
            completed: "Terminé",
            onHold: "En Attente"
        },

        // Reports
        reports: {
            title: "Rapports et Analyses",
            generateReport: "Générer un Rapport",
            reportType: "Type de Rapport",
            period: "Période",
            exportPDF: "Exporter en PDF",
            exportExcel: "Exporter en Excel",
            salesReport: "Rapport de Ventes",
            productionReport: "Rapport de Production",
            financialReport: "Rapport Financier",
            inventoryReport: "Rapport d'Inventaire"
        },

        // Common buttons and actions
        common: {
            save: "Enregistrer",
            cancel: "Annuler",
            delete: "Supprimer",
            edit: "Modifier",
            add: "Ajouter",
            close: "Fermer",
            search: "Rechercher",
            filter: "Filtrer",
            sort: "Trier",
            export: "Exporter",
            import: "Importer",
            refresh: "Actualiser",
            loading: "Chargement...",
            success: "Succès",
            error: "Erreur",
            warning: "Avertissement",
            info: "Information",
            submit: "Soumettre",
            back: "Retour",
            next: "Suivant",
            previous: "Précédent",
            yes: "Oui",
            no: "Non",
            confirm: "Confirmer",
            confirmDelete: "Êtes-vous sûr de vouloir supprimer cet élément?",
            deleteSuccess: "Élément supprimé avec succès",
            saveSuccess: "Enregistrement réussi",
            updateSuccess: "Mise à jour réussie",
            noData: "Aucune donnée disponible",
            selectAll: "Sélectionner Tout",
            deselectAll: "Désélectionner Tout"
        },

        // Settings
        settings: {
            title: "Paramètres",
            profile: "Profil",
            company: "Entreprise",
            security: "Sécurité",
            notifications: "Notifications",
            preferences: "Préférences",
            changePassword: "Changer le Mot de Passe",
            language: "Langue",
            theme: "Thème",
            timezone: "Fuseau Horaire",
            defaultCurrency: "Devise par Défaut"
        },

        // Error messages
        errors: {
            connectionError: "Erreur de Connexion",
            serverError: "Erreur du Serveur",
            validationError: "Erreur de Validation",
            notFound: "Non Trouvé",
            unauthorized: "Non Autorisé",
            forbidden: "Accès Refusé",
            conflict: "Conflit",
            tooManyRequests: "Trop de Requêtes",
            requiredField: "Ce champ est obligatoire",
            invalidEmail: "Email invalide",
            weakPassword: "Mot de passe faible",
            passwordMismatch: "Les mots de passe ne correspondent pas"
        },

        // Headers
        headers: {
            search: "Rechercher...",
            notifications: "Notifications",
            messages: "Messages",
            settings: "Paramètres",
            profile: "Profil",
            help: "Aide"
        }
    }
};

// Function to get translation
function t(key, defaultValue = key) {
    const keys = key.split('.');
    let value = translations.fr;
    
    for (let k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            return defaultValue;
        }
    }
    
    return value || defaultValue;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, t };
}
