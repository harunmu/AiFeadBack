"use client"

import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioData: Blob | undefined;
  isProcessing: boolean;
}

const AudioPlayer = ({ audioData, isProcessing }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const hasPlayedRef = useRef(false);

  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);

  // ④ audioDataが変わったときのみ新しいURLを生成
  useEffect(() => {
    if (audioData) {
      // 古いURLを解放
      if (audioSrc) {
        window.URL.revokeObjectURL(audioSrc);
      }
      
      const newSrc = window.URL.createObjectURL(audioData);
      setAudioSrc(newSrc);
      
      hasPlayedRef.current = false;
    } else if (audioSrc) {
      window.URL.revokeObjectURL(audioSrc);
      setAudioSrc(undefined);
    }

    return () => {
      if (audioSrc) {
        window.URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioData]);

  // ⑤ audioSrcが設定されたら再生（一度だけ）
  useEffect(() => {
    if (!audioSrc || isProcessing || hasPlayedRef.current) {
      return;
    }

    const audioEl = audioRef.current;
    
    if (audioEl) {
      audioEl.play().then(() => {
          hasPlayedRef.current = true;
      }).catch(error => {
          console.error("Audio playback failed:", error);
      });
    }

  }, [audioSrc, isProcessing]); 

  if (!audioSrc) {
    return null;
  }

  return (
    <audio
      ref={audioRef} // refを設定
      hidden 
      src={audioSrc} // ステートで管理されたURLを渡す
    />
  );
};

export default AudioPlayer;