"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  incrementTrustScore,
  decrementTrustScore,
  incrementReportCount,
  setTrustScore,
  setUserRole,
  updateTrustMetrics,
} from "@/lib/trust-utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  // Admin state
  const [activeTab, setActiveTab] = useState<"trust" | "roles" | "metrics">("trust");
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Trust Score Management
  const [userId, setUserId] = useState("");
  const [trustAmount, setTrustAmount] = useState("1");
  const [trustNewValue, setTrustNewValue] = useState("50");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Role Management
  const [roleUserId, setRoleUserId] = useState("");
  const [roleValue, setRoleValue] = useState<"student" | "admin" | "driver" | null>("student");
  const [selectedRoleUser, setSelectedRoleUser] = useState<any>(null);

  // Check admin access
  useEffect(() => {
    if (!loading && (!user || profile?.role !== "admin")) {
      router.push("/");
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
      </main>
    );
  }

  if (profile?.role !== "admin") {
    return null; // Will redirect
  }

  // Helper function to fetch user data
  const fetchUser = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      setStatus("❌ User not found");
      return null;
    } catch (error) {
      setStatus(`❌ Error fetching user: ${error}`);
      return null;
    }
  };

  // Trust Score Actions
  const handleIncrement = async () => {
    if (!userId.trim()) {
      setStatus("❌ Please enter a user ID");
      return;
    }
    setIsProcessing(true);
    try {
      const userData = await fetchUser(userId);
      if (!userData) {
        setIsProcessing(false);
        return;
      }
      await incrementTrustScore(userId, parseInt(trustAmount) || 1);
      setStatus(`✅ Added ${trustAmount} trust points to user ${userId}`);
      setSelectedUser(userData);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecrement = async () => {
    if (!userId.trim()) {
      setStatus("❌ Please enter a user ID");
      return;
    }
    setIsProcessing(true);
    try {
      const userData = await fetchUser(userId);
      if (!userData) {
        setIsProcessing(false);
        return;
      }
      await decrementTrustScore(userId, parseInt(trustAmount) || 1);
      setStatus(`✅ Removed ${trustAmount} trust points from user ${userId}`);
      setSelectedUser(userData);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetTrust = async () => {
    if (!userId.trim()) {
      setStatus("❌ Please enter a user ID");
      return;
    }
    setIsProcessing(true);
    try {
      const userData = await fetchUser(userId);
      if (!userData) {
        setIsProcessing(false);
        return;
      }
      await setTrustScore(userId, parseInt(trustNewValue) || 50);
      setStatus(`✅ Set trust score to ${trustNewValue} for user ${userId}`);
      setSelectedUser(userData);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Role Management
  const handleSetRole = async () => {
    if (!roleUserId.trim()) {
      setStatus("❌ Please enter a user ID");
      return;
    }
    setIsProcessing(true);
    try {
      const userData = await fetchUser(roleUserId);
      if (!userData) {
        setIsProcessing(false);
        return;
      }
      await setUserRole(roleUserId, roleValue);
      setStatus(`✅ Set role to "${roleValue || "none"}" for user ${roleUserId}`);
      setSelectedRoleUser(userData);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Increment Report Count
  const handleIncrementReports = async () => {
    if (!userId.trim()) {
      setStatus("❌ Please enter a user ID");
      return;
    }
    setIsProcessing(true);
    try {
      const userData = await fetchUser(userId);
      if (!userData) {
        setIsProcessing(false);
        return;
      }
      await incrementReportCount(userId);
      setStatus(`✅ Incremented report count for user ${userId}`);
      setSelectedUser(userData);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Batch Update Metrics
  const handleBatchUpdate = async (trustDelta: number, reportDelta: number) => {
    if (!userId.trim()) {
      setStatus("❌ Please enter a user ID");
      return;
    }
    setIsProcessing(true);
    try {
      const userData = await fetchUser(userId);
      if (!userData) {
        setIsProcessing(false);
        return;
      }
      await updateTrustMetrics(userId, {
        trustScoreDelta: trustDelta,
        reportCountDelta: reportDelta,
      });
      setStatus(
        `✅ Updated metrics for user ${userId} (Trust: ${trustDelta > 0 ? "+" : ""}${trustDelta}, Reports: +${reportDelta})`
      );
      setSelectedUser(userData);
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center p-5 pb-32 pt-8 min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-surface dark:text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">admin_panel_settings</span>
            Admin Panel
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400 mt-2">Manage user trust scores and roles</p>
        </div>

        {/* Status Message */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-on-surface dark:text-slate-200"
          >
            {status}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-slate-800 p-2 rounded-lg border border-outline-variant dark:border-slate-700">
          {[
            { id: "trust", label: "Trust Score" },
            { id: "roles", label: "Manage Roles" },
            { id: "metrics", label: "Batch Metrics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary-container dark:bg-blue-600 text-on-primary"
                  : "text-on-surface-variant dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trust Score Tab */}
        {activeTab === "trust" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-outline-variant dark:border-slate-700 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-on-surface dark:text-slate-100">Adjust Trust Score</h2>
              
              <div className="space-y-4">
                {/* User ID Input */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400 mb-2">
                    User ID (UID)
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter Firebase UID"
                    className="w-full px-4 py-2 border border-outline-variant dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-on-surface dark:text-slate-100 focus:outline-none focus:border-primary-container"
                  />
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={trustAmount}
                    onChange={(e) => setTrustAmount(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-2 border border-outline-variant dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-on-surface dark:text-slate-100 focus:outline-none focus:border-primary-container"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleIncrement}
                    disabled={isProcessing}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Add Points
                  </button>
                  <button
                    onClick={handleDecrement}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Remove Points
                  </button>
                </div>

                {/* Set Specific Value */}
                <div className="pt-4 border-t border-outline-variant dark:border-slate-600">
                  <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400 mb-2">
                    Set to Specific Value
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={trustNewValue}
                      onChange={(e) => setTrustNewValue(e.target.value)}
                      placeholder="50"
                      className="flex-1 px-4 py-2 border border-outline-variant dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-on-surface dark:text-slate-100 focus:outline-none focus:border-primary-container"
                    />
                    <button
                      onClick={handleSetTrust}
                      disabled={isProcessing}
                      className="flex-1 bg-primary-container dark:bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-on-primary font-semibold py-2 rounded-lg transition-colors"
                    >
                      Set Value
                    </button>
                  </div>
                </div>

                {/* Increment Reports */}
                <div className="pt-4 border-t border-outline-variant dark:border-slate-600">
                  <button
                    onClick={handleIncrementReports}
                    disabled={isProcessing}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Increment Report Count
                  </button>
                </div>
              </div>

              {selectedUser && (
                <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm font-mono text-on-surface dark:text-slate-200">
                    <strong>Current Stats:</strong>
                    <br />
                    Trust Score: {selectedUser.trustScore || 50}
                    <br />
                    Reports Made: {selectedUser.totalReportsMade || 0}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-outline-variant dark:border-slate-700 shadow-sm"
          >
            <h2 className="text-xl font-bold mb-4 text-on-surface dark:text-slate-100">Manage User Roles</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400 mb-2">
                  User ID (UID)
                </label>
                <input
                  type="text"
                  value={roleUserId}
                  onChange={(e) => setRoleUserId(e.target.value)}
                  placeholder="Enter Firebase UID"
                  className="w-full px-4 py-2 border border-outline-variant dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-on-surface dark:text-slate-100 focus:outline-none focus:border-primary-container"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400 mb-2">
                  Role
                </label>
                <select
                  value={roleValue || ""}
                  onChange={(e) => setRoleValue((e.target.value as any) || null)}
                  className="w-full px-4 py-2 border border-outline-variant dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-on-surface dark:text-slate-100 focus:outline-none focus:border-primary-container"
                >
                  <option value="">None</option>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="driver">Driver</option>
                </select>
              </div>

              <button
                onClick={handleSetRole}
                disabled={isProcessing}
                className="w-full bg-primary-container dark:bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-on-primary font-semibold py-3 rounded-lg transition-colors"
              >
                Update Role
              </button>

              {selectedRoleUser && (
                <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm font-mono text-on-surface dark:text-slate-200">
                    <strong>User Info:</strong>
                    <br />
                    Name: {selectedRoleUser.displayName}
                    <br />
                    Role: {selectedRoleUser.role || "None"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Batch Metrics Tab */}
        {activeTab === "metrics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-outline-variant dark:border-slate-700 shadow-sm"
          >
            <h2 className="text-xl font-bold mb-4 text-on-surface dark:text-slate-100">Batch Update Metrics</h2>
            
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant dark:text-slate-400 mb-4">
                User ID (UID)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter Firebase UID"
                className="w-full px-4 py-2 border border-outline-variant dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-on-surface dark:text-slate-100 focus:outline-none focus:border-primary-container mb-6"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleBatchUpdate(5, 1)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  +5 Trust, +1 Report
                </button>
                <button
                  onClick={() => handleBatchUpdate(-5, 0)}
                  disabled={isProcessing}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  -5 Trust
                </button>
                <button
                  onClick={() => handleBatchUpdate(10, 2)}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  +10 Trust, +2 Reports
                </button>
                <button
                  onClick={() => handleBatchUpdate(-10, 0)}
                  disabled={isProcessing}
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  -10 Trust
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-on-surface-variant dark:text-slate-400">
            <strong>Admin Functions:</strong>
            <br />• Adjust user trust scores (reward/penalize)
            <br />• Manage user roles (student, admin, driver)
            <br />• Update report counts
            <br />• Batch update trust metrics
          </p>
        </div>
      </div>
    </main>
  );
}
