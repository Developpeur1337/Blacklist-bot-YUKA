# Blacklist-bot-YUKA

![License](https://img.shields.io/badge/license-MIT-green)

## Description

**Discord Blacklist Bot** est un bot Discord conçu pour gérer facilement une blacklist d’utilisateurs sur un serveur.  
Il permet aux administrateurs et propriétaires du serveur de blacklister des membres, de gérer leur accès (ban/unban), et de conserver un suivi clair grâce à un système d’auteur et de logs.

Le bot utilise exclusivement des **commandes slash** (full slash commands) pour une meilleure intégration et ergonomie.

---

## Fonctionnalités principales

- Ajouter un utilisateur à la blacklist avec enregistrement de l'auteur de la sanction  
- Retirer un utilisateur de la blacklist (avec vérification que seul l’auteur peut le faire)  
- Bannir/débannir automatiquement l’utilisateur dans le serveur  
- Logs des actions dans un salon dédié  
- Commandes slash intuitives pour une gestion simple et rapide  
- Stockage des données dans un fichier JSON local

--

## Crédits & Contact
Développé par Developpeur1337
Pour toute question, suggestion ou aide supplémentaire, contacte moi sur Discord : @developpeur1337

---

## Installation

1. Clone ce dépôt :

```bash
git clone https://github.com/Developpeur1337/Blacklist-bot-YUKA.git
cd Blacklist-bot-YUKA
npm install && node index.js
