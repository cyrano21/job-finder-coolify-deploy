// Enhanced Job Card Component with improved design and interactions
import React from 'react';
import { JobListing } from '@/app/modules/jobs/utils/types';
import { useJobs } from '@/app/modules/jobs/utils/jobs-context';
import JobMatchEvaluator from '@/app/modules/jobs/components/JobMatchEvaluator';

interface EnhancedJobCardProps {
  job: JobListing;
  onJobClick?: (job: JobListing) => void;
}

const EnhancedJobCard: React.FC<EnhancedJobCardProps> = ({ job, onJobClick }) => {
  const { toggleFavorite, getFavorites, filters } = useJobs();
  const favorites = getFavorites();
  const isFav = favorites.some((fav: JobListing) => fav.id === job.id);
  const isGerman = filters.language === 'de';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(job.id || '');
  };

  const handleCardClick = () => {
    if (onJobClick) {
      onJobClick(job);
    }
  };

  // Fonction simple pour formater la date (exemple)
  const formatDate = (dateString?: string) => {
    if (!dateString) return isGerman ? 'Unbekanntes Datum' : 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString(isGerman ? 'de-DE' : 'fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isGerman ? 'Ungültiges Datum' : 'Date invalide';
    }
  };
  
  // Get contract type label
  const getContractTypeLabel = (type: string) => {
    const labelsFr: Record<string, string> = {
      'full-time': 'CDI',
      'part-time': 'Temps partiel',
      'freelance': 'Freelance',
      'internship': 'Stage',
      'apprenticeship': 'Alternance'
    };
    
    const labelsDe: Record<string, string> = {
      'full-time': 'Vollzeit',
      'part-time': 'Teilzeit',
      'freelance': 'Freiberuflich',
      'internship': 'Praktikum',
      'apprenticeship': 'Ausbildung'
    };
    
    return isGerman ? labelsDe[type] || type : labelsFr[type] || type;
  };
  
  // Get experience level label
  const getExperienceLevelLabel = (level: string) => {
    const labelsFr: Record<string, string> = {
      'entry': 'Débutant',
      'intermediate': 'Intermédiaire',
      'senior': 'Senior',
      'executive': 'Direction'
    };
    
    const labelsDe: Record<string, string> = {
      'entry': 'Einsteiger',
      'intermediate': 'Mittlerer Level',
      'senior': 'Senior',
      'executive': 'Führungskraft'
    };
    
    return isGerman ? labelsDe[level] || level : labelsFr[level] || level;
  };
  
  // Get remote label
  const getRemoteLabel = (remote: string) => {
    const labelsFr: Record<string, string> = {
      'no': 'Sur site',
      'hybrid': 'Hybride',
      'full': 'Télétravail'
    };
    
    const labelsDe: Record<string, string> = {
      'no': 'Vor Ort',
      'hybrid': 'Hybrid',
      'full': 'Homeoffice'
    };
    
    return isGerman ? labelsDe[remote] || remote : labelsFr[remote] || remote;
  };

  // Get salary range
  const getSalaryRange = () => {
    if (job.salary) {
      return job.salary;
    }
    return null;
  };

  return (
    // Enhanced card with glassmorphism effect and improved interactions
    <div 
      className="card card-hover glass group relative flex cursor-pointer flex-col gap-5 p-5 sm:flex-row"
      onClick={handleCardClick}
    >
      {/* Company Logo Placeholder with enhanced styling */}
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-xl font-bold text-white shadow-md">
        {job.company?.charAt(0) || 'C'}
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-primary-600">
            {job.title || (isGerman ? 'Stellentitel' : 'Titre du poste')}
          </h3>
          <span className="whitespace-nowrap text-sm text-gray-500">
            {formatDate(job.postedDate)}
          </span>
        </div>
        
        <p className="mb-1 text-sm font-medium text-gray-700">
          {job.company || (isGerman ? 'Unternehmensname' : 'Nom de l\'entreprise')}
        </p>
        
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location || (isGerman ? 'Standort' : 'Lieu')}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">
            {getSalaryRange()}
          </span>
        </div>
        
        {/* Enhanced Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="badge badge-primary">
            {getContractTypeLabel(job.contractType)}
          </span>
          <span className="badge badge-accent">
            {getExperienceLevelLabel(job.experienceLevel)}
          </span>
          <span className="badge badge-success">
            {getRemoteLabel(job.remote)}
          </span>
        </div>
        
        {/* Description excerpt with improved styling */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {job.description?.substring(0, 150) || (isGerman ? 'Keine Beschreibung verfügbar' : 'Aucune description disponible')}...
        </p>
      </div>

      {/* Right side with actions */}
      <div className="flex flex-shrink-0 flex-col items-end justify-between sm:ml-2">
        {/* Match Score */}
        {job.matchScore !== undefined && (
          <div className="mb-3">
            <JobMatchEvaluator jobId={job.id || ''} initialScore={job.matchScore} />
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          aria-label={isFav ? (isGerman ? "Aus Favoriten entfernen" : "Retirer des favoris") : (isGerman ? "Zu Favoriten hinzufügen" : "Ajouter aux favoris")}
          className={`p-2 rounded-full transition-all duration-200 ${
            isFav
              ? 'text-yellow-500 bg-yellow-100/50 hover:bg-yellow-100 shadow-sm'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
          } focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1`}
        >
          <svg className="h-5 w-5" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
      
      {/* Hover overlay effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
  );
};

export default EnhancedJobCard;