/**
 * geminiUtils.ts
 * Gemini API呼び出しに関する処理を集約
 */

'use server';

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化（環境変数から読み込む）
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

            // const base64Data = await fileToBase64(selectedFile);
            // const mimeType = selectedFile.type || 'text/plain';
            // const contents = [
            //     { inlineData: { mimeType, data: base64Data } }
            // ];

export const generateFeedback = async (
    userId: string,
    Text: string,
    GEMINI_API_KEY: string,
    API_URL: string
): Promise<string | null> => {
    const promptpath = path.join(process.cwd(), 'prompts', 'geminiPrompt.txt');
    const systemPrompt = fs.readFileSync(promptpath, 'utf-8');

    //supabaseから最新のprogress_logを取得
    const { data, error } = await supabase
        .from('progress_logs')
        .select('chatlog')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5); // 直近5件を取得（必要に応じて調整）
    if (error) {
        console.error("Error fetching progress_logs for Gemini prompt:", error.message);
        return null;
    }

    // チャットログ配列を結合してテキストに
    const allLogs = data
        ?.map(entry => `【チャットログ】\n${entry.chatlog.join('\n')}`)
        .join('\n------\n') || '（まだ記録がありません）';


    // ④ systemPrompt の {{chatlog}} を置換
    const fullPrompt = systemPrompt
    .replace('{{chatlog}}', allLogs)
    .replace('{{input}}', Text);

    const payload = {
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    };

    const maxRetries = 3;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            if (!GEMINI_API_KEY) {
                alert("APIキーが設定されていません (NEXT_PUBLIC_GEMINI_API_KEY)。");
                return null;
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API returned status ${response.status}: ${JSON.stringify(errorBody)}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
            else throw new Error("Gemini response was successful, but text content is empty.");
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt + 1} failed. Retrying...`, error);
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    console.error("Gemini API call failed after all retries.", lastError);
    return null;
};
