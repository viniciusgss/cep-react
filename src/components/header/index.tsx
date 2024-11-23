"use client";
import { useSession } from "@/contexts/session-context";
import Link from "next/link";

export function Header() {
  const { session } = useSession();

  return (
    <div className="flex justify-between border-b-2 border-black py-5 px-32">
      <nav>
        <ul className="flex gap-5">
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/sales">Sales</Link>
          </li>
        </ul>
      </nav>
      <span>{session?.name}</span>
    </div>
  );
}
