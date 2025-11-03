"use client"

import React, { useState } from 'react';
// react-datepickerとCSSをインポート
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../app/style/date-picker.css';


const Calendar = () => {
  // 選択された日付を保持するState (Dateオブジェクト)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // DatePickerで日付が選択されたときに実行されるハンドラ
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // 表示用の日付文字列を計算
  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit', // YYYY/MM/DD 形式に合わせる
        day: '2-digit',
      }).replace(/\//g, '-') // 日本語ロケールのスラッシュ(/)をハイフン(-)に置換
    : '日付が未選択です';
    
  // 例: "2025/11/04" -> "2025-11-04" に変換されます

  return (
    <div className="flex flex-col items-center justify-top mt-15 ">
      
      
      {/* 1. カレンダー表示エリア */}
      <div className="w-full max-w-xl bg-white shadow-xl rounded-lg ">
        
        {/* DatePickerコンポーネント: inline属性でカレンダーを常時表示 */}
        <DatePicker
          selected={selectedDate} // 現在選択されている日付
          onChange={handleDateChange} // 日付が変更されたときのコールバック
          inline // ★ カレンダーをポップアップではなく、常にUI内に表示
          dateFormat="yyyy/MM/dd" // 入力値の表示形式
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {/* 2. 選択された日付の表示エリア */}
      <div className="mt-10 p-6 w-full max-w-md bg-indigo-50 shadow-lg rounded-lg text-center">
        
        <p className="text-xl">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}

export default Calendar;