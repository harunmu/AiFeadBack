import React from 'react';

// 💡 重要な点: 相対パス '../' は、Start.tsxの親ディレクトリを参照します。
// Signin.tsxが Start.tsxと同じディレクトリにある場合は './Signin' に変更してください。
// ts(2307)エラー対策として、ここでは拡張子を省略しています。（Next.js/Reactの標準的な書き方）
import SignInForm from './Signin';

/**
 * アプリケーションの開始点となるコンポーネントです。
 * サインインフォームを表示します。
 */
const Start: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* 画面中央にサインインフォームを配置 */}
      <SignInForm />
    </div>
  );
};

export default Start;