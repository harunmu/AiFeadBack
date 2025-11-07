'use client';

import { useRouter } from "next/navigation";
import { useState, memo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化（環境変数から読み込む）
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
      // usersテーブルから一致するユーザーを検索
      const { data, error } = await supabase
        .from('users')
        .select('user_id, password, character_id')
        .eq('user_name', userName)
        .single();

      if (error || !data) {
        setError('ユーザーが見つかりません');
        return;
      }

      // パスワード照合（平文比較）
      if (data.password !== password) {
        setError('パスワードが違います');
        return;
      }

      // ログイン成功
      setUserInfo({ user_id: data.user_id, character_id: data.character_id });
      // ログイン情報を localStorage に保存
      localStorage.setItem("user", JSON.stringify({
      user_id: data.user_id,
      character_id: data.character_id,
      user_name: userName,
      }));
      console.log('ログイン成功:', { user_id: data.user_id, character_id: data.character_id });
      // 必要に応じてリダイレクトなどの処理を追加
      // router.push('/dashboard'); // 例: ダッシュボードページへリダイレクト

    } catch (err) {
      console.error('ログイン中にエラー:', err);
      setError('ログインに失敗しました');
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-3">Login</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="ユーザー名"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          ログイン
        </button>
        <button
        onClick={() => router.push("/")}
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        ← 戻る
      </button>
      </div>

      {/* 結果表示 */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {userInfo && (
        <div className="mt-3 bg-green-100 p-2 rounded">
          <p>✅ ログイン成功！</p>
          <p>user_id: {userInfo.user_id}</p>
          <p>character_id: {userInfo.character_id}</p>
        </div>
      )}
    </div>
  );
};

export default memo(Login);
