import { UserData } from "../../config/type";


export const getUserDataFromLocalStorage = (): UserData | null => {
  // 1. localStorageからキー "user" の値（JSON文字列）を取得
  const userJson = localStorage.getItem("user");

  if (!userJson) {
    // データがない場合は null を返す
    return null; 
  }

  try {
    // 2. JSON文字列を UserData 型としてパース（解析）
    // JSON.parseの結果をUserObject型としてアサーション (型を確定させる)
    const userData = JSON.parse(userJson) as UserData;
    
    // 3. 必要なプロパティが全て存在するか確認する (オプション: 堅牢性のため)
    if (userData.user_id && userData.character_id && userData.user_name) {
        return userData; // 必要なデータが揃っていればオブジェクトを返す
    }
    
    return null; // プロパティが欠けている場合は null を返す

  } catch (e) {
    // 4. JSONのパースエラーが発生した場合
    console.error("Failed to parse user data from localStorage:", e);
    return null;
  }
};