"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile } from "@/types/user";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Fallback default profile (shouldn't happen after signup)
            setProfile({
              displayName: "User",
              email: currentUser.email || "",
              role: null,
              trustScore: 50,
              totalReportsMade: 0,
              defaultStop: "10",
              profilePicture: null,
              emailVerified: false,
              createdAt: new Date().toISOString(),
              offlineRunnerHighScore: 0,
            });
          }
        } catch (error) {
          console.error("Error fetching profile", error);
          setProfile({
            displayName: "User",
            email: currentUser.email || "",
            role: null,
            trustScore: 50,
            totalReportsMade: 0,
            defaultStop: "10",
            profilePicture: null,
            emailVerified: false,
            createdAt: new Date().toISOString(),
            offlineRunnerHighScore: 0,
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, updates, { merge: true });
      
      // Update local state
      setProfile((prev) =>
        prev ? { ...prev, ...updates } : null
      );
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
