"use client"

import React, { useState } from 'react'
import Calendar from './Calendar'
import Log from './Log'

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

  return (
    <div>
        <Calendar onDateChange={setSelectedDate} />
        <Log selectedDate={selectedDate} onLogClick={onLogClick} />
    </div>
  )
}

export default LogPreview