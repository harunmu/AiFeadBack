import Image from "next/image";
import Start from "./components/Start";
import Calendar from "./components/Calendar";
import Login from "./components/Login";


export default function Home() {

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black font-sans">
       <Login />
       <Start />
    </main>
  );
}
