"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function FindRidePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupId = searchParams.get("groupId");

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user, profile } = useAuth();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages realtime
  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "rideGroups", groupId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(data);

      // auto scroll after render
      setTimeout(scrollToBottom, 50);
    });

    return () => unsub();
  }, [groupId]);

  // Load members realtime
  useEffect(() => {
    if (!groupId) return;

    const q = query(collection(db, "rideGroups", groupId, "members"));

    const unsub = onSnapshot(q, (snap) => {
      setGroupMembers(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, [groupId]);

  const sendMessage = async () => {
    if (!text.trim() || !groupId || !auth.currentUser) return;

    const user = auth.currentUser;
    const messageText = text; // store before clearing

    setText(""); // ✅ instant UI response (fixes delay)

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const userData = userSnap.data();

      await addDoc(collection(db, "rideGroups", groupId, "messages"), {
        senderId: user.uid,
        senderName: userData?.displayName || "User",
        profilePicture: userData?.profilePicture || null, // ADD THIS
        text: messageText,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      setText(messageText); // rollback if failed
    }
  };

  if (!groupId) {
    return (
      <main className="p-5 text-center">
        <p>No group found</p>
      </main>
    );
  }

  return (
    <main className="p-5 max-w-md mx-auto flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.back()}
          className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 cursor-pointer"
        >
          ← Back
        </button>

        <div className="text-sm font-bold">Group ({groupMembers.length}/5)</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {!isMe && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                  {msg.profilePicture ? (
                    <img
                      src={msg.profilePicture}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    msg.senderName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm"
                }`}
              >
                {!isMe && (
                  <div className="text-[10px] opacity-60 mb-1">
                    {msg.senderName}
                  </div>
                )}
                {msg.text}
              </div>

              {/* My avatar (optional but nice symmetry) */}
              {isMe && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                  {profile?.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.displayName?.charAt(0)?.toUpperCase() || "M"
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 items-center border-t border-slate-200 dark:border-slate-700 pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Send
        </button>
      </div>
    </main>
  );
}
