"use client"

import React, { useEffect, useState } from 'react'
import Calendar from './Calendar'
import Log from './Log'
import { UserData } from '@/config/type';
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings';

interface LogPreviewProps {
  onLogClick: (chatlog: string[]) => void;
  userId: string | null;
  theme: { bg: string; accent: string; color: string };
}

const LogPreview = ({ onLogClick, userId, theme }: LogPreviewProps) => {
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

  return (
    <div>
        <Calendar onDateChange={setSelectedDate} theme={theme}/>
        <Log selectedDate={selectedDate} onLogClick={onLogClick} userId={userId} theme={theme} />
    </div>
  )
}

export default LogPreview