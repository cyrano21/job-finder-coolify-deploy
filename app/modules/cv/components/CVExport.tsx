'use client'

import { useState, useEffect } from 'react'
import { useCV } from '../utils/cv-context'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { CV, Experience, Education, Skill, Language, Summary } from '../utils/types'

interface CVExportProps {
  className?: string
}

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingBottom: 2,
    borderBottom: '1 solid #E5E7EB',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    color: '#4B5563',
  },
  itemDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  itemDescription: {
    fontSize: 10,
    marginTop: 3,
  },
  skillsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '50%',
    fontSize: 10,
    marginBottom: 3,
  },
  languageItem: {
    width: '50%',
    fontSize: 10,
    marginBottom: 3,
  },
});

// Composant PDF pour le CV
const CVDocument = ({ cv }: { cv: CV }) => {
  const { personalInfo, sections } = cv
  
  const summarySection = sections.find(section => section.id === 'summary')
  const experienceSection = sections.find(section => section.id === 'experience')
  const educationSection = sections.find(section => section.id === 'education')
  const skillsSection = sections.find(section => section.id === 'skills')
  const languagesSection = sections.find(section => section.id === 'languages')
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          {personalInfo.title && (
            <Text style={styles.title}>{personalInfo.title}</Text>
          )}
          
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <Text>Email: {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text>Téléphone: {personalInfo.phone}</Text>
            )}
            {personalInfo.address && (
              <Text>
                {personalInfo.address}, {personalInfo.city} {personalInfo.postalCode}, {personalInfo.country}
              </Text>
            )}
          </View>
        </View>
        
        {/* Summary */}
        {summarySection && (summarySection.content as Summary).content && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{summarySection.title}</Text>
            <Text style={styles.itemDescription}>
              {(summarySection.content as Summary).content}
            </Text>
          </View>
        )}
        
        {/* Experience */}
        {experienceSection && (experienceSection.content as Experience[]).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{experienceSection.title}</Text>
            {(experienceSection.content as Experience[]).map((experience, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{experience.title}</Text>
                <Text style={styles.itemSubtitle}>
                  {experience.company}, {experience.location}
                </Text>
                <Text style={styles.itemDate}>
                  {experience.startDate} - {experience.current ? 'Présent' : experience.endDate}
                </Text>
                <Text style={styles.itemDescription}>{experience.description}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Education */}
        {educationSection && (educationSection.content as Education[]).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{educationSection.title}</Text>
            {(educationSection.content as Education[]).map((education, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>{education.degree}</Text>
                <Text style={styles.itemSubtitle}>
                  {education.institution}, {education.location}
                </Text>
                <Text style={styles.itemDate}>
                  {education.startDate} - {education.current ? 'En cours' : education.endDate}
                </Text>
                <Text style={styles.itemDescription}>{education.description}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Skills */}
        {skillsSection && (skillsSection.content as Skill[]).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{skillsSection.title}</Text>
            <View style={styles.skillsGrid}>
              {(skillsSection.content as Skill[]).map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill.name} ({skill.level === 'beginner' ? 'Débutant' : 
                               skill.level === 'intermediate' ? 'Intermédiaire' : 
                               skill.level === 'advanced' ? 'Avancé' : 'Expert'})
                </Text>
              ))}
            </View>
          </View>
        )}
        
        {/* Languages */}
        {languagesSection && (languagesSection.content as Language[]).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{languagesSection.title}</Text>
            <View style={styles.skillsGrid}>
              {(languagesSection.content as Language[]).map((language, index) => (
                <Text key={index} style={styles.languageItem}>
                  {language.name}: {language.level === 'native' ? 'Langue maternelle' : language.level}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}

export default function CVExport({ className }: CVExportProps) {
  const { cv } = useCV()
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf')
  const [saving, setSaving] = useState(false)
  const [showPDFLink, setShowPDFLink] = useState(false)
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null)
  const [docxGenerating, setDocxGenerating] = useState(false)

  // Délai pour afficher le lien PDF afin d'éviter le rendu initial
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPDFLink(true)
    }, 1000) // Délai de 1 seconde
    return () => clearTimeout(timer)
  }, [])

  // Generate DOCX when format changes to 'docx'
  useEffect(() => {
    if (format === 'docx') {
      generateDocx()
    }
  }, [format, cv])

  const generateDocx = async () => {
    setDocxGenerating(true)
    try {
      // Import docx library dynamically
      const { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } = await import('docx')
      
      // Create document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            // Professional title
            new Paragraph({
              text: cv.personalInfo.title,
              alignment: AlignmentType.CENTER,
            }),
            // Contact info
            new Paragraph({
              text: [
                cv.personalInfo.email,
                cv.personalInfo.phone,
                cv.personalInfo.address,
                cv.personalInfo.city,
                cv.personalInfo.country
              ].filter(Boolean).join(' | '),
              alignment: AlignmentType.CENTER,
            }),
            // Add sections
            ...cv.sections.map(section => {
              const children = []
              
              // Section title
              children.push(
                new Paragraph({
                  text: section.title,
                  heading: HeadingLevel.HEADING_2,
                })
              )
              
              // Section content based on type
              if (section.type === 'experience') {
                const experiences = Array.isArray(section.content) ? section.content : [section.content];
                experiences.forEach(exp => {
                  // Type guard to ensure we're dealing with Experience objects
                  if (exp && typeof exp === 'object' && 
                      'title' in exp && 
                      'company' in exp && 
                      typeof exp.title === 'string' && 
                      typeof exp.company === 'string') {
                    children.push(
                      new Paragraph({
                        text: `${exp.title || ''} - ${exp.company || ''}`,
                        heading: HeadingLevel.HEADING_3,
                      }),
                      new Paragraph({
                        text: `${exp.startDate || ''} - ${exp.endDate || ''}${exp.location ? ` | ${exp.location}` : ''}`,
                      }),
                      new Paragraph({
                        text: exp.description || '',
                      })
                    )
                  }
                })
              } else if (section.type === 'education') {
                const educations = Array.isArray(section.content) ? section.content : [section.content];
                educations.forEach(edu => {
                  // Type guard to ensure we're dealing with Education objects
                  if (edu && typeof edu === 'object' && 
                      'degree' in edu && 
                      'institution' in edu && 
                      typeof edu.degree === 'string' && 
                      typeof edu.institution === 'string') {
                    children.push(
                      new Paragraph({
                        text: `${edu.degree || ''} - ${edu.institution || ''}`,
                        heading: HeadingLevel.HEADING_3,
                      }),
                      new Paragraph({
                        text: `${edu.startDate || ''} - ${edu.endDate || ''}${edu.location ? ` | ${edu.location}` : ''}`,
                      }),
                      new Paragraph({
                        text: edu.description || '',
                      })
                    )
                  }
                })
              } else if (section.type === 'skills') {
                const skills = Array.isArray(section.content) ? section.content : [section.content];
                const skillText = skills
                  .filter((skill): skill is Skill => skill !== null && typeof skill === 'object' && 
                         'name' in skill && 
                         'level' in skill &&
                         typeof skill.name === 'string' && 
                         typeof skill.level === 'string' && 
                         skill.name !== '')
                  .map(skill => `${skill.name} (${skill.level || 'N/A'})`)
                  .join(', ')
                if (skillText) {
                  children.push(
                    new Paragraph({
                      text: skillText,
                    })
                  )
                }
              } else if (section.type === 'languages') {
                const languages = Array.isArray(section.content) ? section.content : [section.content];
                const languageText = languages
                  .filter((lang): lang is Language => lang !== null && typeof lang === 'object' && 
                         'name' in lang && 
                         'level' in lang &&
                         typeof lang.name === 'string' && 
                         typeof lang.level === 'string' && 
                         lang.name !== '')
                  .map(lang => `${lang.name} (${lang.level || 'N/A'})`)
                  .join(', ')
                if (languageText) {
                  children.push(
                    new Paragraph({
                      text: languageText,
                    })
                  )
                }
              } else if (section.type === 'summary') {
                // Handle summary section - it might be a single object or array
                const summaryContent = Array.isArray(section.content) 
                  ? section.content 
                  : [section.content];
                
                summaryContent.forEach(summary => {
                  if (summary && typeof summary === 'object' && 'content' in summary && 
                      typeof summary.content === 'string' && summary.content) {
                    children.push(
                      new Paragraph({
                        text: summary.content,
                      })
                    )
                  } else if (typeof summary === 'string') {
                    children.push(
                      new Paragraph({
                        text: summary,
                      })
                    )
                  }
                })
              }
              
              return children
            }).flat()
          ]
        }]
      })
      
      // Generate blob
      const { Packer } = await import('docx')
      const blob = await Packer.toBlob(doc)
      setDocxBlob(blob)
    } catch (error) {
      console.error('Error generating DOCX:', error)
    } finally {
      setDocxGenerating(false)
    }
  }

  const handleDocxDownload = () => {
    if (!docxBlob) return
    
    const url = URL.createObjectURL(docxBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cv-${cv.personalInfo.firstName}-${cv.personalInfo.lastName}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSaveToCloud = async () => {
    setSaving(true)
    
    try {
      // Simulation d'une sauvegarde cloud
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('CV sauvegardé avec succès !')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <div className={className}>
      <div className="flex items-center mb-4 border-b border-gray-200 pb-3">
        <div className="flex-1">
          <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 mb-1">Format de téléchargement</label>
          <select
            id="format-select"
            className="w-auto border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 bg-white"
            value={format}
            onChange={(e) => setFormat(e.target.value as 'pdf' | 'docx')}
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </div>
        {format === 'pdf' && showPDFLink && (
          <div className="flex-1 text-right">
            <PDFDownloadLink
              document={<CVDocument cv={cv} />}
              fileName={`cv-${cv.personalInfo.firstName}-${cv.personalInfo.lastName}.pdf`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {({ loading }) => (loading ? 'Génération du PDF...' : 'Télécharger le PDF')}
            </PDFDownloadLink>
          </div>
        )}
        {format === 'pdf' && !showPDFLink && (
          <div className="flex-1 text-right">
            <button
              disabled
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Chargement...
            </button>
          </div>
        )}
        {format === 'docx' && (
          <div className="flex-1 text-right">
            <button
              onClick={handleDocxDownload}
              disabled={docxGenerating || !docxBlob}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {docxGenerating ? 'Génération du DOCX...' : 'Télécharger le DOCX'}
            </button>
          </div>
        )}
      </div>
      {/* Div supprimée pour éliminer l'espace vide */}
      <div className="flex">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={handleSaveToCloud}
          disabled={saving}
        >
          {saving ? 'Sauvegarde en cours...' : 'Sauvegarder dans le cloud'}
        </button>
      </div>
    </div>
  )
}
