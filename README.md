# 🛡️ PhishGuard – Réflexes numériques

> **Faites confiance à vos réflexes. Vérifiez les détails.**

PhishGuard est une application web éducative conçue pour sensibiliser les utilisateurs aux risques liés à l'**hameçonnage (phishing)** et leur apprendre à identifier les messages, liens et situations potentiellement suspects.

L'application propose des scénarios fictifs, des quiz et des conseils pratiques afin de développer de bons réflexes de sécurité numérique.

---

## 📌 Table des matières

- [Présentation](#-présentation)
- [Objectifs](#-objectifs)
- [Fonctionnalités](#-fonctionnalités)
- [Fonctionnement](#-fonctionnement)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture générale](#-architecture-générale)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Exécution du projet](#-exécution-du-projet)
- [Déploiement](#-déploiement)
- [Structure du projet](#-structure-du-projet)
- [Sécurité et confidentialité](#-sécurité-et-confidentialité)
- [Public cible](#-public-cible)
- [Limites du projet](#-limites-du-projet)
- [Équipe](#-équipe)
- [Améliorations futures](#-améliorations-futures)
- [Licence](#-licence)

---

## 📖 Présentation

Le phishing, ou hameçonnage, est une technique d'ingénierie sociale utilisée pour tromper une personne afin de l'amener à communiquer des informations sensibles ou à effectuer une action non souhaitée.

PhishGuard a été développé dans le but de proposer un environnement d'apprentissage **simple, interactif et sans danger**.

L'utilisateur est placé face à différents scénarios fictifs et doit déterminer s'il s'agit d'une situation légitime ou d'une tentative d'hameçonnage.

L'objectif principal est de transformer les connaissances théoriques en **réflexes pratiques**.

---

## 🎯 Objectifs

### Objectif général

Développer une application web éducative permettant de sensibiliser les utilisateurs aux techniques d'hameçonnage et de renforcer leurs réflexes de sécurité numérique.

### Objectifs spécifiques

- Apprendre à reconnaître les signes caractéristiques d'un message frauduleux.
- Sensibiliser aux risques liés aux liens suspects.
- Apprendre à vérifier le contexte d'un message.
- Identifier les techniques d'urgence et de manipulation utilisées par les attaquants.
- Sensibiliser aux techniques d'ingénierie sociale.
- Permettre à l'utilisateur de s'entraîner à travers des scénarios fictifs.
- Évaluer les connaissances à travers des quiz.
- Suivre les résultats et la progression de l'utilisateur.
- Fournir des conseils simples et pratiques en matière de sécurité numérique.

---

## 🚀 Fonctionnalités

### 🔐 Authentification

L'application peut proposer un système d'authentification permettant à l'utilisateur d'accéder à son espace personnel.

Selon la configuration de l'application, l'authentification peut utiliser les services Firebase prévus à cet effet.

### 🧪 Laboratoire

Le laboratoire permet à l'utilisateur de découvrir différents scénarios de sensibilisation.

L'utilisateur doit analyser les éléments présentés et déterminer s'ils correspondent à :

- une situation légitime ;
- ou une tentative d'hameçonnage.

### 📝 Quiz rapide

Le module de quiz permet d'évaluer les connaissances de l'utilisateur à travers plusieurs questions portant notamment sur :

- les liens suspects ;
- l'urgence ;
- l'identité de l'expéditeur ;
- le contexte ;
- l'ingénierie sociale ;
- les bonnes pratiques de sécurité.

### 📚 Conseils

Une section fournit des recommandations permettant à l'utilisateur d'améliorer ses habitudes numériques.

Exemples :

- Vérifier l'adresse de l'expéditeur.
- Vérifier attentivement les liens avant de cliquer.
- Se méfier des messages créant un sentiment d'urgence.
- Ne jamais communiquer un mot de passe par message.
- Vérifier une demande importante auprès de la source officielle.

### 📊 Mes résultats

L'utilisateur peut consulter les résultats obtenus lors des exercices et des quiz afin de suivre sa progression.

### 📂 Bibliothèque de scénarios

Les scénarios peuvent être organisés selon différentes catégories, notamment :

- Urgence
- Liens
- Contexte
- Prétextes
- Ingénierie sociale

### ⚙️ Paramètres

L'application propose également une section permettant de gérer les paramètres disponibles pour l'utilisateur.

---

## 🔄 Fonctionnement général

Le fonctionnement de PhishGuard peut être résumé comme suit :

```text
        ┌─────────────────────┐
        │       Utilisateur   │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │    Authentification │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │      Tableau de bord│
        └──────────┬──────────┘
                   │
          ┌────────┼─────────┐
          │        │         │
          ▼        ▼         ▼
      Laboratoire Quiz     Conseils
          │        │
          └────┬───┘
               │
               ▼
        ┌─────────────────────┐
        │      Évaluation     │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │   Résultats /       │
        │   progression       │
        └─────────────────────┘
