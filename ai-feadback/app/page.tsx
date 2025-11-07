"use client";

import { useRouter } from "next/navigation";
import Start from './components/Start/Start';

export default function StartPage() {
  const router = useRouter();

  return (
    <Start />

  );
}

