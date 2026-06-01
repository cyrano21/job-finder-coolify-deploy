// Enhanced Pricing CTA Component with improved design and animations
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const EnhancedPricingCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <motion.div 
          className="blob blue absolute top-0 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="blob purple absolute -bottom-8 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl max-w-4xl mx-auto border border-primary-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gradient-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Prêt à booster votre recherche d'emploi ?
          </motion.h2>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Choisissez le plan qui correspond à vos besoins et commencez dès aujourd'hui.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link 
              href="/pricing" 
              className="btn-primary px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
            >
              Voir nos tarifs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          
          {/* Testimonial */}
          <motion.div 
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-primary-600 text-4xl sm:text-5xl leading-none mb-3 sm:mb-4">"</div>
              <blockquote className="text-base sm:text-lg text-gray-700 italic mb-4 sm:mb-6">
                "Job Finder a complètement transformé ma recherche d'emploi. Grâce à l'IA, j'ai pu créer un CV parfait et trouver des offres qui correspondent vraiment à mon profil."
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4">
                  M
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Marie Dupont</div>
                  <div className="text-xs sm:text-sm text-gray-500">Développeuse Web</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedPricingCTA;