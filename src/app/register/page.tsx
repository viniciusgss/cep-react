"use client";
import { useSession } from "@/contexts/session-context";

export default function Register() {
  const { session } = useSession();

  return (
    <div>
      <h1 className="text-2xl">Page Register</h1>
      <span>{session?.name}</span>
    </div>
  );
}
