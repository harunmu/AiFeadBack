// ai-feedback/app/page.tsx

import { getProgressLogs } from "../api";
import Memorize from "./memorize";

export default async function Home() {
  const logs = await getProgressLogs( "2025-11-03" );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to AiFeedback!</h1>
        <Memorize />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">📜 Process Logs</h2>
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <ul className="space-y-3">
            {logs.map((log: any, index: number) => {
              console.log(log);
              return (
                <li key={log.chat_id || index} className="border p-3 rounded-lg shadow">
                  <p>🧩 chat_id: {log.chat_id}</p>
                  <p>📝 user_id: {JSON.stringify(log.user_id)}</p>
                  <p>🖼️ chatlog: {JSON.stringify(log.chatlog)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}