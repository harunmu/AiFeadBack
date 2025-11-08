"use client"

import { useRouter } from "next/navigation";
import React, { useState, useCallback, useMemo } from 'react';
import { addUser } from '../../../config/api';
import { UserProps } from '../../../config/type';
import { v4 as uuidv4 } from 'uuid';
import CharacterSelection from './CharacterSelection';


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
  const [step, setStep] = useState<1 | 2>(1); // 1: ユーザー情報入力, 2: キャラクター選択
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedCharId, setSelectedCharId] = useState<number | null>(null);

  // エラーメッセージを格納
  const passwordError = useMemo(() => validatePassword(password), [password]);

  // 全ての入力が有効かどうかの判定
  const isFormValid = useMemo(() => {
    return username.trim().length > 0 && passwordError === null;
  }, [username, passwordError]);

  // ステップ1: ユーザー情報入力後に次へ進む
  const handleNext = useCallback(() => {
    if (isFormValid) {
      setStep(2);
    }
  }, [isFormValid]);

  // ステップ2: キャラクター選択後にサインイン完了
  const handleCharacterSelect = useCallback(async (characterId: number) => {
    setSelectedCharId(characterId);

    // addUserに渡すデータオブジェクトを作成 (UserProps型に準拠)
    const userData: UserProps = {
      user_id: uuidv4(),
      user_name: username,
      password: password,
      character_id: characterId,
    };

    localStorage.setItem("user", JSON.stringify({
      user_id: userData.user_id,
      user_name: userData.user_name,
      character_id: userData.character_id,
    }));

    // ユーザー登録（またはサインイン）処理を実行
    const result = await addUser(userData);

    router.push("/chat");
  }, [username, password, router]);

  // キャラクター選択から戻る
  const handleBackToStep1 = useCallback(() => {
    setStep(1);
  }, []);

  // ステップ2: キャラクター選択画面
  if (step === 2) {
    return <CharacterSelection onSelect={handleCharacterSelect} onBack={handleBackToStep1} />;
  }

  // ステップ1: ユーザー情報入力画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full min-w-xl">
        <div className="bg-white rounded-2xl shadow-xl py-16 px-32 space-y-6">
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

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleNext}
                disabled={!isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isFormValid ? '次へ →' : '入力内容を確認してください'}
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
      </div>
    </div>
  );
};
export default SignInForm;