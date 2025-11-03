/**
 * geminiUtils.ts
 * Gemini API呼び出しに関する処理を集約
 */

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
    Text: string,
    GEMINI_API_KEY: string,
    API_URL: string
): Promise<string | null> => {
    const systemPrompt =
        "あなたは世界トップクラスの教育者です。対象は高校生、大学生として提供された文書またはテキストを詳しく解析し、改善点と良かった点を親しみやすいトーンで150字程度で一つの文章として語り口調でフィードバックしてください。\nこのテキストの出来を内容に応じてフィードバックしたり、たくさん褒めたり、けなしたりしてください。このとき、この文章を読み上げるので、しゃべり口調でお願いします。項目を分けずに、１つの文章としてお願いします。\n\n---\n";

    const payload = {
        contents: [{ role: "user", parts: Text }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
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
