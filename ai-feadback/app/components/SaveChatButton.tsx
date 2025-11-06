"use client";

import React, { useState } from "react";
import { supabase } from "@/config/supabaseClient"; 
import type { PostgrestError } from "@supabase/supabase-js";
interface SaveChatButtonProps {
  chatLog: string[];
}

const SaveChatButton: React.FC<SaveChatButtonProps> = ({ chatLog }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (chatLog.length === 0) {
      setMessage("⚠️ 保存できるチャットログがありません。");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // Supabase テーブル名は chat_logs と仮定
      const { error } = await supabase.from("chat_logs").insert([
        {
          created_at: new Date().toISOString(),
          log_data: chatLog, // 配列をそのままJSONとして保存
        },
      ]);

      if (error) throw error;

      setMessage("✅ ChatLogをSupabaseに保存しました！");
    } catch (err: any) {
      console.error("保存エラー:", err);
      setMessage("❌ 保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="text-center mt-4">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`px-6 py-3 text-lg font-bold rounded-lg shadow-md transition duration-200 ${
          isSaving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isSaving ? "保存中..." : "💾 ChatLogをSupabaseに保存"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
};

export default SaveChatButton;
