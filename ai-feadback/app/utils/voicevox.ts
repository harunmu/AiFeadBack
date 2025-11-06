// utils.ts

import superagent from 'superagent';
import { AUDIO_SETTINGS } from '../config/voiceSettings';

// Query型定義はそのまま使用します
type Mora = {
  text: string
  consonant: string
  consonant_length: number
  vowel: string
  vowel_length: number
  pitch: number
}

export type Query = {
  accent_phrases: {
    moras: Mora[]
    accent: number
    pause_mora: Mora
  }[]
  speedScale: number
  pitchScale: number
  intonationScale: number
  volumeScale: number
  prePhonemeLength: number
  postPhonemeLength: number
  outputSamplingRate: number
  outputStereo: boolean
  kana: string
}

// ----------------------------------------------------
// 1. クエリ生成関数
// ----------------------------------------------------
/**
 * VoiceVox Engineにテキストを送信し、音声合成のためのクエリデータを取得します。
 * @param text 読み上げたい文章
 * @param speakerId 話者ID
 * @returns Queryオブジェクト、またはエラー時はundefined
 */
export const createAudioQuery = async (text: string, speakerId: number): Promise<Query | undefined> => {
  try {
    const res = await superagent
      .post('http://localhost:50021/audio_query')
      .query({ speaker: speakerId, text: text });
      
    return res.body as Query;
  } catch (error) {
    console.error("Query作成エラー: VoiceVox Engineが起動しているか確認してください。", error);
    alert("Query作成に失敗しました。VoiceVox Engineが起動しているか確認してください。");
    return undefined;
  }
};

// ----------------------------------------------------
// 2. 音声合成関数
// ----------------------------------------------------
/**
 * 取得したクエリデータをもとに、VoiceVox Engineで音声を合成し、Blobデータを取得します。
 * @param query クエリデータ
 * @param speakerId 話者ID
 * @returns 音声Blobデータ、またはエラー時はundefined
 */
export const createSynthesisVoice = async (query: Query, speakerId: number): Promise<Blob | undefined> => {
  const adjustedQuery = {
    ...query, 
    speedScale: AUDIO_SETTINGS.SPEED_SCALE, // 速度を上書き
    volumeScale: AUDIO_SETTINGS.VOLUME_SCALE, // 音量を上書き
  };

  try {
    const res = await superagent
      .post('http://localhost:50021/synthesis')
      .query({ speaker: speakerId }) 
      .send(adjustedQuery)
      .responseType('blob');

    return res.body as Blob;
  } catch (error) {
    console.error("音声合成エラー", error);
    alert("音声合成に失敗しました。CORS設定とEngineの起動状態を確認してください。");
    return undefined;
  }
};

// ----------------------------------------------------
// 3. 統合実行関数
// ----------------------------------------------------
/**
 * クエリ作成から音声合成までを一括で実行します。
 * @param text 読み上げたい文章
 * @param speakerId 話者ID
 * @returns 音声Blobデータ、またはエラー時はundefined
 */
export const synthesizeVoice = async (text: string, speakerId: number): Promise<Blob | undefined> => {
    // 1. クエリ作成
    const queryJson = await createAudioQuery(text, speakerId);

    if (queryJson) {
      // 2. 音声合成
      const audioBlob = await createSynthesisVoice(queryJson, speakerId);
      return audioBlob;
    }
    
    return undefined;
}