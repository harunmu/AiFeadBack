"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const TermsPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      利用規約
    </div>
  )
}

export default TermsPage
