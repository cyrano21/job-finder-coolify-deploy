// Enhanced Hero Section Component with improved animations and design
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EnhancedHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Floating elements data
  const floatingElements = [
    { id: 1, top: '10%', left: '5%', delay: 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 2, top: '70%', left: '85%', delay: 0.5, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 3, top: '40%', left: '90%', delay: 1, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 4, top: '80%', left: '10%', delay: 1.5, icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 9h6m-6 3h6m-6 3h2' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white py-28 md:py-36">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div 
            className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"
            animate={{ 
              scale: [1, 1.2, 1],
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
            className="absolute top-0 right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-overlay filter blur-3xl opacity-10"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="absolute -bottom-20 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl opacity-10"
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 10, 0],
              y: [0, -15, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Trouvez le job idéal avec <span className="text-gradient-accent">l&apos;aide de l&apos;IA</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Créez des CV et lettres de motivation professionnels, trouvez des offres pertinentes et préparez-vous aux d&apos;entretiens avec notre assistant IA.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href="/login" 
              className="btn-primary px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Commencer gratuitement
            </Link>
            <Link 
              href="/pricing" 
              className="btn-secondary px-8 py-4 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Voir les tarifs
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { value: '10K+', label: 'Utilisateurs' },
            { value: '50K+', label: 'CV créés' },
            { value: '15K+', label: 'Offres trouvées' },
            { value: '95%', label: 'Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Floating elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute hidden md:block"
          style={{ top: element.top, left: element.left }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay
          }}
        >
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={element.icon} />
            </svg>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default EnhancedHero;