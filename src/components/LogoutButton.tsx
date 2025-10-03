"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setLoading(false);
    router.refresh();
  }
  return (
    <button onClick={logout} className="text-sm hover:underline" disabled={loading}>
      {loading ? "Đang thoát…" : "Đăng xuất"}
    </button>
  );
}
