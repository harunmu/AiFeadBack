"use client";

import { useState } from "react";
import { addProgressLog } from "../api";

export default function SaveChatExample() {
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const logData = {
      chat_id: "1",
      user_id: "user_test_001",
      chatlog: [
        { "user": "テスト" }, { "assistant": "頑張ったね" }
      ],
    };

    const result = await addProgressLog(logData);
    console.log(result);
    if (result) {
      alert("進捗ログを保存しました！");
      console.log("Saved:", result);
    }
  };

  return (
    <div className="p-6">
      <textarea
        className="border rounded w-full p-2 mb-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="今日の進捗を入力..."
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        会話を保存
      </button>
    </div>
  );
}