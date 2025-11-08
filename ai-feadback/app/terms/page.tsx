"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const TermsPage = () => {
  const router = useRouter()

  return (
<div className="min-h-screen bg-gray-50 p-4">
  <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-gray-800">利用規約 / クレジット</h2>

    <div className="space-y-6">

      {/* 1. 音声生成技術クレジット */}
      <section>
        <h3 className="text-xl font-semibold mb-3 border-b pb-1 text-indigo-600">
          音声生成技術
        </h3>
        <p className="text-gray-700">
          このWebページ内の音声は**VOICEVOX**を使用して生成されました。
        </p>
        <p className="mt-2">
          VOICEVOX 公式サイト: 
          <a 
            href="https://voicevox.hiroshiba.jp/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://voicevox.hiroshiba.jp/
          </a>
        </p>
      </section>

      {/* 2. 音声キャラクタークレジット */}
      <section>
        <h3 className="text-xl font-semibold mb-3 border-b pb-1 text-indigo-600">
          使用音声キャラクター
        </h3>
        <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
          <li>VOICEVOX: ずんだもん</li>
          <li>VOICEVOX: 春日部つむぎ</li>
          <li>VOICEVOX: 冥鳴ひまり</li>
          <li>VOICEVOX: WhiteCUL</li>
        </ul>
      </section>

      {/* 3. 立ち絵クレジット */}
      <section>
        <h3 className="text-xl font-semibold mb-3 border-b pb-1 text-indigo-600">
          立ち絵クレジット
        </h3>
        
        {/* 立ち絵の作者様 */}
        <p className="font-medium text-gray-800 mt-4">【作者様】</p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
          <li>
            坂本アヒル様: 
            <a 
              href="https://twitter.com/sakamoto_ahr"
              target="_blank"
              rel="noopener noreferrer" // ★追加
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Twitter (@sakamoto_ahr)
            </a>
          </li>
          <li>
            さよなか様: 
            <a 
              href="https://x.com/316_xxxx"
              target="_blank"
              rel="noopener noreferrer" // ★追加
              className="text-blue-600 hover:text-blue-800 underline"
            >
              X (@316_xxxx)
            </a>
          </li>
        </ul>

        {/* 各キャラクターの立ち絵出典 */}
        <p className="font-medium text-gray-800 mt-4">【キャラクター別 出典】</p>
        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
          <li>
            ずんだもん 立ち絵: 
            <a 
              href="https://seiga.nicovideo.jp/seiga/im10788496"
              target="_blank"
              rel="noopener noreferrer" // ★追加
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ニコニコ静画 (im10788496)
            </a>
          </li>
          <li>
            春日部つむぎ 立ち絵: 
            <a 
              href="https://ext.seiga.nicovideo.jp/seiga/im10849150"
              target="_blank"
              rel="noopener noreferrer" // ★追加
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ニコニコ静画 (im10849150)
            </a>
          </li>
          <li>
            冥鳴ひまり 立ち絵: 
            <a 
              href="https://seiga.nicovideo.jp/seiga/im11542497?track=seiga_illust_keyword"
              target="_blank"
              rel="noopener noreferrer" // ★追加
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ニコニコ静画 (im11542497)
            </a>
          </li>
          <li>
            WhiteCUL 立ち絵: 
            <a 
              href="https://seiga.nicovideo.jp/seiga/im11232248"
              target="_blank"
              rel="noopener noreferrer" // ★追加
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ニコニコ静画 (im11232248)
            </a>
          </li>
        </ul>
      </section>

    </div>
  </div>
</div>
  )
}

export default TermsPage
