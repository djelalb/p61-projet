# Habits Tracker

## Description
Habits Tracker est une application conçue pour vous aider à suivre vos habitudes quotidiennes de manière simple et efficace. Profitez d'une interface intuitive qui allie fonctionnalités avancées et facilité d'utilisation.

Veuillez noter que l'application n'a pas été testée sur la plateforme iOS en raison du manque de matériel Apple.

## Contributeurs
- Edouard RINALDI
- Djelal BOUDJI
- Tanaël CLAUDE

## Fonctionnalités
- **Authentification**
  - **Connexion**
  - **Création de compte**
- **Profil Utilisateur**
  - **Accès Rapide**
  - **Modification des informations personnelles**
  - **Déconnexion**
  
- **Page d'Accueil**
  - **Calendrier et liste des habitudes:** Consultez vos habitudes quotidiennes et suivez votre progression.
  - **Historique et habitudes futures:** Explorez votre historique passé et visualisez vos futures habitudes.
  - **Barre de progression:** Suivez votre avancement quotidien avec une barre de progression.
  - **Gestion des habitudes:** Ajoutez une habitude, cochez la comme terminée, modifiez-la ou supprimez-la en un clic.
- **Page de Gestion des Habitudes**
  - **Listing des Habitudes**
  - **Barre de Recherche**
  - **Gestion des habitudes**
- **Page de Gestion des Catégories**
  - **Créez et gérez des catégories pour organiser vos habitudes plus efficacement.**
- **Page de Statistiques**
  - **Analysez votre progression et votre performance dans le suivi de vos habitudes.**
- **Paramètres**
  - **Changement de thème:** Personnalisez l'apparence de l'application en choisissant entre un thème sombre ou clair.
  - **Export/Import de données:** Exportez vos données vers un fichier au format JSON et importez des données depuis un fichier JSON.
  - **Exemple de fichiers d'import:** 
    - categories.json :
      ```json
      {
        "categories": [
          {
            "name": "Sport",
            "color": "#009999"
          },
          {
            "name": "Alimentation",
            "color": "#ff66b2"
          },
          {
            "name": "Loisirs",
            "color": "#ffcc00"
          },
          {
            "name": "Travail",
            "color": "#ff6666"
          },
          {
            "name": "Santé",
            "color": "#66ccff"
          }
        ]
      }
      ```
      - tasks.json :
      ```json
      {
        "tasks": [
          {
            "name": "Pompes",
            "description": "Faire des pompes",
            "category": "Sport",
            "target": 50,
            "unit": "fois",
            "completed": {}
          },
          {
            "name": "Course",
            "description": "Faire du sport",
            "category": "Sport",
            "target": 30,
            "unit": "minutes",
            "completed": {}
          },
          {
            "name": "Manger des fruits",
            "description": "Manger des fruits",
            "category": "Alimentation",
            "target": 3,
            "unit": "fois",
            "completed": {}
          },
          {
            "name": "Manger des légumes",
            "description": "Manger des légumes",
            "category": "Alimentation",
            "target": 2,
            "unit": "fois",
            "completed": {}
          },
          {
            "name": "Lire",
            "description": "Lire un livre",
            "category": "Loisirs",
            "target": 1,
            "unit": "heure",
            "completed": {}
          },
          {
            "name": "Travailler",
            "description": "Travailler",
            "category": "Travail",
            "target": 8,
            "unit": "heures",
            "completed": {}
          },
          {
            "name": "Dormir",
            "description": "Dormir",
            "category": "Santé",
            "target": 8,
            "unit": "heures",
            "completed": {}
          }
        ]
      }
      ```

## Maintenance
### Prérequis
- Node.js >= 20.0.0
- npm >= 10.0.0
- Expo Go ~2.31.0

### Installation
1. Clonez le répertoire Git.
2. Exécutez la commande `npm i` pour installer les dépendances.
3. Lancez l'application avec `npm run start`.
4. Scannez le QR code affiché dans votre console avec l'application Expo Go pour accéder à l'application.
