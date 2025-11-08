"use client"

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../app/style/date-picker.css';

interface CalendarProps {
  onDateChange: (formattedDate: string) => void;
  theme: { bg: string; accent: string };
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

  return (
    <div className={`flex flex-col items-center justify-top  ${theme.bg} py-8`}>

      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl border-2 border-white">
        
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