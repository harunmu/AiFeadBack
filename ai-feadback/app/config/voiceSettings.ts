// Voicevox関連の設定ファイル


export const SPEAKER_IDS = {
  ZUNDAMON: 3,     // ずんだもん (ノーマル)
  TUMUGI: 8,    // WhiteCUL (ノーマル)
  MEIMEIHIMARI: 14 // 冥鳴ひまり (ノーマル)
};

export const AUDIO_SETTINGS = {
  SPEED_SCALE: 1.15,
    
  VOLUME_SCALE: 1.7,
};

export const CHARACTER_OPTIONS = [
  { id: SPEAKER_IDS.ZUNDAMON, name: 'ずんだもん', bg: 'bg-gradient-to-br from-green-150 via-emerald-100 to-teal-100', accent: 'bg-green-100 border-green-300', color: 'green', bgButton: 'bg-green-400', textColor: 'text-green-300'},
  { id: SPEAKER_IDS.TUMUGI, name: '春日部つむぎ', bg: 'bg-gradient-to-br from-orange-200 via-yellow-10 to-amber-50', accent: 'bg-orange-100 border-orange-300', color: 'orange', bgButton: 'bg-orange-300', textColor: 'text-orange-300'},
  { id: SPEAKER_IDS.MEIMEIHIMARI, name: '冥鳴ひまり', bg: 'bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100', accent: 'bg-purple-100 border-purple-300', color: 'purple', bgButton: 'bg-purple-300', textColor: 'text-purple-300'},
];