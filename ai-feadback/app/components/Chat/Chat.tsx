"use client"

import React, { ChangeEvent, useState, useEffect } from 'react';
// utilsファイルから関数と型をインポート
import SaveChatButton from "./SaveChatButton";
import { synthesizeVoice } from '../../utils/voicevox';
import AudioPlayer from './AudioPlayer';
import { generateFeedback } from '../../utils/geminiUtils';
import { UserData } from '@/config/type';
import { CHARACTER_OPTIONS } from '@/app/config/voiceSettings';
import Image from 'next/image';

interface ChatProps {
  initialChatLog?: string[];
}

const Chat = ({ initialChatLog = [] }: ChatProps) => {

  const [inputText, setInputText] = useState<string>('');
  // const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Blob>()
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [chatLog, setChatLog] = useState<string[]>(initialChatLog);

  // initialChatLogが変更された時にchatLogを更新
  useEffect(() => {
    if (initialChatLog.length > 0) {
      setChatLog(initialChatLog);
    }
  }, [initialChatLog]);

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

  // ユーザー情報を格納
  const userData : UserData | null = getUserDataFromLocalStorage();

  // キャラクター情報を取得
  const currentCharacter = userData
    ? CHARACTER_OPTIONS.find(char => char.id === userData.character_id)
    : null;

  return (
    <div className='relative flex items-center justify-center min-h-screen bg-gray-50 p-4'>

      {/* メインコンテンツエリア（中央配置） */}
      <div className='flex flex-col items-center space-y-8 w-full max-w-3xl z-(-1)'>

        {/* 読み上げたい文章を入力セクション */}
        <div className='w-full text-center p-6 bg-white shadow-lg rounded-xl'>
          
          <textarea 
            className='w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 resize-none'
            value={inputText}
            onChange={
              (e: ChangeEvent<HTMLTextAreaElement>) => {
                  setInputText(e.target.value);
                  setAudioData(undefined); 
              }
            }
            placeholder={`文章を入力してください`}
            disabled={isProcessing}
          />
        </div>

        {/* 実行ボタンセクション */}
        <div className='w-full text-center p-6 bg-white shadow-lg rounded-xl'>
          <button 
            className='w-full h-20 text-xl font-bold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-200 disabled:opacity-50'
            onClick={handleSynthesis}
            disabled={!inputText || isProcessing} 
          >
            {isProcessing ? '処理中...' : '実行'}
          </button>
        </div>

        {/* ★ chat_log 表示セクションの追加 ★ */}
          <div className='w-full p-6 bg-white shadow-lg rounded-xl'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-700'>テキストログ</h2>
            <div className='max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2'>
              {/* ログを新しい順に表示するため reverse() を使用し、mapの前に適用 */}
              {chatLog.slice().map((log, index) => (
                <p 
                  key={chatLog.length - 1 - index} 
                  className='p-2 bg-gray-50 border-l-4 border-indigo-500 text-gray-800 text-left rounded'
                >
                  <span className='font-bold text-sm text-indigo-600 mr-2'>[{chatLog.length - index}]</span>
                  {log}
                </p>
              ))}
            </div>
            <SaveChatButton user_id={userData!.user_id} chatlog={chatLog} />
          </div>
        

          <AudioPlayer audioData={audioData} isProcessing={isProcessing} />
      </div>

      {/* キャラクター立ち絵セクション（画面右側に固定配置） */}
      {currentCharacter && (
        <div className='hidden lg:block absolute right-8 top-1/2 -translate-y-1/2'>
          <div className='flex flex-col items-center'>
            <Image
              src={currentCharacter.image}
              alt={currentCharacter.name}
              width={500}
              height={600}
              className='object-contain'
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat