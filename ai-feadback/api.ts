// ai-feedback/api.ts
// ai-feedback/api.ts
import { supabase } from "./config/supabaseClient";

/**
 * 指定した1日分のprogress_logsを取得する関数
 * @param {string} targetDate - "YYYY-MM-DD" 形式（例: "2025-10-31"）
 */
export const getProgressLogs = async (targetDate: string) => {
  // 翌日を計算
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDateStr = nextDay.toISOString().split("T")[0]; // "YYYY-MM-DD"形式に戻す

  // Supabaseクエリ
  const { data, error } = await supabase
    .from("progress_logs")
    .select("*")
    .gte("created_at", `${targetDate}T00:00:00`)
    .lt("created_at", `${nextDateStr}T00:00:00`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching progress_logs:", error.message);
    return [];
  }

  return data;
};

/**
 * 新しいチャットログを追加する関数
 * @param progressData - { chat_id, user_id, chatlog }
 */
export const addProgressLog = async (progressData: {
  chat_id: string;
  user_id: string;
  chatlog: any; // JSON形式で保存
}) => {
  const { data, error } = await supabase.from("progress_logs").insert([progressData]);

  if (error) {
    console.error("Error adding progress_log:", error.message);
    return null;
  }

  return data?.[0];
};
