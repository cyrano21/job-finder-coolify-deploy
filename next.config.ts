import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome : produit un serveur Node minimal pour Docker/Coolify.
  output: "standalone",
  eslint: {
    // Désactiver ESLint pendant le build pour éviter les erreurs de lint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Le build TS est déjà vérifié en CI/local ; ne pas bloquer le déploiement.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
