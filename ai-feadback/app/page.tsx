import Image from "next/image";
import Start from "./components/Start";
import Calendar from "./components/Calendar";
import LogPreview from "./components/LogPreview";
import Chat from "./components/Chat";

export default function Home() {
  return (
    <main >
       < LogPreview />   
      < Chat/>
    <main>

  );
}
