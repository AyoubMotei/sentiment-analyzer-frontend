"use client"; // Indique que c'est un composant client (avec interactivité)

// Import des hooks React nécessaires
import { useState } from "react";
import { useRouter } from "next/navigation";
// Import de nos fonctions API personnalisées
import { login, saveToken } from "@/lib/api";

// ============================================
// COMPOSANT PRINCIPAL : Page de Login
// ============================================

export default function LoginPage() {
  // ==========================================
  // ÉTATS (State) - Les données qui peuvent changer
  // ==========================================
  
  // État pour stocker le username saisi
  const [username, setUsername] = useState("");
  
  // État pour stocker le password saisi
  const [password, setPassword] = useState("");
  
  // État pour afficher les erreurs
  const [error, setError] = useState("");
  
  // État pour savoir si on est en train de charger (pendant la requête)
  const [loading, setLoading] = useState(false);

  // Hook pour naviguer entre les pages
  const router = useRouter();

  // ==========================================
  // FONCTION : Gérer la soumission du formulaire
  // ==========================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    // Empêcher le rechargement de la page (comportement par défaut)
    e.preventDefault();
    
    // Réinitialiser l'erreur
    setError("");
    
    // Indiquer qu'on commence à charger
    setLoading(true);

    try {
      // ÉTAPE 1 : Appeler l'API de login
      const response = await login(username, password);
      
      // ÉTAPE 2 : Sauvegarder le token dans localStorage
      saveToken(response.access_token);
      
      // ÉTAPE 3 : Rediriger vers la page /sentiment
      router.push("/sentiment");
      
    } catch (err) {
      // Si une erreur se produit
      // Cast en Error pour accéder à la propriété message
      setError((err as Error).message);
      
    } finally {
      // Dans tous les cas, arrêter le chargement
      setLoading(false);
    }
  };

  // ==========================================
  // RENDU (JSX) - Ce qui s'affiche à l'écran
  // ==========================================
  
  return (
    // Conteneur principal avec centrage vertical et horizontal
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Carte blanche avec ombre */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        
        {/* Titre */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Analyse de Sentiment
        </h1>
        
        {/* Sous-titre */}
        <p className="text-center text-gray-600 mb-8">
          Connectez-vous pour commencer
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Username */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              // Quand l'utilisateur tape, on met à jour le state
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="admin"
              required // Champ obligatoire
            />
          </div>

          {/* Champ Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password" // Masque le texte
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Affichage des erreurs (si elles existent) */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading} // Désactiver pendant le chargement
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {/* Afficher "Connexion..." pendant le chargement, sinon "Se connecter" */}
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Informations de test */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Compte de test :</strong>
            <br />
            Username: admin | Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}