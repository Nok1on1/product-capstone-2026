import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, reload } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export function useEmailVerification() {
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require verification
  const publicRoutes = ["/login", "/signup", "/verify-email"];
  const isPublicRoute = publicRoutes.some((route) => pathname.includes(route));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Reload to get latest email verification status
        await reload(currentUser);
        setUser(currentUser);
        setEmailVerified(currentUser.emailVerified);

        // If email not verified and on protected route, redirect to verify page
        if (!currentUser.emailVerified && !isPublicRoute) {
          router.push(`/verify-email?email=${encodeURIComponent(currentUser.email || "")}`);
        }
      } else {
        // Not logged in, redirect to login
        if (!isPublicRoute) {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, isPublicRoute, router]);

  return { loading, emailVerified, user };
}
