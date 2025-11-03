"use client"

import React, { ChangeEvent, useState } from 'react';
// utilsファイルから関数と型をインポート
import { synthesizeVoice } from '../utils/voicevox'; 
import { CHARACTER_OPTIONS, SPEAKER_IDS } from '../config/voiceSettings';
import AudioPlayer from './AudioPlayer';

const Chat = () => { 

  const [inputText, setInputText] = useState<string>('');
  const [audioData, setAudioData] = useState<Blob>();
  const [speakerId, setSpeakerId] = useState<number>(SPEAKER_IDS.ZUNDAMON);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); 
  // ★ 新しいchat_logステートを追加
  const [chatLog, setChatLog] = useState<string[]>([]); 

  // ★ 統合された実行関数 ★
  const handleSynthesis = async () => {
    if (!inputText || isProcessing) return; 

    const currentText = inputText; // 実行時のテキストを保持
    setIsProcessing(true); // 処理開始
    setAudioData(undefined); // 古い再生データをクリア

    // utils.tsの統合関数を呼び出し
    const audioBlob = await synthesizeVoice(currentText, speakerId);

    if (audioBlob) {
      // 成功した場合: 
      // 1. 音声データセット（自動再生がトリガーされる）
      setAudioData(audioBlob);
      // 2. chatLogにテキストを追加 ★
      setChatLog(prevLog => [...prevLog, currentText]); 
      // 3. textareaをクリア
      setInputText('')
    }
    
    setIsProcessing(false); // 処理終了
  };

  // キャラクター選択時のボタンのスタイル制御
  const getSpeakerButtonClass = (id: number) => {
    const baseClasses = 'px-4 py-2 font-semibold rounded-lg transition duration-150';
    if (speakerId === id) {
      return `${baseClasses} bg-blue-500 text-white shadow-md`;
    }
    return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-blue-100`;
  };


  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 space-y-8'>
      
      {/* 読み上げたい文章を入力セクション */}
      <div className='max-w-3xl mx-auto w-full text-center p-6 bg-white shadow-lg rounded-xl'>
        
        {/* キャラクター選択ボタン群 */}
        <div className='flex justify-around space-x-2 mb-6'>
          {CHARACTER_OPTIONS.map((char) => (
            <button
              key={char.id}
              className={getSpeakerButtonClass(char.id)}
              onClick={() => {
                setSpeakerId(char.id);
                setAudioData(undefined); 
              }}
              disabled={isProcessing}
            >
              {char.name}
            </button>
          ))}
        </div>
        
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
      <div className='max-w-3xl mx-auto w-full text-center p-6 bg-white shadow-lg rounded-xl'>
        <button 
          className='w-full h-20 text-xl font-bold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-200 disabled:opacity-50'
          onClick={handleSynthesis}
          disabled={!inputText || isProcessing} 
        >
          {isProcessing ? '処理中...' : '再生'}
        </button>
      </div>

      {/* ★ chat_log 表示セクションの追加 ★ */}
      {chatLog.length > 0 && (
        <div className='max-w-3xl mx-auto w-full p-6 bg-white shadow-lg rounded-xl'>
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
        </div>
      )}

      <AudioPlayer audioData={audioData} isProcessing={isProcessing} />

    </div>
  )
}

export default Chat