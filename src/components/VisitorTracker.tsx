"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track once per session
    const tracked = sessionStorage.getItem("st-tracked");
    if (tracked) return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pathname,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    })
      .then(() => {
        sessionStorage.setItem("st-tracked", "1");
      })
      .catch(() => {
        // Silently fail - don't affect user experience
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
