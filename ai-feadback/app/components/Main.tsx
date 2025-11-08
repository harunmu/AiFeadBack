"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import LogPreview from "./Log/LogPreview";
import Chat from "./Chat/Chat";
import MenuBar from './MenuBar';
import Header from './Header';
import { UserData } from '@/config/type';
import { CHARACTER_OPTIONS } from '../config/voiceSettings';

type CurrentView = 'log' | 'chat';

const Main = () => {
  const [currentView, setCurrentView] = useState<CurrentView>('chat');
  const [initialChatLog, setInitialChatLog] = useState<string[]>([]);

  // ログをクリックした時の処理
  const handleLogClick = (chatlog: string[]) => {
    setInitialChatLog(chatlog);
    setCurrentView('chat');
  };

  // 2. 現在のビューに基づいて表示するコンポーネントを決定
  const renderView = () => {
    switch (currentView) {
      case 'log':
        return <LogPreview onLogClick={handleLogClick} userId={userId} theme={theme}/>;
      case 'chat':
        return <Chat initialChatLog={initialChatLog} />;
      default:
        return <Chat initialChatLog={initialChatLog} />;
    }
   };

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
      ? { bg: currentCharacter.bg, accent: currentCharacter.accent, color: currentCharacter.color }
      : { bg: 'bg-gray-50', accent: 'bg-gray-200 border-gray-400', color: 'gray-200' };

  return (
    <main className="flex flex-col min-h-screen relative">

      <Header />
      
      <div className="flex-grow p-4 overflow-hidden">
        { renderView() }
      </div>

      <MenuBar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        userId={userId}
        theme={theme}
      />
      
    </main>

  );
}

export default Main