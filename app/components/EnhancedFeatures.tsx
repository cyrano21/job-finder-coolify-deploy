// Enhanced Features Section Component with improved design and animations
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const EnhancedFeatures = () => {
  const features = [
    {
      id: 1,
      title: "Générateur de CV",
      description: "              Générez des CV professionnels avec notre IA avancée. Créez des documents d&apos;une qualité exceptionnelle en quelques minutes.",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      href: "/cv",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      title: "Lettres de motivation",
      description: "Générez des lettres personnalisées avec l'aide de l'IA, adaptées au poste et à l'entreprise.",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      href: "/lettre",
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 3,
      title: "Chasseur d'emploi IA",
      description: "Trouvez les offres qui correspondent à votre profil grâce à notre IA qui analyse et score les annonces.",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      href: "/jobs",
      color: "from-green-400 to-green-600"
    },
    {
      id: 4,
      title: "Géolocalisation",
      description: "Visualisez les offres sur une carte et calculez votre temps de trajet domicile-travail.",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      href: "/geolocation",
      color: "from-red-400 to-red-600"
    },
    {
      id: 5,
      title: "Coaching IA",
      description: "Préparez-vous aux d'entretiens avec notre simulateur IA et recevez des conseils personnalisés.",
      icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 9h6m-6 3h6m-6 3h2",
      href: "/coaching",
      color: "from-amber-400 to-amber-600"
    },
    {
      id: 6,
      title: "Profil professionnel",
      description: "Créez une page publique personnalisée pour partager votre CV, lettres et projets.",
      icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",
      href: "/profil",
      color: "from-indigo-400 to-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay-1"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient-primary">
            Tout ce dont vous avez besoin pour votre recherche d&apos;emploi
          </h2>
          <p className="text-lg text-gray-600">
            Notre plateforme tout-en-un vous accompagne à chaque étape de votre parcours professionnel
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="card card-hover p-8 rounded-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} text-white rounded-2xl flex items-center justify-center mb-6 transform rotate-3 shadow-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-5">
                {feature.description}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link 
                  href={feature.href} 
                  className="text-primary-600 font-medium flex items-center hover:text-primary-700 transition-colors group"
                >
                  Essayer maintenant
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeatures;