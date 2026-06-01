'use client'

import { useProfile } from '../utils/profile-context'
import { Input, Textarea, Label } from '@/app/components/ui'

export default function ProfileInfoForm() {
  const { profile, updateField, generateSlug } = useProfile()
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    updateField('title', title)
    generateSlug(title)
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Informations du profil</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="title">
            Titre du profil
          </Label>
          <Input
            type="text"
            id="title"
            value={profile.title}
            onChange={handleTitleChange}
            placeholder="Ex: Développeur Web Full Stack"
          />
        </div>
        
        <div>
          <Label htmlFor="slug">
            URL personnalisée
          </Label>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 mr-1">monsite.com/profil/</span>
            <Input
              type="text"
              id="slug"
              value={profile.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              className="flex-1"
              placeholder="mon-nom"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cette URL sera utilisée pour accéder à votre profil public.
          </p>
        </div>
        
        <div>
          <Label htmlFor="bio">
            Biographie
          </Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            rows={5}
            placeholder="Présentez-vous en quelques lignes..."
          />
        </div>
      </div>
    </div>
  )
}
