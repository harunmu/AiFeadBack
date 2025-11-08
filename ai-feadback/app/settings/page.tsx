"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings'
import { UserData } from '@/config/type'
import { updateUserCharacter } from '@/config/api'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

const SettingsPage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // ローカルストレージからユーザーデータを読み込む
    const userJson = localStorage.getItem("user")
    if (userJson) {
      try {
        const data = JSON.parse(userJson) as UserData
        setUserData(data)
        setSelectedCharacterId(data.character_id)
      } catch (e) {
        console.error("Failed to parse user data:", e)
      }
    }
    setIsLoading(false)
  }, [])

  const handleCharacterChange = (characterId: number) => {
    setSelectedCharacterId(characterId)
  }

  const handleSave = async () => {
    if (userData && selectedCharacterId !== null) {
      setIsSaving(true)

      try {
        // データベースを更新
        const result = await updateUserCharacter(userData.user_id, selectedCharacterId)

        if (!result.success) {
          alert(`データベースの更新に失敗しました: ${result.error}`)
          setIsSaving(false)
          return
        }

        // ローカルストレージを更新
        const updatedUserData: UserData = {
          ...userData,
          character_id: selectedCharacterId
        }

        localStorage.setItem("user", JSON.stringify(updatedUserData))
        setUserData(updatedUserData)

        router.back()
      } catch (error) {
        console.error("Error updating character:", error)
        alert("キャラクターの変更に失敗しました")
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-gray-500 mb-4">ユーザーデータが見つかりません</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          ホームに戻る
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors mr-3"
            aria-label="戻る"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">設定</h1>
        </div>

        {/* ユーザー情報 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              {userData.user_name}
            </p>
          </div>
        </div>

        {/* キャラクター選択 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">キャラクター選択</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {CHARACTER_OPTIONS.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterChange(character.id)}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                  selectedCharacterId === character.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 relative mb-3">
                    <Image
                      src={`/${character.name}.png`}
                      alt={character.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-center">
                    {character.name}
                  </h3>
                  {selectedCharacterId === character.id && (
                    <p className="text-sm text-blue-600 mt-1">選択中</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            disabled={selectedCharacterId === userData.character_id || isSaving}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : selectedCharacterId === userData.character_id ? '現在のキャラクター' : '変更を保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
