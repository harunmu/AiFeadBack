"use client"

import React, { useEffect, useState } from 'react'
import { getProgressLogs } from '@/config/api'
import { ChatlogProps } from '@/config/type'

interface LogProps {
  selectedDate: string;
}

const Log = ({ selectedDate }: LogProps) => {
  const [logs, setLogs] = useState<ChatlogProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getProgressLogs(selectedDate);
        setLogs(data || []);
      } catch (err) {
        console.error('ログの取得に失敗しました:', err);
        setError('ログの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedDate]); // selectedDateが変更されたときに再取得

  return (
    <div className="mt-8 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {selectedDate} のログ
      </h2>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-8 rounded text-center">
          この日のログはありません
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.chat_id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mt-2">
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <p className="text-sm whitespace-pre-wrap break-words">
                      { log.chatlog[0] }
                  </p>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Log