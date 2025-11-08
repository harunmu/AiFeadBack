"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * アプリケーションの開始点となるコンポーネントです。
 * ずんだもんをメインビジュアルとして表示し、認証への導線を提供します。
 */

// ずんだもんのテーマ情報
const ZUNDAMON_THEME = {
  name: "ずんだもん",
  image: "ずんだもん.png",
  // 背景を単色（薄い黄緑）に統一
  bg: 'bg-green-100', 
};

const Start: React.FC = () => {
  const router = useRouter();

  return (
    <main className={`flex flex-col items-center justify-center min-h-screen ${ZUNDAMON_THEME.bg} p-4 overflow-hidden`}>
      
      {/* 🚨 背景の装飾は変更なし */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* ブラー要素 */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-52 h-52 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>


      {/* カードUI */}
      <div className="scale-110 relative max-w-lg w-full bg-[#f2f2f2a2] backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-green-300/70 p-8 animate-fade-in-up z-10">
        
        {/* タイトル */}
        <h1 className="text-4xl font-black text-center mb-6 text-gray-800 animate-bounce-in font-rounded">
          ずんだもんといっしょ
          <span role="img" aria-label="sparkles" className='ml-2 inline-block'></span>
        </h1>
        
        {/* ずんだもんイラスト */}
        <div className='flex justify-center my-8 animate-float'>
          <div className='relative w-[220px] h-[320px]'> 
            <Image
              src={`/${ZUNDAMON_THEME.image}`}
              alt={ZUNDAMON_THEME.name}
              layout="fill"
              objectFit="contain"
              className="object-bottom filter drop-shadow-2xl shadow-green-300/80"
            />
          </div>
        </div>

        {/* テキストブロック */}
        <div className="text-center text-gray-700 mb-8 text-lg animate-fade-in animation-delay-1000">
          ずんだもんたちがあなたの会話を、もっと楽しくサポートします！
        </div>
        
        {/* --- 認証・テストボタンエリア --- */}
        <div className="flex flex-col gap-5 animate-fade-in-up animation-delay-1500">
          
          {/* 1. ログイン 🚨 修正箇所: text-white -> text-gray-800 */}
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gray-100 text-green-500 px-8 py-4 rounded-full font-extrabold text-xl shadow-lg hover:text-white hover:bg-green-500  hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            ログイン
          </button>
          
          {/* サインイン */}
          <button
            onClick={() => router.push("/signin")}
            className="w-full text-emerald-400 bg-gray-100 px-8 py-4 rounded-full font-extrabold text-xl shadow-lg  hover:text-white hover:bg-emerald-400 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            サインイン
          </button>
          
        </div>
      </div>

      {/* Tailwind CSSとカスタムKeyframes定義 */}
      <style jsx global>{`
        /* 🚨 丸みを帯びたフォントの候補 */
        @font-face {
          font-family: 'RoundedMplus';
          font-weight: 900;
          font-style: normal;
        }

        .font-rounded {
          font-family: 'RoundedMplus', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
        }
        
        /* ... アニメーションのkeyframesは省略 ... */
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-bounce-in { animation: bounce-in 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </main>
  );
};

export default Start;