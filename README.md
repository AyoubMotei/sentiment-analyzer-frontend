#  Sentiment Analysis - Frontend

Interface web moderne développée avec Next.js et TypeScript pour l'analyse de sentiment en temps réel.

##  Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure des pages](#structure-des-pages)
- [Composants](#composants)
- [API Integration](#api-integration)
- [Déploiement](#déploiement)
- [Auteur](#auteur)

---

##  Vue d'ensemble

Application web interactive permettant d'analyser le sentiment de textes avec une interface utilisateur moderne et intuitive.

### Captures d'écran

#### Page d'accueil
![page d'accueil](/images/Home.png)


#### Page d'analyse
![page d'accueil](/images/Sentiment.png)

---

##  Technologies utilisées

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 14+ | Framework React |
| React | 18+ | Bibliothèque UI |
| TypeScript | 5+ | Typage statique |
| Tailwind CSS | 3+ | Styling |
| React Hooks | - | Gestion d'état |

---

##  Fonctionnalités

### Authentification
- Formulaire de login sécurisé
-  Stockage du token JWT dans localStorage
-  Redirection automatique si non authentifié
-  Déconnexion avec suppression du token

### Analyse de sentiment
-  Saisie de texte multilingue
-  Analyse en temps réel
-  Affichage du score (1-5)
-  Visualisation du sentiment (positif/négatif/neutre)
-  Barre de progression visuelle
-  Emojis contextuels
-  Gestion des états (loading, error, success)

### UX/UI
- Design moderne et responsive
-  Animations et transitions
-  Messages d'erreur clairs
-  Interface intuitive
-  Thème dégradé coloré

---

##  Architecture

```
sentiment-analyzer-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Page d'accueil (/)
│   │   ├── layout.tsx            # Layout principal
│   │   ├── globals.css           # Styles globaux
│   │   ├── login/
│   │   │   └── page.tsx          # Page de login
│   │   └── sentiment/
│   │       └── page.tsx          # Page d'analyse
│   └── lib/
│       └── api.ts                # Fonctions API et types
├── public/                       # Assets statiques
├── .env.local                    # Variables d'environnement (non versionné)
├── .gitignore                    # Fichiers à ignorer
├── next.config.js                # Configuration Next.js
├── tailwind.config.ts            # Configuration Tailwind
├── tsconfig.json                 # Configuration TypeScript
├── package.json                  # Dépendances npm
└── README.md                     # Documentation
```

### Flux utilisateur

```
1. Utilisateur → Page d'accueil (/)
   ↓
2. Clic sur "Commencer" ou "Se connecter"
   ↓
3. Page de login (/login)
   ↓
4. Saisie credentials → Appel API /login
   ↓
5. Réception token JWT → Stockage localStorage
   ↓
6. Redirection → Page d'analyse (/sentiment)
   ↓
7. Vérification token → useEffect au chargement
   ↓
8. Saisie texte → Clic "Analyser"
   ↓
9. Appel API /predict avec token
   ↓
10. Affichage résultat avec animation
```

---

##  Installation

### Prérequis

- Node.js 18+ et npm
- Backend lancé sur http://127.0.0.1:8000
- Git

### Étape 1 : Cloner le repository

```bash
git clone https://github.com/votre-username/sentiment-analyzer-frontend.git
cd sentiment-analyzer-frontend
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Configuration

Créez un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL du backend | `http://127.0.0.1:8000` |

 **Note** : Les variables préfixées par `NEXT_PUBLIC_` sont accessibles côté client.

### Modifier l'URL du backend

En production, changez dans `.env.local` :

```bash
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
```

---

##  Utilisation

### Mode développement

```bash
npm run dev
```

L'application sera disponible sur : **http://localhost:3000**



---

##  Structure des pages

### 1. Page d'accueil `/`

**Fichier** : `src/app/page.tsx`

**Fonctionnalités** :
- Présentation de l'application
- Bouton "Commencer l'analyse"
- Bouton "Se connecter"
- Vérification si déjà authentifié

**Hooks utilisés** :
```typescript
const [mounted, setMounted] = useState(false);  // Éviter erreurs SSR
const router = useRouter();                      // Navigation
```

---

### 2. Page de login `/login`

**Fichier** : `src/app/login/page.tsx`

**Fonctionnalités** :
- Formulaire username + password
- Validation des champs
- Appel API login
- Stockage du token
- Redirection vers /sentiment

**États gérés** :
```typescript
const [username, setUsername] = useState("");    // Username saisi
const [password, setPassword] = useState("");    // Password saisi
const [error, setError] = useState("");          // Message d'erreur
const [loading, setLoading] = useState(false);   // État de chargement
```

**Flux de soumission** :
```typescript
handleSubmit → login() → saveToken() → router.push("/sentiment")
```

---

### 3. Page d'analyse `/sentiment`

**Fichier** : `src/app/sentiment/page.tsx`

**Fonctionnalités** :
- Vérification authentification (useEffect)
- Textarea pour saisir le texte
- Bouton "Analyser le sentiment"
- Affichage du résultat avec :
  - Sentiment coloré
  - Score avec barre de progression
  - Emoji contextuel
  - Texte analysé
- Bouton "Nouvelle analyse"
- Bouton "Déconnexion"

**États gérés** :
```typescript
const [text, setText] = useState("");           // Texte à analyser
const [result, setResult] = useState(null);     // Résultat de l'analyse
const [loading, setLoading] = useState(false);  // Chargement
const [error, setError] = useState("");         // Erreur
const [token, setToken] = useState(null);       // Token JWT
```

**Fonctions utilitaires** :
```typescript
getSentimentColor(sentiment)  // Retourne les classes CSS selon sentiment
getEmoji(score)               // Retourne l'emoji selon le score
```

---

##  Composants

### Fichier `src/lib/api.ts`

**Types TypeScript** :

```typescript
// Requête de login
interface LoginRequest {
  username: string;
  password: string;
}

// Réponse de login
interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
}

// Requête de prédiction
interface PredictRequest {
  text: string;
}

// Réponse de prédiction
interface PredictResponse {
  text: string;
  score: number;
  sentiment: string;
  user: string;
}
```

**Fonctions principales** :

```typescript
// 1. Authentification
login(username, password) → Promise<LoginResponse>

// 2. Analyse de sentiment
analyzeSentiment(text, token) → Promise<PredictResponse>

// 3. Gestion du token
saveToken(token)     // Sauvegarder dans localStorage
getToken()           // Récupérer depuis localStorage
removeToken()        // Supprimer (déconnexion)
isAuthenticated()    // Vérifier si connecté
```

---

##  API Integration

### Exemple d'appel : Login

```typescript
import { login, saveToken } from "@/lib/api";

const handleLogin = async () => {
  try {
    // Appel API
    const response = await login("admin", "admin123");
    
    // Sauvegarder le token
    saveToken(response.access_token);
    
    // Rediriger
    router.push("/sentiment");
    
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};
```

### Exemple d'appel : Analyse

```typescript
import { analyzeSentiment, getToken } from "@/lib/api";

const handleAnalyze = async () => {
  const token = getToken();
  
  try {
    // Appel API avec token
    const result = await analyzeSentiment(text, token);
    
    // Afficher le résultat
    setResult(result);
    
  } catch (error) {
    console.error("Erreur:", error.message);
  }
};
```

---

##  Styling avec Tailwind CSS

### Classes principales utilisées

```css
/* Gradients */
bg-gradient-to-br from-blue-50 to-indigo-100
bg-gradient-to-r from-purple-600 to-pink-600

/* Responsive */
min-h-screen        /* Hauteur minimum = hauteur écran */
max-w-4xl mx-auto   /* Largeur max + centrage horizontal */

/* Flexbox */
flex items-center justify-center  /* Centrage complet */
flex justify-between              /* Espacement entre éléments */

/* Spacing */
p-8    /* Padding 2rem (32px) */
mb-6   /* Margin bottom 1.5rem (24px) */
space-y-4  /* Espacement vertical entre enfants */

/* Borders & Shadows */
rounded-lg          /* Coins arrondis */
shadow-xl           /* Ombre large */
border-2            /* Bordure 2px */

/* Colors */
text-gray-800       /* Texte gris foncé */
bg-white           /* Fond blanc */
hover:bg-blue-700  /* Fond au survol */

/* Transitions */
transition-colors   /* Animation douce des couleurs */
transition-all      /* Animation de toutes les propriétés */
```

### Système de couleurs par sentiment

```typescript
// Positif
"text-green-600 bg-green-50 border-green-200"

// Négatif  
"text-red-600 bg-red-50 border-red-200"

// Neutre
"text-yellow-600 bg-yellow-50 border-yellow-200"
```

## Sécurité

 Token stocké dans localStorage (pas de cookies)  
 Vérification du token à chaque navigation  
 Redirection automatique si non authentifié  
 Suppression du token à la déconnexion  


##  Auteur

**AYOUB MOTEI**

-  Email : ayoub.motei@gmail.com
-  GitHub : [@AyoubMotei](https://github.com/AyoubMotei)

---



