# 🔬 Fiche Technique du Projet : Smart Scientific Dictionary

## 📖 Présentation Générale
**Nom du projet :** Smart Scientific Dictionary | قاموسي العلمي الذكي  
**Type :** Application Web (PWA Ready) / Projet de Classe  
**Objectif :** Offrir une plateforme centralisée et multilingue pour l'apprentissage et la consultation de termes scientifiques complexes, assistée par l'intelligence artificielle.

---

## 🌍 Langues Supportées
Le projet est conçu pour être inclusif et accessible, supportant quatre langues avec une gestion native du RTL (Right-to-Left) :
1. **Anglais** (English)
2. **Français** (French)
3. **Arabe** (العربية)
4. **Amazigh** (ⵜⵉⴼⵉⵏⴰⵖ)

---

## 🛠 Stack Technique

### Frontend (Interface Utilisateur)
- **Langages :** HTML5, CSS3, JavaScript (ES6+ Modules).
- **Design :** Design System personnalisé basé sur le **Glassmorphism** (transparence, flou d'arrière-plan, ombres douces).
- **Typographie :** 
  - *Outfit* (Anglais/Français)
  - *Cairo* (Arabe)
  - *Noto Sans Tifinagh* (Amazigh)
- **Icônes :** Lucide Icons (bibliothèque moderne et légère).
- **Moteur Mathématique :** MathJS pour le support des formules et calculs complexes.

### Backend & Infrastructure
- **Base de données :** Google Firebase Firestore (NoSQL en temps réel).
- **Authentification :** Firebase Auth (Email/Mot de passe).
- **Hébergement Logic :** Architecture SPA (Single Page Application) avec routeur personnalisé.

### Intelligence Artificielle
- **AI Tutor :** Intégration d'un agent conversationnel via une API backend dédiée pour l'explication des concepts scientifiques.

---

## 🚀 Fonctionnalités Clés

1. **Dictionnaire Multilingue :**
   - Recherche instantanée de termes.
   - Filtrage par catégories (Physique, Chimie, Biologie, Maths, Astronomie, etc.).
   - Traductions et définitions synchronisées.

2. **AI Science Tutor :**
   - Chatbot capable d'expliquer les termes et de répondre à des questions scientifiques complexes.

3. **Espace Utilisateur :**
   - **Étudiant :** Consultation, favoris, jeux de quiz.
   - **Enseignant :** Possibilité de proposer de nouveaux termes pour enrichir le dictionnaire.

4. **Outils Scientifiques :**
   - Calculatrice d'expressions mathématiques.
   - Convertisseur d'unités scientifiques.

5. **Interface d'Administration :**
   - Validation des nouveaux termes proposés.
   - Gestion des inscriptions des enseignants.

6. **Gamification :**
   - Quiz interactifs pour tester les connaissances scientifiques.

---

## 🏗 Architecture du Code
- `index.html` : Point d'entrée unique de l'application.
- `js/app.js` : Initialisation et orchestration.
- `js/router.js` : Gestion de la navigation sans rechargement de page.
- `js/store.js` : État global de l'application (données utilisateur, dictionnaire, préférences).
- `js/views/` : Composants modulaires pour chaque écran (Dashboard, Auth, Settings, etc.).
- `css/styles.css` : Design system global et variables CSS.

---

## 🎓 Équipe & Contexte
- **Contexte :** Projet académique.
- **État actuel :** Prototype fonctionnel avec backend Firebase actif.
