export interface JobListing {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contractType: 'full-time' | 'part-time' | 'freelance' | 'internship' | 'apprenticeship';
  experienceLevel: 'entry' | 'intermediate' | 'senior' | 'executive';
  remote: 'no' | 'hybrid' | 'full';
  url: string;
  source: 'indeed' | 'linkedin' | 'monster' | 'glassdoor' | 'adzuna' | 'jooble' | 'searchapi' | 'other';
  postedDate: string;
  matchScore?: number;
  isFavorite?: boolean;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobSearchFilters {
  query: string;
  location: string;
  language?: 'fr' | 'de';
  radius?: number;
  contractType?: string[];
  experienceLevel?: string[];
  remote?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  postedSince?: 'day' | 'week' | 'month' | 'any';
}

export const defaultFilters: JobSearchFilters = {
  query: '',
  location: '',
  language: 'fr',
  radius: 50,
  contractType: [],
  experienceLevel: [],
  remote: [],
  postedSince: 'any'
};

export interface JobAlert {
  id?: string;
  name: string;
  filters: JobSearchFilters;
  frequency: 'daily' | 'weekly' | 'instant';
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Données simulées pour les offres d'emploi - Supprimées
export const mockJobListings: JobListing[] = [];
