"use client";

import { useRouter } from "next/navigation";
import Start from './components/Start/Start';

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="bg-[#d74949a2]">
      <Start />
    </div>

  );
}

