"use client";

import { useState, use } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { logUserSignupCompleted } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StopSelect } from "@/components/StopSelect";
import { motion, AnimatePresence } from "framer-motion";
import { getDictionary, Locale } from "@/i18n/dictionaries";

export default function Signup({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).common;
  
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stop, setStop] = useState("10");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create comprehensive user profile with trust score system
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName,
        email,
        defaultStop: stop,
        role: null, // Manual admin assignment later
        trustScore: 50, // Neutral starting point
        totalReportsMade: 0,
        emailVerified: false,
        profilePicture: null,
        createdAt: new Date().toISOString(),
      });

      // Log signup event for analytics
      await logUserSignupCompleted("email", stop);

      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Redirect to verification page
      router.push(`/${lang}/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || "Failed to create an account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-visible shadow-sm transition-colors duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container dark:bg-blue-500 rounded-t-xl"></div>
        <h1 className="text-3xl font-black text-on-surface dark:text-slate-100 mb-2 tracking-tighter">{dict.signup}</h1>
        <p className="text-on-surface-variant dark:text-slate-400 mb-6">Create an account to save your bus stop.</p>

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

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Display Name</label>
            <input 
              type="text" 
              required 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full px-3 py-3 border border-outline-variant dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
              placeholder="e.g., Besik M."
            />
          </div>
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
            {email && !isValidEmail(email) && (
              <p className="text-red-600 text-xs mt-1">Please enter a valid email address.</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-3 border border-outline-variant dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-on-surface dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-container"
              placeholder="Min 8 characters"
            />
          </div>
          <div className="relative z-20">
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Primary Stop</label>
            <StopSelect value={stop} onChange={setStop} />
          </div>
          
          <motion.button 
            whileTap={{ scale: 0.96 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm mt-6 disabled:opacity-70"
          >
            {loading ? "Creating..." : dict.signup}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant dark:text-slate-400">
          Already have an account? <Link href={`/${lang}/login`} className="text-primary-container dark:text-blue-400 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
