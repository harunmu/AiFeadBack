"use client"

import React, { useEffect, useState } from 'react'
import Calendar from './Calendar'
import Log from './Log'
import { UserData } from '@/config/type';
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings';

interface LogPreviewProps {
  onLogClick: (chatlog: string[]) => void;
}

const LogPreview = ({ onLogClick }: LogPreviewProps) => {
  // 選択された日付を状態管理（YYYY-MM-DD形式）
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // 初期値として今日の日付をYYYY-MM-DD形式で設定
    const today = new Date();
    return today.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '-');
  });
  const [userData, setUserData] = useState<UserData | null>(null);
  

    useEffect(() => {
      // ローカルストレージからユーザー情報を取得
      const getUserDataFromLocalStorage = (): UserData | null => {
        const userJson = localStorage.getItem("user");
  
        if (!userJson) {
          return null;
        }
  
        try {
          const userData = JSON.parse(userJson) as UserData;
  
          if (userData.user_id && userData.character_id && userData.user_name) {
              return userData;
          }
  
          return null;
  
        } catch (e) {
          console.error("Failed to parse user data from localStorage:", e);
          return null;
        }
      };
  
      setUserData(getUserDataFromLocalStorage());
    }, []);
  
    const userId = userData ? userData.user_id : null;
  
    // キャラクター情報を取得
    const currentCharacter = userData
      ? CHARACTER_OPTIONS.find(char => char.id === userData.character_id)
      : null;
  
    // キャラクターごとの背景色設定
    const theme = currentCharacter
      ? { bg: currentCharacter.bg, accent: currentCharacter.accent }
      : { bg: 'bg-gray-50', accent: 'bg-gray-200 border-gray-400' };

  return (
    <div>
        <Calendar onDateChange={setSelectedDate} theme={theme}/>
        <Log selectedDate={selectedDate} onLogClick={onLogClick} userId={userId} theme={theme} />
    </div>
  )
}

export default LogPreview