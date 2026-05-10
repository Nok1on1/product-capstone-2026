"use client";

import { useState, use } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getDictionary, Locale } from "@/i18n/dictionaries";

export default function Login({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).common;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(`/${lang}`);
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-sm transition-colors duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container dark:bg-blue-500"></div>
        <h1 className="text-3xl font-black text-on-surface dark:text-slate-100 mb-2 tracking-tighter">{dict.login}</h1>
        <p className="text-on-surface-variant dark:text-slate-400 mb-6">Welcome back to Bandersnatch.</p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="mb-4 text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-sm overflow-hidden"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-3 border border-outline-variant dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
              placeholder="student@kiu.edu.ge"
            />
          </div>
          <div>
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-3 border border-outline-variant dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.96 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm mt-6 disabled:opacity-70"
          >
            {loading ? "Logging in..." : dict.login}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant dark:text-slate-400">
          Don't have an account? <Link href={`/${lang}/signup`} className="text-primary-container dark:text-blue-400 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
