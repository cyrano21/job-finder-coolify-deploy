export interface CVSection {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'languages' | 'projects' | 'certifications' | 'interests' | 'summary';
  title: string;
  content: (Experience | Education | Skill | Language | Project | Certification | Interest)[] | { content: string };
  order: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  startDate: string;
  endDate: string | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Summary {
  content: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  photo?: string;
}

// Country-specific CV templates
export type CountryTemplate = 
  | 'france'      // European format (chronological)
  | 'germany'     // German format (functional)
  | 'usa'         // US format (chronological with summary)
  | 'uk'          // UK format (similar to US)
  | 'china'       // Chinese format (with photo at top)
  | 'japan'       // Japanese format (with detailed education)
  | 'india'       // Indian format (with career objective)
  | 'brazil'      // Brazilian format (with photo and personal details)
  | 'canada'      // Canadian format (bilingual support)
  | 'australia';  // Australian format (similar to UK/US)

export interface CV {
  id?: string;
  title: string;
  template: 'professional' | 'creative' | 'simple' | 'modern' | 'executive' | 'minimal';
  countryTemplate: CountryTemplate;
  personalInfo: PersonalInfo;
  sections: CVSection[];
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const defaultCV: CV = {
  title: 'Mon CV',
  template: 'professional',
  countryTemplate: 'france',
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
  },
  sections: [
    {
      id: 'summary',
      type: 'summary',
      title: 'Résumé',
      content: { content: '' },
      order: 0,
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Expérience professionnelle',
      content: [],
      order: 1,
    },
    {
      id: 'education',
      type: 'education',
      title: 'Formation',
      content: [],
      order: 2,
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Compétences',
      content: [],
      order: 3,
    },
    {
      id: 'languages',
      type: 'languages',
      title: 'Langues',
      content: [],
      order: 4,
    },
  ],
};

// Country-specific default CVs
export const countryDefaults: Record<CountryTemplate, Partial<CV>> = {
  france: {
    countryTemplate: 'france',
    sections: [
      {
        id: 'summary',
        type: 'summary',
        title: 'Profil',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Expérience professionnelle',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Formation',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Compétences',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Langues',
        content: [],
        order: 4,
      },
    ]
  },
  germany: {
    countryTemplate: 'germany',
    sections: [
      {
        id: 'personal',
        type: 'summary',
        title: 'Persönliche Daten',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Ausbildung',
        content: [],
        order: 1,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Berufserfahrung',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Fähigkeiten',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Sprachen',
        content: [],
        order: 4,
      },
    ]
  },
  usa: {
    countryTemplate: 'usa',
    sections: [
      {
        id: 'summary',
        type: 'summary',
        title: 'Professional Summary',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Work Experience',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Education',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Languages',
        content: [],
        order: 4,
      },
    ]
  },
  uk: {
    countryTemplate: 'uk',
    sections: [
      {
        id: 'profile',
        type: 'summary',
        title: 'Profile',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Employment History',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Education and Qualifications',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Key Skills',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Languages',
        content: [],
        order: 4,
      },
    ]
  },
  china: {
    countryTemplate: 'china',
    sections: [
      {
        id: 'basic',
        type: 'summary',
        title: '基本信息',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: '工作经历',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: '教育背景',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: '技能',
        content: [],
        order: 3,
      },
    ]
  },
  japan: {
    countryTemplate: 'japan',
    sections: [
      {
        id: 'profile',
        type: 'summary',
        title: 'プロフィール',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'education',
        type: 'education',
        title: '学歴',
        content: [],
        order: 1,
      },
      {
        id: 'experience',
        type: 'experience',
        title: '職歴',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'スキル',
        content: [],
        order: 3,
      },
    ]
  },
  india: {
    countryTemplate: 'india',
    sections: [
      {
        id: 'objective',
        type: 'summary',
        title: 'Career Objective',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Academic Qualifications',
        content: [],
        order: 1,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Work Experience',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Technical Skills',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Languages Known',
        content: [],
        order: 4,
      },
    ]
  },
  brazil: {
    countryTemplate: 'brazil',
    sections: [
      {
        id: 'profile',
        type: 'summary',
        title: 'Perfil Profissional',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Experiência Profissional',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Formação Acadêmica',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Habilidades',
        content: [],
        order: 3,
      },
    ]
  },
  canada: {
    countryTemplate: 'canada',
    sections: [
      {
        id: 'summary',
        type: 'summary',
        title: 'Professional Profile',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Work Experience',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Education',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Languages',
        content: [],
        order: 4,
      },
    ]
  },
  australia: {
    countryTemplate: 'australia',
    sections: [
      {
        id: 'profile',
        type: 'summary',
        title: 'Career Profile',
        content: { content: '' },
        order: 0,
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Professional Experience',
        content: [],
        order: 1,
      },
      {
        id: 'education',
        type: 'education',
        title: 'Qualifications',
        content: [],
        order: 2,
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Key Skills',
        content: [],
        order: 3,
      },
      {
        id: 'languages',
        type: 'languages',
        title: 'Languages',
        content: [],
        order: 4,
      },
    ]
  }
};
