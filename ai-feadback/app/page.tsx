import Image from "next/image";
import Start from "./components/Start";
import Calendar from "./components/Calendar";

export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
       < Calendar />
       <Start />
    </main>
  );
}
