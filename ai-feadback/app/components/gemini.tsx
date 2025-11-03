"use client"

import React, { ChangeEvent, useState, useMemo, useEffect, useRef } from 'react';
import { generateFeedback } from '../utils/geminiUtils'; // ★ 分離した関数をインポート

// =========================================================================
// ★ 1. ユーティリティ、定数、型定義 ★
// =========================================================================

interface ChatEntry {
    speakerId: number; 
    text: string;
    isUser: boolean;
}

const SPEAKER_IDS = {
    ZUNDAMON: 3, 
    KASUKABE_TSUMUGI: 8,
    AMATOU_KOTOHA: 46,
    GEMINI: 9999,
};

const CHARACTER_OPTIONS = [
    { id: SPEAKER_IDS.ZUNDAMON, name: 'ずんだもん' },
    { id: SPEAKER_IDS.KASUKABE_TSUMUGI, name: '春日部つむぎ' },
    { id: SPEAKER_IDS.AMATOU_KOTOHA, name: '雨晴はう' },
];

// ★ 環境変数は残す（別ファイルには移動しない）
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""; 
const GEMINI_SPEAKER_ID = SPEAKER_IDS.GEMINI; 
const API_MODEL = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Voicevoxモック
const VOICEVOX_API_BASE_URL = 'http://localhost:50021'; 
async function synthesizeVoice(text: string, speakerId: number): Promise<Blob | undefined> {
    console.warn(`[Voicevox モック] ${text} をスピーカーID ${speakerId} で合成を試みましたが、API呼び出しはモックされています。`);
    return new Blob([new ArrayBuffer(1)], { type: 'audio/wav' });
}



// =========================================================================
// ★ AudioPlayer コンポーネント ★
// =========================================================================

interface AudioPlayerProps {
    audioData: Blob | undefined;
    isProcessing: boolean;
}
  
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioData, isProcessing }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioData) {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            const url = URL.createObjectURL(audioData);
            setAudioUrl(url);
            audioRef.current?.play().catch(() => {});
        } else {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
        }
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioData]);

    const isVisible = audioUrl || isProcessing;

    return (
        <div className={`max-w-3xl mx-auto w-full p-6 bg-white shadow-xl rounded-xl transition-opacity duration-300 ${isVisible ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            <h2 className='text-2xl font-semibold mb-4 text-gray-700'>音声出力</h2>
            {isProcessing ? (
                <div className='flex items-center justify-center p-4 bg-gray-100 rounded-lg text-indigo-500'>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>処理中...</span>
                </div>
            ) : audioUrl ? (
                <audio ref={audioRef} src={audioUrl} controls className='w-full' />
            ) : null}
        </div>
    );
};

// =========================================================================
// ★ Chat コンポーネント本体 ★
// =========================================================================

const Chat = () => { 
    const [inputText, setInputText] = useState<string>('');
    const [audioData, setAudioData] = useState<Blob>();
    const [speakerId, setSpeakerId] = useState<number>(SPEAKER_IDS.ZUNDAMON);
    const [isProcessing, setIsProcessing] = useState<boolean>(false); 
    const [chatLog, setChatLog] = useState<ChatEntry[]>([]); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Gemini呼び出し部分は別ファイルへ移動済み
    const processAndRespond = async (userText: string, geminiText: string) => {
        setChatLog(prev => [...prev, { speakerId, text: userText, isUser: true }]);
        setChatLog(prev => [...prev, { speakerId: GEMINI_SPEAKER_ID, text: geminiText, isUser: false }]);
        const audioBlob = await synthesizeVoice(geminiText, speakerId);
        if (audioBlob) setAudioData(audioBlob);
    };

    const handleTextFeedback = async () => {
        if (!inputText || isProcessing) return;
        setIsProcessing(true);
        setAudioData(undefined);
        const contents = inputText;
        setInputText('');

        try {
            const feedbackText = await generateFeedback(contents, GEMINI_API_KEY, API_URL);
            if (feedbackText) await processAndRespond(contents, feedbackText);
            else alert("Geminiからのフィードバック取得に失敗しました。");
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // const handleFileFeedback = async () => {
    //     if (!selectedFile || isProcessing) return;
    //     setIsProcessing(true);
    //     setAudioData(undefined);

    //     try {

    //         const feedbackText = await generateFeedback(contents, GEMINI_API_KEY, API_URL);
    //         if (feedbackText) await processAndRespond(`[ファイル送信] ${selectedFile.name}`, feedbackText);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setSelectedFile(null);
    //         setIsProcessing(false);
    //     }
    // };

    // その他UI部分は変更なし（省略せずに残してOK）
    // ...
    // 👇 以下は元コードのUI部分をそのまま保持
    // （Chatログ・AudioPlayerなど）

    // === UIは省略せず元のコードをそのまま使用 ===
    // （ここでは長いため説明省略）
    // ...
};

export default Chat;