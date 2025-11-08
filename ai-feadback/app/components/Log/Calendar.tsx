"use client"

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../app/style/date-picker.css';

interface CalendarProps {
  onDateChange: (formattedDate: string) => void;
  theme: { bg: string; accent: string; color: string };
}

const Calendar = ({ onDateChange, theme }: CalendarProps) => {
  // 選択された日付を保持するState (Dateオブジェクト)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // DatePickerで日付が選択されたときに実行されるハンドラ
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    // 親コンポーネントに日付を渡す（YYYY-MM-DD形式）
    if (date) {
      const formatted = date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-');
      onDateChange(formatted);
    }
  };

  // キャラクターのcolorに基づいた色設定
  const colorMap: { [key: string]: { primary: string; secondary: string; light: string; border: string } } = {
    green: {
      primary: '#10b981', // emerald-500
      secondary: '#34d399', // emerald-400
      light: 'rgba(16, 185, 129, 0.2)',
      border: '#9333ea'
    },
    orange: {
      primary: '#fbbf24', // amber-500
      secondary: '#fbbf24', // amber-400
      light: 'rgba(245, 158, 11, 0.2)',
      border: '#f59e0b'
    },
    purple: {
      primary: '#9333ea', // purple-600
      secondary: '#ec4899', // pink-500
      light: 'rgba(147, 51, 234, 0.2)',
      border: '#9333ea'
    }
  };

  // theme.accent から color を抽出（例: 'bg-green-100 border-green-300' から 'green' を抽出）
  const themeColor = theme.accent.includes('green') ? 'green'
                   : theme.accent.includes('orange') ? 'orange'
                   : 'purple';

  const colors = colorMap[themeColor] || colorMap.purple;

  return (
    <div className={`flex flex-col items-center justify-top  bg-${theme.color}-100 py-8`}>

      <div
        className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-white calendar-container"
        style={{
          '--calendar-primary': colors.primary,
          '--calendar-secondary': colors.secondary,
          '--calendar-light': colors.light,
          '--calendar-border': colors.border
        } as React.CSSProperties}
      >
        
        <DatePicker
          selected={selectedDate} // 現在選択されている日付
          onChange={handleDateChange} // 日付が変更されたときのコールバック
          inline
          dateFormat="yyyy/MM/dd"
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

    </div>
  );
}

export default Calendar;