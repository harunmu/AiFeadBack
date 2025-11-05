// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Start from './components/Start';

export default function StartPage() {
  const router = useRouter();

  return (
    <Start />
  );
}

