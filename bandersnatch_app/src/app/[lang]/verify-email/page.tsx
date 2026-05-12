"use client";

import { useState, useEffect, use } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification, reload } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getDictionary, Locale } from "@/i18n/dictionaries";

export default function VerifyEmail({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).common;
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [checking, setChecking] = useState(false);
  const [verificationSent, setVerificationSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check if email is verified
  const checkEmailVerification = async () => {
    try {
      setChecking(true);
      const user = auth.currentUser;
      
      if (!user) {
        router.push(`/${lang}/signup`);
        return;
      }

      // Reload user to get latest email verification status
      await reload(user);

      if (user.emailVerified) {
        // Email is verified, redirect to main app
        router.push(`/${lang}`);
      }
    } catch (err: any) {
      setError("Error checking verification status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    try {
      setLoading(true);
      setError("");
      const user = auth.currentUser;
      
      if (user) {
        await sendEmailVerification(user);
        setVerificationSent(true);
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Check verification every 3 seconds
  useEffect(() => {
    const interval = setInterval(checkEmailVerification, 3000);
    checkEmailVerification(); // Initial check
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-sm transition-colors duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container dark:bg-blue-500"></div>
        
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: checking ? 360 : 0 }}
            transition={{ duration: 2, repeat: checking ? Infinity : 0, ease: "linear" }}
            className="text-4xl mb-4"
          >
            ✉️
          </motion.div>
          
          <h1 className="text-3xl font-black text-on-surface dark:text-slate-100 mb-2 tracking-tighter text-center">
            Verify Your Email
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400 mb-6 text-center">
            We sent a verification link to <strong>{email}</strong>
          </p>

          {error && (
            <div className="mb-4 w-full text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="w-full space-y-4">
            <div className="text-center text-sm text-on-surface-variant dark:text-slate-400 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <p className="mb-2">📧 Check your email and click the verification link.</p>
              <p className="text-xs">We'll check automatically in a few seconds.</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleResendEmail}
              disabled={loading || resendCooldown > 0}
              className="w-full bg-slate-200 dark:bg-slate-700 text-on-surface dark:text-slate-200 font-semibold py-3 rounded-lg shadow-sm disabled:opacity-50 transition-opacity"
            >
              {loading
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Didn't receive email? Resend"}
            </motion.button>

            <p className="text-center text-xs text-on-surface-variant dark:text-slate-500">
              Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
