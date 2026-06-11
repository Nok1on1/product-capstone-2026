"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { readBuses } from "@/lib/offline-bus-data";
import { reportBusIssue } from "@/lib/bus-reporting";

interface Bus {
  id: string;
  name: string;
  isActive: boolean;
  status?: string;
  lastUpdated?: Date;
}

export function ReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string>("");
  const [reason, setReason] = useState("");
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBuses = async () => {
      setIsLoading(true);
      try {
        const { data } = await readBuses();
        setBuses(data as Bus[]);
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBus || !reason.trim()) {
      alert("Please select a bus and enter a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await reportBusIssue({
        busId: selectedBus,
        reason: reason.trim(),
        userId: user?.uid || "anonymous",
      });

      setSelectedBus("");
      setReason("");
      setIsOpen(false);
      if (result.status === "queued") {
        window.dispatchEvent(new CustomEvent("bandersnatch-offline-state-change"));
      }
    } catch (error) {
      console.error("Error submitting alert:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-40 right-5 z-50 md:bottom-44"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-semibold text-sm transition-colors bg-warning hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-on-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/40"
        >
          <span className="material-symbols-outlined text-lg">report_problem</span>
          Report Issue
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.12, duration: 0.35 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg bg-white dark:bg-slate-900 p-6 shadow-2xl max-w-md mx-auto border border-outline-variant dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-on-surface dark:text-slate-100">
                  Report Bus Issue
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/30"
                  aria-label="Close report dialog"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Bus Selection */}
                <div>
                  <label className="block font-semibold text-on-surface dark:text-slate-200 mb-2 text-sm">
                    Select Bus
                  </label>
                  <select
                    value={selectedBus}
                    onChange={(e) => setSelectedBus(e.target.value)}
                    disabled={isLoading}
                  className="w-full border border-outline-variant dark:border-slate-700 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-on-surface dark:text-slate-100 disabled:opacity-50"
                  >
                    <option key="default" value="">Choose a bus...</option>
                    {buses.map((bus, index) => (
                      <option key={`bus-${bus.id || index}`} value={bus.id}>
                        {bus.name || bus.id} {bus.isActive ? "Active" : "Inactive"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reason Text Area */}
                <div>
                  <label className="block font-semibold text-on-surface dark:text-slate-200 mb-2 text-sm">
                    Reason for Report
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe the issue (e.g., broken door, mechanical problem, dirty seats)"
                    maxLength={500}
                    rows={4}
                    className="w-full border border-outline-variant dark:border-slate-700 rounded-lg px-4 py-2 bg-white dark:bg-slate-800 text-on-surface dark:text-slate-100 placeholder-on-surface-variant dark:placeholder-slate-400 resize-none"
                  />
                  <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
                    {reason.length}/500
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/30"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={isSubmitting || !selectedBus || !reason.trim()}
                    className="flex-1 bg-warning hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-on-primary font-semibold py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/40"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        Submit Report
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
