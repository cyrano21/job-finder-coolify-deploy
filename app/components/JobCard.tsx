// src/modules/jobs/components/JobCard.tsx
import React from 'react';
import { JobListing } from '@/app/modules/jobs/utils/types';
import { useJobs } from '@/app/modules/jobs/utils/jobs-context';
import JobMatchEvaluator from '@/app/modules/jobs/components/JobMatchEvaluator';

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { toggleFavorite, getFavorites, filters } = useJobs();
  const favorites = getFavorites();
  const isFav = favorites.some((fav: JobListing) => fav.id === job.id);
  const isGerman = filters.language === 'de';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
      e.preventDefault(); // Empêche la navigation si la carte est un lien
      e.stopPropagation(); // Empêche la propagation si nécessaire
      toggleFavorite(job.id || '');
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

  return (
    // Conteneur de la carte avec styles Tailwind
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col sm:flex-row gap-4 relative group">
      {/* Logo (placeholder) */}
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
        {job.company?.charAt(0) || 'C'}
      </div>

      {/* Informations principales */}
      <div className="flex-grow">
        <h4 className="text-lg font-semibold text-blue-700 hover:underline mb-1">
          {job.title || (isGerman ? 'Stellentitel' : 'Titre du poste')}
        </h4>
        <p className="text-sm text-gray-700 mb-1">{job.company || (isGerman ? 'Unternehmensname' : 'Nom de l\'entreprise')}</p>
        <p className="text-sm text-gray-500 mb-2">{job.location || (isGerman ? 'Standort' : 'Lieu')}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getContractTypeLabel(job.contractType)}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {getExperienceLevelLabel(job.experienceLevel)}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {getRemoteLabel(job.remote)}
          </span>
        </div>
        
        {/* Description excerpt */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {job.description.substring(0, 150)}...
        </p>
      </div>

      {/* Informations secondaires et Actions */}
      <div className="flex-shrink-0 flex flex-col items-end justify-between sm:ml-4">
        {/* Match Score */}
        {job.matchScore !== undefined && (
          <div className="mb-2">
            <JobMatchEvaluator jobId={job.id || ''} initialScore={job.matchScore} />
          </div>
        )}
        
        <div className="flex flex-col items-end">
          <p className="text-xs text-gray-400 mb-2 sm:mb-0">{formatDate(job.postedDate)}</p>
          <button
              onClick={handleFavoriteToggle}
              aria-label={isFav ? (isGerman ? "Aus Favoriten entfernen" : "Retirer des favoris") : (isGerman ? "Zu Favoriten hinzufügen" : "Ajouter aux favoris")}
              className={`p-2 rounded-full transition-colors duration-200 ${
                  isFav
                  ? 'text-yellow-500 bg-yellow-100/50 hover:bg-yellow-100'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1`}
          >
            {/* Icône étoile SVG */}
            <svg className="w-5 h-5" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;