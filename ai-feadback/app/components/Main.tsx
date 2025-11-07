"use client"

import React, { useState } from 'react';
import Image from "next/image";
import LogPreview from "./Log/LogPreview";
import Chat from "./Chat/Chat";
import MenuBar from './MenuBar';

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
        return <LogPreview onLogClick={handleLogClick} />;
      case 'chat':
        return <Chat initialChatLog={initialChatLog} />;
      default:
        return <Chat initialChatLog={initialChatLog} />;
    }
   };

  return (
    <main className="flex flex-col min-h-screen relative">
      
      <div className="flex-grow p-4 mb-16">
        { renderView() }
      </div>

      <MenuBar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
    </main>

  );
}

export default Main