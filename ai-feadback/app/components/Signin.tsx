"use client"

import React, { useState, useCallback, useMemo } from 'react';
import { addUser } from '../api';
import { UserProps } from '../type';
// 💡 注意: このコードを動作させるには、
// 以下のクラス名に対応するCSSファイルを別途用意し、インポートする必要があります。
// 例: import './signin.css';

// キャラクターとそのIDの定義
interface Character {
  id: number;
  name: string;
}

const CHARACTERS: Character[] = [
  { id: 1, name: 'キャラクター1' },
  { id: 2, name: 'キャラクター2' },
  { id: 3, name: 'キャラクター3' },
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
  return null; // エラーなし
};

const SignInForm: React.FC = () => {
  // ステートの定義
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedCharId, setSelectedCharId] = useState<number>(CHARACTERS[0].id); // デフォルトで最初のキャラクターを選択

  // エラーメッセージを格納
  const passwordError = useMemo(() => validatePassword(password), [password]);

  // 全ての入力が有効かどうかの判定
  const isFormValid = useMemo(() => {
    return username.trim().length > 0 && passwordError === null;
  }, [username, passwordError]);

  // サインイン処理
const handleSignIn = useCallback(async (event: React.FormEvent) => {
    event.preventDefault(); 

    if (!isFormValid) {
      return;
    }

    // addUserに渡すデータオブジェクトを作成 (UserProps型に準拠)
    const userData: UserProps = {
      user_name: username, // 'user_naem' を 'user_name' に修正します
      password: password,
      character_id: selectedCharId,
    };

    // try {
      // ユーザー登録（またはサインイン）処理を実行
      const result = await addUser(userData);
      
    //   if (result.success) {
    //     // 成功時のフォームリセットはここでは行いません
    //     console.log('success')
    //   } 
    // } catch (error) {
    //   console.error('サインイン処理中に予期せぬエラーが発生:', error);
    // }
  }, [username, password, selectedCharId, isFormValid]);

  // クラス名の動的な結合
  const buttonClassName = `button ${isFormValid ? 'button-enabled' : 'button-disabled'}`;

  return (
    // 💡 クラス名 (container) を適用
    <div className="container">
      <h2 className="heading">サインイン</h2>
      <form onSubmit={handleSignIn} className="form">
        
        {/* ユーザーネーム入力 */}
        <div className="form-group">
          <label htmlFor="username" className="label">ユーザーネーム:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
          />
        </div>

        {/* パスワード入力 */}
        <div className="form-group">
          <label htmlFor="password" className="label">パスワード (4桁以上の数字):</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>
        
        {/* キャラクター選択 */}
        <div className="form-group">
          <label className="label">キャラクター選択:</label>
          <div className="radio-group">
            {CHARACTERS.map((char) => (
              <label key={char.id} className="radio-label">
                <input
                  type="radio"
                  name="character"
                  value={char.id}
                  checked={selectedCharId === char.id}
                  onChange={() => setSelectedCharId(char.id)}
                  className="radio-button"
                />
                {char.name}
              </label>
            ))}
          </div>
          <p className="char-info">**選択中のキャラID: {selectedCharId}**</p>
        </div>

        {/* サインインボタン */}
        <button 
          type="submit" 
          disabled={!isFormValid}
          // 💡 動的にクラス名を適用
          className={buttonClassName}
        >
          サインイン
        </button>
      </form>
    </div>
  );
};

export default SignInForm;