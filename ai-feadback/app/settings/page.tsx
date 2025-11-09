"use client";
import { CirclePlay, SquareDot } from 'lucide-react';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CHARACTER_OPTIONS } from "@/app/config/voiceSettings"; // voiceSettingsはあなたの環境に合わせてパスを調整してください
import { UserData } from "@/config/type";
import { updateUserCharacter } from "@/config/api";
import Image from "next/image";
import { ArrowLeft, PlayIcon, Volume2, CheckCircle } from "lucide-react"; // CheckCircleアイコンを追加

const SettingsPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);

  // キャラクター情報を取得
  const currentCharacter = userData
    ? CHARACTER_OPTIONS.find(char => char.id === userData.character_id)
    : null;

  // キャラクターごとの背景色設定
  const theme = currentCharacter
    ? { bg: currentCharacter.bg, accent: currentCharacter.accent, color: currentCharacter.color, bgButton: currentCharacter.bgButton, textColor:currentCharacter.textColor}
    : { bg: 'bg-gray-50', accent: 'bg-gray-200 border-gray-400', color: 'gray', bgButton: 'gray', textColor: 'black'};


  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const data = JSON.parse(userJson) as UserData;
        setUserData(data);
        setSelectedCharacterId(data.character_id);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    setIsLoading(false);
  }, []);

  // const handleCharacterChange = (characterId: number) => {
  //   setSelectedCharacterId(characterId);
  // };

  const playVoicePreview = (characterId: number, characterName: string) => {
    setIsPlaying(characterId);

    const audio = new Audio(`/voice/${characterName}_サンプル.wav`);

    audio.onended = () => {
      setIsPlaying(null);
    };

    audio.onerror = () => {
      console.error(`音声ファイルが見つかりません: /voice/${characterName}_サンプル.wav`);
      setIsPlaying(null);
      alert('音声プレビューの再生に失敗しました');
    };

    audio.play().catch((error) => {
      console.error('音声再生エラー:', error);
      setIsPlaying(null);
      alert('音声の再生に失敗しました。ブラウザの設定を確認してください。');
    });
  };

  const handleSave = async () => {
    if (userData && selectedCharacterId !== null) {
      setIsSaving(true);

      try {
        const result = await updateUserCharacter(userData.user_id, selectedCharacterId);

        if (!result.success) {
          alert(`データベースの更新に失敗しました: ${result.error}`);
          setIsSaving(false);
          return;
        }

        const updatedUserData: UserData = {
          ...userData,
          character_id: selectedCharacterId,
        };

        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);

        router.back();
      } catch (error) {
        console.error("Error updating character:", error);
        alert("キャラクターの変更に失敗しました");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <p className="text-gray-600 mb-4">ユーザーデータが見つかりません</p>
        <button
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:brightness-110 transition"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} p-4 font-rounded`}> {/* 🚨 全体にフォント適用 */}
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mt-10 flex justify-center items-center mb-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm py-8  "> {/* ヘッダーを固定・背景追加 */}

          <h1 className="ml-5 text-3xl font-bold text-gray-700">キャラクター設定</h1> {/* タイトル変更・大きく */}
        </div>

        {/* キャラクター選択グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6"> {/* グリッド間隔とレスポンシブ調整 */}
          {CHARACTER_OPTIONS.map((character) => (
            <div
              key={character.id}
              className={`relative cursor-pointer border-4 rounded-3xl p-6 transition-all duration-300 ease-in-out transform bg-white/90 backdrop-blur-sm
                ${selectedCharacterId === character.id
                  ? `border-${theme.color}-300 scale-105`
                  : `border-gray-300 shadow-md hover:shadow-lg hover:border-${theme.color}-200`
                }`}
                onClick={() => setSelectedCharacterId(character.id)}
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
                  <h3 className="mt-1 text-xl font-semibold text-gray-700 text-center">
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
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <PlayIcon />
                  </button>

                  {/* 選択チェックマーク */}
                  {selectedCharacterId === character.id && (
                    <div className={`absolute -top-2 -right-2 w-8 h-8 ${theme.bgButton} rounded-full flex items-center justify-center shadow-lg`}>
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
          className={`w-full mt-8 py-6 rounded-full font-bold text-xl transition-all duration-300 shadow-lg
            ${selectedCharacterId === userData.character_id
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : `${theme.bgButton} text-white hover:shadow-xl hover:scale-102`
            }`}
        >
          {isSaving ? '保存中...' : selectedCharacterId === userData.character_id ? '現在のキャラクター' : '変更を保存'}
        </button>
        <button
          onClick={() => router.push('/chat')}
          className={`w-full mt-8 py-6 rounded-full font-extrabold text-xl transition-all duration-300 shadow-lg
                     bg-white ${theme.textColor} hover:shadow-xl hover:scale-102`
                    }
        >
          戻る
        </button>
      </div>

      {/* Tailwind CSSとカスタムKeyframes定義 (Start.tsxから流用) */}
      <style jsx global>{`
        /* 丸みを帯びたフォントの候補 */
        @font-face {
          font-family: 'RoundedMplus';
          font-weight: 700; /* font-boldに対応 */
          font-style: normal;
        }
        @font-face {
          font-family: 'RoundedMplus';
          font-weight: 900; /* font-blackに対応 */
          font-style: normal;
        }

        .font-rounded {
          font-family: 'RoundedMplus', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
        }
        
        /* アニメーションのkeyframes (Start.tsxから流用) */
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default SettingsPage;