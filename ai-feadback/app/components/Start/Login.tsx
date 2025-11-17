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
    <div className="w-full max-w-xl bg-white/90 backdrop-blur-md
                    rounded-3xl shadow-2xl py-12 px-10 border-2 border-green-200">
      <div className="text-center space-y-2 mb-5">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2 shadow-md">
          <span className="text-3xl">🍃</span>
        </div>
        <h2 className="text-3xl font-bold text-green-700">ログイン</h2>
        <p className="text-gray-500 text-sm">アカウント情報を入力してください</p>
      </div>
      
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
          className="border-2 border-green-300 rounded-xl p-3 mb-5
                     focus:outline-none focus:ring-2 focus:ring-green-400 
                     focus:border-green-400 transition-all duration-200"
        />

        <button
          onClick={handleLogin}
          className="w-full text-white bg-emerald-400 px-8 py-4 rounded-full font-extrabold text-xl shadow-lg   hover:bg-emerald-500 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"

        >
          ログイン →
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full text-emerald-600 bg-white px-8 py-4 rounded-full font-extrabold text-xl shadow-lg  hover:text-white hover:bg-emerald-600 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
        >
          ← 戻る
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-4 text-center font-semibold">❌ {error}</p>
      )}
    </div>
  );
};

export default memo(Login);