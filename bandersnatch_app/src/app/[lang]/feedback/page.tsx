"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getDictionary, Locale } from "@/i18n/dictionaries";

type CrowdingLevel = "Low" | "Medium" | "High";

export default function FeedbackPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).feedback;
  
  const [submitting, setSubmitting] = useState<CrowdingLevel | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFeedback = async (level: CrowdingLevel) => {
    setSubmitting(level);
    
    try {
      await setDoc(doc(db, "bus_data", "current_status"), {
        crowding: level,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${lang}`);
      }, 2000);
      
    } catch (error) {
      console.error("Failed to submit feedback", error);
      setSubmitting(null);
    }
  };

  const options: { level: CrowdingLevel; emoji: string; title: string; desc: string }[] = [
    { level: "Low", emoji: "💺", title: dict.empty, desc: dict.emptyDesc },
    { level: "Medium", emoji: "🚶", title: dict.normal, desc: dict.normalDesc },
    { level: "High", emoji: "😫", title: dict.packed, desc: dict.packedDesc },
  ];

  return (
    <main className="flex-grow p-5 pb-32 flex flex-col justify-center max-w-lg mx-auto w-full">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-on-surface dark:text-slate-100 mb-2 tracking-tighter">{dict.title}</h2>
              <p className="text-lg text-on-surface-variant dark:text-slate-400">{dict.subtitle}</p>
            </div>

            <motion.div
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
              }}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
            >
              {options.map((opt) => (
                <motion.button
                  key={opt.level}
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  whileTap={{ scale: 0.96 }}
                  disabled={submitting !== null}
                  onClick={() => handleFeedback(opt.level)}
                  className={`group w-full bg-surface-container-lowest border-2 transition-all duration-150 rounded-xl p-6 flex items-center text-left ${
                    submitting === opt.level 
                      ? "border-primary-container bg-blue-50 dark:bg-slate-800" 
                      : "border-outline-variant hover:border-primary-container hover:bg-slate-50 dark:hover:bg-slate-800"
                  } ${submitting !== null && submitting !== opt.level ? "opacity-50" : "opacity-100"}`}
                >
                  <div className="text-[48px] leading-none mr-6 group-active:scale-90 transition-transform duration-150">
                    {submitting === opt.level ? (
                      <div className="h-12 w-12 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container dark:border-blue-400"></div>
                      </div>
                    ) : (
                      opt.emoji
                    )}
                  </div>
                  <div className="flex-grow">
                    <span className="text-2xl font-semibold text-on-surface dark:text-slate-100 block mb-1">{opt.title}</span>
                    <span className="text-base text-outline dark:text-slate-500 block">{opt.desc}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <div className="w-20 h-20 bg-success-container dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-success dark:text-green-300 text-5xl">check_circle</span>
            </div>
            <h2 className="text-3xl font-bold text-on-surface dark:text-slate-100 mb-2 tracking-tighter">{dict.thankYou}</h2>
            <p className="text-lg text-on-surface-variant dark:text-slate-400">{dict.thankYouDesc}</p>
            <p className="text-sm text-outline dark:text-slate-500 mt-8">{dict.returning}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
