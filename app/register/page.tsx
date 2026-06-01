'use client';

import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        
        <div className="mt-8">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtons: "mb-4",
                socialButtonsBlockButton: "border border-gray-300 rounded-md",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-gray-300",
                dividerText: "text-gray-500",
                formFieldInput: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                formButtonPrimary: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                footerAction: "hidden"
              }
            }}
            fallbackRedirectUrl="/profil"
          />
        </div>
        
        <div className="text-sm text-center mt-4">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}