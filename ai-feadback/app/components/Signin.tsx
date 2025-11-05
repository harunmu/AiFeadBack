"use client"

import { useRouter } from "next/navigation";
import React, { useState, useCallback, useMemo } from 'react';
import { addUser } from '../../config/api';
import { UserProps } from '../../config/type';

// キャラクターとそのIDの定義
interface Character {
  id: number;
  name: string;
  color: string;
}

const CHARACTERS: Character[] = [
  { id: 1, name: 'キャラクター1', color: 'from-orange-400 to-red-400' },
  { id: 2, name: 'キャラクター2', color: 'from-blue-400 to-purple-400' },
  { id: 3, name: 'キャラクター3', color: 'from-pink-400 to-rose-400' },
];

/**
 * パスワードのバリデーション関数
 * @param password - 入力されたパスワード
 * @returns - エラーメッセージ、問題なければnull
 */
const validatePassword = (password: string): string | null => {
  if (password.length < 4) {
    return 'パスワードは4文字以上で入力してください。';
  }
  // 数字のみで構成されているか、かつ4文字以上かの正規表現
  if (!/^\d+$/.test(password)) {
    return 'パスワードは数字のみで入力してください。';
  }
  return null;
};

const SignInForm: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedCharId, setSelectedCharId] = useState<number>(CHARACTERS[0].id);

  // エラーメッセージを格納
  const passwordError = useMemo(() => validatePassword(password), [password]);

  // 全ての入力が有効かどうかの判定
  const isFormValid = useMemo(() => {
    return username.trim().length > 0 && passwordError === null;
  }, [username, passwordError]);

  const handleSignIn = useCallback(async (event: React.FormEvent) => {
    event.preventDefault(); 

    if (!isFormValid) {
      return;
    }

    // addUserに渡すデータオブジェクトを作成 (UserProps型に準拠)
    const userData: UserProps = {
      user_name: username,
      password: password,
      character_id: selectedCharId,
    };

    // try {
      // ユーザー登録（またはサインイン）処理を実行
      const result = await addUser(userData);
      
    //   if (result.success) {
    //     console.log('success')
    //   } 
    // } catch (error) {
    //   console.error('サインイン処理中に予期せぬエラーが発生:', error);
    // }
  }, [username, password, selectedCharId, isFormValid]);

  const selectedChar = CHARACTERS.find(c => c.id === selectedCharId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-2">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">サインイン</h2>
            <p className="text-gray-500 text-sm">アカウント情報を入力してください</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                ユーザーネーム
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="ユーザーネームを入力"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="4桁以上の数字"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 transition-all outline-none ${
                    passwordError && password ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
              </div>
              {passwordError && password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">⚠</span> {passwordError}
                </p>
              )}
              {!passwordError && password && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="text-green-500">✓</span> パスワードは有効です
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                キャラクター選択
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharId(char.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedCharId === char.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 text-center">
                        {char.name}
                      </span>
                    </div>
                    {selectedCharId === char.id && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedChar && (
                <div className={`mt-2 p-3 rounded-lg bg-gradient-to-r ${selectedChar.color} bg-opacity-10 border border-opacity-20`}>
                  <p className="text-sm text-center text-gray-700">
                    選択中: <span className="font-semibold">{selectedChar.name}</span> (ID: {selectedCharId})
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="button"
                onClick={handleSignIn}
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isFormValid ? 'サインイン' : '入力内容を確認してください'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                ← 戻る
              </button>
            </div>
          </div>

        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          初めてのご利用ですか? アカウントを作成してください
        </p>
      </div>
    </div>
  );
};

export default SignInForm;