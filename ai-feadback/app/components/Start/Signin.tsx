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
    await addUser(userData);

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
    <div className="w-full max-w-xl">
      <div className="bg-[#fbfbfbdd] backdrop-blur-md rounded-3xl shadow-2xl py-12 px-10 space-y-6 border-2 border-green-200">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2 shadow-md">
            <span className="text-3xl">🍃</span>
          </div>
          <h2 className="text-3xl font-bold text-green-700">サインイン</h2>
          <p className="text-gray-500 text-sm">アカウント情報を入力してください</p>
        </div>

        {/* 入力フォーム */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              ユーザーネーム
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="ユーザーネームを入力"
              className="block w-full pl-3 pr-3 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="4桁以上の数字"
              className={`block w-full pl-3 pr-3 py-3 border-2 rounded-xl focus:ring-2 transition-all duration-200 ${
                passwordError && password
                  ? 'border-red-400 focus:ring-red-500'
                  : 'border-green-300 focus:ring-green-400 focus:border-green-400'
              }`}
            />
            {passwordError && password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                ⚠ {passwordError}
              </p>
            )}
            {!passwordError && password && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                ✓ パスワードは有効です
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className={`w-full px-8 py-4 rounded-full font-extrabold text-xl text-white transition-all duration-200 ${
                isFormValid
                  ? 'bg-emerald-500 hover:bg-white hover:text-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              {isFormValid ? '次へ →' : '入力内容を確認してください'}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
            className="w-full text-emerald-400 bg-white px-8 py-4 rounded-full font-extrabold text-xl shadow-lg  hover:text-white hover:bg-emerald-400 hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              
            >
              ← 戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInForm;