"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings'
import { PlayIcon, Volume2 } from 'lucide-react'

interface CharacterSelectionProps {
  onSelect: (characterId: number) => void
  onBack: () => void
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect, onBack }) => {
  const [selectedCharacterID, setSelectedCharacterID] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<number | null>(null)

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

  const handleSelect = () => {
    if (selectedCharacterID !== null) {
      onSelect(selectedCharacterID)
    }
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 space-y-8 ">
        
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2 shadow-md">
              <span className="text-3xl">🍃</span>
            </div>
            <h2 className="text-3xl font-bold text-green-700">キャラクター選択</h2>
            <p className="text-gray-500 text-sm">お好きなキャラクターを選択してください</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
            {CHARACTER_OPTIONS.map((character) => (
              <div
                key={character.id}
                className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-200 ${
                  selectedCharacterID === character.id
                    ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCharacterID(character.id)}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* キャラクター画像（上部にフォーカス） */}
                  <div className="w-48 h-56 relative overflow-hidden">
                    <Image
                      src={`/img/${character.name}.png`}
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
                    className={`flex items-center gap-2 p-5 rounded-full font-medium transition-all ${
                      isPlaying === character.id
                        ? 'bg-green-400 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <PlayIcon />
                  </button>

                  {/* 選択チェックマーク */}
                  {selectedCharacterID === character.id && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleSelect}
              disabled={selectedCharacterID === null}
              className={`w-full  px-8 py-4 rounded-full font-extrabold text-xl text-white transition-all duration-200 ${
                selectedCharacterID !== null
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {selectedCharacterID !== null ? '決定' : 'キャラクターを選択してください'}
            </button>

            <button
              onClick={onBack}
              className="w-full text-emerald-600 bg-white px-8 py-4 rounded-full font-extrabold text-xl shadow-lg hover:text-white hover:bg-emerald-600 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
            
            >
              ← 戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharacterSelection