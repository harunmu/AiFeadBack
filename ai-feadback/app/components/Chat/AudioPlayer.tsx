import React from 'react';

interface AudioPlayerProps{
  audioData: Blob | undefined;
  isProcessing: boolean;
};

/**
 * 合成された音声データを自動再生するための非表示コンポーネント
 */
const AudioPlayer = ({ audioData, isProcessing }: AudioPlayerProps) => {

  if (!audioData || isProcessing) {
    return null;
  }

  // BlobデータをURLに変換して、audioタグに渡す
  const audioSrc = window.URL.createObjectURL(audioData);

  return (
    <audio
      hidden // UIには表示しない
      autoPlay // 自動再生する
      src={audioSrc}
    />
  );
};

export default AudioPlayer;