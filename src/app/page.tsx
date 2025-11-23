"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/api";

// ============================================
// COMPOSANT : Page d'accueil
// ============================================

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Attendre que le composant soit monté (pour éviter les erreurs SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour aller à la page de login
  const goToLogin = () => {
    router.push("/login");
  };

  // Fonction pour aller à la page de sentiment (si connecté)
  const goToSentiment = () => {
    // Vérifier si l'utilisateur est déjà connecté
    if (mounted && isAuthenticated()) {
      router.push("/sentiment");
    } else {
      router.push("/login");
    }
  };

  // Ne rien afficher tant que le composant n'est pas monté 
  if (!mounted) {
    return null;
  }

  return (
    // Conteneur principal avec gradient
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      
      {/* Carte centrale */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
        
        {/* Emoji et titre */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-6">🎭</div>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Analyse de Sentiment
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez le sentiment caché dans vos textes
          </p>
        </div>

        {/* Section des fonctionnalités */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="font-bold text-gray-800">Analyse instantanée</h3>
              <p className="text-gray-600 text-sm">
                Obtenez le sentiment de n'importe quel texte en quelques secondes
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-2xl">🌍</span>
            <div>
              <h3 className="font-bold text-gray-800">Multilingue</h3>
              <p className="text-gray-600 text-sm">
                Supporte le français, l'anglais et bien d'autres langues
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-bold text-gray-800">Intelligence artificielle</h3>
              <p className="text-gray-600 text-sm">
                Propulsé par le modèle BERT de Hugging Face
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-bold text-gray-800">Sécurisé</h3>
              <p className="text-gray-600 text-sm">
                Authentification JWT pour protéger vos données
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <button
            onClick={goToSentiment}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 Commencer l'analyse
          </button>

          <button
            onClick={goToLogin}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            🔑 Se connecter
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Développé avec ❤️ par AYOUB MOTEI
            <br />
            FastAPI • Next.js • TypeScript • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}