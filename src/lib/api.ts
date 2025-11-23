// Ce fichier contient toutes les fonctions pour communiquer avec le backend

// URL de base de notre API backend
const API_BASE_URL = "http://127.0.0.1:8000";

// ============================================
// TYPES (définitions des structures de données)
// ============================================

// Type pour la requête de login
export interface LoginRequest {
  username: string;  // Le nom d'utilisateur
  password: string;  // Le mot de passe
}

// Type pour la réponse du login
export interface LoginResponse {
  access_token: string;  // Le token JWT reçu
  token_type: string;    // Type de token 
  username: string;      // Le nom de l'utilisateur connecté
}

// Type pour la requête de prédiction
export interface PredictRequest {
  text: string;  // Le texte à analyser
}

// Type pour la réponse de prédiction
export interface PredictResponse {
  text: string;       // Le texte analysé
  score: number;      // Le score (1-5)
  sentiment: string;  // Le sentiment (positif, négatif, neutre)
  user: string;       // L'utilisateur qui a fait la requête
}

// ============================================
// FONCTION 1 : LOGIN
// ============================================

/**
 * Fonction pour se connecter au backend
 * @param username - Le nom d'utilisateur
 * @param password - Le mot de passe
 * @returns La réponse avec le token JWT
 */
export async function login(
  username: string, 
  password: string
): Promise<LoginResponse> {
  
  // On fait une requête POST vers /login
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",                           // Type de requête
    headers: {
      "Content-Type": "application/json",     // On envoie du JSON
    },
    body: JSON.stringify({ username, password }),  // Convertir en JSON
  });

  // Si la requête échoue (erreur 401, 500, etc.)
  if (!response.ok) {
    // Lire le message d'erreur du backend
    const error = await response.json();
    // Lancer une exception avec le message
    throw new Error(error.detail || "Erreur de connexion");
  }

  // Si tout va bien, retourner les données JSON
  return response.json();
}

// ============================================
// FONCTION 2 : ANALYZE SENTIMENT
// ============================================

/**
 * Fonction pour analyser le sentiment d'un texte
 * @param text - Le texte à analyser
 * @param token - Le token JWT pour l'authentification
 * @returns La réponse avec le sentiment
 */
export async function analyzeSentiment(
  text: string, 
  token: string
): Promise<PredictResponse> {
  
  try {
    // On fait une requête POST vers /predict
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // IMPORTANT : Ajouter le token dans le header Authorization
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),  // Envoyer le texte
    });

    // Lire la réponse JSON
    const data = await response.json();

    // Si la requête échoue
    if (!response.ok) {
      // Extraire le message d'erreur du backend
      const errorMessage = data.detail || data.message || `Erreur HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    // Retourner le résultat
    return data;
    
  } catch (error) {
    // Si c'est une erreur réseau
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Impossible de contacter le serveur. Vérifiez que le backend est lancé.");
    }
    // Sinon, relancer l'erreur telle quelle
    throw error;
  }
}

// ============================================
// FONCTION 3 : GESTION DU TOKEN (localStorage)
// ============================================

/**
 * Sauvegarder le token dans le navigateur
 * @param token - Le token JWT à sauvegarder
 */
export function saveToken(token: string): void {
  // localStorage = mémoire du navigateur qui persiste
  localStorage.setItem("token", token);
}

/**
 * Récupérer le token sauvegardé
 * @returns Le token ou null s'il n'existe pas
 */
export function getToken(): string | null {
  // Vérifier si on est dans le navigateur (pas sur le serveur)
  if (typeof window === "undefined") {
    return null;
  }
  // Récupérer le token depuis localStorage
  return localStorage.getItem("token");
}

/**
 * Supprimer le token (déconnexion)
 */
export function removeToken(): void {
  localStorage.removeItem("token");
}

/**
 * Vérifier si l'utilisateur est connecté
 * @returns true si un token existe, false sinon
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}