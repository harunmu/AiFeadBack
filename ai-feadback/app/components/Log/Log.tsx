"use client"

import React, { useEffect, useState } from 'react'
import { getProgressLogs } from '@/config/api'
import { ChatlogProps, UserData } from '@/config/type'
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings'

interface LogProps {
  selectedDate: string;
  onLogClick: (chatlog: string[]) => void;
  userId: string | null;
  theme: { bg: string; accent: string; color: string };
}

const Log = ({ selectedDate, onLogClick, userId, theme }: LogProps) => {
  const [logs, setLogs] = useState<ChatlogProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchLogs = async () => {

      if (!selectedDate || !userId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getProgressLogs(selectedDate, userId);
        setLogs(data || []);
      } catch (err) {
        console.error('ログの取得に失敗しました:', err);
        setError('ログの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedDate, userId]); // selectedDateが変更されたときに再取得

  return (
    <div className={`max-h-screen bg-${theme.color}-100 py-10 px-6`}>
      <div className="max-w-4xl mx-auto">

      {/* ローディング */}
      {loading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center border-2 border-white">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 font-semibold">読み込み中...</p>
          </div>
        </div>
      )}

      {/* エラー */}
      {error && (
        <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-3xl shadow-xl p-6 border-2 border-white animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* 空の状態 */}
      {!loading && !error && logs.length === 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center border-2 border-white">
          <div className="flex flex-col items-center gap-4">
            <span className="text-6xl"></span>
            <p className="text-gray-400 text-lg font-semibold">この日のログはありません</p>
          </div>
        </div>
      )}

      {/* ログリスト */}
      {!loading && !error && logs.length > 0 && (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.chat_id}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-white hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-fade-in group"
              onClick={() => onLogClick(log.chatlog)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border-2transition-colors duration-300">
                    <p className=" whitespace-pre-wrap break-words text-gray-700 leading-relaxed">
                      {log.chatlog[0]}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-end gap-2  font-light text-gray-400">
                    <span>クリックして詳細を表示</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      </div>
    </div>
  )
}

export default Log