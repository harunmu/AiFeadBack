"use client"

import React from 'react'
import Link from 'next/link'
import { Settings, CircleQuestionMark } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-[#f2f2f2a2]  px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">AI Feedback</h1>

      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="設定"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>
        <Link
          href="/terms"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="利用規約"
        >
          <CircleQuestionMark className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </header>
  )
}

export default Header