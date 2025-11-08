"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings'
import { UserData } from '@/config/type'
import { updateUserCharacter } from '@/config/api'
import Image from 'next/image'
import { ArrowLeft, PlayIcon, Volume2 } from 'lucide-react'

const SettingsPage = () => {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPlaying, setIsPlaying] = useState<number | null>(null)


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

  
    const playVoicePreview = (characterId: number, characterName: string) => {
      setIsPlaying(characterId)
  
      // 音声ファイルを再生 (WAVファイル)
      const audio = new Audio(`/voice/${characterName}_サンプル.wav`)
  
      audio.onended = () => {
        setIsPlaying(null)
      }
  
      audio.onerror = () => {
        console.error(`音声ファイルが見つかりません: /voice/${characterName}_サンプル.wav`)
        setIsPlaying(null)
        alert('音声プレビューの再生に失敗しました')
      }
  
      audio.play().catch(error => {
        console.error('音声再生エラー:', error)
        setIsPlaying(null)
        alert('音声の再生に失敗しました。ブラウザの設定を確認してください。')
      })
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
            {CHARACTER_OPTIONS.map((character) => (
              <div
                key={character.id}
                className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-200 ${
                selectedCharacterId === character.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCharacterId(character.id)}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* キャラクター画像（上部にフォーカス） */}
                  <div className="w-48 h-56 relative overflow-hidden">
                    <Image
                      src={`/${character.name}.png`}
                      alt={character.name}
                      width={400}
                      height={600}
                      className="object-cover object-top"
                      style={{ objectPosition: '50% 10%' }}
                    />
                  </div>

                  {/* キャラクター名 */}
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {character.name}
                  </h3>

                  {/* 音声プレビューボタン */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playVoicePreview(character.id, character.name)
                    }}
                    disabled={isPlaying === character.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isPlaying === character.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying === character.id ? 'animate-pulse' : ''}`} />
                    <PlayIcon />
                  </button>

                  {/* 選択チェックマーク */}
                  {selectedCharacterId === character.id && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">✓</span>
                    </div>
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
  )
}

export default SettingsPage
