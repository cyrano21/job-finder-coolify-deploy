'use client'

import { useCV } from '../utils/cv-context'
import { Card, CardContent, Input, Label } from '@/app/components/ui'

export default function PersonalInfoForm() {
  const { cv, updatePersonalInfo } = useCV()
  const { personalInfo } = cv

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updatePersonalInfo(name, value)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        updatePersonalInfo('photo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={personalInfo.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={personalInfo.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="title">Titre professionnel</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={personalInfo.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={personalInfo.address || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={personalInfo.city || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="country">Pays</Label>
            <Input
              type="text"
              id="country"
              name="country"
              value={personalInfo.country || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              type="text"
              id="postalCode"
              name="postalCode"
              value={personalInfo.postalCode || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="website">Site web</Label>
            <Input
              type="url"
              id="website"
              name="website"
              value={personalInfo.website || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              type="url"
              id="linkedin"
              name="linkedin"
              value={personalInfo.linkedin || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              type="url"
              id="github"
              name="github"
              value={personalInfo.github || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo</Label>
            <Input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="h-auto py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
