"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analyzeSentiment, getToken, removeToken } from "@/lib/api";

// ============================================
// COMPOSANT PRINCIPAL : Page d'Analyse de Sentiment
// ============================================

export default function SentimentPage() {
  // ==========================================
  // ÉTATS (State)
  // ==========================================
  
  // Le texte à analyser (saisi par l'utilisateur)
  const [text, setText] = useState("");
  
  // Le résultat de l'analyse (null au début)
  const [result, setResult] = useState<{
    score: number;
    sentiment: string;
    text: string;
  } | null>(null);
  
  // État de chargement
  const [loading, setLoading] = useState(false);
  
  // Messages d'erreur
  const [error, setError] = useState("");
  
  // Le token JWT (pour l'authentification)
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // ==========================================
  // EFFET : Vérifier l'authentification au chargement
  // ==========================================
  
  // useEffect se lance quand le composant apparaît à l'écran
  useEffect(() => {
    // Récupérer le token depuis localStorage
    const savedToken = getToken();
    
    // Si pas de token, rediriger vers login
    if (!savedToken) {
      router.push("/login");
    } else {
      // Sinon, sauvegarder le token dans le state
      setToken(savedToken);
    }
  }, []); // [] = se lance une seule fois au montage du composant

  // ==========================================
  // FONCTION : Analyser le texte
  // ==========================================
  
  const handleAnalyze = async () => {
    // Vérifier qu'il y a du texte
    if (!text.trim()) {
      setError("Veuillez entrer un texte à analyser");
      return;
    }

    // Vérifier qu'on a un token
    if (!token) {
      setError("Vous devez être connecté");
      return;
    }

    // Réinitialiser
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // ÉTAPE 1 : Appeler l'API d'analyse
      const response = await analyzeSentiment(text, token);
      
      // ÉTAPE 2 : Sauvegarder le résultat dans le state
      setResult(response);
      
    } catch (err) {
      // Gestion robuste des erreurs
      console.error("Erreur complète:", err); // Pour debugging
      
      let errorMessage = "Une erreur est survenue";
      
      // Si c'est une Error standard
      if (err instanceof Error) {
        errorMessage = err.message;
      } 
      // Si c'est un objet avec une propriété message
      else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }
      // Sinon, convertir en string
      else {
        errorMessage = String(err);
      }
      
      // Si erreur 401, le token est peut-être expiré
      if (errorMessage.includes("401")) {
        setError("Session expirée. Veuillez vous reconnecter.");
        removeToken();
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FONCTION : Se déconnecter
  // ==========================================
  
  const handleLogout = () => {
    // Supprimer le token
    removeToken();
    // Rediriger vers login
    router.push("/login");
  };

  // ==========================================
  // FONCTION : Obtenir la couleur selon le sentiment
  // ==========================================
  
  const getSentimentColor = (sentiment: string) => {
    // Switch = comme plusieurs if/else
    switch (sentiment) {
      case "positif":
        return "text-green-600 bg-green-50 border-green-200";
      case "négatif":
        return "text-red-600 bg-red-50 border-red-200";
      case "neutre":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // ==========================================
  // FONCTION : Obtenir l'emoji selon le score
  // ==========================================
  
  const getEmoji = (score: number) => {
    if (score === 5) return "😍";
    if (score === 4) return "😊";
    if (score === 3) return "😐";
    if (score === 2) return "😟";
    return "😡";
  };

  // ==========================================
  // RENDU (JSX)
  // ==========================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header avec bouton déconnexion */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Analyse de Sentiment 🎭
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          
          {/* Section : Saisie du texte */}
          <div className="mb-6">
            <label 
              htmlFor="text" 
              className="block text-lg font-semibold text-gray-700 mb-3"
            >
              Entrez votre texte à analyser :
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900"
              placeholder="Ex: Ce produit est incroyable ! Je l'adore..."
            />
          </div>

          {/* Bouton Analyser */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "Analyse en cours..." : "🔍 Analyser le sentiment"}
          </button>

          {/* Affichage des erreurs */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">❌ Erreur :</p>
              <p>{error}</p>
            </div>
          )}

          {/* Affichage du résultat */}
          {result && (
            <div className="mt-8 space-y-4">
              
              {/* Titre du résultat */}
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 pb-2">
                📊 Résultat de l'analyse
              </h2>

              {/* Carte du sentiment */}
              <div className={`p-6 rounded-xl border-2 ${getSentimentColor(result.sentiment)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide">
                      Sentiment détecté
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {result.sentiment.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-6xl">
                    {getEmoji(result.score)}
                  </div>
                </div>
              </div>

              {/* Score détaillé */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Score sur 5
                </p>
                
                {/* Barre de progression */}
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${(result.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {result.score}/5
                  </span>
                </div>

                {/* Explication du score */}
                <p className="text-xs text-gray-500 mt-3">
                  1-2 = Négatif | 3 = Neutre | 4-5 = Positif
                </p>
              </div>

              {/* Texte analysé */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-2">
                  Texte analysé :
                </p>
                <p className="text-gray-700 italic">
                  "{result.text}"
                </p>
              </div>

              {/* Bouton pour réinitialiser */}
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                  setError("");
                }}
                className="w-full mt-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ✨ Nouvelle analyse
              </button>
            </div>
          )}
        </div>

        {/* Footer avec informations */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Propulsé par Hugging Face 🤗 • Modèle BERT multilingue</p>
        </div>
      </div>
    </div>
  );
}