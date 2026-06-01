"use client";

import Link from "next/link";
import { useUserContext } from '../modules/user-context'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

function SubscriptionStatusNav() {
  const [mounted, setMounted] = useState(false);
  
  // Utiliser un hook conditionnel mais de manière sûre
  let subscription = null;
  let loading = true;
  let contextAvailable = false;
  
  try {
    const userContext = useUserContext();
    subscription = userContext.subscription;
    loading = userContext.loading;
    contextAvailable = true;
  } catch {
    contextAvailable = false;
    loading = false;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !contextAvailable || loading) return <span className="animate-pulse text-xs text-gray-400">Chargement...</span>;
  if (!subscription) return null;
  
  const statusColors = {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200',
    canceled: 'bg-red-50 text-red-700 border-red-200',
    default: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  const statusColor = statusColors[subscription.subscriptionStatus as keyof typeof statusColors] || statusColors.default;
  
  return (
    <span className={`text-xs ${statusColor} px-2.5 py-1 rounded-full mr-2 border shadow-sm transition-all duration-300 hover:shadow font-medium`}>
      <strong>{subscription.plan?.toUpperCase()}</strong> ({subscription.role})
      <span className="ml-1">[{subscription.subscriptionStatus}]</span>
    </span>
  );
}

export default function EnhancedNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();
  
  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Effect for scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    if (mounted) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [mounted]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Éviter l'hydratation avant le montage
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary-50 to-indigo-50 shadow-md" suppressHydrationWarning>
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex h-16 items-center justify-between">
            <Link href="/" className="text-gradient-primary text-xl font-bold">
              Job Finder
            </Link>
            <div></div>
          </nav>
        </div>
      </header>
    );
  }
  
  const navLinks = [
    { href: '/orientation', label: 'Orientation', icon: '🧭' },
    { href: '/cv', label: 'CV', icon: '📄' },
    { href: '/lettre', label: 'Lettres', icon: '✉️' },
    { href: '/jobs', label: 'Emplois', icon: '💼' },
    { href: '/coaching', label: 'Coaching', icon: '🎯' },
    { href: '/geolocation', label: 'Carte', icon: '🗺️' },
    { href: '/pricing', label: 'Tarifs', icon: '💰' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-gradient-to-r from-primary-50 to-indigo-50 shadow-md'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo - Responsive */}
          <Link href="/" className="text-gradient-primary flex-shrink-0 text-xl font-bold transition-transform hover:scale-105 sm:text-2xl">
            <span className="hidden sm:inline">Job Finder</span>
            <span className="sm:hidden">JF</span>
          </Link>
          
          {/* Desktop Navigation - Medium screens and up */}
          <div className="hidden items-center space-x-1 md:flex">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center rounded-lg from-primary-50 to-indigo-50 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:text-primary-700 hover:shadow-sm focus:ring-2 focus:ring-primary-300 focus:ring-opacity-50"
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Right side - User section */}
          <div className="flex items-center space-x-2">
            {/* Subscription status - Hidden on small screens */}
            <div className="hidden lg:block">
              <SubscriptionStatusNav />
            </div>
            
            {isLoaded && user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/profil" 
                  className="flex items-center space-x-1 rounded-full p-2 text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                  title="Profil"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden text-sm lg:inline">Profil</span>
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
                >
                  <span className="hidden sm:inline">Déconnexion</span>
                  <span className="sm:hidden">🚪</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-primary-700"
                >
                  <span className="hidden sm:inline">Connexion</span>
                  <span className="sm:hidden">🔑</span>
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
                >
                  <span className="hidden sm:inline">S&apos;inscrire</span>
                  <span className="sm:hidden">➕</span>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="ml-2 flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
              onClick={toggleMobileMenu}
              title="Menu"
              aria-label="Ouvrir le menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="animate-fadeIn mb-4 rounded-xl border border-gray-100 bg-white px-3 py-4 shadow-lg md:hidden">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="flex items-center rounded-lg border border-transparent from-primary-50 to-indigo-50 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-primary-200 hover:bg-gradient-to-r hover:text-primary-700 hover:shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              
              {/* Subscription status in mobile menu */}
              <div className="mt-2 border-t border-gray-200 pt-2">
                <SubscriptionStatusNav />
                
                {/* User actions in mobile menu */}
                {isLoaded && user ? (
                  <div className="mt-2 flex flex-col space-y-2">
                    <Link 
                      href="/profil" 
                      className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profil
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      className="flex items-center rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-red-700 hover:shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </Link>
                  </div>
                ) : (
                  <div className="mt-2 flex flex-col space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-primary-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Connexion
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}