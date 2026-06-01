'use client'

import { useState, useRef, useEffect } from 'react'
import { useCV } from '../utils/cv-context'
import { CV, Experience, Education, Skill, Language } from '../utils/types'

export default function DOCXImport() {
  const { updateCV } = useCV()
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const [isMammothLoaded, setIsMammothLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dynamically import mammoth to avoid SSR issues
  useEffect(() => {
    const loadMammoth = async () => {
      try {
        await import('mammoth')
        setIsMammothLoaded(true)
      } catch (error) {
        console.error('Failed to load mammoth:', error)
        setImportStatus('Erreur de chargement de la fonction d\'importation.')
      }
    }
    
    if (typeof window !== 'undefined') {
      loadMammoth()
    }
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier que c'est un fichier DOCX
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setImportStatus('Veuillez sélectionner un fichier DOCX valide.')
      return
    }

    setIsImporting(true)
    setImportStatus('Importation en cours...')

    try {
      // Lire le contenu du fichier DOCX
      const arrayBuffer = await file.arrayBuffer()
      
      // Import mammoth dynamically
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ arrayBuffer })
      const text = result.value
      
      // Vérifier si le texte a été extrait
      if (!text || text.trim() === '') {
        setImportStatus('Le fichier DOCX est vide ou n\'a pas pu être lu.')
        setIsImporting(false)
        return
      }
      
      // Extraire les données du texte
      const extractedData = extractCVDataFromText(text)
      
      // Mettre à jour le CV dans le contexte avec des valeurs par défaut
      const cvData: CV = {
        title: extractedData.title || 'CV importé',
        template: 'professional',
        countryTemplate: 'france',
        personalInfo: extractedData.personalInfo || {
          firstName: '',
          lastName: '',
          title: '',
          email: '',
          phone: '',
        },
        sections: extractedData.sections || []
      }
      updateCV(cvData)
      
      setImportStatus('CV importé avec succès!')
    } catch (error) {
      console.error('Erreur lors de l\'importation du CV:', error)
      setImportStatus(`Erreur lors de l'importation: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez réessayer.`)
    } finally {
      setIsImporting(false)
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const extractCVDataFromText = (text: string): Partial<CV> => {
    // Normaliser le texte (remplacer les caractères spéciaux, etc.)
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    const lines = normalizedText.split('\n').filter(line => line.trim() !== '')
    
    // Initialiser les données
    const personalInfo = {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      website: '',
      linkedin: '',
      github: ''
    }
    
    const sections = []
    let currentSection: any = null
    let experiences: Experience[] = []
    let educations: Education[] = []
    let skills: Skill[] = []
    let languages: Language[] = []
    
    // Extraire les informations personnelles du début
    if (lines.length > 0) {
      // Nom (première ligne non vide)
      const nameLine = lines[0].trim()
      const nameParts = nameLine.split(' ')
      if (nameParts.length >= 2) {
        personalInfo.firstName = nameParts[0]
        personalInfo.lastName = nameParts.slice(1).join(' ')
      } else {
        personalInfo.firstName = nameLine
      }
      
      // Parcourir les lignes suivantes pour trouver les informations de contact
      for (let i = 1; i < Math.min(lines.length, 10); i++) {
        const line = lines[i].trim()
        
        // Email
        if (line.includes('@') && !personalInfo.email) {
          personalInfo.email = line
        }
        // Téléphone
        else if (/\b(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/.test(line) && !personalInfo.phone) {
          personalInfo.phone = line
        }
        // LinkedIn
        else if (line.toLowerCase().includes('linkedin') || line.includes('linkedin.com')) {
          personalInfo.linkedin = line
        }
        // GitHub
        else if (line.toLowerCase().includes('github') || line.includes('github.com')) {
          personalInfo.github = line
        }
        // Site web
        else if (/https?:\/\/[^\s]+/.test(line) && !personalInfo.website) {
          personalInfo.website = line
        }
      }
    }
    
    // Identifier les sections principales
    let experienceLines: string[] = []
    let educationLines: string[] = []
    let skillsLines: string[] = []
    let languagesLines: string[] = []
    
    let inExperience = false
    let inEducation = false
    let inSkills = false
    let inLanguages = false
    
    // Mots-clés pour identifier les sections
    const experienceKeywords = ['expérience', 'experience', 'work', 'emploi', 'job', 'position']
    const educationKeywords = ['formation', 'education', 'études', 'study', 'école', 'school', 'université', 'university']
    const skillsKeywords = ['compétences', 'skills', 'abilities', 'expertise']
    const languagesKeywords = ['langues', 'languages', 'langage']
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim()
      
      // Détecter le début d'une section
      if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
        inExperience = true
        inEducation = false
        inSkills = false
        inLanguages = false
        continue
      }
      
      if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
        inEducation = true
        inExperience = false
        inSkills = false
        inLanguages = false
        continue
      }
      
      if (skillsKeywords.some(keyword => lowerLine.includes(keyword))) {
        inSkills = true
        inExperience = false
        inEducation = false
        inLanguages = false
        continue
      }
      
      if (languagesKeywords.some(keyword => lowerLine.includes(keyword))) {
        inLanguages = true
        inExperience = false
        inEducation = false
        inSkills = false
        continue
      }
      
      // Ajouter la ligne à la section appropriée
      if (inExperience) {
        experienceLines.push(line)
      } else if (inEducation) {
        educationLines.push(line)
      } else if (inSkills) {
        skillsLines.push(line)
      } else if (inLanguages) {
        languagesLines.push(line)
      }
    }
    
    // Extraire les expériences
    experiences = extractExperiences(experienceLines)
    
    // Extraire les formations
    educations = extractEducations(educationLines)
    
    // Extraire les compétences
    skills = extractSkills(skillsLines)
    
    // Extraire les langues
    languages = extractLanguages(languagesLines)
    
    // Construire les sections
    if (experiences.length > 0) {
      sections.push({
        id: 'experience',
        type: 'experience' as const,
        title: 'Expérience professionnelle',
        content: experiences,
        order: 1
      })
    }
    
    if (educations.length > 0) {
      sections.push({
        id: 'education',
        type: 'education' as const,
        title: 'Formation',
        content: educations,
        order: 2
      })
    }
    
    if (skills.length > 0) {
      sections.push({
        id: 'skills',
        type: 'skills' as const,
        title: 'Compétences',
        content: skills,
        order: 3
      })
    }
    
    if (languages.length > 0) {
      sections.push({
        id: 'languages',
        type: 'languages' as const,
        title: 'Langues',
        content: languages,
        order: 4
      })
    }
    
    return {
      title: 'CV importé',
      personalInfo,
      sections
    }
  }
  
  const extractExperiences = (lines: string[]): Experience[] => {
    const experiences: Experience[] = []
    let currentExperience: Partial<Experience> | null = null
    
    for (const line of lines) {
      // Vérifier si la ligne contient une date (indiquant le début d'une nouvelle expérience)
      if (/\d{4}/.test(line)) {
        // Sauvegarder l'expérience précédente si elle existe
        if (currentExperience) {
          experiences.push(currentExperience as Experience)
        }
        
        // Créer une nouvelle expérience
        currentExperience = {
          id: Math.random().toString(36).substr(2, 9),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        }
        
        // Extraire le titre, l'entreprise et la période
        // Format typique: "Poste - Entreprise, Lieu, Période"
        const parts = line.split(/[-,]/).map(part => part.trim())
        if (parts.length >= 1) {
          currentExperience.title = parts[0]
        }
        if (parts.length >= 2) {
          currentExperience.company = parts[1]
        }
        if (parts.length >= 3) {
          currentExperience.location = parts[2]
        }
      } else if (currentExperience) {
        // Ajouter la ligne à la description de l'expérience en cours
        if (currentExperience.description) {
          currentExperience.description += '\n' + line
        } else {
          currentExperience.description = line
        }
      }
    }
    
    // Ajouter la dernière expérience
    if (currentExperience) {
      experiences.push(currentExperience as Experience)
    }
    
    return experiences
  }
  
  const extractEducations = (lines: string[]): Education[] => {
    const educations: Education[] = []
    
    for (const line of lines) {
      // Créer une formation simple
      const education: Education = {
        id: Math.random().toString(36).substr(2, 9),
        degree: line,
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
      
      educations.push(education)
    }
    
    return educations
  }
  
  const extractSkills = (lines: string[]): Skill[] => {
    const skills: Skill[] = []
    
    for (const line of lines) {
      // Séparer les compétences par des virgules ou des points-virgules
      const skillNames = line.split(/[;,]/).map(skill => skill.trim()).filter(skill => skill !== '')
      
      for (const skillName of skillNames) {
        if (skillName) {
          skills.push({
            id: Math.random().toString(36).substr(2, 9),
            name: skillName,
            level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert'
          })
        }
      }
    }
    
    return skills
  }
  
  const extractLanguages = (lines: string[]): Language[] => {
    const languages: Language[] = []
    
    for (const line of lines) {
      // Créer une langue simple
      const language: Language = {
        id: Math.random().toString(36).substr(2, 9),
        name: line,
        level: 'B1' as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native'
      }
      
      languages.push(language)
    }
    
    return languages
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow">
      <h3 className="text-lg font-medium">Importer un CV (DOCX)</h3>
      <p className="text-sm text-gray-600">
        Importez votre CV existant au format DOCX pour pré-remplir automatiquement les informations.
      </p>
      
      <div className="flex flex-col items-start gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".docx"
          aria-label="Sélectionner un fichier CV DOCX"
          className="hidden"
        />
        
        <button
          onClick={handleImportClick}
          disabled={isImporting || !isMammothLoaded}
          className={`px-4 py-2 rounded-md ${
            isImporting || !isMammothLoaded
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isImporting ? 'Importation en cours...' : !isMammothLoaded ? 'Chargement...' : 'Sélectionner un fichier DOCX'}
        </button>
        
        {importStatus && (
          <div className={`text-sm ${
            importStatus.includes('succès') 
              ? 'text-green-600' 
              : importStatus.includes('Erreur') || importStatus.includes('erreur')
                ? 'text-red-600' 
                : 'text-blue-600'
          }`}>
            {importStatus}
          </div>
        )}
        
        {importStatus && importStatus.includes('succès') && (
          <div className="text-sm text-gray-500 mt-2">
            Vos informations ont été importées. Vous pouvez maintenant les modifier dans les formulaires ci-dessous.
          </div>
        )}
      </div>
    </div>
  )
}