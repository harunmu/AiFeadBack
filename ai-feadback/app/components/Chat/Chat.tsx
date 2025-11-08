"use client"

import React, { ChangeEvent, useState, useEffect } from 'react';
// utilsファイルから関数と型をインポート
import { synthesizeVoice } from '../../utils/voicevox';
import AudioPlayer from './AudioPlayer';
import { generateFeedback } from '../../utils/geminiUtils';
import { ChatlogProps, UserData } from '@/config/type';
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings';
import Image from 'next/image';
import { addProgressLog } from '@/config/api';
import { v4 as uuidv4 } from 'uuid';


interface ChatProps {
  initialChatLog?: string[];
}

const Chat = ({ initialChatLog = [] }: ChatProps) => {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [audioData, setAudioData] = useState<Blob>()
  const [inputText, setInputText] = useState<string>('');
  const [chatLog, setChatLog] = useState<string[]>(initialChatLog);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [textAreaHeight, setTextAreaHeight] = useState<string>('3.5rem');

  // initialChatLogが変更された時にchatLogを更新
  useEffect(() => {
    if (initialChatLog.length > 0) {
      setChatLog(initialChatLog);
    }
  }, [initialChatLog]);

  useEffect(() => {
    const getUserDataFromLocalStorage = (): UserData | null => {
      const userJson = localStorage.getItem("user");
      
      if (!userJson) {
        return null;
      }
      
      try {
        return JSON.parse(userJson) as UserData;
      } catch (e) {
        console.error("Error parsing user data:", e);
        return null;
      }
    };

    const data = getUserDataFromLocalStorage();
    setUserData(data);
    setIsLoading(false)
  }, []); // 依存配列が空なので、マウント時のみ実行

  // GeminiAPI関連
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const API_MODEL = "gemini-2.5-flash-preview-09-2025";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // geminiAPIによるフィードバック作成関数
  const handleTextFeedback = async (currentText: string) => {

    try {
        const feedbackText = await generateFeedback(
            currentText, 
            GEMINI_API_KEY, 
            API_URL
        );

        return feedbackText;

    } catch (error) {
        console.error("フィードバック取得エラー:", error);
    }
  };

  // 音声ファイル作成関数
  const CreateAudioBlob = async(feedbackText: string) => {

    try {
        if (!userData) {
          return null; 
        }

        const speaker_id = userData.character_id
        const audioBlob: Blob | undefined = await synthesizeVoice(feedbackText, speaker_id);

        return audioBlob    
    } catch (error) {
        console.error("音声合成エラー:", error);
        alert("音声合成に失敗しました。");
    }
  }

  // 実行関数 
  const handleSynthesis = async () => {
    if (!inputText || isProcessing) return; 

    const currentText = inputText; // 実行時のテキストを保持
    setIsProcessing(true); // 処理開始
    setAudioData(undefined); // 古い再生データをクリア

    // テキストをログに表示
    setChatLog(prevLog => [...prevLog, currentText]); 
    // textareaをクリア
    setInputText('')

    // フィードバック作成
    const feedbackText = await handleTextFeedback(currentText);

    //音声データ作成
    if (feedbackText) {
      // フィードバックをログに表示
      setChatLog(prevLog => [...prevLog, feedbackText]); 

      // audioBlobを作成
      const audioBlob = await CreateAudioBlob(feedbackText)

      if (audioBlob) {
        // 1. 音声データセット
        setAudioData(audioBlob);
      }
    };
    
    setIsProcessing(false); // 処理終了
  };

  // キャラクター情報を取得
  const currentCharacter = userData
    ? CHARACTER_OPTIONS.find(char => char.id === userData.character_id)
    : null;

  if (isLoading || !userData) { 
    // ★ userData が null の場合もここでガードできます
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading or User Data Not Found...</p>
        {/* または、ログインページへのリダイレクトなど */}
      </div>
    );
  }

  // ログ保存
    const handleSave = async () => {
    if (chatLog.length === 0) {
      return;
    }

    const progressData : ChatlogProps = {
      chat_id: uuidv4(),
      user_id: userData.user_id,
      chatlog: chatLog,
      created_at: new Date().toISOString()
    };

    setIsSaving(true);

    try {
      // Supabase テーブル名は chat_logs と仮定
      await addProgressLog(progressData)
    } catch (err: any) {
      console.error("保存エラー:", err);
    } finally {
      setIsSaving(false);
    }
  };

  //ログをクリア
  const handleClear = () =>{
    setChatLog([]);
  }

  // キャラクターごとの背景色設定
const theme = currentCharacter
  ? { bg: currentCharacter.bg, accent: currentCharacter.accent } // 見つかった場合
  : { bg: 'bg-gray-50', accent: 'bg-gray-200 border-gray-400' }

  return (
    <div className={`min-h-content ${theme.bg} mb-10 pb-5`}>
      <div className='max-w-4xl mx-auto p-4'>
        
        {/* 会話ログ表示 */}
        <div className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-white'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
              <span className='mr-3 text-3xl'>💬</span>
              会話ログ
            </h2>
            
            {/* ボタンエリア */}
            <div className='flex gap-2'>
              <button 
                className='py-2 px-4 text-sm font-bold text-white bg-gradient-to-r from-red-400 to-pink-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100'
                onClick={handleClear}
                disabled={chatLog.length === 0 || isSaving} 
              >
                🗑️ クリア
              </button>

              <button 
                className='py-2 px-4 text-sm font-bold text-white bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100'
                onClick={handleSave}
                disabled={chatLog.length === 0 || isSaving} 
              >
                {isSaving ? '💾 保存中...' : '💾 保存'}
              </button>
            </div>
          </div>
          
          <div className='flex gap-6 items-start'>
            {/* キャラクター立ち絵 */}
            {currentCharacter && (
              <div className='flex-shrink-0 hidden lg:block relative h-[calc(100vh-28rem)] min-h-[450px] max-h-[700px] w-[350px] overflow-hidden'>
                <div className='absolute -bottom-20 left-0'>
                  <Image
                    src={`/img/${currentCharacter.name}.png`}
                    alt={currentCharacter.name}
                    width={350}
                    height={525}
                    className='object-contain object-bottom'
                  />
                </div>
              </div>
            )}

            {/* 会話エリア */}
            <div className='flex-1 space-y-6 max-h-[calc(100vh-28rem)] min-h-[450px] overflow-y-auto pr-2 custom-scrollbar'>
              {chatLog.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-400 mb-6'>まだ会話がありません。下のテキストボックスから話しかけてみましょう！</p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* 会話ログ */}
                  {chatLog.map((log, index) => {
                    const isUser = index % 2 === 0;
                    return (
                      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%]`}>
                          <div className={`rounded-2xl p-4 shadow-md ${
                            isUser 
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' 
                              : `${theme.accent} text-gray-800 border-2`
                          }`}>
                            <p className='text-sm font-semibold mb-1 opacity-80'>
                              {isUser ? 'あなた' : currentCharacter?.name}
                            </p>
                            <p className='leading-relaxed'>{log}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* オーディオプレイヤー（非表示） */}
        <div className='hidden'>
          <AudioPlayer audioData={audioData} isProcessing={isProcessing} />
        </div>
      </div>

      {/* 入力エリア（固定フッター） */}
      <div className='fixed bottom-30 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-2xl border-t-2 border-gray-200 z-50'>
        <div className='max-w-4xl mx-auto p-4'>
          <div className='flex gap-3 items-center'>
            <textarea 
              className='flex-1 min-h-[2.8rem] max-h-[12rem] p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-none text-base'
              value={inputText}
              onChange={
                (e: ChangeEvent<HTMLTextAreaElement>) => {
                    setInputText(e.target.value);
                    setAudioData(undefined); 

                    // テキストエリアの高さを自動調整
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 12 * 16)}px`;
                }
              }
              placeholder={`${currentCharacter?.name}に話しかける...`}
              disabled={isProcessing}
            />
            
            <button 
              className='h-14 px-8 text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap'
              onClick={handleSynthesis}
              disabled={!inputText || isProcessing} 
            >
              {isProcessing ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
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
  )
}

export default Chat