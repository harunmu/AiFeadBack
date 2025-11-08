"use client";
import { CirclePlay } from 'lucide-react';

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

  // ずんだもんテーマの色定義 (Start.tsxと共通化すると管理が楽になります)
  const ZUNDAMON_THEME_COLORS = {
    bgLight: 'bg-green-50', // 全体の背景
    cardBg: 'bg-white/95', // カードの背景
    primaryBorder: 'border-green-400', // カードのボーダー
    primaryShadow: 'shadow-green-300/70', // カードの影
    accent: 'bg-lime-500', // 選択時のアクセント色
    accentBorder: 'border-lime-500', // 選択時のアクセントボーダー
    accentShadow: 'shadow-lime-300', // 選択時のアクセント影
    buttonBg: 'bg-gradient-to-r from-green-500 to-green-600', // ボタンの基本色
    buttonText: 'text-gray-800', // ボタンのテキスト色
    iconColor: 'text-green-700', // アイコンの色
    disabledBg: 'bg-gray-200',
    disabledText: 'text-gray-500',
  };


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

  const handleCharacterChange = (characterId: number) => {
    setSelectedCharacterId(characterId);
  };

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
      <div className={`flex items-center justify-center min-h-screen ${ZUNDAMON_THEME_COLORS.bgLight}`}>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${ZUNDAMON_THEME_COLORS.bgLight}`}>
        <p className="text-gray-600 mb-4">ユーザーデータが見つかりません</p>
        <button
          onClick={() => router.push('/')}
          className={`${ZUNDAMON_THEME_COLORS.buttonBg} text-white px-4 py-2 rounded-lg hover:brightness-110 transition`}
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${ZUNDAMON_THEME_COLORS.bgLight} p-4 font-rounded`}> {/* 🚨 全体にフォント適用 */}
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center mb-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-4 sticky top-4 z-10"> {/* ヘッダーを固定・背景追加 */}
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
            aria-label="戻る"
          >
            <ArrowLeft className={`w-6 h-6 ${ZUNDAMON_THEME_COLORS.iconColor}`} /> {/* アイコン色変更 */}
          </button>
          <h1 className="text-3xl font-bold text-gray-800">キャラクター設定</h1> {/* タイトル変更・大きく */}
        </div>

        {/* ユーザー情報カード */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-200`}> {/* カードの丸みと影を調整 */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">現在のユーザー</h2>
          <p className="text-gray-600 text-lg">
            {userData.user_name}
          </p>
        </div>

        {/* キャラクター選択グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6"> {/* グリッド間隔とレスポンシブ調整 */}
          {CHARACTER_OPTIONS.map((character) => (
            <div
              key={character.id}
              className={`relative cursor-pointer border-4 rounded-3xl p-6 transition-all duration-300 ease-in-out transform
                ${selectedCharacterId === character.id
                  ? `${ZUNDAMON_THEME_COLORS.accentBorder} ${ZUNDAMON_THEME_COLORS.cardBg} ${ZUNDAMON_THEME_COLORS.accentShadow} scale-105 ring-4 ring-offset-2 ring-lime-200` // 選択時
                  : `${ZUNDAMON_THEME_COLORS.primaryBorder} ${ZUNDAMON_THEME_COLORS.cardBg} shadow-md hover:shadow-lg hover:border-lime-300` // 非選択時
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

                {/* キャラクター名 */}
                <h3 className="text-xl font-bold text-gray-800 text-center">
                  {character.name}
                </h3>

              </div>

   
          ))}
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={selectedCharacterId === userData.character_id || isSaving}
          className={`w-full mt-8 py-4 rounded-full font-bold text-xl transition-all duration-300 shadow-lg
            ${selectedCharacterId === userData.character_id
              ? `${ZUNDAMON_THEME_COLORS.disabledBg} ${ZUNDAMON_THEME_COLORS.disabledText} cursor-not-allowed` // 変更なし
              : `${ZUNDAMON_THEME_COLORS.buttonBg} text-white hover:brightness-110` // 保存可能
            }`}
        >
          {isSaving ? '保存中...' : selectedCharacterId === userData.character_id ? '現在のキャラクター' : '変更を保存'}
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