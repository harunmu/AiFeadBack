import React from 'react';

// 💡 重要な点: 相対パス '../' は、Start.tsxの親ディレクトリを参照します。
// Signin.tsxが Start.tsxと同じディレクトリにある場合は './Signin' に変更してください。
// ts(2307)エラー対策として、ここでは拡張子を省略しています。（Next.js/Reactの標準的な書き方）
import SignInForm from './Signin';
import Login from './Login';
import { useRouter } from 'next/navigation';

/**
 * アプリケーションの開始点となるコンポーネントです。
 * サインインフォームを表示します。
 */


const Start: React.FC = () => {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to AiFeedback!</h1>
      <div className="flex gap-6">
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          ログイン
        </button>
        <button
          onClick={() => router.push("/signin")}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          サインイン
        </button>
      </div>
    </main>
  );
};

export default Start;