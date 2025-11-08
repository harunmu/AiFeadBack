'use client';

import { useRouter } from "next/navigation";
import { useState, memo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState<{ user_id: number; character_id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setUserInfo(null);

    if (!userName || !password) {
      setError('ユーザー名とパスワードを入力してください');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, password, character_id')
        .eq('user_name', userName)
        .single();

      if (error || !data) {
        setError('ユーザーが見つかりません');
        return;
      }

      if (data.password !== password) {
        setError('パスワードが違います');
        return;
      }

      setUserInfo({ user_id: data.user_id, character_id: data.character_id });
      localStorage.setItem("user", JSON.stringify({
        user_id: data.user_id,
        character_id: data.character_id,
        user_name: userName,
      }));

      router.push('/chat'); 
    } catch (err) {
      console.error('ログイン中にエラー:', err);
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md 
                    rounded-3xl shadow-2xl p-8 border-2 border-green-200">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">ログイン</h2>
      
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="ユーザー名"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border-2 border-green-300 rounded-xl p-3 
                     focus:outline-none focus:ring-2 focus:ring-green-400 
                     focus:border-green-400 transition-all duration-200"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 border-green-300 rounded-xl p-3 
                     focus:outline-none focus:ring-2 focus:ring-green-400 
                     focus:border-green-400 transition-all duration-200"
        />

        <button
          onClick={handleLogin}
          className="py-3 font-bold text-white 
                     bg-gradient-to-r from-green-400 to-emerald-500 
                     rounded-xl shadow-lg hover:shadow-xl hover:scale-105 
                     transition-all duration-200"
        >
          ログイン
        </button>
        <button
          onClick={() => router.push("/")}
          className="py-3 font-bold text-white 
                     bg-gradient-to-r from-lime-400 to-green-600 
                     rounded-xl shadow-lg hover:shadow-xl hover:scale-105 
                     transition-all duration-200"
        >
          ← 戻る
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-4 text-center font-semibold">❌ {error}</p>
      )}
      {userInfo && (
        <div className="mt-4 bg-green-100 p-3 rounded-xl text-center">
          <p className="font-bold text-green-700">✅ ログイン成功！</p>
          <p className="text-sm text-gray-700">user_id: {userInfo.user_id}</p>
          <p className="text-sm text-gray-700">character_id: {userInfo.character_id}</p>
        </div>
      )}
    </div>
  );
};

export default memo(Login);