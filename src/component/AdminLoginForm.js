"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond, Jost } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!username.trim() || !password) return setError("Mohon isi username dan password.");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal masuk.");
      // hanya jalur di dalam /admin yang diizinkan
      const next = new URLSearchParams(window.location.search).get("next");
      const safe = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
      router.replace(safe);
      router.refresh();
    } catch (err) {
      setError(err.message || "Gagal masuk.");
      setLoading(false);
    }
  };

  return (
    <main className={`${sans.className} grid min-h-screen place-items-center bg-[#3f3b2b] px-6 text-[#f3e9d9]`}>
      <form onSubmit={submit} noValidate className="w-full max-w-xs">
        <h1 className={`${serif.className} text-3xl font-light`}>Masuk admin</h1>
        <label htmlFor="admin-username" className="mt-8 block text-sm font-medium">
          Username
        </label>
        <input
          id="admin-username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 w-full border border-[#f3e9d9]/40 bg-transparent px-4 py-3 font-light focus:border-[#f3e9d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3e9d9]/50"
        />
        <label htmlFor="admin-password" className="mt-5 block text-sm font-medium">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-[#f3e9d9]/40 bg-transparent px-4 py-3 font-light focus:border-[#f3e9d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3e9d9]/50"
        />
        {error && (
          <p role="alert" className="mt-4 text-sm text-[#f0b8a8]">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-[#f3e9d9] px-6 py-3 text-sm font-medium text-[#3f3b2b] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f3e9d9] disabled:opacity-60"
        >
          {loading ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
