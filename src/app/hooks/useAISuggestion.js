"use client";

import { useState } from "react";
import toast from "react-hot-toast";

// Utility to strip HTML tags from content
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export function useAISuggestion() {
  const [loading, setLoading] = useState(false);

  const getSuggestion = async ({ title, content, onSuccess }) => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      toast.error("Please enter a title or content first.");
      return;
    }

    const plainText = stripHTML(trimmedContent);

    const toastId = toast.loading("Thinking...");
    setLoading(true);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `${trimmedTitle}\n\n${plainText}`,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error("Invalid JSON response from the server.");
      }

      if (!res.ok || !data?.suggestion) {
        throw new Error(data?.error || "No suggestion available.");
      }

      toast.success("Suggestion applied!", { id: toastId });
      onSuccess?.(data.suggestion);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast.error(error.message || "Failed to get suggestion.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, getSuggestion };
}
